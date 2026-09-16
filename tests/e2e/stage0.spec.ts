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
