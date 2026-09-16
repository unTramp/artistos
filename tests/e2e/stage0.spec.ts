import { expect, test } from "@playwright/test";

test("renders the unauthenticated Daily OS front door", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Know what matters next." })).toBeVisible();
  await expect(page.getByText("YOUR CAREER · ONE OPERATING SYSTEM", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Sign in →" })).toBeVisible();
});

test("exposes liveness with a trace id", async ({ request }) => {
  const response = await request.get("/api/live");
  expect(response.ok()).toBe(true);
  const body = await response.json();
  expect(body.data).toMatchObject({ status: "ok", service: "web" });
  expect(body.meta.traceId).toEqual(expect.any(String));
});

test("signs up, completes onboarding, opens Today and signs out", async ({ page }) => {
  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const email = `daily-os-${suffix}@example.test`;

  await page.goto("/auth");
  await page.getByRole("button", { name: "Sign up" }).click();
  await page.getByLabel("Name").fill("Daily OS Test User");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("daily-os-test-password-123");
  await page.getByRole("button", { name: "Create account" }).click();

  await page.waitForURL("**/onboarding");
  await expect(page.getByRole("heading", { name: "Start with the minimum useful context." })).toBeVisible();
  await page.getByLabel("Your name").fill("Daily OS Test User");
  await page.getByLabel("Artist name").fill("Daily OS Artist");
  await page.getByLabel("Timezone").fill("UTC");
  await page.getByLabel("Language / locale").fill("en");
  await page.getByRole("button", { name: "Create my Artist OS" }).click();

  await page.waitForURL("**/");
  await expect(page.getByRole("heading", { name: "What needs attention now?" })).toBeVisible();
  await expect(page.getByText("Activate your artist identity", { exact: true })).toBeVisible();
  await expect(page.getByText(email, { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Today", exact: true })).toHaveClass(/active/);

  await page.goto("/auth");
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
});
