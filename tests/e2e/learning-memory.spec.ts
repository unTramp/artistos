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
  await page.getByLabel("Scope").selectOption("FORMAT");
  await page.getByLabel("Confidence").selectOption("MEDIUM");
  await page.getByLabel("Why this confidence?").fill("Two completed publications show the same downstream behavior.");
  await page.getByLabel("Source type").fill("Publication");
  await page.getByLabel("Source ID").fill(`publication-${suffix}`);
  await page.getByLabel("Evidence note").fill("Both publications produced stronger profile-to-stream intent.");
  await page.getByRole("button", { name: "Record candidate" }).click();

  const card = page.locator(".decision-card").filter({ hasText: statement });
  await expect(card).toBeVisible();
  await expect(card.getByText("CANDIDATE", { exact: true })).toBeVisible();

  await card.getByRole("button", { name: "Start testing" }).click();
  await expect(card.getByText("TESTING", { exact: true })).toBeVisible();

  page.once("dialog", async (dialog) => {
    expect(dialog.type()).toBe("prompt");
    expect(dialog.message()).toContain("strong enough to validate");
    await dialog.accept("Repeated evidence was reviewed by the artist and is strong enough for this scope.");
  });
  await card.getByRole("button", { name: "Validate" }).click();
  await expect(card.getByText("VALIDATED", { exact: true })).toBeVisible();

  await page.goto("/");
  const memoryPanel = page.locator(".memory-panel");
  await expect(memoryPanel.getByText("VALIDATED LEARNING", { exact: true })).toBeVisible();
  await expect(memoryPanel.getByText(statement, { exact: true })).toBeVisible();

  await memoryPanel.getByRole("link", { name: "Open Learning Memory →" }).click();
  await expect(card.getByText("VALIDATED", { exact: true })).toBeVisible();

  let decisionPrompt = 0;
  const onDecisionPrompt = async (dialog: import("@playwright/test").Dialog) => {
    expect(dialog.type()).toBe("prompt");
    if (decisionPrompt === 0) {
      expect(dialog.message()).toContain("Decision title");
      decisionPrompt += 1;
      await dialog.accept("Use performance-first short videos");
      return;
    }
    expect(dialog.message()).toContain("What are we choosing");
    decisionPrompt += 1;
    await dialog.accept("Prioritize performance-first short videos for the next content batch.");
  };
  page.on("dialog", onDecisionPrompt);
  await card.getByRole("button", { name: "Use in decision →" }).click();
  await page.waitForURL("**/decisions/*");
  page.off("dialog", onDecisionPrompt);
  expect(decisionPrompt).toBe(2);

  await expect(page.getByRole("heading", { name: "Use performance-first short videos" })).toBeVisible();
  await expect(page.getByText("BASED_ON · LEARNING", { exact: true })).toBeVisible();
  await expect(page.getByText(`Based on validated Learning: ${statement}`, { exact: true })).toBeVisible();
});
