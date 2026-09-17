import { CreateLearningService, type CreateLearningCommand, type LearningScope, type LearningStatus } from "@artist-os/core";
import { PgLearningWriter, listLearnings, writeProductTelemetryEvent } from "@artist-os/db";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { commandResultResponse, readJson } from "@/lib/artist-foundation-command";
import { resolveLearningMutationContext } from "@/lib/learning-command";
import { apiErrorResponse, getTraceId, successResponse } from "@/lib/http";
import { getDatabaseRuntime } from "@/lib/runtime";

const statuses: LearningStatus[] = ["CANDIDATE", "TESTING", "VALIDATED", "STALE", "DEPRECATED"];
const scopes: LearningScope[] = ["ARTIST_GLOBAL", "PLATFORM", "SONG", "PILLAR", "FORMAT", "AUDIENCE", "CAMPAIGN", "AUDIO_SEGMENT", "NARRATIVE", "MARKET", "BUSINESS", "IDENTITY"];

export async function GET(request: Request) {
  const traceId = getTraceId(request.headers);
  const actorContext = await resolveAuthenticatedActorContext(request.headers);
  if (!actorContext) return apiErrorResponse({ code: "AUTH_REQUIRED", message: "Authentication is required." }, traceId, 401);
  if (!actorContext.artistId) return apiErrorResponse({ code: "WORKSPACE_REQUIRED", message: "Artist workspace is required." }, traceId, 409);

  const url = new URL(request.url);
  const rawStatuses = url.searchParams.get("status")?.split(",").map((value) => value.trim()).filter(Boolean) ?? [];
  const invalidStatus = rawStatuses.find((status) => !statuses.includes(status as LearningStatus));
  if (invalidStatus) return apiErrorResponse({ code: "LEARNING_STATUS_FILTER_INVALID", message: `Unsupported Learning status: ${invalidStatus}` }, traceId, 400);
  const rawScope = url.searchParams.get("scope")?.trim();
  if (rawScope && !scopes.includes(rawScope as LearningScope)) return apiErrorResponse({ code: "LEARNING_SCOPE_FILTER_INVALID", message: `Unsupported Learning scope: ${rawScope}` }, traceId, 400);

  const learnings = await listLearnings(getDatabaseRuntime().db, actorContext.artistId, {
    ...(rawStatuses.length ? { statuses: rawStatuses as LearningStatus[] } : {}),
    ...(rawScope ? { scope: rawScope as LearningScope } : {})
  });
  return successResponse({ learnings }, traceId);
}

export async function POST(request: Request) {
  const resolution = await resolveLearningMutationContext(request);
  if (resolution instanceof Response) return resolution;
  const body = await readJson<CreateLearningCommand>(request, resolution.traceId);
  if (body instanceof Response) return body;
  const runtime = getDatabaseRuntime();
  const result = await new CreateLearningService(new PgLearningWriter(runtime.db)).execute(body, resolution.commandContext);

  if (result.status === "SUCCESS" && (body.references ?? []).some((reference) => reference.refType.toLowerCase() === "contentangle")) {
    const actorTelemetry = resolution.commandContext.actor.id ? { actorId: resolution.commandContext.actor.id } : {};
    await writeProductTelemetryEvent(runtime.db, {
      artistId: resolution.commandContext.artistId,
      eventName: "PASSIVE_LEARNING_CANDIDATE_CAPTURED",
      surface: "ContentFactory",
      entityType: "Learning",
      entityId: result.data.learningId,
      metadata: { scope: body.scope, confidence: body.confidence },
      ...actorTelemetry
    });
  }

  return commandResultResponse(result, resolution.traceId, 201);
}
