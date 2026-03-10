import { CustomResource, RemovalPolicy, Stack } from "aws-cdk-lib"
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam"
import { Construct } from "constructs"
import type { ITursoProvider } from "./turso-provider"

export interface TursoAuthTokenProps {
  readonly provider: ITursoProvider

  /**
   * The name of the Turso database to create an auth token for.
   */
  readonly databaseName: string

  /**
   * The Turso organization slug that owns the database.
   */
  readonly organizationSlug: string

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

  /**
   * Removal policy for the underlying custom resource.
   * Set to `RemovalPolicy.RETAIN` to keep the SSM parameter on stack
   * deletion.
   */
  readonly removalPolicy?: RemovalPolicy
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

    const parameterArn = Stack.of(this).formatArn({
      service: "ssm",
      resource: "parameter",
      resourceName: props.parameterName.startsWith("/")
        ? props.parameterName.slice(1)
        : props.parameterName,
    })

    const providerWithHandler = props.provider as ITursoProvider & {
      readonly handler?: {
        addToRolePolicy(statement: PolicyStatement): void
      }
    }

    providerWithHandler.handler?.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["ssm:PutParameter", "ssm:DeleteParameter"],
        resources: [parameterArn],
      }),
    )

    const resourceProps: Record<string, unknown> = {
      ResourceType: "AuthToken",
      DatabaseName: props.databaseName,
      OrganizationSlug: props.organizationSlug,
      ParameterName: props.parameterName,
    }

    if (props.expiration) {
      resourceProps.Expiration = props.expiration
    }
    if (props.authorization) {
      resourceProps.Authorization = props.authorization
    }

    const cr = new CustomResource(this, "TursoAuthToken", {
      serviceToken: props.provider.serviceToken,
      resourceType: "Custom::TursoAuthToken",
      properties: resourceProps,
    })

    if (props.removalPolicy !== undefined) {
      cr.applyRemovalPolicy(props.removalPolicy)
    }

    this.parameterName = props.parameterName
  }
}
