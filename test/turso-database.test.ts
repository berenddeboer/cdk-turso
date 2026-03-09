import { Stack } from "aws-cdk-lib"
import { Match, Template } from "aws-cdk-lib/assertions"
import { StringParameter } from "aws-cdk-lib/aws-ssm"
import { TursoDatabase, TursoProvider } from "../src"

describe("TursoDatabase", () => {
  function createStack() {
    const stack = new Stack()
    const apiToken = new StringParameter(stack, "ApiToken", {
      parameterName: "/turso/api-token",
      stringValue: "test-token",
    })
    const provider = new TursoProvider(stack, "TursoProvider", { apiToken })
    return { stack, provider }
  }

  test("supports imported provider service token", () => {
    const stack = new Stack()
    const provider = TursoProvider.fromServiceToken(
      stack,
      "ImportedProvider",
      "arn:aws:lambda:us-east-1:123456789012:function:turso-provider",
    )

    new TursoDatabase(stack, "Database", {
      provider,
      databaseName: "test-db",
      group: "group1",
      organizationSlug: "myorg",
    })

    const template = Template.fromStack(stack)
    template.hasResourceProperties("Custom::TursoDatabase", {
      ServiceToken:
        "arn:aws:lambda:us-east-1:123456789012:function:turso-provider",
    })
    template.resourceCountIs("AWS::Lambda::Function", 0)
  })

  test("creates custom resource with correct properties", () => {
    const { stack, provider } = createStack()
    new TursoDatabase(stack, "Database", {
      provider,
      databaseName: "test-db",
      group: "group1",
      organizationSlug: "myorg",
    })

    const template = Template.fromStack(stack)
    template.hasResource("Custom::TursoDatabase", {
      Properties: {
        ResourceType: "Database",
        DatabaseName: "test-db",
        Group: "group1",
        OrganizationSlug: "myorg",
      },
    })
  })

  test("lambda function uses nodejs runtime", () => {
    const { stack, provider } = createStack()
    new TursoDatabase(stack, "Database", {
      provider,
      databaseName: "test-db",
      group: "group1",
      organizationSlug: "myorg",
    })

    const template = Template.fromStack(stack)
    template.hasResourceProperties("AWS::Lambda::Function", {
      Runtime: "nodejs24.x",
      Handler: "index.handler",
    })
  })

  test("lambda has SSM parameter name in environment variables", () => {
    const { stack, provider } = createStack()
    new TursoDatabase(stack, "Database", {
      provider,
      databaseName: "test-db",
      group: "group1",
      organizationSlug: "myorg",
    })

    const template = Template.fromStack(stack)
    template.hasResourceProperties("AWS::Lambda::Function", {
      Environment: {
        Variables: {
          TURSO_API_TOKEN_PARAMETER_NAME: {
            Ref: "ApiToken07F9A1D2",
          },
        },
      },
    })
  })

  test("IAM policy grants ssm:GetParameter", () => {
    const { stack, provider } = createStack()
    new TursoDatabase(stack, "Database", {
      provider,
      databaseName: "test-db",
      group: "group1",
      organizationSlug: "myorg",
    })

    const template = Template.fromStack(stack)
    template.hasResourceProperties("AWS::IAM::Policy", {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Effect: "Allow",
            Action: Match.arrayWith(["ssm:GetParameter"]),
          }),
        ]),
      },
    })
  })

  test("optional properties are passed through when provided", () => {
    const { stack, provider } = createStack()
    new TursoDatabase(stack, "Database", {
      provider,
      databaseName: "test-db",
      group: "group1",
      organizationSlug: "myorg",
      sizeLimit: "256mb",
      seed: {
        type: "schema",
        name: "migrations",
      },
      encryption: {
        encryptionKey: "key-arn",
        encryptionCipher: "AES",
      },
    })

    const template = Template.fromStack(stack)
    template.hasResourceProperties("Custom::TursoDatabase", {
      ResourceType: "Database",
      DatabaseName: "test-db",
      Group: "group1",
      OrganizationSlug: "myorg",
      SizeLimit: "256mb",
      Seed: {
        type: "schema",
        name: "migrations",
      },
      Encryption: {
        encryptionKey: "key-arn",
        encryptionCipher: "AES",
      },
    })
  })

  test("databaseName validation rejects invalid names", () => {
    const { stack, provider } = createStack()
    expect(() => {
      new TursoDatabase(stack, "Database", {
        provider,
        databaseName: "Test-DB",
        group: "group1",
        organizationSlug: "myorg",
      })
    }).toThrow(
      "databaseName must contain only lowercase letters, numbers, and dashes",
    )
  })

  test("databaseName validation rejects names longer than 64 chars", () => {
    const { stack, provider } = createStack()
    expect(() => {
      new TursoDatabase(stack, "Database", {
        provider,
        databaseName: "a".repeat(65),
        group: "group1",
        organizationSlug: "myorg",
      })
    }).toThrow("databaseName must be at most 64 characters")
  })

  test("construct exposes dbId, hostname, databaseName attributes", () => {
    const { stack, provider } = createStack()
    const db = new TursoDatabase(stack, "Database", {
      provider,
      databaseName: "test-db",
      group: "group1",
      organizationSlug: "myorg",
    })

    expect(db.dbId).toBeDefined()
    expect(db.hostname).toBeDefined()
    expect(db.databaseName).toBeDefined()
  })
})
