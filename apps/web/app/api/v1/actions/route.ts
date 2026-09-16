import { CreateOperationalActionService, type CreateOperationalActionCommand, type OperationalActionStatus } from "@artist-os/core";
import { PgOperationalActionReader, PgOperationalActionWriter } from "@artist-os/db";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { commandResultResponse, readJson } from "@/lib/artist-foundation-command";
import { apiErrorResponse, getTraceId, successResponse } from "@/lib/http";
import { resolveOperationalActionMutationContext } from "@/lib/operational-action-command";
import { getDatabaseRuntime } from "@/lib/runtime";

const allowedStatuses: OperationalActionStatus[] = ["OPEN", "IN_PROGRESS", "BLOCKED", "DONE", "SKIPPED", "EXPIRED"];

export async function GET(request: Request) {
  const traceId = getTraceId(request.headers);
  const actorContext = await resolveAuthenticatedActorContext(request.headers);
  if (!actorContext) return apiErrorResponse({ code: "AUTH_REQUIRED", message: "Authentication is required." }, traceId, 401);
  if (!actorContext.artistId) return apiErrorResponse({ code: "WORKSPACE_REQUIRED", message: "Artist workspace is required." }, traceId, 409);

  const url = new URL(request.url);
  const rawStatuses = url.searchParams.get("status")?.split(",").map((value) => value.trim()).filter(Boolean) ?? [];
  const invalid = rawStatuses.find((status) => !allowedStatuses.includes(status as OperationalActionStatus));
  if (invalid) return apiErrorResponse({ code: "OPERATIONAL_ACTION_STATUS_FILTER_INVALID", message: `Unsupported status filter: ${invalid}` }, traceId, 400);
  const limitRaw = url.searchParams.get("limit");
  const limit = limitRaw ? Number(limitRaw) : undefined;
  if (limit !== undefined && (!Number.isInteger(limit) || limit < 1 || limit > 100)) {
    return apiErrorResponse({ code: "OPERATIONAL_ACTION_LIMIT_INVALID", message: "limit must be an integer between 1 and 100." }, traceId, 400);
  }

  const reader = new PgOperationalActionReader(getDatabaseRuntime().db);
  const actions = await reader.listActions(actorContext.artistId, {
    ...(rawStatuses.length ? { statuses: rawStatuses as OperationalActionStatus[] } : {}),
    ...(limit !== undefined ? { limit } : {})
  });
  return successResponse({ actions }, traceId);
}

export async function POST(request: Request) {
  const resolution = await resolveOperationalActionMutationContext(request);
  if (resolution instanceof Response) return resolution;
  const body = await readJson<CreateOperationalActionCommand>(request, resolution.traceId);
  if (body instanceof Response) return body;
  const result = await new CreateOperationalActionService(new PgOperationalActionWriter(getDatabaseRuntime().db))
    .execute(body, resolution.commandContext);
  return commandResultResponse(result, resolution.traceId, 201);
}
