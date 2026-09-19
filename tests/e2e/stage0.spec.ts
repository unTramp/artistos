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

test("signs up, uses command palette, manages current focus, explains maturity, learns in context and signs out", async ({ page }) => {
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
  await expect(page.getByRole("heading", { name: "Today", exact: true })).toBeVisible();
  await expect(page.getByText("Activate your artist identity", { exact: true })).toBeVisible();
  await expect(page.getByText(email, { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Today", exact: true })).toHaveClass(/active/);

  await page.getByRole("button", { name: "Open command palette" }).click();
  let palette = page.getByRole("dialog", { name: "Command palette" });
  await expect(palette).toBeVisible();
  await palette.getByLabel("Search commands").fill("weekly review");
  await expect(palette.getByRole("button", { name: /Run Weekly Review/ })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(palette).toBeHidden();

  await page.keyboard.press("Control+k");
  palette = page.getByRole("dialog", { name: "Command palette" });
  await expect(palette).toBeVisible();
  await palette.getByLabel("Search commands").fill("what should i do next");
  await palette.getByRole("button", { name: /What should I do next\?/ }).click();
  await page.waitForURL("**/");

  await expect(page.getByText("No primary focus yet", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Set current focus" }).click();
  await page.getByLabel("Focus title").fill("Build release momentum");
  await page.getByLabel("What does success look like?").fill("Keep the next release moving through one coherent artist-level operational focus.");
  await page.getByLabel("Starts").fill("2026-09-01");
  await page.getByLabel("Ends").fill("2026-09-30");
  await page.getByRole("button", { name: "Set focus", exact: true }).click();

  const focus = page.getByRole("region", { name: "Current focus" });
  await expect(focus).toBeVisible();
  await expect(focus.getByText("Build release momentum", { exact: true })).toBeVisible();
  await expect(focus.getByText("Keep the next release moving through one coherent artist-level operational focus.", { exact: true })).toBeVisible();
  await focus.getByRole("button", { name: "Complete focus" }).click();
  await expect(page.getByText("No primary focus yet", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Why this recommendation: Activate your artist identity" }).click();
  const drawer = page.getByRole("dialog", { name: "Activate your artist identity" });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByText("WHY THIS", { exact: true }).first()).toBeVisible();
  await expect(drawer.getByText("BASED ON", { exact: true })).toBeVisible();
  await expect(drawer.getByText("BASIS MATURITY", { exact: true })).toBeVisible();
  await expect(drawer.getByText("FOUNDATION CONTEXT", { exact: true })).toBeVisible();
  await expect(drawer.getByText("0 direct provenance refs", { exact: true })).toBeVisible();
  await expect(drawer.getByText("UNCERTAINTY", { exact: true })).toBeVisible();
  await expect(drawer.getByText("EXPECTED EFFECT", { exact: true })).toBeVisible();
  await expect(drawer.getByText("WHAT WE MAY LEARN", { exact: true })).toBeVisible();
  await expect(drawer.getByText("Low — this recommendation comes from deterministic current state.")).toBeVisible();
  await expect(drawer.getByText("What an active Identity changes", { exact: true })).toBeVisible();
  await drawer.getByRole("button", { name: "Learn →" }).click();

  const guide = page.getByRole("dialog", { name: "What an active Identity changes" });
  await expect(guide).toBeVisible();
  await expect(guide.getByText("CONTEXTUAL GUIDANCE", { exact: true })).toBeVisible();
  await expect(guide.getByText("WHAT IS THIS?", { exact: true })).toBeVisible();
  await expect(guide.getByText("WHY IT MATTERS", { exact: true })).toBeVisible();
  await expect(guide.getByText("HOW TO USE IT", { exact: true })).toBeVisible();
  await expect(guide.getByText("Apply to · Activate your artist identity", { exact: true })).toBeVisible();
  await guide.getByRole("link", { name: "Apply now →" }).click();
  await page.waitForURL("**/identity");

  await page.goto("/auth");
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
});
