import { describe, expect, it } from "vitest";
import type { CommandContext } from "./index";
import {
  CreateLearningService,
  DeprecateLearningService,
  LearningPersistenceError,
  MarkLearningStaleService,
  StartLearningTestService,
  ValidateLearningService,
  type LearningWritePort
} from "./learning";

const userContext = (): CommandContext => ({
  commandId: crypto.randomUUID(),
  artistId: crypto.randomUUID(),
  actor: { type: "USER", id: "user-1" },
  requestedAt: new Date("2026-09-17T08:00:00Z"),
  traceId: "trace-learning"
});

const agentContext = (): CommandContext => ({ ...userContext(), actor: { type: "AGENT", id: "agent-1" } });

const writer = (): LearningWritePort => ({
  createLearning: async ({ learningId }) => ({ learningId, status: "CANDIDATE", version: 1 }),
  transitionLearning: async ({ learningId, toStatus }) => ({ learningId, status: toStatus, version: 2 })
});

describe("Learning domain", () => {
  it("creates scoped confidence-rated candidate learning", async () => {
    const service = new CreateLearningService(writer(), () => "11111111-1111-4111-8111-111111111111");
    const result = await service.execute({
      statement: "Performance-first reels retain more qualified listeners for this artist.",
      scope: "FORMAT",
      confidence: "MEDIUM",
      confidenceRationale: "Repeated directional support, but still needs another controlled test.",
      references: [{ refType: "Publication", refId: "publication-1", relation: "SUPPORTS" }]
    }, userContext());
    expect(result).toEqual({ status: "SUCCESS", data: { learningId: "11111111-1111-4111-8111-111111111111", status: "CANDIDATE", version: 1 } });
  });

  it("requires confidence rationale", async () => {
    const service = new CreateLearningService(writer());
    const result = await service.execute({ statement: "A useful claim", scope: "ARTIST_GLOBAL", confidence: "LOW", confidenceRationale: "" }, userContext());
    expect(result.status).toBe("VALIDATION_ERROR");
  });

  it("allows candidate to enter testing without human-only promotion", async () => {
    const service = new StartLearningTestService(writer());
    const result = await service.execute({ learningId: "11111111-1111-4111-8111-111111111111" }, agentContext());
    expect(result.status).toBe("SUCCESS");
  });

  it("requires explicit user approval and rationale for VALIDATED", async () => {
    const service = new ValidateLearningService(writer());
    expect((await service.execute({ learningId: "11111111-1111-4111-8111-111111111111", rationale: "Evidence reviewed." }, agentContext())).status).toBe("FORBIDDEN");
    expect((await service.execute({ learningId: "11111111-1111-4111-8111-111111111111" }, userContext())).status).toBe("VALIDATION_ERROR");
    expect((await service.execute({ learningId: "11111111-1111-4111-8111-111111111111", rationale: "Repeated evidence supports this scoped rule." }, userContext())).status).toBe("SUCCESS");
  });

  it("requires reasons when stale/deprecated and preserves persistence conflicts", async () => {
    expect((await new MarkLearningStaleService(writer()).execute({ learningId: "11111111-1111-4111-8111-111111111111" }, userContext())).status).toBe("VALIDATION_ERROR");
    expect((await new DeprecateLearningService(writer()).execute({ learningId: "11111111-1111-4111-8111-111111111111" }, userContext())).status).toBe("VALIDATION_ERROR");

    const failing: LearningWritePort = {
      ...writer(),
      transitionLearning: async () => { throw new LearningPersistenceError("LEARNING_VERSION_CONFLICT"); }
    };
    const conflict = await new MarkLearningStaleService(failing).execute({ learningId: "11111111-1111-4111-8111-111111111111", rationale: "Freshness expired." }, userContext());
    expect(conflict.status).toBe("CONFLICT");
  });
});
