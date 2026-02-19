# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### TursoAuthToken <a name="TursoAuthToken" id="cdk-turso.TursoAuthToken"></a>

#### Initializers <a name="Initializers" id="cdk-turso.TursoAuthToken.Initializer"></a>

```typescript
import { TursoAuthToken } from 'cdk-turso'

new TursoAuthToken(scope: Construct, id: string, props: TursoAuthTokenProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-turso.TursoAuthToken.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cdk-turso.TursoAuthToken.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-turso.TursoAuthToken.Initializer.parameter.props">props</a></code> | <code><a href="#cdk-turso.TursoAuthTokenProps">TursoAuthTokenProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-turso.TursoAuthToken.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-turso.TursoAuthToken.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-turso.TursoAuthToken.Initializer.parameter.props"></a>

- *Type:* <a href="#cdk-turso.TursoAuthTokenProps">TursoAuthTokenProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-turso.TursoAuthToken.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#cdk-turso.TursoAuthToken.with">with</a></code> | Applies one or more mixins to this construct. |

---

##### `toString` <a name="toString" id="cdk-turso.TursoAuthToken.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `with` <a name="with" id="cdk-turso.TursoAuthToken.with"></a>

```typescript
public with(mixins: ...IMixin[]): IConstruct
```

Applies one or more mixins to this construct.

Mixins are applied in order. The list of constructs is captured at the
start of the call, so constructs added by a mixin will not be visited.
Use multiple `with()` calls if subsequent mixins should apply to added
constructs.

###### `mixins`<sup>Required</sup> <a name="mixins" id="cdk-turso.TursoAuthToken.with.parameter.mixins"></a>

- *Type:* ...constructs.IMixin[]

The mixins to apply.

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-turso.TursoAuthToken.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="cdk-turso.TursoAuthToken.isConstruct"></a>

```typescript
import { TursoAuthToken } from 'cdk-turso'

TursoAuthToken.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="cdk-turso.TursoAuthToken.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-turso.TursoAuthToken.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-turso.TursoAuthToken.property.parameterName">parameterName</a></code> | <code>string</code> | The SSM parameter name where the auth token is stored. |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-turso.TursoAuthToken.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `parameterName`<sup>Required</sup> <a name="parameterName" id="cdk-turso.TursoAuthToken.property.parameterName"></a>

```typescript
public readonly parameterName: string;
```

- *Type:* string

The SSM parameter name where the auth token is stored.

---


### TursoDatabase <a name="TursoDatabase" id="cdk-turso.TursoDatabase"></a>

#### Initializers <a name="Initializers" id="cdk-turso.TursoDatabase.Initializer"></a>

```typescript
import { TursoDatabase } from 'cdk-turso'

new TursoDatabase(scope: Construct, id: string, props: TursoDatabaseProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-turso.TursoDatabase.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cdk-turso.TursoDatabase.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-turso.TursoDatabase.Initializer.parameter.props">props</a></code> | <code><a href="#cdk-turso.TursoDatabaseProps">TursoDatabaseProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-turso.TursoDatabase.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-turso.TursoDatabase.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-turso.TursoDatabase.Initializer.parameter.props"></a>

- *Type:* <a href="#cdk-turso.TursoDatabaseProps">TursoDatabaseProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-turso.TursoDatabase.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#cdk-turso.TursoDatabase.with">with</a></code> | Applies one or more mixins to this construct. |

---

##### `toString` <a name="toString" id="cdk-turso.TursoDatabase.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `with` <a name="with" id="cdk-turso.TursoDatabase.with"></a>

```typescript
public with(mixins: ...IMixin[]): IConstruct
```

Applies one or more mixins to this construct.

Mixins are applied in order. The list of constructs is captured at the
start of the call, so constructs added by a mixin will not be visited.
Use multiple `with()` calls if subsequent mixins should apply to added
constructs.

###### `mixins`<sup>Required</sup> <a name="mixins" id="cdk-turso.TursoDatabase.with.parameter.mixins"></a>

- *Type:* ...constructs.IMixin[]

The mixins to apply.

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-turso.TursoDatabase.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="cdk-turso.TursoDatabase.isConstruct"></a>

```typescript
import { TursoDatabase } from 'cdk-turso'

TursoDatabase.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="cdk-turso.TursoDatabase.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-turso.TursoDatabase.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-turso.TursoDatabase.property.databaseName">databaseName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-turso.TursoDatabase.property.dbId">dbId</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-turso.TursoDatabase.property.hostname">hostname</a></code> | <code>string</code> | DNS hostname for the database (e.g., `my-db-my-org.turso.io`). Use with libSQL or HTTP connections. |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-turso.TursoDatabase.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `databaseName`<sup>Required</sup> <a name="databaseName" id="cdk-turso.TursoDatabase.property.databaseName"></a>

```typescript
public readonly databaseName: string;
```

- *Type:* string

---

##### `dbId`<sup>Required</sup> <a name="dbId" id="cdk-turso.TursoDatabase.property.dbId"></a>

```typescript
public readonly dbId: string;
```

- *Type:* string

---

##### `hostname`<sup>Required</sup> <a name="hostname" id="cdk-turso.TursoDatabase.property.hostname"></a>

```typescript
public readonly hostname: string;
```

- *Type:* string

DNS hostname for the database (e.g., `my-db-my-org.turso.io`). Use with libSQL or HTTP connections.

---


### TursoProvider <a name="TursoProvider" id="cdk-turso.TursoProvider"></a>

Shared Lambda + CloudFormation custom-resource provider for all Turso resources.

Create one per stack and pass it to every
`TursoDatabase`, `TursoAuthToken`, etc.

#### Initializers <a name="Initializers" id="cdk-turso.TursoProvider.Initializer"></a>

```typescript
import { TursoProvider } from 'cdk-turso'

new TursoProvider(scope: Construct, id: string, props: TursoProviderProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-turso.TursoProvider.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cdk-turso.TursoProvider.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-turso.TursoProvider.Initializer.parameter.props">props</a></code> | <code><a href="#cdk-turso.TursoProviderProps">TursoProviderProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-turso.TursoProvider.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-turso.TursoProvider.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-turso.TursoProvider.Initializer.parameter.props"></a>

- *Type:* <a href="#cdk-turso.TursoProviderProps">TursoProviderProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-turso.TursoProvider.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#cdk-turso.TursoProvider.with">with</a></code> | Applies one or more mixins to this construct. |

---

##### `toString` <a name="toString" id="cdk-turso.TursoProvider.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `with` <a name="with" id="cdk-turso.TursoProvider.with"></a>

```typescript
public with(mixins: ...IMixin[]): IConstruct
```

Applies one or more mixins to this construct.

Mixins are applied in order. The list of constructs is captured at the
start of the call, so constructs added by a mixin will not be visited.
Use multiple `with()` calls if subsequent mixins should apply to added
constructs.

###### `mixins`<sup>Required</sup> <a name="mixins" id="cdk-turso.TursoProvider.with.parameter.mixins"></a>

- *Type:* ...constructs.IMixin[]

The mixins to apply.

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-turso.TursoProvider.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="cdk-turso.TursoProvider.isConstruct"></a>

```typescript
import { TursoProvider } from 'cdk-turso'

TursoProvider.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="cdk-turso.TursoProvider.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-turso.TursoProvider.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-turso.TursoProvider.property.handler">handler</a></code> | <code>aws-cdk-lib.aws_lambda.Function</code> | The Lambda function backing all Turso custom resources. |
| <code><a href="#cdk-turso.TursoProvider.property.serviceToken">serviceToken</a></code> | <code>string</code> | The CDK custom-resource provider service token. |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-turso.TursoProvider.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `handler`<sup>Required</sup> <a name="handler" id="cdk-turso.TursoProvider.property.handler"></a>

```typescript
public readonly handler: Function;
```

- *Type:* aws-cdk-lib.aws_lambda.Function

The Lambda function backing all Turso custom resources.

Use this to attach additional IAM permissions when a resource
type needs them (e.g. `ssm:PutParameter` for auth-token storage).

---

##### `serviceToken`<sup>Required</sup> <a name="serviceToken" id="cdk-turso.TursoProvider.property.serviceToken"></a>

```typescript
public readonly serviceToken: string;
```

- *Type:* string

The CDK custom-resource provider service token.

---


## Structs <a name="Structs" id="Structs"></a>

### TursoAuthTokenProps <a name="TursoAuthTokenProps" id="cdk-turso.TursoAuthTokenProps"></a>

#### Initializer <a name="Initializer" id="cdk-turso.TursoAuthTokenProps.Initializer"></a>

```typescript
import { TursoAuthTokenProps } from 'cdk-turso'

const tursoAuthTokenProps: TursoAuthTokenProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-turso.TursoAuthTokenProps.property.databaseName">databaseName</a></code> | <code>string</code> | The name of the Turso database to create an auth token for. |
| <code><a href="#cdk-turso.TursoAuthTokenProps.property.organizationSlug">organizationSlug</a></code> | <code>string</code> | The Turso organization slug that owns the database. |
| <code><a href="#cdk-turso.TursoAuthTokenProps.property.parameterName">parameterName</a></code> | <code>string</code> | The SSM parameter name where the generated JWT will be stored as a SecureString. |
| <code><a href="#cdk-turso.TursoAuthTokenProps.property.provider">provider</a></code> | <code><a href="#cdk-turso.TursoProvider">TursoProvider</a></code> | *No description.* |
| <code><a href="#cdk-turso.TursoAuthTokenProps.property.authorization">authorization</a></code> | <code>string</code> | Authorization level for the token. |
| <code><a href="#cdk-turso.TursoAuthTokenProps.property.expiration">expiration</a></code> | <code>string</code> | Expiration time for the token (e.g., `"2w"`, `"1d30m"`). |

---

##### `databaseName`<sup>Required</sup> <a name="databaseName" id="cdk-turso.TursoAuthTokenProps.property.databaseName"></a>

```typescript
public readonly databaseName: string;
```

- *Type:* string

The name of the Turso database to create an auth token for.

---

##### `organizationSlug`<sup>Required</sup> <a name="organizationSlug" id="cdk-turso.TursoAuthTokenProps.property.organizationSlug"></a>

```typescript
public readonly organizationSlug: string;
```

- *Type:* string

The Turso organization slug that owns the database.

---

##### `parameterName`<sup>Required</sup> <a name="parameterName" id="cdk-turso.TursoAuthTokenProps.property.parameterName"></a>

```typescript
public readonly parameterName: string;
```

- *Type:* string

The SSM parameter name where the generated JWT will be stored as a SecureString.

---

##### `provider`<sup>Required</sup> <a name="provider" id="cdk-turso.TursoAuthTokenProps.property.provider"></a>

```typescript
public readonly provider: TursoProvider;
```

- *Type:* <a href="#cdk-turso.TursoProvider">TursoProvider</a>

---

##### `authorization`<sup>Optional</sup> <a name="authorization" id="cdk-turso.TursoAuthTokenProps.property.authorization"></a>

```typescript
public readonly authorization: string;
```

- *Type:* string
- *Default:* "full-access"

Authorization level for the token.

---

##### `expiration`<sup>Optional</sup> <a name="expiration" id="cdk-turso.TursoAuthTokenProps.property.expiration"></a>

```typescript
public readonly expiration: string;
```

- *Type:* string
- *Default:* "never"

Expiration time for the token (e.g., `"2w"`, `"1d30m"`).

---

### TursoDatabaseEncryption <a name="TursoDatabaseEncryption" id="cdk-turso.TursoDatabaseEncryption"></a>

#### Initializer <a name="Initializer" id="cdk-turso.TursoDatabaseEncryption.Initializer"></a>

```typescript
import { TursoDatabaseEncryption } from 'cdk-turso'

const tursoDatabaseEncryption: TursoDatabaseEncryption = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-turso.TursoDatabaseEncryption.property.encryptionCipher">encryptionCipher</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-turso.TursoDatabaseEncryption.property.encryptionKey">encryptionKey</a></code> | <code>string</code> | *No description.* |

---

##### `encryptionCipher`<sup>Required</sup> <a name="encryptionCipher" id="cdk-turso.TursoDatabaseEncryption.property.encryptionCipher"></a>

```typescript
public readonly encryptionCipher: string;
```

- *Type:* string

---

##### `encryptionKey`<sup>Required</sup> <a name="encryptionKey" id="cdk-turso.TursoDatabaseEncryption.property.encryptionKey"></a>

```typescript
public readonly encryptionKey: string;
```

- *Type:* string

---

### TursoDatabaseProps <a name="TursoDatabaseProps" id="cdk-turso.TursoDatabaseProps"></a>

#### Initializer <a name="Initializer" id="cdk-turso.TursoDatabaseProps.Initializer"></a>

```typescript
import { TursoDatabaseProps } from 'cdk-turso'

const tursoDatabaseProps: TursoDatabaseProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-turso.TursoDatabaseProps.property.databaseName">databaseName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-turso.TursoDatabaseProps.property.group">group</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-turso.TursoDatabaseProps.property.organizationSlug">organizationSlug</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-turso.TursoDatabaseProps.property.provider">provider</a></code> | <code><a href="#cdk-turso.TursoProvider">TursoProvider</a></code> | *No description.* |
| <code><a href="#cdk-turso.TursoDatabaseProps.property.encryption">encryption</a></code> | <code><a href="#cdk-turso.TursoDatabaseEncryption">TursoDatabaseEncryption</a></code> | *No description.* |
| <code><a href="#cdk-turso.TursoDatabaseProps.property.seed">seed</a></code> | <code><a href="#cdk-turso.TursoDatabaseSeed">TursoDatabaseSeed</a></code> | *No description.* |
| <code><a href="#cdk-turso.TursoDatabaseProps.property.sizeLimit">sizeLimit</a></code> | <code>string</code> | *No description.* |

---

##### `databaseName`<sup>Required</sup> <a name="databaseName" id="cdk-turso.TursoDatabaseProps.property.databaseName"></a>

```typescript
public readonly databaseName: string;
```

- *Type:* string

---

##### `group`<sup>Required</sup> <a name="group" id="cdk-turso.TursoDatabaseProps.property.group"></a>

```typescript
public readonly group: string;
```

- *Type:* string

---

##### `organizationSlug`<sup>Required</sup> <a name="organizationSlug" id="cdk-turso.TursoDatabaseProps.property.organizationSlug"></a>

```typescript
public readonly organizationSlug: string;
```

- *Type:* string

---

##### `provider`<sup>Required</sup> <a name="provider" id="cdk-turso.TursoDatabaseProps.property.provider"></a>

```typescript
public readonly provider: TursoProvider;
```

- *Type:* <a href="#cdk-turso.TursoProvider">TursoProvider</a>

---

##### `encryption`<sup>Optional</sup> <a name="encryption" id="cdk-turso.TursoDatabaseProps.property.encryption"></a>

```typescript
public readonly encryption: TursoDatabaseEncryption;
```

- *Type:* <a href="#cdk-turso.TursoDatabaseEncryption">TursoDatabaseEncryption</a>

---

##### `seed`<sup>Optional</sup> <a name="seed" id="cdk-turso.TursoDatabaseProps.property.seed"></a>

```typescript
public readonly seed: TursoDatabaseSeed;
```

- *Type:* <a href="#cdk-turso.TursoDatabaseSeed">TursoDatabaseSeed</a>

---

##### `sizeLimit`<sup>Optional</sup> <a name="sizeLimit" id="cdk-turso.TursoDatabaseProps.property.sizeLimit"></a>

```typescript
public readonly sizeLimit: string;
```

- *Type:* string

---

### TursoDatabaseSeed <a name="TursoDatabaseSeed" id="cdk-turso.TursoDatabaseSeed"></a>

#### Initializer <a name="Initializer" id="cdk-turso.TursoDatabaseSeed.Initializer"></a>

```typescript
import { TursoDatabaseSeed } from 'cdk-turso'

const tursoDatabaseSeed: TursoDatabaseSeed = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-turso.TursoDatabaseSeed.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-turso.TursoDatabaseSeed.property.type">type</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-turso.TursoDatabaseSeed.property.timestamp">timestamp</a></code> | <code>string</code> | *No description.* |

---

##### `name`<sup>Required</sup> <a name="name" id="cdk-turso.TursoDatabaseSeed.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `type`<sup>Required</sup> <a name="type" id="cdk-turso.TursoDatabaseSeed.property.type"></a>

```typescript
public readonly type: string;
```

- *Type:* string

---

##### `timestamp`<sup>Optional</sup> <a name="timestamp" id="cdk-turso.TursoDatabaseSeed.property.timestamp"></a>

```typescript
public readonly timestamp: string;
```

- *Type:* string

---

### TursoProviderProps <a name="TursoProviderProps" id="cdk-turso.TursoProviderProps"></a>

#### Initializer <a name="Initializer" id="cdk-turso.TursoProviderProps.Initializer"></a>

```typescript
import { TursoProviderProps } from 'cdk-turso'

const tursoProviderProps: TursoProviderProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-turso.TursoProviderProps.property.apiToken">apiToken</a></code> | <code>aws-cdk-lib.aws_ssm.IParameter</code> | SSM parameter that holds the Turso platform API token (stored as SecureString). |
| <code><a href="#cdk-turso.TursoProviderProps.property.logGroup">logGroup</a></code> | <code>aws-cdk-lib.aws_logs.ILogGroup</code> | Optional log group for the Lambda function. |

---

##### `apiToken`<sup>Required</sup> <a name="apiToken" id="cdk-turso.TursoProviderProps.property.apiToken"></a>

```typescript
public readonly apiToken: IParameter;
```

- *Type:* aws-cdk-lib.aws_ssm.IParameter

SSM parameter that holds the Turso platform API token (stored as SecureString).

---

##### `logGroup`<sup>Optional</sup> <a name="logGroup" id="cdk-turso.TursoProviderProps.property.logGroup"></a>

```typescript
public readonly logGroup: ILogGroup;
```

- *Type:* aws-cdk-lib.aws_logs.ILogGroup

Optional log group for the Lambda function.

If not provided, a log group will be automatically created.

---



