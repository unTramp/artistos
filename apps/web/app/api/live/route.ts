import { successResponse } from "../../../lib/http";

export function GET(request: Request) {
  const traceId = request.headers.get("x-trace-id")?.trim() || crypto.randomUUID();
  return successResponse({ status: "ok", service: "web" }, traceId);
}
