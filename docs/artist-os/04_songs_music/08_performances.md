# Performances

## 1. Metadata
- **Spec ID:** `SNG-PERF`
- **Domain:** `04_songs_music`
- **Feature:** Song Performances
- **Status:** REVIEW
- **MASTER references:** 104, 110–112, 127–141, 160–190, 242, 406
- **Depends on:** Song; optional ShootSession, Assets, AudioAsset, Content Unit, Publication
- **Used by:** Song Brain, Factory, Production, Content History, DSP Video

## 2. Purpose
Create a song-scoped view of real performances and performance-derived assets/content so Artist OS can reuse authentic source material and distinguish studio/master content from live/acoustic/performance executions.

## 3. User problem / job-to-be-done
**JTBD:** “Show me every meaningful performance of this song, what assets/content came from it, and what can still be reused.”

## 4. Scope
Performance occurrences derived from Shoot/live/content context, linked Assets/Content, performance type/context, quality/selection metadata where owned by production.

Out: a separate duplicate Production model; automatic best-take scoring beyond approved scope.

## 5. Entry points
Song Brain → Performances, ShootSession, Asset ingest, Content History, DSP Video.

## 6. Preconditions and dependencies
Song exists. A performance may be represented via linked ShootSession/Assets/Content rather than a new heavy entity if existing domain lineage suffices.

## 7. Information architecture
Timeline/cards by date/context: live, acoustic, studio session, cover/performance content; linked assets, selected takes, published outputs, reuse status.

## 8. User roles and permissions
Artist controls associations/selections; Production workflow owns take state.

## 9. Core data model
MASTER names `Performances` as Song Brain section but does not define a dedicated Performance entity. Detailed product behavior should prefer a projection over ShootSession/Shot/Asset/Content lineage unless schema audit proves a dedicated entity necessary.

## 10. Main happy-path workflow
1. Shoot/ingest/content lineage identifies a Song performance.
2. Song Brain performance view groups related assets/executions.
3. User confirms/corrects Song association when uncertain.
4. View shows selected takes and derived Content.
5. User can create new derivative/repurposing/content from remaining usable material.
6. Performance metrics remain linked through Publications rather than copied.

## 11. Alternative workflows
Live show recording, home acoustic take, studio one-take, external commissioned performance video, performance with multiple Songs/medley.

## 12. User actions
Confirm/correct song, open Shoot/assets/content, mark context notes, start repurposing, inspect published derivatives.

## 13. State model
Derived from source entities; no separate lifecycle required unless dedicated entity is later justified.

## 14. Business rules
- **SNG-PERF-001** — Performance view SHOULD derive from existing production/asset/content lineage rather than duplicate truth by default.
- **SNG-PERF-002** — Performance association to Song MUST be correctable by human.
- **SNG-PERF-003** — AI ingest suggestion MUST expose confidence.
- **SNG-PERF-004** — Singing identification MUST use audio/timestamp/shot context and not rely solely on speech transcription.
- **SNG-PERF-005** — One ShootSession MAY contain multiple performances/Songs.
- **SNG-PERF-006** — One performance MAY generate multiple Assets and Content Units.
- **SNG-PERF-007** — Published performance metrics MUST remain owned by Publication/Analytics domain.
- **SNG-PERF-008** — Performance view MUST preserve original recording date/context where known.
- **SNG-PERF-009** — An edited/derived Asset MUST retain parent lineage back to source performance material.
- **SNG-PERF-010** — Performance type/context MUST NOT be inferred as fact when uncertain; allow UNKNOWN/custom notes.
- **SNG-PERF-011** — Rights status of commissioned/external performance assets MUST remain visible.
- **SNG-PERF-012** — Performance quality labels from Production (GOOD/SELECTED) MUST not be reinterpreted as audience performance success.
- **SNG-PERF-013** — Artist can retain authentic/imperfect performances even if not highest technical quality.
- **SNG-PERF-014** — Repurposing MUST not destroy or detach original source lineage.
- **SNG-PERF-015** — Archive/delete of derived content MUST not erase source performance history.
- **SNG-PERF-016** — A performance may be usable for multiple Verticals/Platforms without duplicating the source event.
- **SNG-PERF-017** — DSP Video eligibility/pitch status belongs to DSP domain even when sourced from a performance.
- **SNG-PERF-018** — Song Brain MUST show performance history even when no Publication exists.

## 15. AI behavior
Can cluster related performance assets and suggest Song mapping/repurposing. Must show confidence and never auto-delete/reassign high-confidence conflicts without review.

## 16. Human approval
Required for ambiguous Song association, rights override and selected derivative actions.

## 17. Validation
Source entity exists, artist/song ownership, timestamps/context, asset rights.

## 18. UI states
No performances, inferred mapping awaiting review, confirmed, source missing, rights warning, unpublished source-rich state.

## 19. Edge cases
Medley; same Song performed in different key/tempo; external collaborator performance; multiple cameras/audio recorders with offsets.

## 20. Cross-module effects
Links Production/Assets/Repurposing/Content/DSP to Song Brain without owning their states.

## 21. Notifications and attention model
Ambiguous mapping, rights issue, newly ingested source requiring review. No pressure to publish every performance.

## 22. Search / filtering / sorting / bulk actions
Filter date/type/published/reusable/source; sort date/recent ingest. Bulk confirm mappings if confidence/source batch is clear.

## 23. Analytics and product telemetry
Mapping correction rate, repurposing actions, performance source reuse.

## 24. Learning feedback
Performance-derived Content contributes to format/production/song insights through standard Analytics.

## 25. Auditability / provenance
Source grouping/mapping decisions and corrections retained.

## 26. Desktop / mobile behavior
Desktop history/grid; mobile recent performances and quick review.

## 27. Accessibility / usability
Media cards have text metadata; no reliance on thumbnails alone.

## 28. Security / privacy / rights
Unreleased/private performance assets restricted; commissioned rights visible.

## 29. Performance / async jobs
Clustering/mapping/preview generation async; listing cached/structured.

## 30. Acceptance criteria
1. Performance view can work without dedicated Performance entity.
2. One performance links many assets/content.
3. Mapping confidence/correction supported.
4. Publication metrics not duplicated.
5. Repurposing preserves lineage.

## 31. Test matrix
Unit: projection/grouping. Integration: Shoot/Asset/Content. Agent eval: uncertain mapping behavior. E2E: Shoot→ingest→Song performance→derivative.

## 32. Open questions
Whether a dedicated `Performance` entity is required for live-show/setlist/DSP workflows or whether projection + LiveSession/ShootSession suffices. Defer to schema audit.

## 33. Traceability
`SNG-PERF-001–018` → MASTER 104, 110–112, 127–141, 160–190, 242, 406.
