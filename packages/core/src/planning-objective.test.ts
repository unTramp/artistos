import { describe, expect, it } from "vitest";
import {
  CompletePlanningObjectiveService,
  CreatePlanningObjectiveService,
  type PlanningObjectiveWritePort
} from "./planning-objective";
import type { CommandContext } from "./index";

const context = (): CommandContext => ({
  commandId: crypto.randomUUID(),
  artistId: crypto.randomUUID(),
  actor: { type: "USER", id: "user-1" },
  requestedAt: new Date("2026-09-17T08:00:00.000Z"),
  traceId: "trace-1"
});

const writer: PlanningObjectiveWritePort = {
  async createObjective(request) {
    return { objectiveId: request.objectiveId, status: request.command.status, version: 1, completedAt: null };
  },
  async transitionObjective(request) {
    return {
      objectiveId: request.objectiveId,
      status: request.toStatus,
      version: 2,
      completedAt: request.toStatus === "COMPLETED" ? request.evidence.occurredAt : null
    };
  }
};

describe("PlanningObjective services", () => {
  it("creates an ACTIVE primary objective by default and preserves success criteria", async () => {
    let captured: Parameters<PlanningObjectiveWritePort["createObjective"]>[0] | undefined;
    const capturingWriter: PlanningObjectiveWritePort = {
      ...writer,
      async createObjective(request) {
        captured = request;
        return writer.createObjective(request);
      }
    };
    const result = await new CreatePlanningObjectiveService(capturingWriter, () => "11111111-1111-4111-8111-111111111111").execute({
      title: "Prepare Trastevere release",
      statement: "Finish launch-critical work and establish the first audience discovery loop.",
      periodStart: "2026-09-17",
      periodEnd: "2026-10-01",
      scope: "ARTIST",
      priority: "PRIMARY",
      successCriteria: ["Execution package approved"]
    }, context());
    expect(result).toMatchObject({ status: "SUCCESS", data: { objectiveId: "11111111-1111-4111-8111-111111111111", status: "ACTIVE", version: 1 } });
    expect(captured?.command).toMatchObject({ status: "ACTIVE", successCriteria: ["Execution package approved"] });
  });

  it("rejects invalid dates and missing scope references", async () => {
    const result = await new CreatePlanningObjectiveService(writer).execute({
      title: "Bad objective",
      statement: "Invalid scope test",
      periodStart: "2026-10-02",
      periodEnd: "2026-09-17",
      scope: "RELEASE",
      priority: "PRIMARY"
    }, context());
    expect(result).toMatchObject({ status: "VALIDATION_ERROR", code: "PLANNING_OBJECTIVE_INVALID" });
  });

  it("fails closed when a target domain cannot verify the supplied reference", async () => {
    const result = await new CreatePlanningObjectiveService(writer).execute({
      title: "Release objective",
      statement: "Must not persist a dangling release reference.",
      periodStart: "2026-09-17",
      periodEnd: "2026-10-01",
      scope: "RELEASE",
      releaseId: crypto.randomUUID(),
      priority: "PRIMARY"
    }, context());
    expect(result).toMatchObject({ status: "BLOCKED", code: "PLANNING_OBJECTIVE_TARGET_UNAVAILABLE" });
  });

  it("requires a human user to commit or transition an objective", async () => {
    const systemContext = { ...context(), actor: { type: "SYSTEM" as const } };
    const create = await new CreatePlanningObjectiveService(writer).execute({
      title: "System objective",
      statement: "Should not commit automatically.",
      periodStart: "2026-09-17",
      periodEnd: "2026-09-18",
      scope: "ARTIST",
      priority: "PRIMARY"
    }, systemContext);
    const complete = await new CompletePlanningObjectiveService(writer).execute({ objectiveId: crypto.randomUUID() }, systemContext);
    expect(create).toMatchObject({ status: "FORBIDDEN", code: "PLANNING_OBJECTIVE_USER_REQUIRED" });
    expect(complete).toMatchObject({ status: "FORBIDDEN", code: "PLANNING_OBJECTIVE_USER_REQUIRED" });
  });
});
