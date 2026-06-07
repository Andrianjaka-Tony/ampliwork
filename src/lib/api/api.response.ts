import { NextResponse } from "next/server";

import type { ApiErrorBody, ApiErrorCode, ApiSuccess } from "./api.schema";

const STATUS_BY_CODE: Record<ApiErrorCode, number> = {
  BAD_REQUEST: 400,
  VALIDATION_ERROR: 400,
  INVALID_CREDENTIALS: 401,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

export function ok<T>(data: T, status = 200): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ ok: true, data }, { status });
}

export function fail(
  code: ApiErrorCode,
  message: string,
  details?: unknown,
): NextResponse<{ ok: false; error: ApiErrorBody }> {
  const error: ApiErrorBody = {
    code,
    message,
    ...(details !== undefined ? { details } : {}),
  };
  return NextResponse.json({ ok: false, error }, { status: STATUS_BY_CODE[code] });
}
