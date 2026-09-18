import { describe, expect, it } from "vitest";
import { hrefForEntityReference, hrefForOperationalSource } from "./entity-href";

describe("entity reference routing", () => {
  it("routes memory and workflow references to stable product surfaces", () => {
    expect(hrefForEntityReference("Decision", "decision-1")).toBe("/decisions/decision-1");
    expect(hrefForEntityReference("Learning", "learning-1")).toBe("/learnings#learning-learning-1");
    expect(hrefForEntityReference("WeeklyReview", "review-123")).toBe("/weekly-reviews/review-123");
    expect(hrefForEntityReference("OperationalAction", "action-1")).toBe("/#action-action-1");
    expect(hrefForEntityReference("PlanningObjective", "objective-1")).toBe("/#current-focus");
  });

  it("does not invent a route for unknown entity types", () => {
    expect(hrefForEntityReference("UnknownSource", "entity-1")).toBeNull();
  });

  it("keeps operational source fallback closed to Today", () => {
    expect(hrefForOperationalSource("WeeklyReview", "review-123")).toBe("/weekly-reviews/review-123");
    expect(hrefForOperationalSource("UnknownSource", "entity-1")).toBe("/");
  });
});
