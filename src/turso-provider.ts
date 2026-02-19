import { Duration } from "aws-cdk-lib"
import { Code, Function, Runtime, RuntimeFamily } from "aws-cdk-lib/aws-lambda"
import type { IParameter } from "aws-cdk-lib/aws-ssm"
import { Provider } from "aws-cdk-lib/custom-resources"
import { Construct } from "constructs"
import * as path from "path"

export interface TursoProviderProps {
  /**
   * SSM parameter that holds the Turso platform API token
   * (stored as SecureString).
   */
  readonly apiToken: IParameter
}

/**
 * Shared Lambda + CloudFormation custom-resource provider for all
 * Turso resources.  Create one per stack and pass it to every
 * `TursoDatabase`, `TursoAuthToken`, etc.
 */
export class TursoProvider extends Construct {
  /**
   * The Lambda function backing all Turso custom resources.
   * Use this to attach additional IAM permissions when a resource
   * type needs them (e.g. `ssm:PutParameter` for auth-token storage).
   */
  public readonly handler: Function

  /**
   * The CDK custom-resource provider service token.
   */
  public readonly serviceToken: string

  constructor(scope: Construct, id: string, props: TursoProviderProps) {
    super(scope, id)

    this.handler = new Function(this, "Handler", {
      runtime: new Runtime("nodejs24.x", RuntimeFamily.NODEJS),
      handler: "index.handler",
      code: Code.fromAsset(path.join(__dirname, "handler")),
      timeout: Duration.minutes(3),
      environment: {
        TURSO_API_TOKEN_PARAMETER_NAME: props.apiToken.parameterName,
      },
    })

    props.apiToken.grantRead(this.handler)

    const provider = new Provider(this, "Provider", {
      onEventHandler: this.handler,
    })

    this.serviceToken = provider.serviceToken
  }
}
