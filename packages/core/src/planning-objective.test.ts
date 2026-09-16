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
  async createObjective(request) { return { objectiveId: request.objectiveId, version: 1, completedAt: null }; },
  async completeObjective(request) { return { objectiveId: request.objectiveId, version: 2, completedAt: request.evidence.occurredAt }; }
};

describe("PlanningObjective services", () => {
  it("creates a period-scoped primary objective", async () => {
    const result = await new CreatePlanningObjectiveService(writer, () => "11111111-1111-4111-8111-111111111111").execute({
      title: "Prepare Trastevere release",
      statement: "Finish launch-critical work and establish the first audience discovery loop.",
      periodStart: "2026-09-17",
      periodEnd: "2026-10-01",
      scope: "ARTIST",
      priority: "PRIMARY"
    }, context());
    expect(result).toMatchObject({ status: "SUCCESS", data: { objectiveId: "11111111-1111-4111-8111-111111111111", version: 1 } });
  });

  it("rejects invalid dates and scope references", async () => {
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

  it("requires a human user to commit or complete an objective", async () => {
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
