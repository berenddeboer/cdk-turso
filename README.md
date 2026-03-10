# CDK Turso

CDK constructs to create [Turso cloud](https://docs.turso.tech/turso-cloud) databases and manage auth tokens.

## Installation

```bash
npm install cdk-turso
```

## Usage

Create a `TursoProvider` with your API token:

```typescript
import { RemovalPolicy, Stack } from 'aws-cdk-lib';
import { ParameterType, StringParameter } from 'aws-cdk-lib/aws-ssm';
import { TursoProvider, TursoDatabase, TursoAuthToken } from 'cdk-turso';

const stack = new Stack();

// SSM Parameter containing your Turso API token (must be a SecureString)
const apiToken = new StringParameter(stack, 'TursoApiToken', {
  parameterName: '/turso/api-token',
  stringValue: 'your-api-token',
  type: ParameterType.SECURE_STRING,
});

// Create the provider (one per stack)
const provider = new TursoProvider(stack, 'TursoProvider', {
  apiToken,
});

const database = new TursoDatabase(stack, 'Database', {
  provider,
  databaseName: 'my-database',
  group: 'group-name',
  organizationSlug: 'my-org',
  adopt: true, // optional: adopt existing database if it already exists
  removalPolicy: RemovalPolicy.RETAIN, // optional: keep DB on stack delete
});

// Access database attributes
database.dbId;      // Database ID
database.hostname;  // Database hostname (e.g., my-database-my-org.turso.io)
database.databaseName;  // Database name
```

If you run a shared provider in another stack, import it by service token:

```typescript
const provider = TursoProvider.fromServiceToken(
  stack,
  'TursoProvider',
  'arn:aws:lambda:us-east-1:123456789012:function:shared-turso-provider',
);
```

### Auth Token

Generate a database auth token and store it as a SecureString in SSM Parameter Store:

```typescript
const authToken = new TursoAuthToken(stack, 'AuthToken', {
  provider,
  databaseName: database.databaseName,
  organizationSlug: 'my-org',
  parameterName: '/turso/db-token',
  expiration: '2w',          // optional, default: 'never'
  authorization: 'read-only', // optional, default: 'full-access'
  removalPolicy: RemovalPolicy.RETAIN, // optional: keep SSM parameter
});

// The SSM parameter name where the JWT is stored
authToken.parameterName;
```

## API

### TursoProviderProps

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `apiToken` | `ssm.IParameter` | Yes | SSM Parameter containing the Turso platform API token (must be SecureString) |
| `logGroup` | `ILogGroup` | No | Optional CloudWatch log group for the Lambda handler |

### TursoProvider

| Attribute | Type | Description |
|-----------|------|-------------|
| `handler` | `Function` | The Lambda function backing all Turso custom resources (for attaching IAM permissions) |
| `serviceToken` | `string` | The CDK custom-resource provider service token |

Static method:

| Method | Returns | Description |
|--------|---------|-------------|
| `fromServiceToken(scope, id, serviceToken)` | `ITursoProvider` | Imports an existing Turso custom-resource provider |

### ITursoProvider

| Attribute | Type | Description |
|-----------|------|-------------|
| `serviceToken` | `string` | The CDK custom-resource provider service token |

### TursoDatabaseProps

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `provider` | `ITursoProvider` | Yes | The Turso provider to use for this database |
| `databaseName` | `string` | Yes | Database name (lowercase, numbers, dashes only, max 64 chars) |
| `group` | `string` | Yes | Turso group name (must already exist) |
| `organizationSlug` | `string` | Yes | Organization slug |
| `sizeLimit` | `string` | No | Size limit (e.g., '256mb') |
| `seed` | `TursoDatabaseSeed` | No | Database seed configuration |
| `encryption` | `TursoDatabaseEncryption` | No | Encryption configuration |
| `adopt` | `boolean` | No | On create, adopt an existing database when create returns "already exists" |
| `removalPolicy` | `RemovalPolicy` | No | Custom resource removal policy (for example `RemovalPolicy.RETAIN`) |

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
| `hostname` | `string` | DNS hostname (e.g., `my-database-my-org.turso.io`) for libSQL/HTTP connections |
| `databaseName` | `string` | Database name |

### TursoAuthTokenProps

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `provider` | `ITursoProvider` | Yes | The Turso provider to use for this auth token |
| `databaseName` | `string` | Yes | The name of the Turso database to create an auth token for |
| `organizationSlug` | `string` | Yes | The Turso organization slug that owns the database |
| `parameterName` | `string` | Yes | SSM parameter name where the generated JWT will be stored as a SecureString |
| `expiration` | `string` | No | Token expiry (e.g., `'2w'`, `'1d30m'`). Default: `'never'` |
| `authorization` | `string` | No | `'full-access'` or `'read-only'`. Default: `'full-access'` |
| `removalPolicy` | `RemovalPolicy` | No | Custom resource removal policy (for example `RemovalPolicy.RETAIN`) |

### TursoAuthToken

| Attribute | Type | Description |
|-----------|------|-------------|
| `parameterName` | `string` | The SSM parameter name where the auth token is stored |

## Requirements

- Node.js 24.x runtime for the Lambda handler
- The Lambda handler requires the AWS SDK for JavaScript v3 (pre-installed in Lambda runtime)
