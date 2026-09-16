# Song Library

## 1. Metadata
- **Spec ID:** `SNG-LIB`
- **Domain:** `04_songs_music`
- **Feature:** Song Library
- **Status:** REVIEW
- **MASTER references:** 48–49, 103–112, 354–356, 403, 406
- **Depends on:** Artist
- **Used by:** Song Brain, Campaigns, Content Factory, Production, DSP, Analytics

## 2. Purpose
Provide the canonical operational catalog of songs and song-related projects in Artist OS, with clear ownership, release state and fast entry into each Song Brain.

## 3. User problem / job-to-be-done
**JTBD:** “Give me one reliable place to see every song I am working with, its current lifecycle state, what is ready, and what knowledge/content/history belongs to it.”

## 4. Scope
Create/import song records, browse/filter/search, identify originals vs covers, show release state/date, basic metadata/readiness summaries and open Song Brain.

Out: full release campaign management, DSP readiness, audio file editing, rights clearance engine.

## 5. Entry points
Primary navigation `/songs`, Command Palette `Add Song`, Campaign/Shoot/Factory song pickers, Overview contextual links.

## 6. Preconditions and dependencies
Artist exists. Song may be created with minimal metadata and enriched progressively.

## 7. Information architecture
Recommended views: list/table + optional cards.
Columns/cards may include title, original/cover, language, release status/date, current campaign, content count, recent activity, key readiness warnings.

Local actions: New Song, Import/Link Release where supported, filters, search.

## 8. User roles and permissions
Single-artist MVP full control. Destructive delete should be restricted once lineage exists; archive preferred.

## 9. Core data model
MASTER `Song`:
```text
id
artistId
title
type
originalArtist?
isOriginal
releaseStatus
releaseDate?
genre
mood
language
story
meaning
lyricsReference
isrc?
upc?
platformLinks
createdAt
```
Library reads derived counts/readiness without duplicating source-of-truth fields.

## 10. Main happy-path workflow
1. User opens Songs.
2. Searches/browses catalog.
3. Chooses `Add Song`.
4. Enters minimal title + original/cover status.
5. Optionally adds metadata/release date/IDs.
6. Saves Song.
7. System creates Song Brain namespace.
8. User opens Song detail and progressively adds story, lyrics, segments, audio and identity context.

## 11. Alternative workflows
Create unreleased demo; create cover with original artist; import already-released catalog item; catalog song with unknown ISRC/UPC; add song before Identity exists.

## 12. User actions
Create, edit basic metadata, archive, search/filter/sort, open detail, start Campaign/Content/Shoot from Song context.

## 13. State model
Song lifecycle is primarily expressed via `releaseStatus`; exact enum is not frozen in MASTER. Song catalog availability may additionally use archive semantics without conflating archive with release status.

## 14. Business rules
- **SNG-LIB-001** — Every Song MUST belong to one Artist.
- **SNG-LIB-002** — Song Library MUST support both original songs and non-original/cover material.
- **SNG-LIB-003** — `originalArtist` MUST remain available when `isOriginal=false` and MUST NOT be fabricated when unknown.
- **SNG-LIB-004** — A Song MAY exist before a release date, ISRC, UPC or platform links are known.
- **SNG-LIB-005** — Missing metadata MUST be shown as missing/unknown, not inferred silently.
- **SNG-LIB-006** — Creating a Song MUST establish a distinct Song Brain namespace.
- **SNG-LIB-007** — Song Brain knowledge MUST NOT be copied wholesale into Artist Brain.
- **SNG-LIB-008** — Catalog archive MUST preserve Content, Asset, Publication, Experiment, Learning and Decision lineage.
- **SNG-LIB-009** — Hard delete SHOULD be unavailable once dependent lineage exists unless explicit destructive workflow is introduced.
- **SNG-LIB-010** — Release status and catalog archive status MUST remain conceptually separate.
- **SNG-LIB-011** — Search MUST support at minimum title and original artist where present.
- **SNG-LIB-012** — Filters SHOULD support release state, original/cover, language and relevant date range.
- **SNG-LIB-013** — Library summaries MUST derive counts/readiness from owning domains and MUST NOT duplicate mutable truth.
- **SNG-LIB-014** — A Song can participate in multiple Campaigns over time.
- **SNG-LIB-015** — A Song can have multiple Audio Assets and Release Extensions.
- **SNG-LIB-016** — ISRC/UPC conflicts or duplicates MUST be surfaced for review rather than silently merged.
- **SNG-LIB-017** — Platform links are references, not proof that metadata/artist mapping is correct on the platform.
- **SNG-LIB-018** — The Library MUST remain useful with no AI provider available.
- **SNG-LIB-019** — Song ordering MUST NOT imply artistic or performance ranking by default.
- **SNG-LIB-020** — User must be able to create an incomplete Song and continue later without blocking core workflow.

## 15. AI behavior
AI optional: metadata suggestions from user-supplied assets/transcripts may be proposed with provenance. It must not invent credits, rights, IDs, release dates or factual song history.

## 16. Human approval
All identity/metadata changes saved by user; AI suggestions require acceptance. Archive/delete explicit.

## 17. Validation
Title required; artist ownership; ISRC/UPC format validation where entered; releaseDate consistency; cover/original metadata consistency.

## 18. UI states
First-use empty state, partial catalog, search no results, incomplete metadata, duplicate warning, archived filter, provider unavailable.

## 19. Edge cases
Same title for multiple songs; alternate release with same composition; cover of song with uncertain attribution; catalog import duplicates.

## 20. Cross-module effects
Song creation enables Song Brain, Campaign, Factory, Shoots and DSP planning. Archive removes from default new-work pickers but preserves history.

## 21. Notifications and attention model
Only actionable metadata/readiness conflicts; no reminders merely because a Song is inactive.

## 22. Search / filtering / sorting / bulk actions
Search title/original artist; filters above; sort title/recent/release date/status. Bulk archive/tag only if safe and auditable.

## 23. Analytics and product telemetry
Time to first Song, incomplete→enriched progression, search/filter usage, duplicate resolution.

## 24. Learning feedback
None directly; Library is catalog/entry layer. Song-specific learnings live in Song Brain/Intelligence.

## 25. Auditability / provenance
Metadata changes, merges/duplicate resolutions, archive and AI suggestions retain actor/source/time.

## 26. Desktop / mobile behavior
Desktop richer table. Mobile searchable list and quick add/open.

## 27. Accessibility / usability
Keyboard search/navigation, clear status text, no color-only readiness.

## 28. Security / privacy / rights
Private/unreleased Song records remain internal; platform links/metadata exported only through explicit workflows.

## 29. Performance / async jobs
Library loads structured DB data without AI. Heavy import/enrichment via JobService.

## 30. Acceptance criteria
1. User can create incomplete original or cover Song.
2. Song Brain namespace exists after creation.
3. Missing metadata is explicit.
4. Archive preserves lineage.
5. Duplicate IDs are warned, not silently merged.
6. Library works without AI.

## 31. Test matrix
Unit: metadata validation. Integration: archive/lineage, duplicate IDs. E2E: create Song→open Brain. Manual: search/filter/mobile.

## 32. Open questions
Exact `Song.releaseStatus` enum is not defined in MASTER and must be resolved during schema/product lifecycle pass.

## 33. Traceability
`SNG-LIB-001–020` → MASTER 48–49, 103–112, 354–356, 403, 406.
