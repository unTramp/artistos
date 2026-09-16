# Release Lifecycle

- **Status:** REVIEW COMPLETE
- **MASTER references:** §49, §112, §203–206, §223–243, §401, §406
- **Domain:** 05_campaigns_releases
- **Feature slug:** `release-lifecycle`
- **Requirement prefix:** `CMP-REL`

## 2. Purpose
Provide one coherent product lifecycle around a music release while keeping Song, Release metadata, DSP operations, Content and Campaign as distinct concepts.

## 3. User problem / job-to-be-done
Release work begins long before day zero and continues into catalog life. The artist needs the OS to remember context, deadlines, assets, opportunities and post-release learning without implying that launch day determines a song’s destiny.

## 4. Scope
Release creation/reference, association to Song, campaign association, lifecycle phase projection, date changes, extension linkage and transition into catalog. Distribution-provider delivery itself is outside this feature unless handled by future connector.

## 5. Entry points
Song Brain, Campaign, DSP, Distribution, Overview.

## 6. Preconditions and dependencies
Song is typical but architecture must allow future multi-track releases. MASTER lacks a formal Release entity schema; this spec defines behavior, not final persistence.

## 7. Information architecture
Release Overview → Metadata → Timeline → Readiness → DSP → Launch → Momentum → Extensions → Post-launch/learned → Catalog.

## 8. User roles and permissions
MVP user controls lifecycle and dates. Provider-sourced state is read-only unless supported action exists.

## 9. Core data model
Open architecture item: formal Release entity. Product behavior requires stable release identity, relationship to Song(s), release date/status, identifiers/links where available, lifecycle phase and extension relationships.

## 10. Main happy-path workflow
Create/link Release → set planned date → attach Campaign → complete readiness → execute platform tasks → launch → measure early windows → continue post-launch → transition to Catalog while preserving campaign/history.

## 11. Alternative workflows
Date unknown; release postponed; silent/re-upload; release taken down; release extension (acoustic/live/remix); song already released before onboarding; no campaign attached.

## 12. User actions
Create/import/link release, set/change date, mark launched, postpone, cancel, attach campaign, create release extension, open DSP/readiness, archive historical record.

## 13. State model
MASTER defines Song `releaseStatus` field but not enum. Suggested lifecycle semantics: `PLANNED / SCHEDULED / RELEASED / CATALOG / CANCELLED / TAKEN_DOWN`; final enum requires schema decision.

## 14. Business rules
- `CMP-REL-001` Release MUST be distinguishable from Song and Campaign.
- `CMP-REL-002` Release date changes MUST cascade as a planning signal, not silently mutate downstream deadlines.
- `CMP-REL-003` Existing downstream work with old dates MUST be flagged for review after date change.
- `CMP-REL-004` System MUST preserve historical publication/metrics attribution after postponement or re-release.
- `CMP-REL-005` A release MAY exist without an active Campaign.
- `CMP-REL-006` A Campaign MAY reference a Release without owning Release metadata.
- `CMP-REL-007` Release extension MUST preserve `parentReleaseId → releaseId` lineage per MASTER.
- `CMP-REL-008` Remix/acoustic/live/stripped/alt/video/collab extensions MUST have independent status and objective.
- `CMP-REL-009` System MUST NOT hardcode “first 24 hours decide the release”.
- `CMP-REL-010` Release phase transitions MUST be date/evidence aware and user-correctable.
- `CMP-REL-011` Catalog status MUST not mean the OS stops recommending useful evergreen actions.
- `CMP-REL-012` Re-upload/re-release workflows MUST preserve identifiers and prior history when known rather than overwrite them.
- `CMP-REL-013` Platform-specific deadlines come from Capability/DSP knowledge, not universal release constants.
- `CMP-REL-014` Release lifecycle MUST tolerate manual/CSV operation when no distributor integration exists.
- `CMP-REL-015` User must be able to record uncertainty (date TBD, provider state unknown) explicitly.

## 15. AI behavior
AI may identify missing readiness work and propose phase-appropriate actions. It cannot declare provider delivery complete without evidence.

## 16. Human approval
Release date/status mutation, cancellation/takedown record and extension creation are explicit user actions or verified imports.

## 17. Validation
No impossible date ranges; parent extension cannot self-reference; identifiers are not silently regenerated; historical release import may have partial metadata.

## 18. UI states
TBD date, planning, scheduled, released, catalog, postponed, cancelled/taken down, partial provider data, imported historical.

## 19. Edge cases
Timezone around release date; different DSP availability dates; regional delay; re-upload same ISRC; metadata correction; duplicate release records.

## 20. Cross-module effects
Date/phase drives Campaign attention, Calendar, Link Routing, DSP tasks, Website CTA and Momentum Windows.

## 21. Notifications and attention model
Notify only when date change creates real conflicts/deadlines or required readiness remains unresolved.

## 22. Search / filtering / sorting / bulk actions
Filter by phase/status/date/song; deduplication support for imports. Bulk destructive changes not supported.

## 23. Analytics and product telemetry
Track release setup-to-ready time, date changes, readiness gaps and post-release review completion.

## 24. Learning feedback
Post-release evidence feeds Song/Campaign learning but no causal assumption from launch timing alone.

## 25. Auditability / provenance
Date/status/import/provider source history is auditable.

## 26. Desktop / mobile behavior
Desktop full lifecycle; mobile current phase, deadlines and quick status checks.

## 27. Accessibility / usability
Use exact dates and phase names; avoid ambiguous “soon”.

## 28. Security / privacy / rights
Private unreleased metadata/assets remain internal unless explicitly shared.

## 29. Performance / async jobs
Provider/status refresh async; cached lifecycle is always visible with freshness timestamp.

## 30. Acceptance criteria
- `CMP-REL-AC01` Release can be planned with TBD/known date and linked to Song/Campaign.
- `CMP-REL-AC02` Changing release date flags affected downstream plans.
- `CMP-REL-AC03` Release can transition to catalog without loss of history.
- `CMP-REL-AC04` ReleaseExtension lineage is preserved.
- `CMP-REL-AC05` Historical/re-upload release can coexist with partial metadata.
- `CMP-REL-AC06` No UI text implies deterministic 24-hour fate.

## 31. Test matrix
Planned release, postponed release, historical import, same-ISRC reupload, release extension, regional discrepancy, no campaign, provider unavailable.

## 32. Open questions
Formal Release schema; multi-track release scope; semantics of `VIDEO` ReleaseExtension vs DSPVideo/Content asset.

## 33. Traceability
MASTER §49 Song, §112 ReleaseExtension, §230–243 DSP/release operations, §401 E2E Release.
