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
): Promise<Response> {
  return backOff(async () => {
    const response = await fetch(url, options)
    if (!response.ok) {
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

interface TursoAuthTokenResponse {
  jwt: string
}

export interface CloudFormationCustomResourceEvent {
  RequestType: "Create" | "Update" | "Delete"
  PhysicalResourceId?: string
  ResourceProperties: {
    ServiceToken: string
    DatabaseName: string
    OrganizationSlug: string
    ParameterName: string
    Expiration?: string
    Authorization?: string
  }
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

export async function handler(
  event: CloudFormationCustomResourceEvent,
): Promise<{
  PhysicalResourceId: string
}> {
  const { RequestType, PhysicalResourceId, ResourceProperties } = event
  const apiTokenParameterName = process.env.TURSO_API_TOKEN_PARAMETER_NAME
  if (!apiTokenParameterName) {
    throw new Error(
      "TURSO_API_TOKEN_PARAMETER_NAME environment variable not set",
    )
  }

  const apiToken = await getApiToken(apiTokenParameterName)
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
