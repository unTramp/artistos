import type { Stage0Database } from "./runtime";
import { productTelemetryEvents } from "./product-telemetry-schema";

export type ProductTelemetryEventName =
  | "ATTENTION_EXPLANATION_OPENED"
  | "ATTENTION_ACTION_OPENED"
  | "DECISION_CREATED"
  | "MEMORY_REUSED"
  | "PASSIVE_LEARNING_CANDIDATE_CAPTURED"
  | "PASSIVE_DECISION_CANDIDATE_CAPTURED"
  | "CONTEXTUAL_GUIDANCE_OPENED"
  | "CONTEXTUAL_GUIDANCE_APPLIED"
  | "COMMAND_PALETTE_OPENED"
  | "COMMAND_PALETTE_EXECUTED";

export async function writeProductTelemetryEvent(db: Stage0Database, input: {
  artistId: string;
  eventName: ProductTelemetryEventName;
  surface: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  actorId?: string;
  occurredAt?: Date;
}) {
  const [created] = await db.insert(productTelemetryEvents).values({
    id: crypto.randomUUID(),
    artistId: input.artistId,
    eventName: input.eventName,
    surface: input.surface,
    ...(input.entityType ? { entityType: input.entityType } : {}),
    ...(input.entityId ? { entityId: input.entityId } : {}),
    metadata: input.metadata ?? {},
    ...(input.actorId ? { actorId: input.actorId } : {}),
    occurredAt: input.occurredAt ?? new Date()
  }).returning({ id: productTelemetryEvents.id });
  return created?.id ?? null;
}
