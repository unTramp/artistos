import { expect, test } from "@playwright/test";

test("creates a lightweight Factory draft and turns rejection evidence into explicit memory candidates", async ({ page }) => {
  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const email = `passive-capture-${suffix}@example.test`;
  const angleTitle = `Identity mismatch ${suffix}`;
  const learningStatement = `Content angles similar to “${angleTitle}” may not fit the artist identity.`;
  const decisionTitle = `Creative constraint ${suffix}`;

  await page.goto("/auth");
  await page.getByRole("button", { name: "Sign up" }).click();
  await page.getByLabel("Name").fill("Passive Capture User");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("passive-capture-password-123");
  await page.getByRole("button", { name: "Create account" }).click();

  await page.waitForURL("**/onboarding");
  await page.getByLabel("Your name").fill("Passive Capture User");
  await page.getByLabel("Artist name").fill("Passive Capture Artist");
  await page.getByLabel("Timezone").fill("UTC");
  await page.getByLabel("Language / locale").fill("en");
  await page.getByRole("button", { name: "Create my Artist OS" }).click();
  await page.waitForURL("**/");

  await page.goto("/factory");
  await expect(page.getByRole("heading", { name: "Start with intent. Let context accumulate." })).toBeVisible();
  await page.getByLabel("Angle title").fill(angleTitle);
  await page.getByLabel("Big idea").fill("A deliberately flashy persona-led concept that the artist does not identify with.");
  await page.getByLabel("Content pillar").selectOption("PERSONALITY");
  await page.getByLabel("Content mode").selectOption("EXPERIMENTAL");
  await page.getByRole("button", { name: "Save draft" }).click();

  const draftCard = page.locator(".factory-angle-card").filter({ hasText: angleTitle });
  await expect(draftCard).toBeVisible();
  await expect(draftCard.getByText("Not set yet", { exact: true }).first()).toBeVisible();

  const reviewRow = page.locator(".factory-review-list").first().locator(".factory-review-row").filter({ hasText: angleTitle });
  await reviewRow.getByLabel(`Rejection reason for ${angleTitle}`).selectOption("NOT_ME");
  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toContain("Optional context");
    await dialog.accept("The concept feels performative rather than emotionally honest.");
  });
  await reviewRow.getByRole("button", { name: "Reject" }).click();

  const passiveSection = page.getByRole("region", { name: "Memory candidates from normal work" });
  await expect(passiveSection).toBeVisible();
  const passiveRow = passiveSection.locator(".factory-review-row").filter({ hasText: angleTitle });
  await expect(passiveRow).toContainText("NOT ME");
  await expect(passiveRow).toContainText("The concept feels performative rather than emotionally honest.");

  await passiveRow.getByRole("button", { name: "Capture Learning candidate" }).click();
  await page.goto("/learnings");
  const learningCard = page.locator(".decision-card").filter({ hasText: learningStatement });
  await expect(learningCard).toBeVisible();
  await expect(learningCard.getByText("CANDIDATE", { exact: true })).toBeVisible();
  await expect(learningCard).toContainText("LOW");

  await page.goto("/factory");
  const decisionRow = page.getByRole("region", { name: "Memory candidates from normal work" }).locator(".factory-review-row").filter({ hasText: angleTitle });
  let promptIndex = 0;
  const handlePrompt = async (dialog: import("@playwright/test").Dialog) => {
    if (promptIndex === 0) {
      expect(dialog.message()).toContain("Review decision candidate");
      promptIndex += 1;
      await dialog.accept(`Do not repeat the identity mismatch from ${angleTitle} unless context changes.`);
      return;
    }
    expect(dialog.message()).toContain("Decision title");
    promptIndex += 1;
    await dialog.accept(decisionTitle);
  };
  page.on("dialog", handlePrompt);
  await decisionRow.getByRole("button", { name: "Review Decision candidate" }).click();
  await expect(page.getByRole("status")).toContainText("Saved. Context captured from normal work.");
  page.off("dialog", handlePrompt);
  expect(promptIndex).toBe(2);

  const decisionsResponse = await page.context().request.get("/api/v1/decisions");
  expect(decisionsResponse.status()).toBe(200);
  const decisionsBody = await decisionsResponse.json() as { data: { decisions: Array<{ id: string; title: string; references: Array<{ refType: string; relation: string }> }> } };
  const decision = decisionsBody.data.decisions.find((item) => item.title === decisionTitle);
  expect(decision).toBeTruthy();
  expect(decision?.references).toEqual(expect.arrayContaining([
    expect.objectContaining({ refType: "ContentAngle", relation: "BASED_ON" })
  ]));
});
