import { expect, test } from "@playwright/test";

test("creates Identity, Era and Song through authenticated idempotent commands", async ({ page }) => {
  const email = `foundation-${Date.now()}-${Math.random().toString(16).slice(2)}@example.test`;

  await page.goto("/auth");
  await page.getByRole("button", { name: "Sign up" }).click();
  await page.getByLabel("Name").fill("Artist Foundation User");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("artist-foundation-password-123");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();

  const api = page.context().request;
  const workspace = await api.post("/api/v1/artist", {
    headers: { "idempotency-key": `workspace-${crypto.randomUUID()}` },
    data: {
      name: "Artist Foundation E2E",
      artistName: "Artist Foundation E2E",
      timezone: "UTC",
      locale: "en",
      reportingCurrency: "USD"
    }
  });
  expect(workspace.status()).toBe(201);

  await page.goto("/identity");
  await expect(page.getByRole("heading", { name: "Identity" })).toBeVisible();
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
  await expect(page.getByRole("heading", { name: "Songs" })).toBeVisible();
  await page.getByLabel("Title").fill("E2E Song");
  await page.getByLabel("Language").fill("en");
  await page.getByRole("button", { name: "Create Song" }).click();

  await expect(page.getByText("E2E Song", { exact: true })).toBeVisible();
  await expect(page.getByText("Original", { exact: true })).toBeVisible();
  await expect(page.getByText("ISRC unknown", { exact: true })).toBeVisible();
});
