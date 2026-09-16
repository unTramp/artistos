import { NextResponse } from "next/server";

export interface ApiErrorBody {
  code: string;
  message: string;
  retryable?: boolean;
  fieldErrors?: Record<string, string>;
}

export function getTraceId(headers: Headers) {
  return headers.get("x-trace-id")?.trim() || crypto.randomUUID();
}

export function successResponse<T>(data: T, traceId: string, status = 200) {
  return NextResponse.json(
    { data, meta: { traceId } },
    { status, headers: { "x-trace-id": traceId } }
  );
}

export function apiErrorResponse(error: ApiErrorBody, traceId: string, status: number) {
  return NextResponse.json(
    { error, meta: { traceId } },
    { status, headers: { "x-trace-id": traceId } }
  );
}
