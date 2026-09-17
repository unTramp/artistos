import { expect, test } from "@playwright/test";

const apiPost = async (page: import("@playwright/test").Page, url: string, body: unknown, key: string) => page.evaluate(async ({ url, body, key }) => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", "idempotency-key": key },
    body: JSON.stringify(body)
  });
  return { status: response.status, body: await response.json() };
}, { url, body, key });

test("Weekly Review closes into Decision lineage and OperationalAction provenance", async ({ page }) => {
  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const email = `weekly-review-${suffix}@example.test`;
  const learningStatement = "Performance-first clips create stronger downstream intent.";
  const seededActionTitle = `Prepare next performance clip ${suffix}`;

  await page.goto("/auth");
  await page.getByRole("button", { name: "Sign up" }).click();
  await page.getByLabel("Name").fill("Weekly Review User");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("weekly-review-password-123");
  await page.getByRole("button", { name: "Create account" }).click();

  await page.waitForURL("**/onboarding");
  await page.getByLabel("Your name").fill("Weekly Review User");
  await page.getByLabel("Artist name").fill("Weekly Review Artist");
  await page.getByLabel("Timezone").fill("UTC");
  await page.getByLabel("Language / locale").fill("en");
  await page.getByRole("button", { name: "Create my Artist OS" }).click();
  await page.waitForURL("**/");

  const createLearning = await apiPost(page, "/api/v1/learnings", {
    statement: learningStatement,
    scope: "FORMAT",
    confidence: "MEDIUM",
    confidenceRationale: "Repeated evidence suggests the pattern is useful enough to test.",
    references: [{ refType: "Publication", refId: `publication-${suffix}`, relation: "SUPPORTS", note: "Observed downstream intent." }]
  }, `weekly-learning-${suffix}`);
  expect(createLearning.status).toBe(201);
  const learningId = (createLearning.body as { data: { learningId: string } }).data.learningId;

  const startTest = await apiPost(page, `/api/v1/learnings/${learningId}/test`, {}, `weekly-learning-test-${suffix}`);
  expect(startTest.status).toBe(200);
  const validate = await apiPost(page, `/api/v1/learnings/${learningId}/validate`, { rationale: "Artist reviewed repeated evidence and approved this scoped finding." }, `weekly-learning-validate-${suffix}`);
  expect(validate.status).toBe(200);

  const seedAction = await apiPost(page, "/api/v1/actions", {
    sourceDomain: "CONTENT",
    sourceEntityType: "ContentUnit",
    sourceEntityId: crypto.randomUUID(),
    title: seededActionTitle,
    actionType: "PREPARE_PERFORMANCE_CLIP",
    priority: "HIGH",
    executionMode: "MANUAL_NATIVE"
  }, `weekly-action-${suffix}`);
  expect(seedAction.status).toBe(201);

  await page.goto("/weekly-reviews");
  await expect(page.getByRole("heading", { name: "Turn the week into better decisions" })).toBeVisible();
  await page.getByRole("button", { name: "Generate Weekly Review" }).click();
  await page.waitForURL("**/weekly-reviews/*");
  const reviewUrl = page.url();

  const decisionSection = page.locator(".decision-section").filter({ hasText: "DECISIONS TO MAKE" });
  await expect(decisionSection.getByText(learningStatement, { exact: false })).toBeVisible();

  const decisionPrompts = [
    "Apply performance-first learning",
    "Prioritize performance-first clips in the next content batch.",
    `Based on Weekly Review: ${learningStatement}`,
    "content.format"
  ];
  let decisionPromptIndex = 0;
  const handleDecisionPrompt = async (dialog: import("@playwright/test").Dialog) => {
    expect(dialog.type()).toBe("prompt");
    await dialog.accept(decisionPrompts[decisionPromptIndex++] ?? "");
  };
  page.on("dialog", handleDecisionPrompt);
  await decisionSection.getByRole("button", { name: "Turn into Decision →" }).click();
  await page.waitForURL("**/decisions/*");
  page.off("dialog", handleDecisionPrompt);
  expect(decisionPromptIndex).toBe(4);

  await expect(page.getByRole("heading", { name: "Apply performance-first learning" })).toBeVisible();
  await expect(page.getByText("BASED_ON · WEEKLYREVIEW", { exact: true })).toBeVisible();

  await page.goto(reviewUrl);
  const actionSection = page.locator(".decision-section").filter({ hasText: "NEXT ACTIONS" });
  const actionItem = actionSection.locator(".decision-card").filter({ hasText: seededActionTitle });
  await expect(actionItem).toBeVisible();

  let actionPromptIndex = 0;
  const handleActionPrompt = async (dialog: import("@playwright/test").Dialog) => {
    expect(dialog.type()).toBe("prompt");
    if (actionPromptIndex === 0) await dialog.accept(`Follow up from review ${suffix}`);
    else await dialog.accept("Explicitly committed from the Weekly Review ritual.");
    actionPromptIndex += 1;
  };
  page.on("dialog", handleActionPrompt);
  await actionItem.getByRole("button", { name: "Create Action →" }).click();
  await page.waitForURL("**/");
  page.off("dialog", handleActionPrompt);
  expect(actionPromptIndex).toBe(2);

  const actions = await page.evaluate(async () => {
    const response = await fetch("/api/v1/actions?status=OPEN,IN_PROGRESS,BLOCKED&limit=100", { cache: "no-store" });
    return response.json() as Promise<{ data: { actions: Array<{ title: string; sourceDomain: string; sourceEntityType: string; sourceEntityId: string }> } }>;
  });
  const created = actions.data.actions.find((action) => action.title === `Follow up from review ${suffix}`);
  expect(created).toBeTruthy();
  expect(created?.sourceDomain).toBe("INTELLIGENCE");
  expect(created?.sourceEntityType).toBe("WeeklyReview");
  expect(created?.sourceEntityId).toBe(reviewUrl.split("/").pop());
});
