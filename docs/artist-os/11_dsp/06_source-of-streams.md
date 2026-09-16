# Source of Streams & Discovery Channels

- **Status:** REVIEW COMPLETE
- **MASTER references:** §231–235, §287–300, §401
- **Domain:** 11_dsp
- **Feature slug:** `source-of-streams`
- **Requirement prefix:** `DSP-SRC`

## 2. Purpose
Normalize and explain where DSP streams/listeners are reported to originate, so release/catalog discovery can be monitored without pretending closed algorithms are understood causally.

## 3. User problem / job-to-be-done
Raw stream totals hide whether listening comes from profile, listener playlists, editorial, algorithmic surfaces, radio, autoplay or search. Artists need source mix and changes over time to understand distribution patterns.

## 4. Scope
### In scope
- MASTER Source of Streams categories
- DiscoveryChannelPerformance
- release/window/platform breakdown
- stream/listener distributions where available
- imports/manual mapping
- trend/context

### Out of scope / non-goals
- reverse-engineering proprietary algorithms
- causal claims about why algorithm promoted a track
- cross-DSP metric equivalence without context

## 5. Entry points
- DSP home
- Release analytics
- Song Brain content history
- Analytics

## 6. Preconditions and dependencies
- DSP export/API/import
- Release/Song
- Momentum window
- canonical metric normalization

## 7. Information architecture
Import/map DSP source data → validate category/period → show totals and source mix → compare momentum windows/periods with sample context → create qualified observations/insights.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER Source categories: PROFILE, LISTENER_PLAYLIST, EDITORIAL, ALGORITHMIC, RADIO, AUTOPLAY, SEARCH, OTHER. DiscoveryChannelPerformance stores streams/listeners distribution where source allows.

## 10. Main happy-path workflow
1. Import or refresh source-of-streams data
2. Map provider labels to canonical categories transparently
3. Validate period/release/platform
4. Show stream/listener distribution and missing categories
5. Compare against earlier period/window
6. Send evidence to Analytics/Insight workflow

## 11. Alternative workflows
- DSP export only exposes some sources
- provider category combines radio/autoplay
- historical schema changes
- no listener count for source
- catalog aggregate cannot be assigned to single song

## 12. User actions
- import
- inspect mapping
- change mapping template
- filter period/release
- export normalized aggregates
- create observation

## 13. State model
Imported snapshots/history are append/replace according to deterministic import key. No destructive recalculation of source data without mapping/version provenance.

## 14. Business rules
- `DSP-SRC-001` Canonical source categories MUST use MASTER enum.
- `DSP-SRC-002` Provider-specific categories MUST retain raw label and mapping provenance.
- `DSP-SRC-003` Unknown/unmappable source MUST map to OTHER or remain provider-specific metadata rather than be guessed.
- `DSP-SRC-004` Missing source categories MUST be NULL/unknown, not zero unless the export explicitly states zero.
- `DSP-SRC-005` ALGORITHMIC/RADIO/AUTOPLAY labels describe reported source categories, not proof of platform rationale.
- `DSP-SRC-006` Source mix MUST be presented with absolute sample size/totals and period.
- `DSP-SRC-007` Comparisons SHOULD use same platform/source schema when possible and flag mapping/schema discontinuities.
- `DSP-SRC-008` Release Momentum Windows MAY organize views but MUST NOT imply first-day deterministic fate.
- `DSP-SRC-009` DSP source metrics MUST not be raw-ranked against social views.
- `DSP-SRC-010` AI MUST use association/observation language unless stronger evidence exists.
- `DSP-SRC-011` Import deduplication MUST protect repeated CSV/API loads.
- `DSP-SRC-012` Historical raw/imported evidence SHOULD be retained or reproducible after mapping-template changes.

## 15. AI behavior
Analytics Agent can summarize source shifts, sample sizes and uncertainty, and propose hypotheses such as “radio share increased after X period.” It cannot claim X caused algorithmic promotion absent experiment/evidence.

## 16. Human approval
Mapping corrections and Insight promotion are human-reviewable; raw import can process automatically under saved mapping templates.

## 17. Validation
- period valid
- release/song scope valid
- mapping template explicit
- totals internally coherent when source provides total
- duplicates handled

## 18. UI states
- no data
- partial categories
- mapped
- mapping warning
- schema changed
- stale import

## 19. Edge cases
- source categories overlap
- late backfill
- track relink/re-upload
- DSP changes terminology
- country breakdown missing

## 20. Cross-module effects
- Analytics
- Release Momentum
- Song Brain
- Experiments/Learnings
- CSV Wizard

## 21. Notifications and attention model
- active release data stale
- mapping schema changed
- unexpected source total mismatch

## 22. Search / filtering / sorting / bulk actions
Filter platform/release/song/period/source/window. Bulk import uses saved mapping templates with preview/validation.

## 23. Analytics and product telemetry
- import succeeded/failed
- mapping overridden
- source observation created
- schema discontinuity flagged

## 24. Learning feedback
Feeds Insights/Hypotheses, with no direct rule promotion. Repeated patterns across releases can gain confidence through shared Learning workflow.

## 25. Auditability / provenance
Preserve source file/provider, raw labels, mapping version, import time and corrections.

## 26. Desktop / mobile behavior
Desktop charts/table analysis; mobile concise source mix/trend summary.

## 27. Accessibility / usability
Charts expose exact counts/periods and accessible table view. OTHER/unknown semantics are explained.

## 28. Security / privacy / rights
No PII expected; imported files may contain sensitive commercial data and follow secure storage/export policies.

## 29. Performance / async jobs
CSV/API import asynchronous for large files, idempotent and restartable.

## 30. Acceptance criteria
- `DSP-SRC-AC01` Raw provider label is preserved.
- `DSP-SRC-AC02` Missing source is not converted to zero.
- `DSP-SRC-AC03` ALGORITHMIC is not presented as causal explanation.
- `DSP-SRC-AC04` Repeated import is deduplicated.
- `DSP-SRC-AC05` Source mix includes period/sample context.

## 31. Test matrix
- partial export
- schema change
- duplicate import
- re-uploaded track
- category mismatch
- late backfill

## 32. Open questions
- Canonical DiscoveryChannelPerformance persistence shape and snapshot granularity need Analytics/schema alignment.

## 33. Traceability
MASTER §231–235, §287–300, §401
