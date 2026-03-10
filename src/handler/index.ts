/* eslint-disable import/no-extraneous-dependencies */
import {
  DeleteParameterCommand,
  GetParameterCommand,
  PutParameterCommand,
  SSMClient,
} from "@aws-sdk/client-ssm"
import { backOff } from "exponential-backoff"

const ssmClient = new SSMClient({})

const retryOptions = {
  startingDelay: 5000,
  timeMultiple: 3,
  numOfAttempts: 4,
  jitter: "none" as const,
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  errorMessage: string,
  allow404 = false,
  allowError?: (status: number, errorText: string) => boolean,
): Promise<Response> {
  return backOff(async () => {
    const response = await fetch(url, options)
    if (!response.ok && !(allow404 && response.status === 404)) {
      const errorText = await response.text()
      if (allowError?.(response.status, errorText)) {
        return response
      }
      throw new Error(`${errorMessage}: ${response.status} ${errorText}`)
    }
    return response
  }, retryOptions)
}

function isAlreadyExistsError(status: number, errorText: string): boolean {
  return status === 409 || /already exists|already been taken/i.test(errorText)
}

function isTrueValue(value: unknown): boolean {
  if (typeof value === "string") {
    return value.trim().toLowerCase() === "true"
  }

  return value === true
}

async function getApiToken(parameterName: string): Promise<string> {
  const command = new GetParameterCommand({
    Name: parameterName,
    WithDecryption: true,
  })
  const response = await ssmClient.send(command)
  if (!response.Parameter?.Value) {
    throw new Error(`SSM parameter ${parameterName} not found`)
  }
  return response.Parameter.Value
}

// Database types and helpers

interface TursoDatabaseResponse {
  database: {
    DbId: string
    Hostname: string
    Name: string
  }
}

interface DatabaseResourceProperties {
  ServiceToken: string
  ResourceType: "Database"
  DatabaseName: string
  Group: string
  OrganizationSlug: string
  Adopt?: boolean | string
  SizeLimit?: string
  Seed?: {
    type: string
    name: string
    timestamp?: string
  }
  Encryption?: {
    encryptionKey: string
    encryptionCipher: string
  }
}

interface DatabaseEvent {
  RequestType: "Create" | "Update" | "Delete"
  PhysicalResourceId?: string
  ResourceProperties: DatabaseResourceProperties
  OldResourceProperties?: {
    DatabaseName: string
    Group: string
    OrganizationSlug: string
  }
}

async function handleDatabase(
  event: DatabaseEvent,
  apiToken: string,
): Promise<{
  PhysicalResourceId: string
  Data?: { DbId: string; Hostname: string; Name: string }
}> {
  const { RequestType, PhysicalResourceId, ResourceProperties } = event
  const orgSlug = encodeURIComponent(ResourceProperties.OrganizationSlug)
  const baseUrl = "https://api.turso.tech/v1"

  if (RequestType === "Create") {
    const dbName = ResourceProperties.DatabaseName
    const adopt = isTrueValue(ResourceProperties.Adopt)
    const body: Record<string, unknown> = {
      name: dbName,
      group: ResourceProperties.Group,
    }
    if (ResourceProperties.SizeLimit) {
      body.size_limit = ResourceProperties.SizeLimit
    }
    if (ResourceProperties.Seed) {
      body.seed = ResourceProperties.Seed
    }
    if (ResourceProperties.Encryption) {
      body.encryption = ResourceProperties.Encryption
    }

    const response = await fetchWithRetry(
      `${baseUrl}/organizations/${orgSlug}/databases`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
      "Failed to create database",
      false,
      (status, errorText) => {
        return adopt && isAlreadyExistsError(status, errorText)
      },
    )

    if (!response.ok) {
      const existingDbName = encodeURIComponent(dbName)
      const existingResponse = await fetchWithRetry(
        `${baseUrl}/organizations/${orgSlug}/databases/${existingDbName}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        },
        "Failed to get database",
      )

      const existingData =
        (await existingResponse.json()) as TursoDatabaseResponse
      return {
        PhysicalResourceId: dbName,
        Data: {
          DbId: existingData.database.DbId,
          Hostname: existingData.database.Hostname,
          Name: existingData.database.Name,
        },
      }
    }

    const data = (await response.json()) as TursoDatabaseResponse
    return {
      PhysicalResourceId: dbName,
      Data: {
        DbId: data.database.DbId,
        Hostname: data.database.Hostname,
        Name: data.database.Name,
      },
    }
  }

  if (RequestType === "Update") {
    const oldDbName = event.OldResourceProperties?.DatabaseName
    const newDbName = ResourceProperties.DatabaseName

    if (oldDbName && oldDbName !== newDbName) {
      const body: Record<string, unknown> = {
        name: newDbName,
        group: ResourceProperties.Group,
      }

      const response = await fetchWithRetry(
        `${baseUrl}/organizations/${orgSlug}/databases`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
        "Failed to create database",
      )

      const data = (await response.json()) as TursoDatabaseResponse
      return {
        PhysicalResourceId: newDbName,
        Data: {
          DbId: data.database.DbId,
          Hostname: data.database.Hostname,
          Name: data.database.Name,
        },
      }
    }

    return {
      PhysicalResourceId: PhysicalResourceId || ResourceProperties.DatabaseName,
    }
  }

  if (RequestType === "Delete") {
    if (!PhysicalResourceId) {
      return { PhysicalResourceId: "unknown" }
    }

    if (
      PhysicalResourceId === "unknown" ||
      PhysicalResourceId.startsWith("failed-")
    ) {
      return { PhysicalResourceId }
    }

    const dbNameToDelete = encodeURIComponent(PhysicalResourceId)
    await fetchWithRetry(
      `${baseUrl}/organizations/${orgSlug}/databases/${dbNameToDelete}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      },
      "Failed to delete database",
      true,
    )

    return { PhysicalResourceId: PhysicalResourceId }
  }

  throw new Error(`Unknown request type: ${RequestType}`)
}

// Auth token types and helpers

interface TursoAuthTokenResponse {
  jwt: string
}

interface AuthTokenResourceProperties {
  ServiceToken: string
  ResourceType: "AuthToken"
  DatabaseName: string
  OrganizationSlug: string
  ParameterName: string
  Expiration?: string
  Authorization?: string
}

interface AuthTokenEvent {
  RequestType: "Create" | "Update" | "Delete"
  PhysicalResourceId?: string
  ResourceProperties: AuthTokenResourceProperties
}

async function createToken(
  baseUrl: string,
  orgSlug: string,
  dbName: string,
  apiToken: string,
  expiration: string,
  authorization: string,
): Promise<string> {
  const params = new URLSearchParams()
  params.set("expiration", expiration)
  params.set("authorization", authorization)

  const response = await fetchWithRetry(
    `${baseUrl}/organizations/${orgSlug}/databases/${dbName}/auth/tokens?${params.toString()}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    },
    "Failed to create auth token",
  )

  const data = (await response.json()) as TursoAuthTokenResponse
  return data.jwt
}

async function storeToken(parameterName: string, token: string): Promise<void> {
  const command = new PutParameterCommand({
    Name: parameterName,
    Value: token,
    Type: "SecureString",
    Overwrite: true,
  })
  await ssmClient.send(command)
}

async function deleteParameter(parameterName: string): Promise<void> {
  try {
    const command = new DeleteParameterCommand({
      Name: parameterName,
    })
    await ssmClient.send(command)
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "ParameterNotFound") {
      return
    }
    throw error
  }
}

async function handleAuthToken(
  event: AuthTokenEvent,
  apiToken: string,
): Promise<{ PhysicalResourceId: string }> {
  const { RequestType, PhysicalResourceId, ResourceProperties } = event
  const orgSlug = encodeURIComponent(ResourceProperties.OrganizationSlug)
  const dbName = encodeURIComponent(ResourceProperties.DatabaseName)
  const baseUrl = "https://api.turso.tech/v1"
  const parameterName = ResourceProperties.ParameterName
  const expiration = ResourceProperties.Expiration || "never"
  const authorization = ResourceProperties.Authorization || "full-access"

  if (RequestType === "Create") {
    const jwt = await createToken(
      baseUrl,
      orgSlug,
      dbName,
      apiToken,
      expiration,
      authorization,
    )
    await storeToken(parameterName, jwt)
    return { PhysicalResourceId: parameterName }
  }

  if (RequestType === "Update") {
    const jwt = await createToken(
      baseUrl,
      orgSlug,
      dbName,
      apiToken,
      expiration,
      authorization,
    )
    await storeToken(parameterName, jwt)
    return { PhysicalResourceId: parameterName }
  }

  if (RequestType === "Delete") {
    if (!PhysicalResourceId) {
      return { PhysicalResourceId: "unknown" }
    }

    if (
      PhysicalResourceId === "unknown" ||
      PhysicalResourceId.startsWith("failed-")
    ) {
      return { PhysicalResourceId }
    }

    await deleteParameter(PhysicalResourceId)
    return { PhysicalResourceId }
  }

  throw new Error(`Unknown request type: ${RequestType}`)
}

// Main handler — dispatches by ResourceType

export interface CloudFormationCustomResourceEvent {
  RequestType: "Create" | "Update" | "Delete"
  PhysicalResourceId?: string
  ResourceProperties: {
    ServiceToken: string
    ResourceType: "Database" | "AuthToken"
    [key: string]: unknown
  }
  OldResourceProperties?: {
    [key: string]: unknown
  }
}

export async function handler(
  event: CloudFormationCustomResourceEvent,
): Promise<{
  PhysicalResourceId: string
  Data?: Record<string, string>
}> {
  const parameterName = process.env.TURSO_API_TOKEN_PARAMETER_NAME
  if (!parameterName) {
    throw new Error(
      "TURSO_API_TOKEN_PARAMETER_NAME environment variable not set",
    )
  }

  const apiToken = await getApiToken(parameterName)
  const resourceType = event.ResourceProperties.ResourceType

  switch (resourceType) {
    case "Database":
      return handleDatabase(event as unknown as DatabaseEvent, apiToken)
    case "AuthToken":
      return handleAuthToken(event as unknown as AuthTokenEvent, apiToken)
    default:
      throw new Error(`Unknown resource type: ${resourceType}`)
  }
}
