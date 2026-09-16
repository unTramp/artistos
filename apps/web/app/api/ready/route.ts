import { NextResponse } from "next/server";
import { getDatabaseRuntime } from "../../../lib/runtime";

export async function GET(request: Request) {
  const traceId = request.headers.get("x-trace-id") ?? crypto.randomUUID();
  try {
    await getDatabaseRuntime().ping();
    return NextResponse.json({ data: { status: "ready", dependencies: { database: "ok" } }, meta: { traceId } });
  } catch {
    return NextResponse.json(
      { error: { code: "RUNTIME_NOT_READY", message: "Required runtime dependency is unavailable.", retryable: true }, meta: { traceId } },
      { status: 503 }
    );
  }
}
