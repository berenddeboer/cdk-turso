import { Stack } from "aws-cdk-lib"
import { Match, Template } from "aws-cdk-lib/assertions"
import { StringParameter } from "aws-cdk-lib/aws-ssm"
import { TursoAuthToken, TursoProvider } from "../src"

describe("TursoAuthToken", () => {
  function createStack() {
    const stack = new Stack()
    const apiToken = new StringParameter(stack, "ApiToken", {
      parameterName: "/turso/api-token",
      stringValue: "test-token",
    })
    const provider = new TursoProvider(stack, "TursoProvider", { apiToken })
    return { stack, provider }
  }

  test("creates custom resource with correct properties", () => {
    const { stack, provider } = createStack()
    new TursoAuthToken(stack, "AuthToken", {
      provider,
      databaseName: "test-db",
      organizationSlug: "myorg",
      parameterName: "/turso/db-token",
    })

    const template = Template.fromStack(stack)
    template.hasResourceProperties("Custom::TursoAuthToken", {
      ResourceType: "AuthToken",
      OrganizationSlug: "myorg",
      ParameterName: "/turso/db-token",
    })
  })

  test("IAM policy grants ssm:GetParameter for API token", () => {
    const { stack, provider } = createStack()
    new TursoAuthToken(stack, "AuthToken", {
      provider,
      databaseName: "test-db",
      organizationSlug: "myorg",
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
    const { stack, provider } = createStack()
    new TursoAuthToken(stack, "AuthToken", {
      provider,
      databaseName: "test-db",
      organizationSlug: "myorg",
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
    const { stack, provider } = createStack()
    new TursoAuthToken(stack, "AuthToken", {
      provider,
      databaseName: "test-db",
      organizationSlug: "myorg",
      parameterName: "/turso/db-token",
      expiration: "2w",
      authorization: "read-only",
    })

    const template = Template.fromStack(stack)
    template.hasResourceProperties("Custom::TursoAuthToken", {
      ResourceType: "AuthToken",
      ParameterName: "/turso/db-token",
      Expiration: "2w",
      Authorization: "read-only",
    })
  })

  test("authorization validation rejects invalid values", () => {
    const { stack, provider } = createStack()
    expect(() => {
      new TursoAuthToken(stack, "AuthToken", {
        provider,
        databaseName: "test-db",
        organizationSlug: "myorg",
        parameterName: "/turso/db-token",
        authorization: "invalid",
      })
    }).toThrow('authorization must be "full-access" or "read-only"')
  })

  test("construct exposes parameterName", () => {
    const { stack, provider } = createStack()
    const authToken = new TursoAuthToken(stack, "AuthToken", {
      provider,
      databaseName: "test-db",
      organizationSlug: "myorg",
      parameterName: "/turso/db-token",
    })

    expect(authToken.parameterName).toBe("/turso/db-token")
  })
})
