import { expect, test } from "@playwright/test";

test("records Decision Memory and explicitly overrides a conflicting prior Decision", async ({ page }) => {
  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const email = `decision-memory-${suffix}@example.test`;

  await page.goto("/auth");
  await page.getByRole("button", { name: "Sign up" }).click();
  await page.getByLabel("Name").fill("Decision Memory User");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("decision-memory-password-123");
  await page.getByRole("button", { name: "Create account" }).click();

  await page.waitForURL("**/onboarding");
  await page.getByLabel("Your name").fill("Decision Memory User");
  await page.getByLabel("Artist name").fill("Decision Memory Artist");
  await page.getByLabel("Timezone").fill("UTC");
  await page.getByLabel("Language / locale").fill("en");
  await page.getByRole("button", { name: "Create my Artist OS" }).click();
  await page.waitForURL("**/");

  await page.getByRole("link", { name: "Memory", exact: true }).click();
  await page.waitForURL("**/memory");
  await expect(page.getByRole("heading", { name: "Remember what happened — and why it matters next." })).toBeVisible();
  await expect(page.getByText("History + learning + decisions", { exact: true })).toBeVisible();
  await expect(page.getByText("Current usable context", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Open Decisions →" }).click();
  await page.waitForURL("**/decisions");
  await expect(page.getByRole("heading", { name: "Remember the choice, not just the outcome" })).toBeVisible();

  await page.getByRole("button", { name: "Record decision" }).click();
  await page.getByLabel("Title").fill("Use Trastevere as next release");
  await page.getByLabel("Decision", { exact: true }).fill("Make Trastevere the next release focus.");
  await page.getByLabel("Why", { exact: true }).fill("It is the most release-ready song in the current context.");
  await page.getByLabel("Scope").fill("music.release");
  await page.getByText("Conflict memory", { exact: true }).click();
  await page.getByLabel("Topic key").fill("song.next-release");
  await page.getByRole("button", { name: "Record decision", exact: true }).last().click();

  await expect(page.locator(".decision-card").filter({ hasText: "Use Trastevere as next release" })).toBeVisible();
  await page.goto("/");
  await expect(page.getByText("Use Trastevere as next release", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Open Decision Memory →" }).click();

  await page.getByRole("button", { name: "Record decision" }).click();
  await page.getByLabel("Title").fill("Use Always on My Mind as next release");
  await page.getByLabel("Decision", { exact: true }).fill("Make Always on My Mind the next release focus.");
  await page.getByLabel("Why", { exact: true }).fill("The release schedule now favors the finished master.");
  await page.getByLabel("Scope").fill("music.release");
  await page.getByText("Conflict memory", { exact: true }).click();
  await page.getByLabel("Topic key").fill("song.next-release");
  await page.getByRole("button", { name: "Record decision", exact: true }).last().click();

  const conflict = page.getByRole("dialog", { name: "This changes a previous choice" });
  await expect(conflict).toBeVisible();
  await expect(conflict.getByText("Use Trastevere as next release", { exact: true })).toBeVisible();
  await expect(conflict.getByText("WHY · It is the most release-ready song in the current context.", { exact: true })).toBeVisible();
  await conflict.getByLabel("What changed?").fill("The schedule changed and Always on My Mind can ship earlier.");
  await conflict.getByRole("button", { name: "Use new decision" }).click();

  const oldCard = page.locator(".decision-card").filter({ hasText: "Use Trastevere as next release" });
  const newCard = page.locator(".decision-card").filter({ hasText: "Use Always on My Mind as next release" });
  await expect(oldCard).toBeVisible();
  await expect(newCard).toBeVisible();
  await expect(oldCard.getByText("REVERSED", { exact: true })).toBeVisible();
  await expect(newCard.getByText("ACTIVE", { exact: true })).toBeVisible();
  await expect(newCard.getByText("Replaces prior Decision", { exact: true })).toBeVisible();

  await newCard.click();
  await expect(page.getByRole("heading", { name: "Use Always on My Mind as next release" })).toBeVisible();
  await expect(page.getByText("SUPERSEDES · DECISION", { exact: true })).toBeVisible();
});
