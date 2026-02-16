# CDK Turso

CDK construct to create a [Turso cloud](https://docs.turso.tech/turso-cloud) database.

## Installation

```bash
npm install cdk-turso
```

## Usage

```typescript
import { Stack } from 'aws-cdk-lib';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { TursoDatabase } from 'cdk-turso';

const stack = new Stack();

// SSM Parameter containing your Turso API token
const apiToken = new StringParameter(stack, 'TursoApiToken', {
  parameterName: '/turso/api-token',
  stringValue: 'your-api-token',
});

const database = new TursoDatabase(stack, 'Database', {
  databaseName: 'my-database',
  group: 'group-name',
  organizationSlug: 'my-org',
  apiToken,
});

// Use the database attributes
database.dbId;     // Database ID
database.hostname; // Database hostname
database.databaseName; // Database name
```

## API

### TursoDatabaseProps

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `databaseName` | `string` | Yes | Database name (lowercase, numbers, dashes only, max 64 chars) |
| `group` | `string` | Yes | Turso group name (must already exist) |
| `organizationSlug` | `string` | Yes | Organization slug |
| `apiToken` | `ssm.IParameter` | Yes | SSM Parameter containing the Turso API token |
| `sizeLimit` | `string` | No | Size limit (e.g., '256mb') |
| `seed` | `TursoDatabaseSeed` | No | Database seed configuration |
| `encryption` | `TursoDatabaseEncryption` | No | Encryption configuration |

### TursoDatabaseSeed

```typescript
interface TursoDatabaseSeed {
  readonly type: string;      // Seed type (e.g., 'schema')
  readonly name: string;       // Seed name
  readonly timestamp?: string;  // Optional timestamp
}
```

### TursoDatabaseEncryption

```typescript
interface TursoDatabaseEncryption {
  readonly encryptionKey: string;    // KMS key ARN
  readonly encryptionCipher: string; // Cipher type (e.g., 'AES')
}
```

### TursoDatabase

| Attribute | Type | Description |
|-----------|------|-------------|
| `dbId` | `string` | Turso database ID |
| `hostname` | `string` | DNS hostname (e.g., `my-db-my-org.turso.io`) for libSQL/HTTP connections |
| `databaseName` | `string` | Database name |

## Requirements

- Node.js 24.x runtime for the Lambda handler
- The Lambda handler requires the AWS SDK for JavaScript v3 (pre-installed in Lambda runtime)
