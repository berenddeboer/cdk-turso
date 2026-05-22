import { CustomResource, RemovalPolicy } from "aws-cdk-lib"
import { Construct } from "constructs"
import type { ITursoProvider } from "./turso-provider"

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
  readonly provider: ITursoProvider
  readonly databaseName: string
  readonly group: string
  readonly organizationSlug: string
  readonly sizeLimit?: string
  readonly seed?: TursoDatabaseSeed
  readonly encryption?: TursoDatabaseEncryption

  /**
   * If true, create the database with TursoDB enabled.
   *
   * This flag is only used during Create requests. Changing it does not affect
   * existing databases; recreate the database to apply a new value.
   *
   * @default false
   */
  readonly useTursoDb?: boolean

  /**
   * If true, the provider will adopt an existing Turso database when
   * creation reports that the database already exists.
   *
   * This flag is only used during Create requests.
   *
   * @default false
   */
  readonly adopt?: boolean

  /**
   * Removal policy for the underlying custom resource.
   * Set to `RemovalPolicy.RETAIN` to keep the Turso database on stack
   * deletion.
   * Set to `RemovalPolicy.SNAPSHOT` to create a point-in-time Turso database
   * snapshot before deleting the database.
   */
  readonly removalPolicy?: RemovalPolicy
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
    if (props.useTursoDb !== undefined) {
      resourceProps.UseTursoDb = props.useTursoDb
    }
    if (props.removalPolicy === RemovalPolicy.SNAPSHOT) {
      resourceProps.SnapshotOnDelete = true
    }
    if (props.adopt !== undefined) {
      resourceProps.Adopt = props.adopt
    }

    const cr = new CustomResource(this, "TursoDb", {
      serviceToken: props.provider.serviceToken,
      resourceType: "Custom::TursoDatabase",
      properties: resourceProps,
    })

    if (
      props.removalPolicy !== undefined &&
      props.removalPolicy !== RemovalPolicy.SNAPSHOT
    ) {
      cr.applyRemovalPolicy(props.removalPolicy)
    }

    this.dbId = cr.getAttString("DbId")
    this.hostname = cr.getAttString("Hostname")
    this.databaseName = cr.getAttString("Name")
  }
}
