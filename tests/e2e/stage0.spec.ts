import { expect, test } from "@playwright/test";

test("renders the Artist OS Stage 0 shell", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Artist OS" })).toBeVisible();
  await expect(page.getByText("Make the architecture executable")).toBeVisible();
  await expect(page.getByText("Stage 0 · Foundation")).toBeVisible();
});

test("exposes liveness with a trace id", async ({ request }) => {
  const response = await request.get("/api/live");
  expect(response.ok()).toBe(true);
  const body = await response.json();
  expect(body.data).toMatchObject({ status: "ok", service: "web" });
  expect(body.meta.traceId).toEqual(expect.any(String));
});

test("signs up, restores the session, and signs out", async ({ page }) => {
  const email = `stage0-${Date.now()}-${Math.random().toString(16).slice(2)}@example.test`;

  await page.goto("/auth");
  await page.getByRole("button", { name: "Sign up" }).click();
  await page.getByLabel("Name").fill("Stage 0 Test User");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("stage0-test-password-123");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await expect(page.getByText(email)).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await expect(page.getByText(email)).toBeVisible();

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
});
