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

test("authenticates, creates server-owned artist scope, restores session, and signs out", async ({ page }) => {
  const email = `stage0-${Date.now()}-${Math.random().toString(16).slice(2)}@example.test`;
  const traceId = `e2e-${crypto.randomUUID()}`;

  await page.goto("/auth");
  await page.getByRole("button", { name: "Sign up" }).click();
  await page.getByLabel("Name").fill("Stage 0 Test User");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("stage0-test-password-123");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await expect(page.getByText(email)).toBeVisible();

  const api = page.context().request;
  const create = await api.post("/api/v1/artist", {
    headers: {
      "x-trace-id": traceId,
      "idempotency-key": `e2e-${crypto.randomUUID()}`
    },
    data: {
      name: "Stage 0 E2E Artist",
      artistName: "Stage 0 E2E Artist",
      timezone: "UTC",
      locale: "en",
      reportingCurrency: "USD"
    }
  });
  expect(create.status()).toBe(201);
  const created = await create.json();
  expect(created).toMatchObject({
    data: { existing: false, replayed: false },
    meta: { traceId }
  });
  expect(created.data.artistId).toEqual(expect.any(String));
  expect(create.headers()["x-trace-id"]).toBe(traceId);

  const ensure = await api.post("/api/v1/artist", {
    data: {
      name: "Ignored because scope already exists",
      artistName: "Ignored because scope already exists",
      timezone: "UTC"
    }
  });
  expect(ensure.status()).toBe(200);
  const ensured = await ensure.json();
  expect(ensured.data).toMatchObject({ artistId: created.data.artistId, existing: true });

  await page.reload();
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await expect(page.getByText(email)).toBeVisible();

  await page.getByRole("link", { name: "Open Artist OS" }).click();
  await expect(page.getByText("AUTHENTICATED", { exact: true })).toBeVisible();
  await expect(page.getByText(email)).toBeVisible();

  await page.goto("/auth");
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
});
