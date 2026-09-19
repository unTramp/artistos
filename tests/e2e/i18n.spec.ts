import { expect, test } from "@playwright/test";

test("switches the global shell and Today between EN and RU and persists locale", async ({ page }) => {
  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  await page.goto("/auth");
  await page.getByRole("button", { name: "Sign up" }).click();
  await page.getByLabel("Name").fill("Locale Test User");
  await page.getByLabel("Email").fill(`locale-${suffix}@example.test`);
  await page.getByLabel("Password").fill("locale-test-password-123");
  await page.getByRole("button", { name: "Create account" }).click();

  await page.waitForURL("**/onboarding");
  await page.getByLabel("Your name").fill("Locale Test User");
  await page.getByLabel("Artist name").fill("Locale Test Artist");
  await page.getByLabel("Timezone").fill("UTC");
  await page.getByLabel("Language / locale").fill("en");
  await page.getByRole("button", { name: "Create my Artist OS" }).click();
  await page.waitForURL("**/");

  await expect(page.getByRole("heading", { name: "Today", exact: true })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  const enLanguage = page.getByRole("group", { name: "Interface language" });
  await enLanguage.getByRole("button", { name: "RU" }).click();

  await expect(page.locator("html")).toHaveAttribute("lang", "ru");
  await expect(page.getByRole("heading", { name: "Сегодня", exact: true })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Основная навигация" }).getByText("Память", { exact: true })).toBeVisible();
  await expect(page.getByText("Главный фокус пока не задан", { exact: true })).toBeVisible();
  await expect(page.locator(".today-primary-card")).toContainText("Активируйте идентичность артиста");
  await expect(page.getByLabel("Контекст главного действия")).toBeVisible();

  const whyButton = page.getByRole("button", { name: /Почему эта рекомендация:/ }).first();
  await whyButton.click();
  const drawer = page.getByRole("dialog");
  await expect(drawer.getByText("ПОЧЕМУ ЭТО", { exact: true }).first()).toBeVisible();
  await expect(drawer.getByText("НА ЧЁМ ОСНОВАНО", { exact: true })).toBeVisible();
  await drawer.getByRole("button", { name: "Закрыть объяснение" }).click();
  await expect(whyButton).toBeFocused();

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "ru");
  await expect(page.getByRole("heading", { name: "Сегодня", exact: true })).toBeVisible();

  const ruLanguage = page.getByRole("group", { name: "Язык интерфейса" });
  await ruLanguage.getByRole("button", { name: "EN" }).click();

  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { name: "Today", exact: true })).toBeVisible();
});
