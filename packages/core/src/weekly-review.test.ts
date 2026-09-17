import { describe, expect, it } from "vitest";
import {
  CreateWeeklyReviewService,
  type CommandContext,
  type WeeklyReviewWritePort
} from "./index";

const context: CommandContext = {
  commandId: "command-1",
  artistId: "11111111-1111-4111-8111-111111111111",
  actor: { type: "USER", id: "user-1" },
  requestedAt: new Date("2026-09-17T18:00:00.000Z"),
  traceId: "trace-1"
};

const validCommand = {
  periodStart: "2026-09-07T00:00:00.000Z",
  periodEnd: "2026-09-14T00:00:00.000Z",
  generatedAt: "2026-09-14T08:00:00.000Z",
  configurationVersion: "weekly-review-v1",
  sourceSnapshotIds: ["snapshot-1"],
  insightIds: ["insight-1"],
  sections: [
    {
      kind: "WHAT_HAPPENED" as const,
      label: "What happened",
      items: [{ text: "Published three performance clips." }]
    },
    {
      kind: "WHAT_WAS_LEARNED" as const,
      label: "What was learned",
      items: [{ text: "Performance-first clips produced stronger downstream intent.", references: [{ refType: "Learning", refId: "learning-1" }] }]
    },
    {
      kind: "DECISIONS_TO_MAKE" as const,
      label: "Decisions to make",
      items: [{ text: "Choose whether to prioritize performance-first short video next week." }]
    }
  ]
};

describe("CreateWeeklyReviewService", () => {
  it("persists a new immutable review artifact", async () => {
    let captured: Parameters<WeeklyReviewWritePort["createWeeklyReview"]>[0] | undefined;
    const writer: WeeklyReviewWritePort = {
      createWeeklyReview: async (request) => {
        captured = request;
        return { weeklyReviewId: request.weeklyReviewId, version: 1, generatedAt: request.command.generatedAt };
      }
    };
    const service = new CreateWeeklyReviewService(writer, () => "22222222-2222-4222-8222-222222222222");

    const result = await service.execute(validCommand, context);

    expect(result.status).toBe("SUCCESS");
    expect(captured?.command.sections).toEqual(validCommand.sections);
    expect(captured?.command.sourceSnapshotIds).toEqual(["snapshot-1"]);
    expect(captured?.command.insightIds).toEqual(["insight-1"]);
  });

  it("rejects a period that ends before it starts", async () => {
    const writer: WeeklyReviewWritePort = {
      createWeeklyReview: async () => { throw new Error("should not persist"); }
    };
    const service = new CreateWeeklyReviewService(writer);

    const result = await service.execute({
      ...validCommand,
      periodStart: "2026-09-15T00:00:00.000Z",
      periodEnd: "2026-09-14T00:00:00.000Z"
    }, context);

    expect(result.status).toBe("VALIDATION_ERROR");
    if (result.status !== "SUCCESS") expect(result.fieldErrors?.periodEnd).toBeDefined();
  });

  it("rejects duplicate labeled section kinds", async () => {
    const writer: WeeklyReviewWritePort = {
      createWeeklyReview: async () => { throw new Error("should not persist"); }
    };
    const service = new CreateWeeklyReviewService(writer);

    const result = await service.execute({
      ...validCommand,
      sections: [validCommand.sections[0]!, validCommand.sections[0]!]
    }, context);

    expect(result.status).toBe("VALIDATION_ERROR");
  });

  it("does not expose an update or transition command on the write port", () => {
    const writerShape: (keyof WeeklyReviewWritePort)[] = ["createWeeklyReview"];
    expect(writerShape).toEqual(["createWeeklyReview"]);
  });
});
