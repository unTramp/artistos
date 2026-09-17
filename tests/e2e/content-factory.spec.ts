import { expect, test } from "@playwright/test";

test("reviews an Angle, degrades AI safely, creates one Content Unit and versions execution without rewriting history", async ({ page }) => {
  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const email = `factory-${suffix}@example.test`;
  const angleTitle = `E2E Story Angle ${suffix}`;

  await page.goto("/auth");
  await page.getByRole("button", { name: "Sign up" }).click();
  await page.getByLabel("Name").fill("Content Factory User");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("content-factory-password-123");
  await page.getByRole("button", { name: "Create account" }).click();

  await page.waitForURL("**/onboarding");
  await page.getByLabel("Your name").fill("Content Factory E2E");
  await page.getByLabel("Artist name").fill("Content Factory E2E");
  await page.getByLabel("Timezone").fill("UTC");
  await page.getByLabel("Language / locale").fill("en");
  await page.getByRole("button", { name: "Create my Artist OS" }).click();
  await page.waitForURL("**/");
  await expect(page.getByRole("heading", { name: "What needs attention now?" })).toBeVisible();

  const api = page.context().request;

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
  await expect(page.getByRole("heading", { name: "Start with intent. Let context accumulate." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Generate bounded Angle Cards" })).toBeVisible();
  await page.getByLabel("Song scope").selectOption({ label: "Factory Song" });
  await page.getByRole("button", { name: "Generate Angles" }).click();
  await expect(page.getByText("AI_PROVIDER_DISABLED", { exact: true })).toBeVisible();
  await expect(page.getByText("Manual Angle creation below remains the canonical fallback.", { exact: true })).toBeVisible();

  await page.getByLabel("Angle title").fill(angleTitle);
  await page.getByLabel("Song context").selectOption({ label: "Factory Song" });
  await page.getByLabel("Big idea").fill("Tell the emotional turn in the song as one concrete moment instead of a generic promo clip.");
  await page.getByLabel("Content pillar").selectOption("STORY");
  await page.getByLabel("Content mode").selectOption("EVERGREEN");
  await page.getByText("Advanced context · optional for draft", { exact: true }).click();
  await page.getByLabel("Angle goal").fill("Make the song story understandable before asking for a stream.");
  await page.getByLabel("Angle audience").fill("Listeners who respond to honest, story-led artist content.");
  await page.getByLabel("Why this angle").fill("The song already carries a narrative; the content should reveal rather than manufacture it.");
  await page.getByLabel("Identity fit rationale").fill("Direct, emotionally open and understated rather than flashy.");
  await page.getByLabel("Production effort").fill("One location, one performance insert, simple edit.");
  await page.getByLabel("Learning value").fill("Tests whether story context improves interest before a music CTA.");
  const manualFactory = page.getByRole("region", { name: "Content Factory commands" });
  await manualFactory.getByLabel("Platform targets").fill("INSTAGRAM_REELS, TIKTOK");
  await page.getByLabel("Required assets").fill("performance take, clean audio");
  await page.getByRole("button", { name: "Save draft" }).click();

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
  await expect(unit.getByText("Factory Song · STORY · Execution format lives in revisions", { exact: true })).toBeVisible();
  await expect(unit.locator(".unit-code")).toContainText("FACTORY-SONG-STORY-");
  await expect(page.locator(".factory-convert-list").filter({ hasText: angleTitle })).toHaveCount(0);

  const homeResponse = await api.get("/api/v1/content-factory");
  expect(homeResponse.status()).toBe(200);
  const home = await homeResponse.json() as {
    data: {
      angles: Array<{ id: string; title: string }>;
      units: Array<{ id: string; angleId: string | null }>;
    };
  };
  const angle = home.data.angles.find((item) => item.title === angleTitle);
  expect(angle).toBeTruthy();
  if (!angle) throw new Error("E2E angle missing from Factory read model");
  const canonicalUnits = home.data.units.filter((item) => item.angleId === angle.id);
  expect(canonicalUnits).toHaveLength(1);
  const contentUnitId = canonicalUnits[0]?.id;
  expect(contentUnitId).toBeTruthy();
  if (!contentUnitId) throw new Error("E2E Content Unit missing from Factory read model");

  const duplicate = await api.post(`/api/v1/content-factory/angles/${angle.id}/content-unit`, {
    headers: { "idempotency-key": `duplicate-unit-${crypto.randomUUID()}` },
    data: { priority: "HIGH" }
  });
  expect(duplicate.status()).toBe(409);
  const duplicateBody = await duplicate.json() as { error?: { code?: string } };
  expect(duplicateBody.error?.code).toBe("ANGLE_ALREADY_CONVERTED");

  await unit.getByRole("link", { name: "Open execution workspace" }).click();
  await expect(page.getByRole("heading", { name: angleTitle, exact: true })).toBeVisible();
  await expect(page.getByText("No approved execution source yet", { exact: true })).toBeVisible();
  await expect(page.getByText("Rights domain is not connected in this slice.", { exact: true })).toBeVisible();

  await page.getByLabel("Execution format").fill("VERTICAL_PERFORMANCE_STORY");
  await page.getByLabel("Production intent").selectOption("AUTHENTIC");
  await page.getByLabel("Hook type").fill("PERSONAL_LINE");
  await page.getByLabel("Hook text").fill("I did not know how to explain this song when I wrote it.");
  await page.getByLabel("Execution structure").fill("PERSONAL LINE → FIRST VERSE → CHORUS → QUIET CTA");
  await page.getByLabel("Script or performance concept").fill("One honest sentence, then move directly into a live performance with no promotional interruption.");
  await page.getByLabel("Shot list").fill("Locked waist-up personal line\nStay in the same frame for the first verse\nOne restrained closer crop for the chorus");
  await page.getByLabel("Edit brief").fill("Keep natural pauses and breath. No speed ramps or fake reaction cuts.");
  await page.getByLabel("Execution caption").fill("A small part of the story behind this song.");
  await page.getByLabel("Execution CTA").fill("Listen if this feels familiar.");
  await page.getByLabel("Platform notes").fill("INSTAGRAM_REELS: Keep the spoken line inside the safe title area.\nTIKTOK: Keep the same master premise.");
  await page.getByLabel("Feasibility notes").fill("One room, one camera and the existing audio setup are enough.");
  await page.getByLabel("Fallback plan").fill("If the full performance take fails, capture a simpler acoustic version without changing the story premise.");
  await page.getByRole("button", { name: "Save new execution revision" }).click();

  const revision1 = page.locator(".execution-revision-list article").filter({ hasText: "REV 1" });
  await expect(revision1.getByText("DRAFT", { exact: true })).toBeVisible();
  await expect(revision1).toContainText("PERSONAL LINE → FIRST VERSE → CHORUS → QUIET CTA");

  await page.getByRole("button", { name: "Approve execution" }).click();
  await expect(page.getByRole("heading", { name: "Revision 1", exact: true })).toBeVisible();
  await expect(page.locator(".execution-revision-list article").filter({ hasText: "REV 1" }).getByText("APPROVED", { exact: true })).toBeVisible();

  await page.getByLabel("Execution structure").fill("PERSONAL LINE → FIRST VERSE → CHORUS → SILENT END FRAME");
  await page.getByLabel("Edit brief").fill("Revision two removes the CTA cut and holds the final frame for two seconds.");
  await page.getByRole("button", { name: "Save new execution revision" }).click();

  const revision2 = page.locator(".execution-revision-list article").filter({ hasText: "REV 2" });
  await expect(revision2.getByText("DRAFT", { exact: true })).toBeVisible();
  await expect(revision1).toContainText("PERSONAL LINE → FIRST VERSE → CHORUS → QUIET CTA");
  await expect(revision2).toContainText("PERSONAL LINE → FIRST VERSE → CHORUS → SILENT END FRAME");

  const draftReview = page.locator(".execution-review-list .factory-review-row").filter({ hasText: "Revision 2" });
  await draftReview.getByRole("button", { name: "Approve execution" }).click();
  await expect(page.getByRole("heading", { name: "Revision 2", exact: true })).toBeVisible();
  await expect(page.locator(".execution-revision-list article").filter({ hasText: "REV 2" }).getByText("APPROVED", { exact: true })).toBeVisible();
  await expect(page.locator(".execution-revision-list article").filter({ hasText: "REV 1" }).getByText("SUPERSEDED", { exact: true })).toBeVisible();

  const executionResponse = await api.get(`/api/v1/content-factory/units/${contentUnitId}/execution-revisions`);
  expect(executionResponse.status()).toBe(200);
  const execution = await executionResponse.json() as { data: { revisions: Array<{ revisionNumber: number; status: string; snapshot: { structure: string } }> } };
  expect(execution.data.revisions).toEqual(expect.arrayContaining([
    expect.objectContaining({ revisionNumber: 1, status: "SUPERSEDED", snapshot: expect.objectContaining({ structure: "PERSONAL LINE → FIRST VERSE → CHORUS → QUIET CTA" }) }),
    expect.objectContaining({ revisionNumber: 2, status: "APPROVED", snapshot: expect.objectContaining({ structure: "PERSONAL LINE → FIRST VERSE → CHORUS → SILENT END FRAME" }) })
  ]));
});