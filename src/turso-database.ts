import { CustomResource, Duration } from "aws-cdk-lib"
import { Code, Function, Runtime, RuntimeFamily } from "aws-cdk-lib/aws-lambda"
import type { IParameter } from "aws-cdk-lib/aws-ssm"
import { Provider } from "aws-cdk-lib/custom-resources"
import { Construct } from "constructs"
import * as path from "path"

export interface TursoDatabaseSeed {
  readonly type: string
  readonly name: string
  readonly timestamp?: string
}

export interface TursoDatabaseEncryption {
  readonly encryptionKey: string
  readonly encryptionCipher: string
}

export interface TursoDatabaseProps {
  readonly databaseName: string
  readonly group: string
  readonly organizationSlug: string
  readonly apiToken: IParameter
  readonly sizeLimit?: string
  readonly seed?: TursoDatabaseSeed
  readonly encryption?: TursoDatabaseEncryption
}

export class TursoDatabase extends Construct {
  public readonly dbId: string
  /**
   * DNS hostname for the database (e.g., `my-db-my-org.turso.io`).
   * Use with libSQL or HTTP connections.
   */
  public readonly hostname: string
  public readonly databaseName: string
  public readonly organizationSlug: string
  public readonly apiToken: IParameter

  constructor(scope: Construct, id: string, props: TursoDatabaseProps) {
    super(scope, id)

    this.organizationSlug = props.organizationSlug
    this.apiToken = props.apiToken

    if (!/^[a-z0-9-]+$/.test(props.databaseName)) {
      throw new Error(
        "databaseName must contain only lowercase letters, numbers, and dashes",
      )
    }
    if (props.databaseName.length > 64) {
      throw new Error("databaseName must be at most 64 characters")
    }

    const handler = new Function(this, "Handler", {
      runtime: new Runtime("nodejs24.x", RuntimeFamily.NODEJS),
      handler: "index.handler",
      code: Code.fromAsset(path.join(__dirname, "handler")),
      timeout: Duration.minutes(3),
      environment: {
        TURSO_API_TOKEN_PARAMETER_NAME: props.apiToken.parameterName,
      },
    })

    props.apiToken.grantRead(handler)

    const provider = new Provider(this, "Provider", {
      onEventHandler: handler,
    })

    const resourceProps: Record<string, unknown> = {
      DatabaseName: props.databaseName,
      Group: props.group,
      OrganizationSlug: props.organizationSlug,
    }

    if (props.sizeLimit) {
      resourceProps.SizeLimit = props.sizeLimit
    }
    if (props.seed) {
      resourceProps.Seed = props.seed
    }
    if (props.encryption) {
      resourceProps.Encryption = props.encryption
    }

    const cr = new CustomResource(this, "TursoDb", {
      serviceToken: provider.serviceToken,
      properties: resourceProps,
    })

    this.dbId = cr.getAttString("DbId")
    this.hostname = cr.getAttString("Hostname")
    this.databaseName = cr.getAttString("Name")
  }
}
