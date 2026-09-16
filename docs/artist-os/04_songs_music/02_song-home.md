# Song Detail / Song Brain

## 1. Metadata
- **Spec ID:** `SNG-HOME`
- **Domain:** `04_songs_music`
- **Feature:** Song Detail / Song Brain Home
- **Status:** REVIEW
- **MASTER references:** 49, 103–112, 113–126, 138–141, 187, 406, 449–455
- **Depends on:** Song; optional Identity, Campaign, Assets, Content, Metrics
- **Used by:** Factory, Production, Campaigns, DSP, Analytics, Context Assembler

## 2. Purpose
Provide the canonical contextual workspace for one song, combining its meaning, lyrics, key segments, audio, identity context, performances, content history, experiments and learnings without duplicating global Artist knowledge.

## 3. User problem / job-to-be-done
**JTBD:** “When I work on this song, give me everything the system knows specifically about this song — and only what is relevant — so I do not repeatedly reconstruct its story, best moments, assets and past experiments.”

## 4. Scope
Song summary, Brain section navigation, release/context summary, current opportunities/warnings, recent content/performance, active experiments and song-scoped learnings.

Out: replacing domain-specific editors; copying full Artist Identity/Brain into Song record.

## 5. Entry points
`/songs/:id`, Song Library, Factory, Campaign, DSP, Asset/content contextual links.

## 6. Preconditions and dependencies
Song exists. Song Brain progressively becomes richer; no minimum completeness required for viewing.

## 7. Information architecture
Recommended tabs/sections:
`Overview | Story & Meaning | Lyrics | Segments | Audio | Identity Context | Performances | Content History | Experiments & Learnings | Release Extensions`

Overview blocks:
- core metadata/release state;
- Story/Meaning summary;
- active Identity/Era context;
- key segments;
- available audio;
- current Campaign/Release context;
- recent content;
- active experiments;
- validated song learnings;
- readiness/attention.

## 8. User roles and permissions
Artist controls truth-bearing meaning/interpretation and sensitive material. Future collaborators may edit operational metadata subject to permissions.

## 9. Core data model
Song Brain is a namespace/view over structured entities rather than one giant JSON document. It reads Song plus related Story/Interpretation records, SongSegments, AudioAssets/Usage, SongIdentityContext, Content/Assets, Experiments/Learnings and Decisions.

## 10. Main happy-path workflow
1. User opens Song.
2. System assembles structured overview without waiting for AI.
3. Missing Brain sections display next-best action.
4. User opens or edits a section.
5. Cross-module actions inherit `songId` automatically.
6. Strategy/Factory asks Context Assembler for relevant Song summary rather than the entire Brain.
7. New content/metrics/experiments update history and evidence views.

## 11. Alternative workflows
Brand-new Song; catalog song with years of content; cover; unreleased demo; Song with archived Identity context; Song with multiple release extensions.

## 12. User actions
Edit metadata, add story/lyrics/segments/audio/context, start content/campaign/shoot/experiment, inspect history/learnings, export allowed summary.

## 13. State model
Brain completeness is sectional, not a single score. Sections may be `EMPTY | PARTIAL | READY | REVIEW_REQUIRED` as view states; do not fabricate a universal Song Brain score.

## 14. Business rules
- **SNG-HOME-001** — Each Song MUST have its own knowledge namespace.
- **SNG-HOME-002** — Song Brain MUST NOT duplicate the complete Artist Identity/Artist Brain as song-owned truth.
- **SNG-HOME-003** — Song-specific context MUST reference the Identity Version/Era it uses.
- **SNG-HOME-004** — Song Brain MUST preserve FACT vs ARTIST_INTERPRETATION vs AUDIENCE_INTERPRETATION distinctions where interpretation is involved.
- **SNG-HOME-005** — Song Brain MUST remain usable when most sections are empty.
- **SNG-HOME-006** — Missing section data MUST produce contextual onboarding, not fake completion values.
- **SNG-HOME-007** — Overview MUST derive recent Content/Asset/Experiment/Learning data from owning domains rather than duplicate it.
- **SNG-HOME-008** — Historical Content MUST remain linked to the Identity Version/Era used at creation where lineage exists.
- **SNG-HOME-009** — Context Assembler MUST select relevant Song Brain material for tasks rather than load all song history by default.
- **SNG-HOME-010** — Song Brain summaries used by AI MUST preserve source/provenance and protected disclosure rules.
- **SNG-HOME-011** — Validated song-specific Learnings MUST be distinguishable from generic external heuristics.
- **SNG-HOME-012** — A Song-specific Learning MUST NOT automatically become ARTIST_GLOBAL.
- **SNG-HOME-013** — Audience interpretations MUST NOT overwrite artist-confirmed meaning.
- **SNG-HOME-014** — Content success/failure MUST NOT rewrite Song meaning automatically.
- **SNG-HOME-015** — Song Brain MUST link to, not replace, Campaign and Release lifecycle domains.
- **SNG-HOME-016** — Derived “key segment” or “best segment” labels MUST expose whether they are artist-selected, usage-based or evidence-based.
- **SNG-HOME-017** — Overview MUST avoid presenting one metric as the song's overall quality.
- **SNG-HOME-018** — Song Brain MUST support original and cover workflows without assuming identical rights/meaning ownership.
- **SNG-HOME-019** — Cross-module create actions launched from Song MUST prefill `songId` but allow user to change context where valid.
- **SNG-HOME-020** — Brain history MUST remain exportable in structured/Markdown form under portability rules.

## 15. AI behavior
AI can summarize Song Brain, surface missing knowledge, propose content questions and retrieve relevant evidence. It cannot invent artist meaning, rights, IDs or audience claims.

## 16. Human approval
Truth-bearing Story/Meaning/Interpretation and permanent Candidate Knowledge promotion require human approval.

## 17. Validation
Song ownership, linked entity integrity, Identity/Era references, protected data filtering.

## 18. UI states
New/empty Brain, partial, mature, archived Identity context, stale analytics, conflicting interpretations, AI unavailable.

## 19. Edge cases
Cover where artist has personal interpretation; alternate version with changed arrangement; lyrics unavailable; Song renamed after release; multiple ISRCs across versions.

## 20. Cross-module effects
Song Brain is major input to Context Assembler, Factory, Production, Campaign and Analytics; it should not own their state.

## 21. Notifications and attention model
Actionable missing release readiness, unresolved factual conflict, active experiment result, stale/contradictory learning. No completeness nagging for optional sections.

## 22. Search / filtering / sorting / bulk actions
Search within Brain history/transcripts/notes where available; local filters in content/experiment subsections.

## 23. Analytics and product telemetry
Section usage, time to first meaningful Brain, AI summary acceptance, cross-module actions.

## 24. Learning feedback
Song-specific evidence returns to scoped Song Learnings/Decisions and can influence future strategy through Context Assembler.

## 25. Auditability / provenance
All truth-bearing edits and AI summaries retain source/actor/version.

## 26. Desktop / mobile behavior
Desktop full workspace; mobile overview, capture/edit, key segments/audio/content quick access.

## 27. Accessibility / usability
Clear section hierarchy, keyboard tabs, labels for source/type/confidence.

## 28. Security / privacy / rights
Unreleased lyrics/story/private interpretation remain internal unless explicitly used/exported.

## 29. Performance / async jobs
Overview from DB/cache. AI summaries/transcription/analysis async.

## 30. Acceptance criteria
1. Brain works with empty sections.
2. Artist vs audience interpretation remain distinct.
3. AI context uses selected relevant Brain material, not entire corpus.
4. Historical lineage preserved.
5. Song learning stays song-scoped unless explicitly promoted.
6. No global song quality score.

## 31. Test matrix
Unit: scoped summaries/visibility. Integration: Context Assembler, Content history. Agent eval: no invented meaning. E2E: Song→Brain→Factory→metrics→Learning.

## 32. Open questions
Whether Brain section readiness should be persisted or fully derived; prefer derived until a workflow proves persistence useful.

## 33. Traceability
`SNG-HOME-001–020` → MASTER 49, 103–112, 113–126, 138–141, 187, 406, 449–455.
