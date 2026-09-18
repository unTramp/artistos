import { expect, test } from "@playwright/test";

test("reviews Candidate Knowledge and rebuilds Artist Brain from approved sources", async ({ page }) => {
  const email = `knowledge-${Date.now()}-${Math.random().toString(16).slice(2)}@example.test`;

  await page.goto("/auth");
  await page.getByRole("button", { name: "Sign up" }).click();
  await page.getByLabel("Name").fill("Knowledge E2E User");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("knowledge-e2e-password-123");
  await page.getByRole("button", { name: "Create account" }).click();

  await page.waitForURL("**/onboarding");
  await page.getByLabel("Your name").fill("Knowledge E2E Artist");
  await page.getByLabel("Artist name").fill("Knowledge E2E Artist");
  await page.getByLabel("Timezone").fill("UTC");
  await page.getByLabel("Language / locale").fill("en");
  await page.getByRole("button", { name: "Create my Artist OS" }).click();
  await page.waitForURL("**/");
  await expect(page.getByRole("heading", { name: "What needs attention now?" })).toBeVisible();

  await page.goto("/knowledge");
  await expect(page.getByRole("heading", { name: "Current context, compiled deliberately", exact: true })).toBeVisible();
  await expect(page.getByText("NO SNAPSHOT", { exact: true })).toBeVisible();

  await page.getByRole("textbox", { name: "Voice example", exact: true }).fill("Warm, direct language without launch hype.");
  await page.getByLabel("Tone label").selectOption("AUTHENTIC");
  await page.getByRole("button", { name: "Add to Tone Corpus" }).click();
  await expect(page.locator(".tone-label-authentic", { hasText: "AUTHENTIC" })).toBeVisible();
  await expect(page.locator("article").filter({ hasText: "Warm, direct language without launch hype." })).toBeVisible();

  await page.getByRole("textbox", { name: "Candidate knowledge", exact: true }).fill("My artist voice should feel kind, open and emotionally direct.");
  await page.getByLabel("Candidate source ID").fill("voice-note-e2e-001");
  await page.getByRole("button", { name: "Send to Knowledge Inbox" }).click();
  await expect(page.getByText("PENDING", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Accept to Artist Brain" })).toBeVisible();

  await page.getByRole("button", { name: "Accept to Artist Brain" }).click();
  await expect(page.getByText("ACCEPTED", { exact: true })).toBeVisible();
  await expect(page.locator("article").filter({ hasText: "My artist voice should feel kind, open and emotionally direct." }).last()).toBeVisible();

  await page.getByRole("button", { name: "Rebuild Artist Brain snapshot" }).click();
  await expect(page.getByText("BRAIN v1", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "1", exact: true }).first()).toBeVisible();

  await page.getByRole("textbox", { name: "Candidate knowledge", exact: true }).fill("A generic claim that should remain rejected evidence.");
  await page.getByLabel("Candidate source ID").fill("voice-note-e2e-002");
  await page.getByRole("button", { name: "Send to Knowledge Inbox" }).click();
  await page.getByRole("button", { name: "Reject" }).click();
  await expect(page.getByText("REJECTED", { exact: true })).toBeVisible();
  await expect(page.locator("article").filter({ hasText: "A generic claim that should remain rejected evidence." })).toBeVisible();
});
