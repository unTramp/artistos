export type ClientTelemetryEventName =
  | "ATTENTION_EXPLANATION_OPENED"
  | "ATTENTION_ACTION_OPENED"
  | "PASSIVE_LEARNING_CANDIDATE_CAPTURED"
  | "PASSIVE_DECISION_CANDIDATE_CAPTURED"
  | "CONTEXTUAL_GUIDANCE_OPENED"
  | "CONTEXTUAL_GUIDANCE_APPLIED"
  | "COMMAND_PALETTE_OPENED"
  | "COMMAND_PALETTE_EXECUTED";

export function emitProductTelemetry(input: {
  eventName: ClientTelemetryEventName;
  surface: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}) {
  void fetch("/api/v1/product-telemetry", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
    keepalive: true
  }).catch(() => undefined);
}
