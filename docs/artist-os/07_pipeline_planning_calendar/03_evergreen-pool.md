# Evergreen Pool

- **Status:** REVIEW COMPLETE
- **MASTER references:** §148–150, §127–129, §156
- **Domain:** 07_pipeline_planning_calendar
- **Feature slug:** `evergreen-pool`
- **Requirement prefix:** `PLN-EVG`

## 2. Purpose
Maintain a reusable pool of non-release-dependent content opportunities so the artist can stay meaningfully present between campaign peaks without manufacturing filler.

## 3. User problem / job-to-be-done
Release campaigns naturally produce focus, but between releases artists often either disappear or publish generic low-value content. Evergreen Pool provides remembered, identity-aligned creative lanes and existing reusable opportunities.

## 4. Scope
Evergreen categories from MASTER, candidate ideas/units/series, readiness and reuse status, links to existing Assets/Songs/Narrative, capacity-aware suggestions.

## 5. Entry points
Planning, Calendar empty/flex slot, Factory, Assets atomization, Song history, Weekly Review.

## 6. Preconditions and dependencies
Artist required. Identity strongly preferred; Campaign not required. Existing assets may enrich pool but are not mandatory.

## 7. Information architecture
Category filters → available evergreen opportunities → readiness/effort → source/lineage → “use now / send to Factory / schedule” actions.

## 8. User roles and permissions
Single artist manages pool. AI may suggest candidates; human commits production work.

## 9. Core data model
MASTER defines Evergreen Pool categories but not a first-class `EvergreenItem` entity. Product behavior may project ContentAngles, ContentUnits, RecurringSeries, Assets/Repurposing opportunities and saved prompts into one pool. Schema boundary remains open.

## 10. Main happy-path workflow
System/user identifies evergreen opportunity → tags category/context → stores or links it in pool → when planning has suitable flex capacity, user selects opportunity → creates/opens Angle or ContentUnit → normal Pipeline lifecycle continues.

## 11. Alternative workflows
Existing published concept to repackage; source asset has derivatives; no Song; recurring series episode; spontaneous BTS; archive item; idea becomes campaign-specific later.

## 12. User actions
Add, edit, tag, mark used, snooze, archive, convert to Angle/Unit, link source Asset/Song/Series, duplicate with clear lineage.

## 13. State model
Candidate/Available/In Progress/Used/Archived may be UI projection. Canonical ContentUnit state applies once a unit exists.

## 14. Business rules
- `PLN-EVG-001` Evergreen Pool MUST exist to support continuity, not to enforce posting for its own sake.
- `PLN-EVG-002` MASTER evergreen categories MUST be representable: Performance, Acoustic, BTS, Studio, Personal, Live, Story, Lyric, Editorial Photo, Recurring Series, Community, Voice Note Story, Archive.
- `PLN-EVG-003` Evergreen content MUST still respect active Identity/Era and rights constraints.
- `PLN-EVG-004` Evergreen opportunity MAY be song-linked or song-independent.
- `PLN-EVG-005` Existing Assets and repurposing opportunities SHOULD be preferred when they satisfy goal with lower production effort.
- `PLN-EVG-006` The system MUST distinguish a reusable concept/source from a duplicated publication artifact.
- `PLN-EVG-007` Previous use MUST be visible to avoid accidental repetitive execution.
- `PLN-EVG-008` Stable signature identity elements MUST NOT be treated as repetition failure by themselves.
- `PLN-EVG-009` Saturated execution patterns SHOULD lower recommendation priority but MUST NOT automatically ban a category.
- `PLN-EVG-010` AI SHOULD consider Narrative coverage and production capacity when proposing evergreen opportunities.
- `PLN-EVG-011` AI MUST NOT invent intimate/personal stories to fill evergreen gaps.
- `PLN-EVG-012` “Nothing worth publishing now” is a valid outcome.
- `PLN-EVG-013` Pool membership MUST NOT imply a calendar commitment.
- `PLN-EVG-014` Archive source content must retain lineage when reused.
- `PLN-EVG-015` Pool MUST be usable manually without AI.

## 15. AI behavior
May surface unused assets, underrepresented narrative/pillars, recurring-series ideas and song segments with healthy fatigue signals. Must explain why candidate is evergreen and what asset/work is required.

## 16. Human approval
Adding AI candidate to saved pool can be lightweight; creation of committed ContentUnit and any identity deviation requires normal approval.

## 17. Validation
Linked entities resolve; rights known where actual asset selected; reuse does not overwrite original lineage; duplicate detection warns on near-identical execution.

## 18. UI states
Empty pool, categories with candidates, no suitable low-effort candidates, saturated pattern warning, rights-blocked source, archived item, AI unavailable.

## 19. Edge cases
Old content under archived Identity version; source asset expired license; “evergreen” content suddenly becomes campaign-relevant; repeated acoustic performance with different SongSegment.

## 20. Cross-module effects
Feeds Factory/Pipeline/Calendar. Consumes Assets, Song Brain, Narrative coverage and Fatigue. Usage later contributes Content History.

## 21. Notifications and attention model
No alerts merely because pool is empty. During prolonged non-campaign periods, Overview may gently surface available high-fit evergreen opportunity if rhythm/goal indicates continuity is desired.

## 22. Search / filtering / sorting / bulk actions
Filter category, Song, Narrative, Pillar, required effort, existing asset, previous usage, freshness. Sort by readiness/last-used/effort—not opaque “viral potential.”

## 23. Analytics and product telemetry
Candidate accepted, used, snoozed, archived; source asset reuse; time-to-execution; AI suggestion acceptance.

## 24. Learning feedback
Use/performance may inform content learnings through normal analytics; the pool itself does not promote rules.

## 25. Auditability / provenance
Store source (manual/AI/asset atomization/history), linked originals, identity version and use history.

## 26. Desktop / mobile behavior
Desktop browsing/planning; mobile quick save from Voice Note/Asset and select for a flex slot.

## 27. Accessibility / usability
Make category/effort/status text explicit; avoid visual-only “freshness” indicators.

## 28. Security / privacy / rights
Private voice-note/personal-story candidates remain private. Rights checks required before publishable asset use.

## 29. Performance / async jobs
Pool itself loads synchronously; AI refresh/similarity scan may be async.

## 30. Acceptance criteria
- `PLN-EVG-AC01` Pool supports all MASTER categories.
- `PLN-EVG-AC02` User can use an opportunity without Campaign.
- `PLN-EVG-AC03` Previous usage/lineage is visible.
- `PLN-EVG-AC04` System can legitimately recommend nothing.
- `PLN-EVG-AC05` Reuse preserves rights/identity warnings.

## 31. Test matrix
Empty; manual item; AI candidate; existing asset derivative; no Song; expired rights; high fatigue; archived Identity source; AI outage.

## 32. Open questions
Whether a dedicated EvergreenItem entity is necessary or Pool should remain a query/projection over existing entities.

## 33. Traceability
MASTER §127–129, §148–150, §156.
