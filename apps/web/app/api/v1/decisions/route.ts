import { CreateDecisionService, type CreateDecisionCommand, type DecisionStatus } from "@artist-os/core";
import { PgDecisionReader, PgDecisionWriter } from "@artist-os/db";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { commandResultResponse, readJson } from "@/lib/artist-foundation-command";
import { resolveDecisionMutationContext } from "@/lib/decision-command";
import { apiErrorResponse, getTraceId, successResponse } from "@/lib/http";
import { getDatabaseRuntime } from "@/lib/runtime";

const statuses: DecisionStatus[] = ["ACTIVE", "UNDER_REVIEW", "REVERSED", "EXPIRED"];

export async function GET(request: Request) {
  const traceId = getTraceId(request.headers);
  const actorContext = await resolveAuthenticatedActorContext(request.headers);
  if (!actorContext) return apiErrorResponse({ code: "AUTH_REQUIRED", message: "Authentication is required." }, traceId, 401);
  if (!actorContext.artistId) return apiErrorResponse({ code: "WORKSPACE_REQUIRED", message: "Artist workspace is required." }, traceId, 409);

  const url = new URL(request.url);
  const rawStatuses = url.searchParams.get("status")?.split(",").map((value) => value.trim()).filter(Boolean) ?? [];
  const invalid = rawStatuses.find((status) => !statuses.includes(status as DecisionStatus));
  if (invalid) return apiErrorResponse({ code: "DECISION_STATUS_FILTER_INVALID", message: `Unsupported Decision status: ${invalid}` }, traceId, 400);
  const scope = url.searchParams.get("scope")?.trim() || undefined;
  const reviewDueBeforeRaw = url.searchParams.get("reviewDueBefore")?.trim();
  const reviewDueBefore = reviewDueBeforeRaw ? new Date(reviewDueBeforeRaw) : undefined;
  if (reviewDueBeforeRaw && Number.isNaN(reviewDueBefore?.getTime())) {
    return apiErrorResponse({ code: "DECISION_REVIEW_FILTER_INVALID", message: "reviewDueBefore must be an ISO date/time." }, traceId, 400);
  }

  const reader = new PgDecisionReader(getDatabaseRuntime().db);
  const decisions = await reader.listDecisions(actorContext.artistId, {
    ...(rawStatuses.length ? { statuses: rawStatuses as DecisionStatus[] } : {}),
    ...(scope ? { scope } : {}),
    ...(reviewDueBefore ? { reviewDueBefore } : {})
  });
  return successResponse({ decisions }, traceId);
}

export async function POST(request: Request) {
  const resolution = await resolveDecisionMutationContext(request);
  if (resolution instanceof Response) return resolution;
  const body = await readJson<CreateDecisionCommand>(request, resolution.traceId);
  if (body instanceof Response) return body;

  const result = await new CreateDecisionService(new PgDecisionWriter(getDatabaseRuntime().db))
    .execute(body, resolution.commandContext);
  return commandResultResponse(result, resolution.traceId, 201);
}
