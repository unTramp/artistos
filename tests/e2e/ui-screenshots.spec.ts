import { expect, test } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const post = async (page: import("@playwright/test").Page, url: string, body: unknown, key: string) =>
  page.evaluate(async ({ url, body, key }) => {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", "idempotency-key": key },
      body: JSON.stringify(body)
    });
    return { status: response.status, body: await response.json() };
  }, { url, body, key });

test("capture current Artist OS product surfaces", async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1440, height: 1050 });
  mkdirSync("artifacts/ui-screenshots", { recursive: true });

  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const email = `ui-screenshot-${suffix}@example.test`;

  await page.goto("/auth");
  await page.getByRole("button", { name: "Sign up" }).click();
  await page.getByLabel("Name").fill("Artist OS Demo");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("artist-os-screenshot-password-123");
  await page.getByRole("button", { name: "Create account" }).click();

  await page.waitForURL("**/onboarding");
  await page.getByLabel("Your name").fill("Andrey");
  await page.getByLabel("Artist name").fill("Andrey Dorofeev");
  await page.getByLabel("Timezone").fill("Asia/Yerevan");
  await page.getByLabel("Language / locale").fill("en");
  await page.getByRole("button", { name: "Create my Artist OS" }).click();
  await page.waitForURL("**/");

  execFileSync("pnpm", ["--filter", "@artist-os/db", "exec", "tsx", "src/seed-demo.ts"], {
    cwd: process.cwd(),
    env: { ...process.env, DEMO_EMAIL: email },
    stdio: "inherit"
  });

  await page.reload();

  const learningStatement = "Performance-first short videos create stronger downstream music intent.";
  const learning = await post(page, "/api/v1/learnings", {
    statement: learningStatement,
    scope: "FORMAT",
    confidence: "MEDIUM",
    confidenceRationale: "Repeated evidence suggests the pattern is useful enough to test.",
    references: [{ refType: "Publication", refId: `publication-${suffix}`, relation: "SUPPORTS", note: "Observed downstream intent." }]
  }, `shot-learning-${suffix}`);
  expect(learning.status).toBe(201);
  const learningId = (learning.body as { data: { learningId: string } }).data.learningId;

  expect((await post(page, `/api/v1/learnings/${learningId}/test`, {}, `shot-learning-test-${suffix}`)).status).toBe(200);
  expect((await post(page, `/api/v1/learnings/${learningId}/validate`, {
    rationale: "Repeated evidence was reviewed and approved for this scoped finding."
  }, `shot-learning-validate-${suffix}`)).status).toBe(200);

  const decision = await post(page, "/api/v1/decisions", {
    title: "Use performance-first short videos",
    decision: "Prioritize performance-first short videos for the next content batch.",
    reason: `Based on validated Learning: ${learningStatement}`,
    scope: "content.format",
    references: [{ refType: "Learning", refId: learningId, relation: "BASED_ON" }]
  }, `shot-decision-${suffix}`);
  expect(decision.status).toBe(201);

  const factory = await page.evaluate(async () => {
    const response = await fetch("/api/v1/content-factory", { cache: "no-store" });
    return response.json() as Promise<{ data: { units: Array<{ id: string; title: string }> } }>;
  });
  const unit = factory.data.units[0];
  if (!unit) throw new Error("Demo Content Unit missing");

  const actionTitle = "Prepare the next Midnight Signals performance clip";
  const action = await post(page, "/api/v1/actions", {
    sourceDomain: "CONTENT",
    sourceEntityType: "ContentUnit",
    sourceEntityId: unit.id,
    title: actionTitle,
    actionType: "PREPARE_PERFORMANCE_CLIP",
    priority: "HIGH",
    executionMode: "MANUAL_NATIVE"
  }, `shot-action-${suffix}`);
  expect(action.status).toBe(201);

  await page.goto("/weekly-reviews");
  await page.getByRole("button", { name: "Generate Weekly Review" }).click();
  await page.waitForURL("**/weekly-reviews/*");
  const weeklyReviewUrl = page.url();

  const focusSection = page.locator(".decision-section").filter({ hasText: "RECOMMENDED NEXT FOCUS" });
  if (await focusSection.getByRole("button", { name: "Set current focus →" }).count()) {
    await focusSection.getByRole("button", { name: "Set current focus →" }).click();
    await focusSection.getByRole("button", { name: "Confirm current focus" }).click();
    await page.waitForURL("**/");
  } else {
    await page.goto("/");
  }

  await expect(page.getByRole("heading", { name: "What needs attention now?" })).toBeVisible();
  await page.screenshot({ path: "artifacts/ui-screenshots/01-today.png", fullPage: true });

  const whyButton = page.getByRole("button", { name: /Why this recommendation:/ }).first();
  if (await whyButton.count()) {
    await whyButton.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.screenshot({ path: "artifacts/ui-screenshots/02-today-why.png", fullPage: true });
    await page.getByRole("button", { name: "Close explanation" }).click();
  }

  await page.goto("/factory");
  await expect(page.getByRole("heading", { name: "Start with intent. Let context accumulate." })).toBeVisible();
  await page.screenshot({ path: "artifacts/ui-screenshots/03-create-factory.png", fullPage: true });

  await page.goto("/songs");
  await expect(page.getByRole("heading", { name: "Songs", exact: true })).toBeVisible();
  await page.screenshot({ path: "artifacts/ui-screenshots/04-music.png", fullPage: true });

  await page.goto("/knowledge");
  await expect(page.getByRole("heading", { name: "Memory that earns permanence", exact: true })).toBeVisible();
  await page.screenshot({ path: "artifacts/ui-screenshots/05-brain.png", fullPage: true });

  await page.goto("/memory");
  await expect(page.getByRole("heading", { name: "Remember what happened — and why it matters next." })).toBeVisible();
  await page.screenshot({ path: "artifacts/ui-screenshots/06-memory.png", fullPage: true });

  await page.goto("/decisions");
  await expect(page.getByRole("heading", { name: "Remember the choice, not just the outcome" })).toBeVisible();
  await page.screenshot({ path: "artifacts/ui-screenshots/07-decisions.png", fullPage: true });

  await page.goto(weeklyReviewUrl);
  await expect(page.getByRole("heading", { name: "What happened", exact: true })).toBeVisible();
  await page.screenshot({ path: "artifacts/ui-screenshots/08-weekly-review.png", fullPage: true });

  await page.goto(`/factory/units/${unit.id}`);
  await expect(page.getByRole("heading", { name: unit.title, exact: true })).toBeVisible();
  await page.screenshot({ path: "artifacts/ui-screenshots/09-execution.png", fullPage: true });

  await page.goto("/identity");
  await expect(page.getByRole("heading", { name: "Identity", exact: true })).toBeVisible();
  await page.screenshot({ path: "artifacts/ui-screenshots/10-identity.png", fullPage: true });
});
