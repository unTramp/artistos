import { describe, expect, it } from "vitest";
import { AttentionProjectionService } from "./attention-projection";

const service = new AttentionProjectionService();
const now = new Date("2026-09-17T08:00:00.000Z");

const base = {
  computedAt: now,
  identity: { active: true },
  songsCount: 1,
  pendingKnowledge: { count: 0 },
  reviewAngles: { count: 0 },
  approvedAnglesWithoutUnit: { count: 0 },
  unitsWithoutApprovedExecution: [],
  operationalActions: []
};

describe("AttentionProjectionService", () => {
  it("keeps projection deterministic and empty when nothing needs attention", () => {
    expect(service.project(base)).toEqual({ computedAt: now, activeObjective: null, items: [] });
  });

  it("surfaces deterministic domain blockers before lower-priority review work", () => {
    const result = service.project({
      ...base,
      reviewAngles: { count: 2 },
      unitsWithoutApprovedExecution: [{ id: "unit-1", title: "Trastevere story reel" }]
    });

    expect(result.items[0]).toMatchObject({
      id: "content-unit:unit-1:execution",
      kind: "BLOCKER",
      priority: "HIGH",
      action: { href: "/factory/units/unit-1" }
    });
    expect(result.items[0]?.whyThis[0]).toContain("no approved execution revision");
    expect(result.items[1]?.kind).toBe("REVIEW");
  });

  it("uses the active PlanningObjective as a ranking boost, not as a hard rule", () => {
    const result = service.project({
      ...base,
      activeObjective: {
        id: "objective-1",
        title: "Prepare Trastevere release",
        statement: "Finish launch-critical work for the Trastevere release.",
        priority: "PRIMARY",
        scope: "RELEASE",
        releaseId: "release-trastevere"
      },
      operationalActions: [
        {
          id: "evergreen-action",
          sourceDomain: "CONTENT",
          sourceEntityType: "ContentUnit",
          sourceEntityId: "evergreen-1",
          title: "Review evergreen caption",
          status: "OPEN",
          priority: "NORMAL",
          version: 1
        },
        {
          id: "release-action",
          sourceDomain: "MUSIC",
          sourceEntityType: "Release",
          sourceEntityId: "release-trastevere",
          title: "Confirm Trastevere artwork",
          status: "OPEN",
          priority: "NORMAL",
          version: 1
        }
      ]
    });

    expect(result.items[0]).toMatchObject({
      id: "operational-action:release-action",
      objectiveAligned: true
    });
    expect(result.items[0]?.whyThis.join(" ")).toContain("Prepare Trastevere release");
    expect(result.items[1]).toMatchObject({ objectiveAligned: false });
  });

  it("lets deadline urgency override objective alignment when constraints are not comparable", () => {
    const result = service.project({
      ...base,
      activeObjective: {
        id: "objective-1",
        title: "Prepare Trastevere release",
        statement: "Finish launch-critical work.",
        priority: "PRIMARY",
        scope: "RELEASE",
        releaseId: "release-trastevere"
      },
      operationalActions: [
        {
          id: "aligned",
          sourceDomain: "MUSIC",
          sourceEntityType: "Release",
          sourceEntityId: "release-trastevere",
          title: "Review release notes",
          status: "OPEN",
          priority: "NORMAL",
          version: 1
        },
        {
          id: "urgent",
          sourceDomain: "DSP",
          sourceEntityType: "EditorialPitch",
          sourceEntityId: "pitch-1",
          title: "Submit editorial pitch",
          status: "OPEN",
          priority: "URGENT",
          dueAt: new Date("2026-09-17T09:00:00.000Z"),
          version: 1
        }
      ]
    });

    expect(result.items[0]?.id).toBe("operational-action:urgent");
    expect(result.items[1]?.id).toBe("operational-action:aligned");
  });

  it("preserves explainability and an optional guidance extension point", () => {
    const result = service.project({
      ...base,
      pendingKnowledge: { count: 1, refs: [{ type: "CandidateKnowledge", id: "candidate-1" }] }
    });

    const item = result.items[0];
    expect(item).toMatchObject({
      kind: "MEMORY",
      basedOn: [{ type: "CandidateKnowledge", id: "candidate-1" }],
      uncertainty: [],
      blockedBy: []
    });
    expect("guidanceRef" in (item ?? {})).toBe(false);
  });
});
