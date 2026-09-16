export type ActorType = "USER" | "SYSTEM" | "AGENT" | "WORKER" | "INTEGRATION";
export type CommandStatus = "SUCCESS" | "VALIDATION_ERROR" | "CONFLICT" | "FORBIDDEN" | "NOT_FOUND" | "BLOCKED" | "RETRYABLE_FAILURE" | "EXTERNAL_FAILURE";

export interface CommandContext {
  commandId: string;
  artistId: string;
  actor: { type: ActorType; id?: string };
  requestedAt: Date;
  idempotencyKey?: string;
  expectedVersion?: number;
  traceId: string;
}

export interface DomainEvent<T = unknown> {
  eventId: string;
  eventType: string;
  occurredAt: Date;
  recordedAt: Date;
  artistId: string;
  aggregateType: string;
  aggregateId: string;
  aggregateVersion: number;
  actorType: ActorType;
  actorId?: string;
  correlationId: string;
  causationId?: string;
  payloadVersion: number;
  payload: T;
}

export type CommandResult<T> =
  | { status: "SUCCESS"; data: T }
  | {
      status: Exclude<CommandStatus, "SUCCESS">;
      code: string;
      message: string;
      retryable?: boolean;
      fieldErrors?: Record<string, string>;
    };

export * from "./artist";
export * from "./artist-foundation";
export * from "./song-brain";
export * from "./knowledge";
export * from "./content-factory";
export * from "./content-execution";
export * from "./context-assembler";
export * from "./agent-run";
