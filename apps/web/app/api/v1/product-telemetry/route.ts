import { writeProductTelemetryEvent, type ProductTelemetryEventName } from "@artist-os/db";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { apiErrorResponse, getTraceId, successResponse } from "@/lib/http";
import { getDatabaseRuntime } from "@/lib/runtime";

const allowedEvents: ProductTelemetryEventName[] = [
  "ATTENTION_EXPLANATION_OPENED",
  "ATTENTION_ACTION_OPENED",
  "DECISION_CREATED",
  "MEMORY_REUSED",
  "PASSIVE_LEARNING_CANDIDATE_CAPTURED",
  "PASSIVE_DECISION_CANDIDATE_CAPTURED",
  "CONTEXTUAL_GUIDANCE_OPENED",
  "CONTEXTUAL_GUIDANCE_APPLIED"
];

const compact = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  const traceId = getTraceId(request.headers);
  const actorContext = await resolveAuthenticatedActorContext(request.headers);
  if (!actorContext) return apiErrorResponse({ code: "AUTH_REQUIRED", message: "Authentication is required." }, traceId, 401);
  if (!actorContext.artistId) return apiErrorResponse({ code: "WORKSPACE_REQUIRED", message: "Artist workspace is required." }, traceId, 409);

  const body = await request.json().catch(() => null) as null | {
    eventName?: string;
    surface?: string;
    entityType?: string;
    entityId?: string;
    metadata?: Record<string, unknown>;
  };
  if (!body) return apiErrorResponse({ code: "INVALID_JSON", message: "Request body must be valid JSON." }, traceId, 400);
  if (!allowedEvents.includes(body.eventName as ProductTelemetryEventName)) return apiErrorResponse({ code: "TELEMETRY_EVENT_INVALID", message: "Unsupported telemetry event." }, traceId, 400);
  const surface = compact(body.surface, 120);
  if (!surface) return apiErrorResponse({ code: "TELEMETRY_SURFACE_REQUIRED", message: "Telemetry surface is required." }, traceId, 400);

  const metadata = body.metadata && typeof body.metadata === "object" && !Array.isArray(body.metadata)
    ? Object.fromEntries(Object.entries(body.metadata).slice(0, 20).map(([key, value]) => [key.slice(0, 80), typeof value === "string" ? value.slice(0, 200) : value]))
    : {};

  const id = await writeProductTelemetryEvent(getDatabaseRuntime().db, {
    artistId: actorContext.artistId,
    eventName: body.eventName as ProductTelemetryEventName,
    surface,
    ...(compact(body.entityType, 120) ? { entityType: compact(body.entityType, 120) } : {}),
    ...(compact(body.entityId, 240) ? { entityId: compact(body.entityId, 240) } : {}),
    metadata,
    actorId: actorContext.user.id
  });
  return successResponse({ id }, traceId, 201);
}
