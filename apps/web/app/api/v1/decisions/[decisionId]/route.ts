import { PgDecisionReader } from "@artist-os/db";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { apiErrorResponse, getTraceId, successResponse } from "@/lib/http";
import { getDatabaseRuntime } from "@/lib/runtime";

export async function GET(request: Request, context: { params: Promise<{ decisionId: string }> }) {
  const traceId = getTraceId(request.headers);
  const actorContext = await resolveAuthenticatedActorContext(request.headers);
  if (!actorContext) return apiErrorResponse({ code: "AUTH_REQUIRED", message: "Authentication is required." }, traceId, 401);
  if (!actorContext.artistId) return apiErrorResponse({ code: "WORKSPACE_REQUIRED", message: "Artist workspace is required." }, traceId, 409);

  const { decisionId } = await context.params;
  const reader = new PgDecisionReader(getDatabaseRuntime().db);
  const decision = await reader.getDecision(actorContext.artistId, decisionId);
  if (!decision) return apiErrorResponse({ code: "DECISION_NOT_FOUND", message: "Decision was not found." }, traceId, 404);
  const history = await reader.listHistory(actorContext.artistId, decisionId);
  return successResponse({ decision, history }, traceId);
}
