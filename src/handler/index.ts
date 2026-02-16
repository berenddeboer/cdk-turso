/* eslint-disable import/no-extraneous-dependencies */
import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm"
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
  allow404: boolean,
): Promise<Response> {
  return backOff(async () => {
    const response = await fetch(url, options)
    if (!response.ok && !(allow404 && response.status === 404)) {
      const errorText = await response.text()
      throw new Error(`${errorMessage}: ${response.status} ${errorText}`)
    }
    return response
  }, retryOptions)
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

interface TursoDatabaseResponse {
  database: {
    DbId: string
    Hostname: string
    Name: string
  }
}

export interface CloudFormationCustomResourceEvent {
  RequestType: "Create" | "Update" | "Delete"
  PhysicalResourceId?: string
  ResourceProperties: {
    ServiceToken: string
    DatabaseName: string
    Group: string
    OrganizationSlug: string
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
  OldResourceProperties?: {
    DatabaseName: string
    Group: string
    OrganizationSlug: string
  }
}

export async function handler(
  event: CloudFormationCustomResourceEvent,
): Promise<{
  PhysicalResourceId: string
  Data?: {
    DbId: string
    Hostname: string
    Name: string
  }
}> {
  const {
    RequestType,
    PhysicalResourceId,
    ResourceProperties,
    OldResourceProperties,
  } = event
  const parameterName = process.env.TURSO_API_TOKEN_PARAMETER_NAME
  if (!parameterName) {
    throw new Error(
      "TURSO_API_TOKEN_PARAMETER_NAME environment variable not set",
    )
  }

  const apiToken = await getApiToken(parameterName)
  const orgSlug = encodeURIComponent(ResourceProperties.OrganizationSlug)
  const baseUrl = "https://api.turso.tech/v1"

  if (RequestType === "Create") {
    const dbName = ResourceProperties.DatabaseName
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
    )

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
    const oldDbName = OldResourceProperties?.DatabaseName
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
        false,
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
