import { Stack } from "aws-cdk-lib"
import { Match, Template } from "aws-cdk-lib/assertions"
import { StringParameter } from "aws-cdk-lib/aws-ssm"
import { TursoDatabase } from "../src"

describe("TursoDatabase", () => {
  function createStack() {
    const stack = new Stack()
    const apiToken = new StringParameter(stack, "ApiToken", {
      parameterName: "/turso/api-token",
      stringValue: "test-token",
    })
    return { stack, apiToken }
  }

  test("creates custom resource with correct properties", () => {
    const { stack, apiToken } = createStack()
    new TursoDatabase(stack, "Database", {
      databaseName: "test-db",
      group: "group1",
      organizationSlug: "myorg",
      apiToken,
    })

    const template = Template.fromStack(stack)
    template.hasResource("AWS::CloudFormation::CustomResource", {
      Properties: {
        DatabaseName: "test-db",
        Group: "group1",
        OrganizationSlug: "myorg",
      },
    })
  })

  test("lambda function uses nodejs runtime", () => {
    const { stack, apiToken } = createStack()
    new TursoDatabase(stack, "Database", {
      databaseName: "test-db",
      group: "group1",
      organizationSlug: "myorg",
      apiToken,
    })

    const template = Template.fromStack(stack)
    template.hasResourceProperties("AWS::Lambda::Function", {
      Runtime: "nodejs24.x",
      Handler: "index.handler",
    })
  })

  test("lambda has SSM parameter name in environment variables", () => {
    const { stack, apiToken } = createStack()
    new TursoDatabase(stack, "Database", {
      databaseName: "test-db",
      group: "group1",
      organizationSlug: "myorg",
      apiToken,
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
    const { stack, apiToken } = createStack()
    new TursoDatabase(stack, "Database", {
      databaseName: "test-db",
      group: "group1",
      organizationSlug: "myorg",
      apiToken,
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
    const { stack, apiToken } = createStack()
    new TursoDatabase(stack, "Database", {
      databaseName: "test-db",
      group: "group1",
      organizationSlug: "myorg",
      apiToken,
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
    template.hasResourceProperties("AWS::CloudFormation::CustomResource", {
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
    const { stack, apiToken } = createStack()
    expect(() => {
      new TursoDatabase(stack, "Database", {
        databaseName: "Test-DB",
        group: "group1",
        organizationSlug: "myorg",
        apiToken,
      })
    }).toThrow(
      "databaseName must contain only lowercase letters, numbers, and dashes",
    )
  })

  test("databaseName validation rejects names longer than 64 chars", () => {
    const { stack, apiToken } = createStack()
    expect(() => {
      new TursoDatabase(stack, "Database", {
        databaseName: "a".repeat(65),
        group: "group1",
        organizationSlug: "myorg",
        apiToken,
      })
    }).toThrow("databaseName must be at most 64 characters")
  })

  test("construct exposes dbId, hostname, databaseName attributes", () => {
    const { stack, apiToken } = createStack()
    const db = new TursoDatabase(stack, "Database", {
      databaseName: "test-db",
      group: "group1",
      organizationSlug: "myorg",
      apiToken,
    })

    expect(db.dbId).toBeDefined()
    expect(db.hostname).toBeDefined()
    expect(db.databaseName).toBeDefined()
  })
})
