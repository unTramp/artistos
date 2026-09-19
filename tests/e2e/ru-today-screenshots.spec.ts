import { expect, test } from "@playwright/test";
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

test("capture Russian Today after EN/RU localization", async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1440, height: 1024 });
  mkdirSync("artifacts/ru-today", { recursive: true });

  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  await page.goto("/auth");
  await page.getByRole("button", { name: "Sign up" }).click();
  await page.getByLabel("Name").fill("Andrey Dorofeev");
  await page.getByLabel("Email").fill(`ru-preview-${suffix}@example.test`);
  await page.getByLabel("Password").fill("artist-os-ru-preview-123");
  await page.getByRole("button", { name: "Create account" }).click();

  await page.waitForURL("**/onboarding");
  await page.getByLabel("Your name").fill("Andrey");
  await page.getByLabel("Artist name").fill("Andrey Dorofeev");
  await page.getByLabel("Timezone").fill("Asia/Yerevan");
  await page.getByLabel("Language / locale").fill("en");
  await page.getByRole("button", { name: "Create my Artist OS" }).click();
  await page.waitForURL("**/");

  const decision = await post(page, "/api/v1/decisions", {
    title: "Сделать performance-клип главным форматом",
    decision: "Для следующего контент-батча ставим performance-клип в центр.",
    reason: "Формат напрямую поддерживает текущий релизный фокус и может дать понятный музыкальный сигнал.",
    scope: "content.format"
  }, `ru-decision-${suffix}`);
  expect(decision.status).toBe(201);
  const decisionId = (decision.body as { data: { decisionId: string } }).data.decisionId;

  const today = new Date().toISOString().slice(0, 10);
  const end = new Date();
  end.setUTCDate(end.getUTCDate() + 29);
  const focus = await post(page, "/api/v1/objectives", {
    title: "Подготовить релиз Trastevere",
    statement: "Собрать сильный performance-клип и довести релизный контекст до готового действия.",
    periodStart: today,
    periodEnd: end.toISOString().slice(0, 10),
    scope: "ARTIST",
    priority: "PRIMARY",
    relatedRefs: [{ refType: "Decision", refId: decisionId }]
  }, `ru-focus-${suffix}`);
  expect([200, 201]).toContain(focus.status);

  const actionTitle = "Подготовить performance-клип для Trastevere";
  const action = await post(page, "/api/v1/actions", {
    sourceDomain: "INTELLIGENCE",
    sourceEntityType: "Decision",
    sourceEntityId: decisionId,
    title: actionTitle,
    description: "Собрать финальный hook, структуру кадра и подготовить материал к съёмке.",
    actionType: "PREPARE_PERFORMANCE_CLIP",
    priority: "HIGH",
    executionMode: "MANUAL_NATIVE"
  }, `ru-action-${suffix}`);
  expect(action.status).toBe(201);

  await page.goto("/");
  const switcher = page.locator(".app-topbar").getByRole("group", { name: "Interface locale" });
  await switcher.getByRole("button", { name: "RU", exact: true }).click();

  await expect(page.getByRole("heading", { name: "Сегодня", exact: true })).toBeVisible();
  await expect(page.locator(".today-primary-card")).toContainText(actionTitle);
  await expect(page.getByLabel("Контекст главной рекомендации")).toBeVisible();

  await page.screenshot({ path: "artifacts/ru-today/01-today-ru-full.png", fullPage: true });
  await page.locator(".app-main").screenshot({ path: "artifacts/ru-today/02-today-ru-workspace.png" });

  const why = page.getByRole("button", { name: `Почему эта рекомендация: ${actionTitle}` });
  await why.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.screenshot({ path: "artifacts/ru-today/03-today-ru-why.png", fullPage: true });

  await page.locator(".drawer-close").click();
  await page.getByRole("button", { name: "Открыть палитру команд" }).click();
  await expect(page.getByRole("dialog", { name: "Открыть палитру команд" })).toBeVisible();
  await page.screenshot({ path: "artifacts/ru-today/04-command-palette-ru.png", fullPage: true });
});
