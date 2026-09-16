import { CreatePlanningObjectiveService, type CreatePlanningObjectiveCommand } from "@artist-os/core";
import { PgPlanningObjectiveReader, PgPlanningObjectiveWriter } from "@artist-os/db";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { commandResultResponse, readJson } from "@/lib/artist-foundation-command";
import { apiErrorResponse, getTraceId, successResponse } from "@/lib/http";
import { resolvePlanningObjectiveMutationContext } from "@/lib/planning-objective-command";
import { getDatabaseRuntime } from "@/lib/runtime";

export async function GET(request: Request) {
  const traceId = getTraceId(request.headers);
  const actorContext = await resolveAuthenticatedActorContext(request.headers);
  if (!actorContext) return apiErrorResponse({ code: "AUTH_REQUIRED", message: "Authentication is required." }, traceId, 401);
  if (!actorContext.artistId) return apiErrorResponse({ code: "WORKSPACE_REQUIRED", message: "Artist workspace is required." }, traceId, 409);

  const url = new URL(request.url);
  const includeCompleted = url.searchParams.get("includeCompleted") === "true";
  const reader = new PgPlanningObjectiveReader(getDatabaseRuntime().db);
  const objectives = await reader.listObjectives(actorContext.artistId, { includeCompleted });
  return successResponse({ objectives }, traceId);
}

export async function POST(request: Request) {
  const resolution = await resolvePlanningObjectiveMutationContext(request);
  if (resolution instanceof Response) return resolution;
  const body = await readJson<CreatePlanningObjectiveCommand>(request, resolution.traceId);
  if (body instanceof Response) return body;
  const result = await new CreatePlanningObjectiveService(new PgPlanningObjectiveWriter(getDatabaseRuntime().db))
    .execute(body, resolution.commandContext);
  return commandResultResponse(result, resolution.traceId, 201);
}
