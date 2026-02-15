jest.mock("@aws-sdk/client-ssm", () => {
  return {
    SSMClient: jest.fn().mockImplementation(() => ({})),
    GetParameterCommand: jest.fn().mockImplementation((params) => params),
  }
})

const mockSend = jest.fn()
jest.mock("@aws-sdk/client-ssm", () => {
  return {
    SSMClient: jest.fn().mockImplementation(() => ({
      send: mockSend,
    })),
    GetParameterCommand: jest.fn().mockImplementation((params) => params),
  }
})

import { type CloudFormationCustomResourceEvent, handler } from "../src/handler"

describe("handler", () => {
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

  test("create calls Turso API with correct URL/body and returns database info", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        database: {
          DbId: "db-123",
          Hostname: "db-123.db.turso.io",
          Name: "test-db",
        },
      }),
    })
    global.fetch = mockFetch

    const event: CloudFormationCustomResourceEvent = {
      RequestType: "Create",
      ResourceProperties: {
        ServiceToken: "arn:aws:lambda:us-east-1:123456789012:function:test",
        DatabaseName: "test-db",
        Group: "group1",
        OrganizationSlug: "myorg",
      },
    }

    const result = await handler(event)

    expect(result.PhysicalResourceId).toBe("test-db")
    expect(result.Data).toEqual({
      DbId: "db-123",
      Hostname: "db-123.db.turso.io",
      Name: "test-db",
    })

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.turso.tech/v1/organizations/myorg/databases",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-api-token",
        }),
        body: JSON.stringify({
          name: "test-db",
          group: "group1",
        }),
      }),
    )
  })

  test("delete calls correct URL and returns PhysicalResourceId", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
    })
    global.fetch = mockFetch

    const event: CloudFormationCustomResourceEvent = {
      RequestType: "Delete",
      PhysicalResourceId: "test-db",
      ResourceProperties: {
        ServiceToken: "arn:aws:lambda:us-east-1:123456789012:function:test",
        DatabaseName: "test-db",
        Group: "group1",
        OrganizationSlug: "myorg",
      },
    }

    const result = await handler(event)

    expect(result.PhysicalResourceId).toBe("test-db")
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.turso.tech/v1/organizations/myorg/databases/test-db",
      expect.objectContaining({
        method: "DELETE",
      }),
    )
  })

  test("update with same name is a no-op", async () => {
    const mockFetch = jest.fn()
    global.fetch = mockFetch

    const event: CloudFormationCustomResourceEvent = {
      RequestType: "Update",
      PhysicalResourceId: "test-db",
      ResourceProperties: {
        ServiceToken: "arn:aws:lambda:us-east-1:123456789012:function:test",
        DatabaseName: "test-db",
        Group: "group1",
        OrganizationSlug: "myorg",
      },
      OldResourceProperties: {
        DatabaseName: "test-db",
        Group: "group1",
        OrganizationSlug: "myorg",
      },
    }

    const result = await handler(event)

    expect(result.PhysicalResourceId).toBe("test-db")
    expect(mockFetch).not.toHaveBeenCalled()
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
        Group: "group1",
        OrganizationSlug: "myorg",
      },
    }

    await expect(handler(event)).rejects.toThrow("Failed to create database")
  })

  test("delete tolerates 404", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
    })
    global.fetch = mockFetch

    const event: CloudFormationCustomResourceEvent = {
      RequestType: "Delete",
      PhysicalResourceId: "test-db",
      ResourceProperties: {
        ServiceToken: "arn:aws:lambda:us-east-1:123456789012:function:test",
        DatabaseName: "test-db",
        Group: "group1",
        OrganizationSlug: "myorg",
      },
    }

    const result = await handler(event)

    expect(result.PhysicalResourceId).toBe("test-db")
  })
})
