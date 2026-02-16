# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

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

---

##### `toString` <a name="toString" id="cdk-turso.TursoDatabase.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-turso.TursoDatabase.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk-turso.TursoDatabase.isConstruct"></a>

```typescript
import { TursoDatabase } from 'cdk-turso'

TursoDatabase.isConstruct(x: any)
```

Checks if `x` is a construct.

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


## Structs <a name="Structs" id="Structs"></a>

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
| <code><a href="#cdk-turso.TursoDatabaseProps.property.apiToken">apiToken</a></code> | <code>aws-cdk-lib.aws_ssm.IParameter</code> | *No description.* |
| <code><a href="#cdk-turso.TursoDatabaseProps.property.databaseName">databaseName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-turso.TursoDatabaseProps.property.group">group</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-turso.TursoDatabaseProps.property.organizationSlug">organizationSlug</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-turso.TursoDatabaseProps.property.encryption">encryption</a></code> | <code><a href="#cdk-turso.TursoDatabaseEncryption">TursoDatabaseEncryption</a></code> | *No description.* |
| <code><a href="#cdk-turso.TursoDatabaseProps.property.seed">seed</a></code> | <code><a href="#cdk-turso.TursoDatabaseSeed">TursoDatabaseSeed</a></code> | *No description.* |
| <code><a href="#cdk-turso.TursoDatabaseProps.property.sizeLimit">sizeLimit</a></code> | <code>string</code> | *No description.* |

---

##### `apiToken`<sup>Required</sup> <a name="apiToken" id="cdk-turso.TursoDatabaseProps.property.apiToken"></a>

```typescript
public readonly apiToken: IParameter;
```

- *Type:* aws-cdk-lib.aws_ssm.IParameter

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



