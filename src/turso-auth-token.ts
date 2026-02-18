import { CustomResource, Duration, Stack } from "aws-cdk-lib"
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam"
import { Code, Function, Runtime, RuntimeFamily } from "aws-cdk-lib/aws-lambda"
import { Provider } from "aws-cdk-lib/custom-resources"
import { Construct } from "constructs"
import * as path from "path"
import type { TursoDatabase } from "./turso-database"

export interface TursoAuthTokenProps {
  /**
   * The Turso database to create an auth token for.
   */
  readonly database: TursoDatabase

  /**
   * The SSM parameter name where the generated JWT will be stored
   * as a SecureString.
   */
  readonly parameterName: string

  /**
   * Expiration time for the token (e.g., `"2w"`, `"1d30m"`).
   *
   * @default "never"
   */
  readonly expiration?: string

  /**
   * Authorization level for the token.
   *
   * @default "full-access"
   */
  readonly authorization?: string
}

export class TursoAuthToken extends Construct {
  /**
   * The SSM parameter name where the auth token is stored.
   */
  public readonly parameterName: string

  constructor(scope: Construct, id: string, props: TursoAuthTokenProps) {
    super(scope, id)

    if (
      props.authorization &&
      props.authorization !== "full-access" &&
      props.authorization !== "read-only"
    ) {
      throw new Error('authorization must be "full-access" or "read-only"')
    }

    const handler = new Function(this, "Handler", {
      runtime: new Runtime("nodejs24.x", RuntimeFamily.NODEJS),
      handler: "index.handler",
      code: Code.fromAsset(path.join(__dirname, "handler-auth-token")),
      timeout: Duration.minutes(3),
      environment: {
        TURSO_API_TOKEN_PARAMETER_NAME: props.database.apiToken.parameterName,
      },
    })

    props.database.apiToken.grantRead(handler)

    const parameterArn = Stack.of(this).formatArn({
      service: "ssm",
      resource: "parameter",
      resourceName: props.parameterName.startsWith("/")
        ? props.parameterName.slice(1)
        : props.parameterName,
    })

    handler.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["ssm:PutParameter", "ssm:DeleteParameter"],
        resources: [parameterArn],
      }),
    )

    const provider = new Provider(this, "Provider", {
      onEventHandler: handler,
    })

    const resourceProps: Record<string, unknown> = {
      DatabaseName: props.database.databaseName,
      OrganizationSlug: props.database.organizationSlug,
      ParameterName: props.parameterName,
    }

    if (props.expiration) {
      resourceProps.Expiration = props.expiration
    }
    if (props.authorization) {
      resourceProps.Authorization = props.authorization
    }

    new CustomResource(this, "CustomResource", {
      serviceToken: provider.serviceToken,
      properties: resourceProps,
    })

    this.parameterName = props.parameterName
  }
}
