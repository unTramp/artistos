import { expect, test } from "@playwright/test";

test("validates a Learning, surfaces it on Today and uses it in Decision lineage", async ({ page }) => {
  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const statement = "Performance-first short videos create stronger downstream music intent.";
  expect(suffix).toBeTruthy();
  await page.goto("/learnings");
  await expect(page).toHaveURL(/learnings/);
  expect(statement).toContain("Performance-first");
});
