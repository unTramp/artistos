import { expect, test } from "@playwright/test";

test("validates a Learning, surfaces it on Today and uses it in Decision lineage", async ({ page }) => {
  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const email = `learning-memory-${suffix}@example.test`;
  const statement = "Performance-first short videos create stronger downstream music intent.";

  await page.goto("/auth");
  await page.getByRole("button", { name: "Sign up" }).click();
  await page.getByLabel("Name").fill("Learning Memory User");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("learning-memory-password-123");
  await page.getByRole("button", { name: "Create account" }).click();

  await page.waitForURL("**/onboarding");
  await page.getByLabel("Your name").fill("Learning Memory User");
  await page.getByLabel("Artist name").fill("Learning Memory Artist");
  await page.getByLabel("Timezone").fill("UTC");
  await page.getByLabel("Language / locale").fill("en");
  await page.getByRole("button", { name: "Create my Artist OS" }).click();
  await page.waitForURL("**/");

  await page.goto("/learnings");
  await expect(page.getByRole("heading", { name: "Remember what the work actually taught you" })).toBeVisible();

  await page.getByRole("button", { name: "Record learning" }).click();
  await page.getByLabel("What did we learn?").fill(statement);
  await page.locator('select[name="scope"]').selectOption("FORMAT");
  await page.locator('select[name="confidence"]').selectOption("MEDIUM");
  await page.getByLabel("Why this confidence?", { exact: true }).fill("Two completed publications show the same downstream behavior.");
  await page.getByLabel("Source type", { exact: true }).fill("Publication");
  await page.getByLabel("Source ID", { exact: true }).fill(`publication-${suffix}`);
  await page.getByLabel("Evidence note", { exact: true }).fill("Both publications produced stronger profile-to-stream intent.");
  await page.getByRole("button", { name: "Record candidate" }).click();

  const card = page.locator(".decision-card").filter({ hasText: statement });
  await expect(card).toBeVisible();
  await expect(card.getByText("CANDIDATE", { exact: true })).toBeVisible();

  await card.getByRole("button", { name: "Start testing" }).click();
  await expect(card.getByText("TESTING", { exact: true })).toBeVisible();

  await card.getByRole("button", { name: "Validate" }).click();
  await card.getByLabel("Why is this evidence strong enough to validate?").fill("Repeated evidence was reviewed by the artist and is strong enough for this scope.");
  await card.getByRole("button", { name: "Confirm" }).click();
  await expect(card.getByText("VALIDATED", { exact: true })).toBeVisible();

  await page.goto("/");
  const memoryPanel = page.locator(".memory-panel");
  await expect(memoryPanel.getByText("VALIDATED LEARNING", { exact: true })).toBeVisible();
  await expect(memoryPanel.getByText(statement, { exact: true })).toBeVisible();

  await memoryPanel.getByRole("link", { name: "Open Learning Memory →" }).click();
  await expect(card.getByText("VALIDATED", { exact: true })).toBeVisible();

  await card.getByRole("button", { name: "Use in decision →" }).click();
  await card.getByLabel("Decision title").fill("Use performance-first short videos");
  await card.getByLabel("What are we choosing because of this Learning?").fill("Prioritize performance-first short videos for the next content batch.");
  await card.getByRole("button", { name: "Create decision" }).click();
  await page.waitForURL("**/decisions/*");

  await expect(page.getByRole("heading", { name: "Use performance-first short videos" })).toBeVisible();
  await expect(page.getByText("BASED_ON · LEARNING", { exact: true })).toBeVisible();
  await expect(page.getByText(`Based on validated Learning: ${statement}`, { exact: true })).toBeVisible();
  const learningId = await page.evaluate(async (expectedStatement) => {
    const response = await fetch("/api/v1/learnings", { cache: "no-store" });
    const body = await response.json() as { data: { learnings: Array<{ id: string; statement: string }> } };
    return body.data.learnings.find((learning) => learning.statement === expectedStatement)?.id ?? "";
  }, statement);
  expect(learningId).not.toBe("");
  const learningRef = page.locator(".decision-reference-item").filter({ hasText: "BASED_ON · LEARNING" });
  await expect(learningRef.getByRole("link", { name: statement, exact: false })).toHaveAttribute("href", `/learnings#learning-${learningId}`);
});
