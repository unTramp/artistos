import { getLearning, listLearningHistory } from "@artist-os/db";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { apiErrorResponse, getTraceId, successResponse } from "@/lib/http";
import { getDatabaseRuntime } from "@/lib/runtime";

export async function GET(request: Request, context: { params: Promise<{ learningId: string }> }) {
  const traceId = getTraceId(request.headers);
  const actorContext = await resolveAuthenticatedActorContext(request.headers);
  if (!actorContext) return apiErrorResponse({ code: "AUTH_REQUIRED", message: "Authentication is required." }, traceId, 401);
  if (!actorContext.artistId) return apiErrorResponse({ code: "WORKSPACE_REQUIRED", message: "Artist workspace is required." }, traceId, 409);
  const { learningId } = await context.params;
  const db = getDatabaseRuntime().db;
  const learning = await getLearning(db, actorContext.artistId, learningId);
  if (!learning) return apiErrorResponse({ code: "LEARNING_NOT_FOUND", message: "Learning was not found." }, traceId, 404);
  const history = await listLearningHistory(db, actorContext.artistId, learningId);
  return successResponse({ learning, history }, traceId);
}
