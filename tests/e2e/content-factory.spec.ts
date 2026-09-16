import { expect, test } from "@playwright/test";

test("reviews an Angle before creating one canonical Content Unit", async ({ page }) => {
  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const email = `factory-${suffix}@example.test`;
  const angleTitle = `E2E Story Angle ${suffix}`;

  await page.goto("/auth");
  await page.getByRole("button", { name: "Sign up" }).click();
  await page.getByLabel("Name").fill("Content Factory User");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("content-factory-password-123");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();

  const api = page.context().request;
  const workspace = await api.post("/api/v1/artist", {
    headers: { "idempotency-key": `workspace-${crypto.randomUUID()}` },
    data: {
      name: "Content Factory E2E",
      artistName: "Content Factory E2E",
      timezone: "UTC",
      locale: "en",
      reportingCurrency: "USD"
    }
  });
  expect(workspace.status()).toBe(201);

  await page.goto("/identity");
  await page.getByLabel("New identity draft").fill("Factory Identity");
  await page.getByRole("button", { name: "Create draft" }).click();
  await expect(page.getByText("Version 1 · Factory Identity", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Activate", exact: true }).click();
  await expect(page.getByText("ACTIVE", { exact: true }).first()).toBeVisible();

  await page.goto("/songs");
  await page.getByLabel("Title").fill("Factory Song");
  await page.getByLabel("Language").fill("en");
  await page.getByRole("button", { name: "Create Song" }).click();
  await expect(page.getByText("Factory Song", { exact: true })).toBeVisible();

  await page.goto("/factory");
  await expect(page.getByRole("heading", { name: "Make fewer ideas matter more" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Not connected yet — by design" })).toBeVisible();

  await page.getByLabel("Angle title").fill(angleTitle);
  await page.getByLabel("Song context").selectOption({ label: "Factory Song" });
  await page.getByLabel("Big idea").fill("Tell the emotional turn in the song as one concrete moment instead of a generic promo clip.");
  await page.getByLabel("Content pillar").selectOption("STORY");
  await page.getByLabel("Content mode").selectOption("EVERGREEN");
  await page.getByLabel("Angle goal").fill("Make the song story understandable before asking for a stream.");
  await page.getByLabel("Angle audience").fill("Listeners who respond to honest, story-led artist content.");
  await page.getByLabel("Why this angle").fill("The song already carries a narrative; the content should reveal rather than manufacture it.");
  await page.getByLabel("Identity fit rationale").fill("Direct, emotionally open and understated rather than flashy.");
  await page.getByLabel("Production effort").fill("One location, one performance insert, simple edit.");
  await page.getByLabel("Learning value").fill("Tests whether story context improves interest before a music CTA.");
  await page.getByLabel("Platform targets").fill("INSTAGRAM_REELS, TIKTOK");
  await page.getByLabel("Required assets").fill("performance take, clean audio");
  await page.getByRole("button", { name: "Save Angle draft" }).click();

  const reviewRow = page.locator(".factory-review-row").filter({ hasText: angleTitle }).first();
  await expect(reviewRow).toBeVisible();
  await expect(reviewRow.getByText("DRAFT", { exact: true })).toBeVisible();
  await expect(page.locator(".factory-angle-card").filter({ hasText: angleTitle })).toContainText("Identity captured");

  await reviewRow.getByRole("button", { name: "Approve" }).click();

  const approvedCard = page.locator(".factory-angle-card").filter({ hasText: angleTitle });
  await expect(approvedCard.getByText("APPROVED", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "No production commitment yet" })).toBeVisible();

  const conversionRow = page.locator(".factory-review-row").filter({ hasText: angleTitle }).first();
  await expect(conversionRow.getByText("APPROVED · explicit conversion required", { exact: true })).toBeVisible();
  await conversionRow.getByRole("button", { name: "Create Content Unit" }).click();

  const unit = page.locator(".factory-unit-list article").filter({ hasText: angleTitle });
  await expect(unit).toBeVisible();
  await expect(unit.getByText("APPROVED", { exact: true })).toBeVisible();
  await expect(unit.getByText("Factory Song · STORY · Execution format not defined yet", { exact: true })).toBeVisible();
  await expect(unit.locator(".unit-code")).toContainText("FACTORY-SONG-STORY-");
  await expect(page.locator(".factory-convert-list").filter({ hasText: angleTitle })).toHaveCount(0);
});
