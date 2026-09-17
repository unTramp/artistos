import { describe, expect, it } from "vitest";
import {
  CreateDecisionService,
  ExpireDecisionService,
  MarkDecisionUnderReviewService,
  ReactivateDecisionService,
  ReverseDecisionService,
  type CommandContext,
  type CreateDecisionCommand,
  type DecisionResult,
  type DecisionWritePort
} from "./index";

const context = (overrides: Partial<CommandContext> = {}): CommandContext => ({
  commandId: crypto.randomUUID(),
  artistId: crypto.randomUUID(),
  actor: { type: "USER", id: "decision-user" },
  requestedAt: new Date("2026-09-17T08:00:00.000Z"),
  traceId: `trace-${crypto.randomUUID()}`,
  ...overrides
});

class MemoryWriter implements DecisionWritePort {
  status: DecisionResult["status"] = "ACTIVE";
  version = 0;
  createdReason: string | null = null;
  createdCommand: CreateDecisionCommand | null = null;
  transitions: Array<{ toStatus: DecisionResult["status"]; rationale?: string }> = [];

  async createDecision(request: Parameters<DecisionWritePort["createDecision"]>[0]): Promise<DecisionResult> {
    this.status = "ACTIVE";
    this.version = 1;
    this.createdReason = request.command.reason;
    this.createdCommand = request.command;
    return { decisionId: request.decisionId, status: this.status, version: this.version };
  }

  async transitionDecision(request: Parameters<DecisionWritePort["transitionDecision"]>[0]): Promise<DecisionResult> {
    this.status = request.toStatus;
    this.version += 1;
    this.transitions.push({ toStatus: request.toStatus, ...(request.rationale ? { rationale: request.rationale } : {}) });
    return { decisionId: request.decisionId, status: this.status, version: this.version };
  }
}

describe("Decision Memory", () => {
  it("requires human-controlled creation and a non-empty reason", async () => {
    const writer = new MemoryWriter();
    const service = new CreateDecisionService(writer, undefined, () => "0f3dd7ea-3ff2-44ca-a0f9-6e963b76b0ba");

    await expect(service.execute({
      title: "Prioritize story-first hooks",
      decision: "Lead the next release cycle with story-first hook tests.",
      reason: "",
      scope: "artist"
    }, context())).resolves.toMatchObject({ status: "VALIDATION_ERROR", code: "DECISION_INVALID" });

    await expect(service.execute({
      title: "Prioritize story-first hooks",
      decision: "Lead the next release cycle with story-first hook tests.",
      reason: "The current strategy intentionally favors narrative learning over output volume.",
      scope: "artist"
    }, context({ actor: { type: "AGENT", id: "agent" } }))).resolves.toMatchObject({ status: "FORBIDDEN", code: "DECISION_USER_REQUIRED" });
  });

  it("does not accept unverifiable evidence links", async () => {
    const service = new CreateDecisionService(new MemoryWriter());
    await expect(service.execute({
      title: "Keep acoustic format",
      decision: "Use acoustic performance as the primary test format.",
      reason: "Preserve authenticity while evidence infrastructure is still being built.",
      scope: "content",
      evidenceIds: [crypto.randomUUID()]
    }, context())).resolves.toMatchObject({ status: "BLOCKED", code: "DECISION_REFERENCE_VALIDATION_UNAVAILABLE" });
  });

  it("preserves forward-compatible subject and lineage references", async () => {
    const writer = new MemoryWriter();
    const service = new CreateDecisionService(writer, undefined, () => "0f3dd7ea-3ff2-44ca-a0f9-6e963b76b0ba");
    const subjectId = crypto.randomUUID();

    const result = await service.execute({
      title: "Use Trastevere as next release",
      decision: "Make Trastevere the next release focus.",
      reason: "It is the most release-ready song in the current context.",
      scope: "music.release",
      decisionKey: "song.next-release",
      references: [{ refType: "SONG", refId: subjectId, relation: "SUBJECT" }]
    }, context());

    expect(result.status).toBe("SUCCESS");
    expect(writer.createdCommand).toMatchObject({
      decisionKey: "song.next-release",
      references: [{ refType: "SONG", refId: subjectId, relation: "SUBJECT" }]
    });
  });

  it("requires explicit override rationale when replacing a prior Decision", async () => {
    const writer = new MemoryWriter();
    const service = new CreateDecisionService(writer);
    const priorDecisionId = crypto.randomUUID();

    await expect(service.execute({
      title: "Change next release",
      decision: "Use Always on My Mind instead.",
      reason: "Context changed.",
      scope: "music.release",
      decisionKey: "song.next-release",
      overrideDecisionId: priorDecisionId
    }, context())).resolves.toMatchObject({
      status: "VALIDATION_ERROR",
      code: "DECISION_INVALID",
      fieldErrors: { overrideRationale: expect.any(String) }
    });

    await expect(service.execute({
      title: "Change next release",
      decision: "Use Always on My Mind instead.",
      reason: "Context changed.",
      scope: "music.release",
      decisionKey: "song.next-release",
      overrideDecisionId: priorDecisionId,
      overrideRationale: "The release schedule changed and the new song is ready first."
    }, context())).resolves.toMatchObject({ status: "SUCCESS" });
  });

  it("supports ACTIVE ↔ UNDER_REVIEW and requires rationale for reversal/expiry", async () => {
    const writer = new MemoryWriter();
    const decisionId = crypto.randomUUID();

    await expect(new MarkDecisionUnderReviewService(writer).execute({ decisionId }, context())).resolves.toMatchObject({ status: "SUCCESS", data: { status: "UNDER_REVIEW" } });
    await expect(new ReactivateDecisionService(writer).execute({ decisionId, rationale: "Still valid after review." }, context())).resolves.toMatchObject({ status: "SUCCESS", data: { status: "ACTIVE" } });
    await expect(new ReverseDecisionService(writer).execute({ decisionId }, context())).resolves.toMatchObject({ status: "VALIDATION_ERROR", code: "DECISION_RATIONALE_REQUIRED" });
    await expect(new ExpireDecisionService(writer).execute({ decisionId }, context())).resolves.toMatchObject({ status: "VALIDATION_ERROR", code: "DECISION_RATIONALE_REQUIRED" });
    await expect(new ReverseDecisionService(writer).execute({ decisionId, rationale: "New evidence changed the strategy." }, context())).resolves.toMatchObject({ status: "SUCCESS", data: { status: "REVERSED" } });
    expect(writer.transitions.at(-1)).toEqual({ toStatus: "REVERSED", rationale: "New evidence changed the strategy." });
  });
});
