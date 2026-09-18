import { and, eq, gte } from "drizzle-orm";
import type { Stage0Database } from "./runtime";
import { productTelemetryEvents } from "./product-telemetry-schema";

type OutcomeCounts = {
  started: number;
  completed: number;
  blocked: number;
  reopened: number;
};

export type ProductTelemetrySummary = {
  windowStart: string;
  totalEvents: number;
  attention: {
    explanationsOpened: number;
    actionsOpened: number;
    outcomesRecorded: number;
    outcomes: OutcomeCounts;
  };
  memory: {
    decisionsCreated: number;
    decisionsWithMemoryReuse: number;
    decisionReuseRate: number | null;
    contentContextsConsumed: number;
    contentContextsWithLearningMemory: number;
    contentReuseRate: number | null;
  };
  guidance: {
    opened: number;
    applied: number;
    applyRate: number | null;
  };
  passiveCapture: {
    learningCandidates: number;
    decisionCandidates: number;
  };
  commandPalette: {
    opened: number;
    executed: number;
  };
};

const ratio = (numerator: number, denominator: number) =>
  denominator > 0 ? Number((numerator / denominator).toFixed(4)) : null;

export async function readProductTelemetrySummary(
  db: Stage0Database,
  artistId: string,
  since: Date
): Promise<ProductTelemetrySummary> {
  const events = await db.select({
    eventName: productTelemetryEvents.eventName,
    surface: productTelemetryEvents.surface,
    metadata: productTelemetryEvents.metadata
  }).from(productTelemetryEvents).where(and(
    eq(productTelemetryEvents.artistId, artistId),
    gte(productTelemetryEvents.occurredAt, since)
  ));

  const count = (eventName: string, surface?: string) => events.filter((event) =>
    event.eventName === eventName && (!surface || event.surface === surface)
  ).length;

  const outcomes: OutcomeCounts = { started: 0, completed: 0, blocked: 0, reopened: 0 };
  for (const event of events) {
    if (event.eventName !== "ATTENTION_ACTION_OUTCOME_RECORDED") continue;
    const outcome = typeof event.metadata?.outcome === "string" ? event.metadata.outcome : "";
    if (outcome === "STARTED") outcomes.started += 1;
    if (outcome === "COMPLETED") outcomes.completed += 1;
    if (outcome === "BLOCKED") outcomes.blocked += 1;
    if (outcome === "REOPENED") outcomes.reopened += 1;
  }

  const decisionsCreated = count("DECISION_CREATED", "DecisionMemory");
  const decisionsWithMemoryReuse = count("MEMORY_REUSED", "DecisionMemory");
  const contentContextsConsumed = count("CONTENT_CONTEXT_CONSUMED", "ContentFactory");
  const contentContextsWithLearningMemory = count("MEMORY_REUSED", "ContentFactory");
  const guidanceOpened = count("CONTEXTUAL_GUIDANCE_OPENED");
  const guidanceApplied = count("CONTEXTUAL_GUIDANCE_APPLIED");

  return {
    windowStart: since.toISOString(),
    totalEvents: events.length,
    attention: {
      explanationsOpened: count("ATTENTION_EXPLANATION_OPENED"),
      actionsOpened: count("ATTENTION_ACTION_OPENED"),
      outcomesRecorded: outcomes.started + outcomes.completed + outcomes.blocked + outcomes.reopened,
      outcomes
    },
    memory: {
      decisionsCreated,
      decisionsWithMemoryReuse,
      decisionReuseRate: ratio(decisionsWithMemoryReuse, decisionsCreated),
      contentContextsConsumed,
      contentContextsWithLearningMemory,
      contentReuseRate: ratio(contentContextsWithLearningMemory, contentContextsConsumed)
    },
    guidance: {
      opened: guidanceOpened,
      applied: guidanceApplied,
      applyRate: ratio(guidanceApplied, guidanceOpened)
    },
    passiveCapture: {
      learningCandidates: count("PASSIVE_LEARNING_CANDIDATE_CAPTURED"),
      decisionCandidates: count("PASSIVE_DECISION_CANDIDATE_CAPTURED")
    },
    commandPalette: {
      opened: count("COMMAND_PALETTE_OPENED"),
      executed: count("COMMAND_PALETTE_EXECUTED")
    }
  };
}
