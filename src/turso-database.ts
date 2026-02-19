import { CustomResource } from "aws-cdk-lib"
import { Construct } from "constructs"
import type { TursoProvider } from "./turso-provider"

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
  readonly provider: TursoProvider
  readonly databaseName: string
  readonly group: string
  readonly organizationSlug: string
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

  constructor(scope: Construct, id: string, props: TursoDatabaseProps) {
    super(scope, id)

    if (!/^[a-z0-9-]+$/.test(props.databaseName)) {
      throw new Error(
        "databaseName must contain only lowercase letters, numbers, and dashes",
      )
    }
    if (props.databaseName.length > 64) {
      throw new Error("databaseName must be at most 64 characters")
    }

    const resourceProps: Record<string, unknown> = {
      ResourceType: "Database",
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
      serviceToken: props.provider.serviceToken,
      properties: resourceProps,
    })

    this.dbId = cr.getAttString("DbId")
    this.hostname = cr.getAttString("Hostname")
    this.databaseName = cr.getAttString("Name")
  }
}
