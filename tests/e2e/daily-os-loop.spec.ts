import { expect, test } from "@playwright/test";

const post = async (page: import("@playwright/test").Page, url: string, body: unknown, key: string) => page.evaluate(async ({ url, body, key }) => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", "idempotency-key": key },
    body: JSON.stringify(body)
  });
  return { status: response.status, body: await response.json() };
}, { url, body, key });

test("Weekly Review recommendation becomes bounded focus and closes an OperationalAction on Today", async ({ page }) => {
  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const actionTitle = `Close Daily OS loop ${suffix}`;

  await page.goto("/auth");
  await page.getByRole("button", { name: "Sign up" }).click();
  await page.getByLabel("Name").fill("Daily OS Loop User");
  await page.getByLabel("Email").fill(`daily-os-loop-${suffix}@example.test`);
  await page.getByLabel("Password").fill("daily-os-loop-test-pass-123");
  await page.getByRole("button", { name: "Create account" }).click();

  await page.waitForURL("**/onboarding");
  await page.getByLabel("Your name").fill("Daily OS Loop User");
  await page.getByLabel("Artist name").fill("Daily OS Loop Artist");
  await page.getByLabel("Timezone").fill("UTC");
  await page.getByLabel("Language / locale").fill("en");
  await page.getByRole("button", { name: "Create my Artist OS" }).click();
  await page.waitForURL("**/");

  const created = await post(page, "/api/v1/actions", {
    sourceDomain: "INTELLIGENCE",
    sourceEntityType: "WeeklyReviewSeed",
    sourceEntityId: crypto.randomUUID(),
    title: actionTitle,
    actionType: "DAILY_OS_LOOP_TEST",
    priority: "HIGH",
    executionMode: "MANUAL_NATIVE"
  }, `daily-os-action-${suffix}`);
  expect(created.status).toBe(201);
  const actionId = (created.body as { data: { actionId: string } }).data.actionId;

  await page.goto("/weekly-reviews");
  await page.getByRole("button", { name: "Generate Weekly Review" }).click();
  await page.waitForURL("**/weekly-reviews/*");

  const focusSection = page.locator(".decision-section").filter({ hasText: "RECOMMENDED NEXT FOCUS" });
  await expect(focusSection.getByRole("link", { name: actionTitle, exact: false })).toHaveAttribute("href", `/actions/${actionId}`);
  await focusSection.getByRole("button", { name: "Set current focus →" }).click();
  await focusSection.getByRole("button", { name: "Confirm current focus" }).click();
  await page.waitForURL("**/");

  await expect(page.getByRole("heading", { name: "Today", exact: true })).toBeVisible();
  await expect(page.getByLabel("Current focus")).toBeVisible();
  await expect(page.getByText("Aligned with current objective", { exact: true })).toBeVisible();
  await expect(page.locator(".today-primary-card")).toContainText(actionTitle);
  await expect(page.getByLabel("Context for primary attention")).toBeVisible();
  const controls = page.getByTestId(`action-controls-${actionId}`);
  await expect(controls).toBeVisible();

  const languageSwitcher = page.locator(".app-topbar").getByRole("group", { name: "Interface locale" });
  await languageSwitcher.getByRole("button", { name: "RU", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Сегодня", exact: true })).toBeVisible();
  await expect(page.getByLabel("ТЕКУЩИЙ ФОКУС")).toBeVisible();
  await expect(page.getByText("Соответствует текущей цели", { exact: true })).toBeVisible();
  await expect(page.locator(".today-primary-card")).toContainText(actionTitle);
  await expect(page.getByLabel("Контекст главной рекомендации")).toBeVisible();
  await expect(page.getByTestId(`action-controls-${actionId}`).getByRole("button", { name: "Готово" })).toBeVisible();

  const ruWhyButton = page.getByRole("button", { name: `Почему эта рекомендация: ${actionTitle}` });
  await ruWhyButton.click();
  const ruWhyDrawer = page.getByRole("dialog");
  await expect(ruWhyDrawer.locator(".attention-drawer-head .signal-label")).toHaveText("ПОЧЕМУ ЭТО");
  await ruWhyDrawer.getByRole("button", { name: "Закрыть объяснение" }).click();
  await expect(ruWhyButton).toBeFocused();

  const ruLanguageSwitcher = page.locator(".app-topbar").getByRole("group", { name: "Локаль интерфейса" });
  await ruLanguageSwitcher.getByRole("button", { name: "EN", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Today", exact: true })).toBeVisible();

  const whyButton = page.getByRole("button", { name: `Why this recommendation: ${actionTitle}` });
  await whyButton.click();
  const whyDrawer = page.getByRole("dialog");
  await expect(whyDrawer.getByRole("link", { name: actionTitle, exact: false })).toBeVisible();
  await expect(whyDrawer.getByText(actionId, { exact: true })).toHaveCount(0);
  await whyDrawer.getByRole("button", { name: "Close explanation" }).click();
  await expect(whyButton).toBeFocused();
  await controls.getByRole("button", { name: "Done" }).click();
  await expect(page.getByTestId(`action-controls-${actionId}`)).toHaveCount(0);

  await expect.poll(async () => page.evaluate(async () => {
    const response = await fetch("/api/v1/product-telemetry?windowDays=1", { cache: "no-store" });
    const body = await response.json() as {
      data: { summary: { attention: { explanationsOpened: number; outcomes: { completed: number } } } }
    };
    return body.data.summary.attention;
  })).toMatchObject({
    explanationsOpened: expect.any(Number),
    outcomes: { completed: 1 }
  });

  const active = await page.evaluate(async () => {
    const response = await fetch("/api/v1/actions?status=OPEN,IN_PROGRESS,BLOCKED&limit=100", { cache: "no-store" });
    return response.json() as Promise<{ data: { actions: Array<{ id: string }> } }>;
  });
  expect(active.data.actions.some((action) => action.id === actionId)).toBe(false);

  await page.goto(`/actions/${actionId}`);
  await expect(page.getByRole("heading", { name: actionTitle })).toBeVisible();
  await expect(page.locator(".status-chip").getByText("DONE", { exact: true })).toBeVisible();
});
