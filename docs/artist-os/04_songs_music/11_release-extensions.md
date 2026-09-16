# Release Extensions

## 1. Metadata
- **Spec ID:** `SNG-EXT`
- **Domain:** `04_songs_music`
- **Feature:** Release Extensions
- **Status:** REVIEW
- **MASTER references:** 49, 110–112, 112, 226–237, 242–243, 406
- **Depends on:** Song/Release records; optional Audio/Assets/Campaign/DSP
- **Used by:** Campaigns, DSP, Song Brain, Content strategy, Analytics

## 2. Purpose
Model intentional alternate release versions—acoustic, live, remix, stripped, video, collaboration—as related extensions rather than disconnected catalog items.

## 3. User problem / job-to-be-done
**JTBD:** “Let me extend the life of a song with alternate versions while the system remembers what they are related to, why we made them, and how they performed separately.”

## 4. Scope
Parent-child release relation, extension type/objective/status, navigation and planning context.

Out: release cadence rules, DSP metadata submission implementation, rights clearance/royalty accounting.

## 5. Entry points
Song Brain → Release Extensions, Release plan, DSP, Campaign, Audio/Performance context.

## 6. Preconditions and dependencies
Parent Release/Song context and child Release record. MASTER uses `parentReleaseId` + `releaseId`; exact Release entity is expected in Campaign/Release domain.

## 7. Information architecture
Extension tree/list with type, objective, status, release date, campaign, assets, DSP readiness, performance summary.

## 8. User roles and permissions
Artist creates/links extension and objective. Metadata publishing remains Distribution/DSP controlled.

## 9. Core data model
MASTER `ReleaseExtension`:
```text
type: REMIX|ACOUSTIC|LIVE|STRIPPED|ALT_VERSION|VIDEO|COLLAB
parentReleaseId
releaseId
objective
status
```

## 10. Main happy-path workflow
1. User opens parent Song/Release.
2. Chooses `Create/Link Release Extension`.
3. Selects type and objective.
4. Creates or links child Release.
5. Adds relevant Audio/Performance/Assets through owning domains.
6. Plans Campaign/DSP readiness separately.
7. After release, analytics remain distinguishable from parent while relationship is visible.

## 11. Alternative workflows
Existing alternate version already released; video extension without separate audio release; collaboration with rights/metadata complexity; live version from existing performance.

## 12. User actions
Create/link/unlink (with history safety), edit type/objective/status, open child release/campaign/DSP, compare performance.

## 13. State model
Uses generic `status` field not enumerated in MASTER; lifecycle should align with child Release lifecycle rather than invent contradictory states.

## 14. Business rules
- **SNG-EXT-001** — Every ReleaseExtension MUST link a parent Release and child Release.
- **SNG-EXT-002** — Type MUST use MASTER enum.
- **SNG-EXT-003** — Parent and child MUST remain distinct releases/entities; extension relation does not merge metadata/performance.
- **SNG-EXT-004** — Objective MUST be stored explicitly rather than inferred from type.
- **SNG-EXT-005** — Extension relation MUST NOT imply a universal release timing/cadence.
- **SNG-EXT-006** — Acoustic/remix-after-N-days patterns MUST remain experiments/strategy choices, not hardcoded rules.
- **SNG-EXT-007** — Extension analytics MUST remain separable from parent release analytics.
- **SNG-EXT-008** — Catalog-level rollup MAY show combined family performance if clearly labeled.
- **SNG-EXT-009** — Child Release may have its own Campaign, DSP plan, artwork and Identity context.
- **SNG-EXT-010** — Historical parent-child relation SHOULD remain stable after publication.
- **SNG-EXT-011** — Relinking published extension to another parent requires explicit review/audit.
- **SNG-EXT-012** — `VIDEO` type MUST not imply a separate audio release if product model permits video-only extension; exact Release relationship must be clarified by Release domain.
- **SNG-EXT-013** — Collaboration extension MUST surface rights/credits/metadata dependencies without inventing them.
- **SNG-EXT-014** — LIVE extension may originate from Performance lineage and should preserve source relation.
- **SNG-EXT-015** — Extension creation MUST NOT duplicate parent Song Brain wholesale.
- **SNG-EXT-016** — Shared song meaning/lyrics can be referenced, while version-specific audio/visual/identity notes remain scoped.
- **SNG-EXT-017** — Platform eligibility/opportunities for the extension come from DSP/Capability Registry, not hardcoded assumptions.
- **SNG-EXT-018** — AI can propose extension ideas/objectives but MUST NOT claim that releasing one will guarantee algorithmic lift.
- **SNG-EXT-019** — User can choose not to create extensions; system must not treat catalog without remixes/acoustics as incomplete.
- **SNG-EXT-020** — Extension family must remain navigable/exportable for historical analysis.

## 15. AI behavior
May propose candidate extension based on creative assets, campaign objective, audience evidence and capacity, with explicit rationale/cost/opportunity. No guaranteed DSP/algorithm claims.

## 16. Human approval
Required for create/link/relink and strategic objective.

## 17. Validation
Parent≠child, valid type, artist/release ownership/permissions, duplicate/circular relation detection.

## 18. UI states
No extensions, planned/linked, released, historical, relation conflict, missing child metadata.

## 19. Edge cases
Multiple remixes; child could conceptually relate to multiple parents (medley/remix); video-only release; same recording distributed with new metadata.

## 20. Cross-module effects
Campaign/DSP/Distribution handle operational release lifecycle. Song Brain shows family context.

## 21. Notifications and attention model
Release readiness/deadline belongs to Release/DSP; relation conflicts may surface here.

## 22. Search / filtering / sorting / bulk actions
Filter type/status/date; sort chronological/type. No bulk relinking.

## 23. Analytics and product telemetry
Extension creation, type/objective, family navigation and strategy proposal acceptance.

## 24. Learning feedback
Extension outcomes can generate cadence/version hypotheses scoped appropriately.

## 25. Auditability / provenance
Relation creation/relink, objective, source performance/audio context.

## 26. Desktop / mobile behavior
Desktop tree/detail; mobile compact family list.

## 27. Accessibility / usability
Parent/child relationship explicit text; not inferred from indentation alone.

## 28. Security / privacy / rights
Collaboration/unreleased rights metadata protected as needed.

## 29. Performance / async jobs
Structured relation immediate; analytics/asset processing async.

## 30. Acceptance criteria
1. Parent and child remain separate releases.
2. Type/objective explicit.
3. No cadence law is hardcoded.
4. Analytics can separate child vs family rollup.
5. Performance/live source lineage preserved.
6. AI cannot promise algorithmic benefit.

## 31. Test matrix
Unit: relation/type/cycle validation. Integration: Release/DSP/Performance. Agent eval: no guaranteed lift. E2E: parent→live extension→campaign→analytics.

## 32. Open questions
1. Formal `Release` entity schema is not defined in MASTER core model excerpt; Campaign/Release detailed pass must freeze it.
2. Semantics of `VIDEO` extension with required `releaseId` need clarification in Release/DSP schema.

## 33. Traceability
`SNG-EXT-001–020` → MASTER 49, 110–112, 226–243, 406.
