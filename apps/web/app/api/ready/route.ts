import { apiErrorResponse, getTraceId, successResponse } from "../../../lib/http";
import { getDatabaseRuntime } from "../../../lib/runtime";

export async function GET(request: Request) {
  const traceId = getTraceId(request.headers);
  try {
    await getDatabaseRuntime().ping();
    return successResponse({ status: "ready", dependencies: { database: "ok" } }, traceId);
  } catch {
    return apiErrorResponse(
      { code: "RUNTIME_NOT_READY", message: "Required runtime dependency is unavailable.", retryable: true },
      traceId,
      503
    );
  }
}
