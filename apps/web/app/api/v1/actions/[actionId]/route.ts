import { PgOperationalActionReader } from "@artist-os/db";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { apiErrorResponse, getTraceId, successResponse } from "@/lib/http";
import { getDatabaseRuntime } from "@/lib/runtime";

export async function GET(request: Request, context: { params: Promise<{ actionId: string }> }) {
  const traceId = getTraceId(request.headers);
  const actorContext = await resolveAuthenticatedActorContext(request.headers);
  if (!actorContext) return apiErrorResponse({ code: "AUTH_REQUIRED", message: "Authentication is required." }, traceId, 401);
  if (!actorContext.artistId) return apiErrorResponse({ code: "WORKSPACE_REQUIRED", message: "Artist workspace is required." }, traceId, 409);
  const { actionId } = await context.params;
  const action = await new PgOperationalActionReader(getDatabaseRuntime().db).getAction(actorContext.artistId, actionId);
  if (!action) return apiErrorResponse({ code: "OPERATIONAL_ACTION_NOT_FOUND", message: "Operational Action was not found." }, traceId, 404);
  return successResponse(action, traceId);
}
