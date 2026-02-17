jest.mock("exponential-backoff", () => ({
  backOff: (fn: () => Promise<unknown>) => fn(),
}))

const mockSend = jest.fn()
jest.mock("@aws-sdk/client-ssm", () => {
  return {
    SSMClient: jest.fn().mockImplementation(() => ({
      send: mockSend,
    })),
    GetParameterCommand: jest.fn().mockImplementation((params) => params),
    PutParameterCommand: jest.fn().mockImplementation((params) => params),
    DeleteParameterCommand: jest.fn().mockImplementation((params) => params),
  }
})

import {
  type CloudFormationCustomResourceEvent,
  handler,
} from "../src/handler-auth-token"

describe("handler-auth-token", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.TURSO_API_TOKEN_PARAMETER_NAME = "/turso/api-token"
    mockSend.mockResolvedValue({
      Parameter: { Value: "test-api-token" },
    })
  })

  afterEach(() => {
    delete process.env.TURSO_API_TOKEN_PARAMETER_NAME
  })

  test("create calls Turso API and stores token in SSM", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ jwt: "generated-jwt-token" }),
    })
    global.fetch = mockFetch

    const event: CloudFormationCustomResourceEvent = {
      RequestType: "Create",
      ResourceProperties: {
        ServiceToken: "arn:aws:lambda:us-east-1:123456789012:function:test",
        DatabaseName: "test-db",
        OrganizationSlug: "myorg",
        ParameterName: "/turso/db-token",
      },
    }

    const result = await handler(event)

    expect(result.PhysicalResourceId).toBe("/turso/db-token")

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.turso.tech/v1/organizations/myorg/databases/test-db/auth/tokens?expiration=never&authorization=full-access",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-api-token",
        }),
      }),
    )

    // Second call to mockSend is the PutParameter
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        Name: "/turso/db-token",
        Value: "generated-jwt-token",
        Type: "SecureString",
        Overwrite: true,
      }),
    )
  })

  test("create passes expiration and authorization query params", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ jwt: "generated-jwt-token" }),
    })
    global.fetch = mockFetch

    const event: CloudFormationCustomResourceEvent = {
      RequestType: "Create",
      ResourceProperties: {
        ServiceToken: "arn:aws:lambda:us-east-1:123456789012:function:test",
        DatabaseName: "test-db",
        OrganizationSlug: "myorg",
        ParameterName: "/turso/db-token",
        Expiration: "2w",
        Authorization: "read-only",
      },
    }

    await handler(event)

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.turso.tech/v1/organizations/myorg/databases/test-db/auth/tokens?expiration=2w&authorization=read-only",
      expect.objectContaining({ method: "POST" }),
    )
  })

  test("update regenerates token and stores in SSM", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ jwt: "new-jwt-token" }),
    })
    global.fetch = mockFetch

    const event: CloudFormationCustomResourceEvent = {
      RequestType: "Update",
      PhysicalResourceId: "/turso/db-token",
      ResourceProperties: {
        ServiceToken: "arn:aws:lambda:us-east-1:123456789012:function:test",
        DatabaseName: "test-db",
        OrganizationSlug: "myorg",
        ParameterName: "/turso/db-token",
      },
    }

    const result = await handler(event)

    expect(result.PhysicalResourceId).toBe("/turso/db-token")
    expect(mockFetch).toHaveBeenCalled()
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        Name: "/turso/db-token",
        Value: "new-jwt-token",
        Type: "SecureString",
        Overwrite: true,
      }),
    )
  })

  test("delete removes SSM parameter", async () => {
    const event: CloudFormationCustomResourceEvent = {
      RequestType: "Delete",
      PhysicalResourceId: "/turso/db-token",
      ResourceProperties: {
        ServiceToken: "arn:aws:lambda:us-east-1:123456789012:function:test",
        DatabaseName: "test-db",
        OrganizationSlug: "myorg",
        ParameterName: "/turso/db-token",
      },
    }

    const result = await handler(event)

    expect(result.PhysicalResourceId).toBe("/turso/db-token")
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        Name: "/turso/db-token",
      }),
    )
  })

  test("delete skips unknown physical resource ID", async () => {
    const event: CloudFormationCustomResourceEvent = {
      RequestType: "Delete",
      PhysicalResourceId: "unknown",
      ResourceProperties: {
        ServiceToken: "arn:aws:lambda:us-east-1:123456789012:function:test",
        DatabaseName: "test-db",
        OrganizationSlug: "myorg",
        ParameterName: "/turso/db-token",
      },
    }

    const result = await handler(event)

    expect(result.PhysicalResourceId).toBe("unknown")
  })

  test("API errors are thrown as exceptions", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => "Internal Server Error",
    })
    global.fetch = mockFetch

    const event: CloudFormationCustomResourceEvent = {
      RequestType: "Create",
      ResourceProperties: {
        ServiceToken: "arn:aws:lambda:us-east-1:123456789012:function:test",
        DatabaseName: "test-db",
        OrganizationSlug: "myorg",
        ParameterName: "/turso/db-token",
      },
    }

    await expect(handler(event)).rejects.toThrow("Failed to create auth token")
  })

  test("missing env var throws early", async () => {
    delete process.env.TURSO_API_TOKEN_PARAMETER_NAME

    const event: CloudFormationCustomResourceEvent = {
      RequestType: "Create",
      ResourceProperties: {
        ServiceToken: "arn:aws:lambda:us-east-1:123456789012:function:test",
        DatabaseName: "test-db",
        OrganizationSlug: "myorg",
        ParameterName: "/turso/db-token",
      },
    }

    await expect(handler(event)).rejects.toThrow(
      "TURSO_API_TOKEN_PARAMETER_NAME environment variable not set",
    )
  })
})
