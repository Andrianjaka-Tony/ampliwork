import { z } from "zod";

import { apiFailureSchema, apiSuccessSchema, type ApiErrorCode } from "./api.schema";

export type ApiErrorReason = ApiErrorCode | "NETWORK_ERROR" | "PARSE_ERROR";

export class ApiError extends Error {
  readonly code: ApiErrorReason;
  readonly status: number;
  readonly details?: unknown;

  constructor(params: { code: ApiErrorReason; message: string; status: number; details?: unknown }) {
    super(params.message);
    this.name = "ApiError";
    this.code = params.code;
    this.status = params.status;
    this.details = params.details;
  }
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiRequest<TOut> = {
  method?: HttpMethod;

  body?: unknown;

  schema?: z.ZodType<TOut>;

  enveloped?: boolean;
  signal?: AbortSignal;
  headers?: Record<string, string>;
};

export async function apiFetch<TOut = unknown>(
  path: string,
  { method = "GET", body, schema, enveloped = true, signal, headers }: ApiRequest<TOut> = {},
): Promise<TOut> {
  let response: Response;
  try {
    response = await fetch(path, {
      method,
      signal,
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiError({ code: "NETWORK_ERROR", message: "Network request failed.", status: 0 });
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    throw new ApiError({
      code: "PARSE_ERROR",
      message: "The server response was not valid JSON.",
      status: response.status,
    });
  }

  const failure = apiFailureSchema.safeParse(json);
  if (failure.success) {
    throw new ApiError({
      code: failure.data.error.code,
      message: failure.data.error.message,
      status: response.status,
      details: failure.data.error.details,
    });
  }
  if (!response.ok) {
    throw new ApiError({
      code: "INTERNAL_ERROR",
      message: `Request failed with status ${response.status}.`,
      status: response.status,
    });
  }

  if (!enveloped) {
    const direct = (schema ?? z.unknown()).safeParse(json);
    if (!direct.success) {
      throw new ApiError({
        code: "PARSE_ERROR",
        message: "The server response did not match the expected shape.",
        status: response.status,
        details: direct.error.issues,
      });
    }
    return direct.data as TOut;
  }

  const envelope = apiSuccessSchema(schema ?? z.unknown()).safeParse(json);
  if (!envelope.success) {
    throw new ApiError({
      code: "PARSE_ERROR",
      message: "The server response did not match the expected shape.",
      status: response.status,
      details: envelope.error.issues,
    });
  }
  return envelope.data.data as TOut;
}
