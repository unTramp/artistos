import { expect, test } from "@playwright/test";

test("creates Identity, Era, Song and Song Brain context through authenticated idempotent commands", async ({ page }) => {
  const email = `foundation-${Date.now()}-${Math.random().toString(16).slice(2)}@example.test`;

  await page.goto("/auth");
  await page.getByRole("button", { name: "Sign up" }).click();
  await page.getByLabel("Name").fill("Artist Foundation User");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("artist-foundation-password-123");
  await page.getByRole("button", { name: "Create account" }).click();

  await page.waitForURL("**/onboarding");
  await page.getByLabel("Your name").fill("Artist Foundation E2E");
  await page.getByLabel("Artist name").fill("Artist Foundation E2E");
  await page.getByLabel("Timezone").fill("UTC");
  await page.getByLabel("Language / locale").fill("en");
  await page.getByRole("button", { name: "Create my Artist OS" }).click();
  await page.waitForURL("**/");
  await expect(page.getByRole("heading", { name: "Today", exact: true })).toBeVisible();

  await page.goto("/identity");
  await expect(page.getByRole("heading", { name: "Identity", exact: true })).toBeVisible();
  await page.getByLabel("New identity draft").fill("E2E Identity");
  await page.getByRole("button", { name: "Create draft" }).click();
  await expect(page.getByText("Version 1 · E2E Identity", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Activate", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Version 1" })).toBeVisible();
  await expect(page.getByText("ACTIVE", { exact: true }).first()).toBeVisible();

  await page.getByLabel("New Era").fill("E2E Era");
  await page.getByRole("button", { name: "Create Era draft" }).click();
  await expect(page.getByText("E2E Era · DRAFT", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Activate Era" }).click();
  await expect(page.getByText("E2E Era · ACTIVE", { exact: true })).toBeVisible();

  await page.goto("/songs");
  await expect(page.getByRole("heading", { name: "Songs", exact: true })).toBeVisible();
  await page.getByLabel("Title").fill("E2E Song");
  await page.getByLabel("Language").fill("en");
  await page.getByRole("button", { name: "Create Song" }).click();

  await expect(page.getByText("E2E Song", { exact: true })).toBeVisible();
  await expect(page.getByText("Original", { exact: true })).toBeVisible();
  await expect(page.getByText("ISRC unknown", { exact: true })).toBeVisible();

  await page.getByRole("link", { name: "E2E Song", exact: true }).click();
  await expect(page.getByRole("heading", { name: "E2E Song", exact: true })).toBeVisible();
  await expect(page.getByText("Sectional readiness only · no universal Song score.", { exact: true })).toBeVisible();

  await page.getByLabel("Statement type").selectOption("ARTIST_INTERPRETATION");
  await page.getByRole("textbox", { name: "Statement", exact: true }).fill("This song is about choosing honesty over comfort.");
  await page.getByRole("button", { name: "Add to Song Brain" }).click();
  await expect(page.getByText("ARTIST INTERPRETATION", { exact: true })).toBeVisible();
  await expect(page.getByText("This song is about choosing honesty over comfort.", { exact: true })).toBeVisible();

  await page.getByLabel("Visual notes").fill("Warm evening light without changing the base identity.");
  await page.getByLabel("Song anchors").fill("window light");
  await page.getByLabel("Allowed overrides").fill("warmer palette");
  await page.getByRole("button", { name: "Save Identity Context" }).click();

  await expect(page.getByRole("heading", { name: "Identity Version 1", exact: true })).toBeVisible();
  await expect(page.getByText("Era: E2E Era", { exact: true })).toBeVisible();
  await expect(page.locator("p.brain-note").filter({ hasText: "Warm evening light without changing the base identity." })).toBeVisible();
});
