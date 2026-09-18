import { describe, expect, it } from "vitest";
import { hrefForOperationalSource } from "./entity-href";

describe("hrefForOperationalSource", () => {
  it("routes WeeklyReview sources back to their immutable review", () => {
    expect(hrefForOperationalSource("WeeklyReview", "review-123")).toBe("/weekly-reviews/review-123");
  });

  it("fails unknown source types closed to Today", () => {
    expect(hrefForOperationalSource("UnknownSource", "entity-1")).toBe("/");
  });
});
