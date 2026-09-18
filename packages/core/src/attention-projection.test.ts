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

const action = (overrides: Partial<{
  id: string;
  sourceDomain: string;
  sourceEntityType: string;
  sourceEntityId: string;
  title: string;
  status: "OPEN" | "IN_PROGRESS" | "BLOCKED" | "DONE" | "SKIPPED" | "EXPIRED";
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  version: number;
}> = {}) => ({
  id: "action-1",
  sourceDomain: "CONTENT",
  sourceEntityType: "ContentUnit",
  sourceEntityId: "unit-1",
  title: "Review content unit",
  status: "OPEN" as const,
  priority: "NORMAL" as const,
  version: 1,
  ...overrides
});

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
      guidanceRef: {
        key: "content.execution-revision",
        label: "Turn a concept into shoot-ready execution",
        estimatedMinutes: 5
      },
      action: { href: "/factory/units/unit-1" }
    });
    expect(result.items[0]?.whyThis[0]).toContain("no approved execution revision");
    expect(result.items[1]).toMatchObject({
      kind: "REVIEW",
      guidanceRef: { key: "content.angle-review" }
    });
  });

  it("uses a release-scoped PlanningObjective as a bounded ranking boost, not a hard rule", () => {
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
        action({ id: "evergreen-action", sourceEntityId: "evergreen-1", title: "Review evergreen caption" }),
        action({ id: "release-action", sourceDomain: "MUSIC", sourceEntityType: "Release", sourceEntityId: "release-trastevere", title: "Confirm Trastevere artwork" })
      ]
    });

    expect(result.items[0]).toMatchObject({ id: "operational-action:release-action", objectiveAligned: true });
    expect(result.items[0]?.whyThis.join(" ")).toContain("Prepare Trastevere release");
    expect(result.items[1]).toMatchObject({ objectiveAligned: false });
  });

  it("does not treat an ARTIST objective without related evidence as aligned with every action", () => {
    const result = service.project({
      ...base,
      activeObjective: {
        id: "objective-artist",
        title: "Build momentum",
        statement: "Keep the month focused on momentum.",
        priority: "PRIMARY",
        scope: "ARTIST"
      },
      operationalActions: [action()]
    });

    expect(result.items[0]).toMatchObject({ id: "operational-action:action-1", objectiveAligned: false });
    expect(result.items[0]?.whyThis.join(" ")).not.toContain("Build momentum");
  });

  it("aligns an ARTIST objective only when an explicit related reference matches action lineage", () => {
    const result = service.project({
      ...base,
      activeObjective: {
        id: "objective-related",
        title: "Finish the chosen production task",
        statement: "Close the exact work selected in review.",
        priority: "PRIMARY",
        scope: "ARTIST",
        relatedRefs: [{ type: "ContentUnit", id: "unit-1" }]
      },
      operationalActions: [
        action({ id: "matching" }),
        action({ id: "other", sourceEntityId: "unit-2", title: "Other content unit" })
      ]
    });

    expect(result.items.find((item) => item.id === "operational-action:matching")).toMatchObject({ objectiveAligned: true });
    expect(result.items.find((item) => item.id === "operational-action:other")).toMatchObject({ objectiveAligned: false });
  });

  it("can align a focus directly to one OperationalAction without widening to sibling actions", () => {
    const result = service.project({
      ...base,
      activeObjective: {
        id: "objective-action",
        title: "Close one blocker",
        statement: "Finish the selected action.",
        priority: "PRIMARY",
        scope: "ARTIST",
        relatedRefs: [{ type: "OperationalAction", id: "target-action" }]
      },
      operationalActions: [
        action({ id: "target-action", sourceEntityId: "shared-unit", title: "Target action" }),
        action({ id: "sibling-action", sourceEntityId: "shared-unit", title: "Sibling action" })
      ]
    });

    expect(result.items.find((item) => item.id === "operational-action:target-action")).toMatchObject({ objectiveAligned: true });
    expect(result.items.find((item) => item.id === "operational-action:sibling-action")).toMatchObject({ objectiveAligned: false });
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
        action({ id: "aligned", sourceDomain: "MUSIC", sourceEntityType: "Release", sourceEntityId: "release-trastevere", title: "Review release notes" }),
        {
          ...action({ id: "urgent", sourceDomain: "DSP", sourceEntityType: "EditorialPitch", sourceEntityId: "pitch-1", title: "Submit editorial pitch", priority: "URGENT" }),
          dueAt: new Date("2026-09-17T09:00:00.000Z")
        }
      ]
    });

    expect(result.items[0]).toMatchObject({
      id: "operational-action:urgent",
      guidanceRef: { key: "music.editorial-pitch", estimatedMinutes: 6 }
    });
    expect(result.items[1]?.id).toBe("operational-action:aligned");
  });

  it("attaches optional guidance to knowledge review without changing canonical state", () => {
    const result = service.project({
      ...base,
      pendingKnowledge: { count: 1, refs: [{ type: "CandidateKnowledge", id: "candidate-1" }] }
    });

    const item = result.items[0];
    expect(item).toMatchObject({
      kind: "MEMORY",
      basedOn: [{ type: "CandidateKnowledge", id: "candidate-1" }],
      uncertainty: [],
      blockedBy: [],
      guidanceRef: { key: "brain.candidate-review", label: "How to review a Brain candidate", estimatedMinutes: 3 }
    });
  });

  it("offers guidance for foundational setup while keeping execution optional", () => {
    const result = service.project({ ...base, identity: { active: false }, songsCount: 0 });

    expect(result.items[0]).toMatchObject({
      id: "foundation:identity",
      guidanceRef: { key: "identity.active-context" },
      action: { href: "/identity" }
    });
    expect(result.items.find((item) => item.id === "music:first-song")).toMatchObject({
      guidanceRef: { key: "music.song-brain" },
      action: { href: "/songs" }
    });
  });
});
