import { Stack } from "aws-cdk-lib"
import { Match, Template } from "aws-cdk-lib/assertions"
import { StringParameter } from "aws-cdk-lib/aws-ssm"
import { TursoAuthToken, TursoDatabase } from "../src"

describe("TursoAuthToken", () => {
  function createStack() {
    const stack = new Stack()
    const apiToken = new StringParameter(stack, "ApiToken", {
      parameterName: "/turso/api-token",
      stringValue: "test-token",
    })
    const database = new TursoDatabase(stack, "Database", {
      databaseName: "test-db",
      group: "group1",
      organizationSlug: "myorg",
      apiToken,
    })
    return { stack, apiToken, database }
  }

  test("creates custom resource with correct properties", () => {
    const { stack, database } = createStack()
    new TursoAuthToken(stack, "AuthToken", {
      database,
      parameterName: "/turso/db-token",
    })

    const template = Template.fromStack(stack)
    template.hasResourceProperties("AWS::CloudFormation::CustomResource", {
      OrganizationSlug: "myorg",
      ParameterName: "/turso/db-token",
    })
  })

  test("lambda function uses nodejs runtime", () => {
    const { stack, database } = createStack()
    new TursoAuthToken(stack, "AuthToken", {
      database,
      parameterName: "/turso/db-token",
    })

    const template = Template.fromStack(stack)
    template.hasResourceProperties("AWS::Lambda::Function", {
      Runtime: "nodejs24.x",
      Handler: "index.handler",
    })
  })

  test("lambda has SSM parameter name in environment variables", () => {
    const { stack, database } = createStack()
    new TursoAuthToken(stack, "AuthToken", {
      database,
      parameterName: "/turso/db-token",
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

  test("IAM policy grants ssm:GetParameter for API token", () => {
    const { stack, database } = createStack()
    new TursoAuthToken(stack, "AuthToken", {
      database,
      parameterName: "/turso/db-token",
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

  test("IAM policy grants ssm:PutParameter and ssm:DeleteParameter for output parameter", () => {
    const { stack, database } = createStack()
    new TursoAuthToken(stack, "AuthToken", {
      database,
      parameterName: "/turso/db-token",
    })

    const template = Template.fromStack(stack)
    template.hasResourceProperties("AWS::IAM::Policy", {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Effect: "Allow",
            Action: ["ssm:PutParameter", "ssm:DeleteParameter"],
          }),
        ]),
      },
    })
  })

  test("optional properties are passed through when provided", () => {
    const { stack, database } = createStack()
    new TursoAuthToken(stack, "AuthToken", {
      database,
      parameterName: "/turso/db-token",
      expiration: "2w",
      authorization: "read-only",
    })

    const template = Template.fromStack(stack)
    template.hasResourceProperties("AWS::CloudFormation::CustomResource", {
      ParameterName: "/turso/db-token",
      Expiration: "2w",
      Authorization: "read-only",
    })
  })

  test("authorization validation rejects invalid values", () => {
    const { stack, database } = createStack()
    expect(() => {
      new TursoAuthToken(stack, "AuthToken", {
        database,
        parameterName: "/turso/db-token",
        authorization: "invalid",
      })
    }).toThrow('authorization must be "full-access" or "read-only"')
  })

  test("construct exposes parameterName", () => {
    const { stack, database } = createStack()
    const authToken = new TursoAuthToken(stack, "AuthToken", {
      database,
      parameterName: "/turso/db-token",
    })

    expect(authToken.parameterName).toBe("/turso/db-token")
  })
})
