# Metric Snapshots

- **Status:** REVIEW COMPLETE
- **MASTER references:** §288–290, §373
- **Domain:** 14_analytics
- **Feature slug:** `snapshots`
- **Requirement prefix:** `ANA-SNP`

## 2. Purpose
Store time-indexed metric observations for Publications so performance can be compared at equivalent ages without overwriting history.

## 3. User problem / job-to-be-done
A post’s 30-day total cannot be fairly compared with another post after six hours. The OS needs snapshots over time and explicit observation age.

## 4. Scope
### In scope
- MetricSnapshot entity
- preferred 1h/6h/24h/72h/7d/30d ages where available
- actual observedAt
- derived metrics
- dedupe

### Out of scope / non-goals
- fabricating missing snapshot ages
- continuous high-frequency scraping

## 5. Entry points
- Analytics import
- Publication detail
- provider refresh

## 6. Preconditions and dependencies
- Publication
- platform adapter/export
- normalized fields

## 7. Information architecture
Receive/import observation → resolve Publication/platform → record observedAt and metrics → calculate derived values → dedupe same source snapshot → compare at nearest valid age with tolerance disclosed.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER `MetricSnapshot` and preferred snapshot ages; actual platform availability has priority.

## 10. Main happy-path workflow
1. Inspect publication timeline
2. import new snapshot
3. compare age-aligned observations
4. open raw source

## 11. Alternative workflows
- only 24h/7d available
- late import represents current totals
- provider backfills earlier data
- publication time unknown

## 12. User actions
- import
- exclude corrupt snapshot
- relink publication with audit

## 13. State model
Snapshots append over time; correction uses provenance rather than overwriting without trace.

## 14. Business rules
- `ANA-SNP-001` ObservedAt MUST represent when the metric state was observed/reported, not automatically the Publication publishedAt.
- `ANA-SNP-002` Preferred snapshot ages are targets, not fabricated requirements.
- `ANA-SNP-003` If 6h data is unavailable, OS MUST not estimate it silently from 24h.
- `ANA-SNP-004` Age-aligned comparisons MUST disclose tolerance/actual age.
- `ANA-SNP-005` Metric snapshots MUST attach to a Publication/platform context.
- `ANA-SNP-006` Duplicate detection SHOULD use platform/publication/snapshot/source keys.
- `ANA-SNP-007` Backfilled/provider-corrected values MUST retain provenance.
- `ANA-SNP-008` Derived metrics MUST be recomputable from snapshot inputs/formula version where possible.
- `ANA-SNP-009` Deleted external publication does not delete historical snapshots.
- `ANA-SNP-010` NULL metric stays NULL in snapshot history.

## 15. AI behavior
AI may summarize trajectory, but storage/computation is deterministic.

## 16. Human approval
Exclusion/relink/correction requires audited user/admin action.

## 17. Validation
- observedAt valid
- publication reference valid
- metric units valid
- duplicate key checked

## 18. UI states
- single snapshot
- growing timeline
- late/stale
- corrected
- external post unavailable

## 19. Edge cases
- unknown publishedAt
- provider backfill
- snapshot clock timezone
- repost linked incorrectly

## 20. Cross-module effects
- Publications
- Baselines
- Outliers
- Insights

## 21. Notifications and attention model
- snapshot import stale for active campaign
- duplicate/conflict

## 22. Search / filtering / sorting / bulk actions
Filter by age/period/platform/publication. Bulk import supported.

## 23. Analytics and product telemetry
- snapshot imported
- duplicate prevented
- correction recorded

## 24. Learning feedback
Snapshot trajectories are raw evidence for insights.

## 25. Auditability / provenance
Preserve source/import mapping/formula versions.

## 26. Desktop / mobile behavior
Desktop timeline; mobile latest trajectory summary.

## 27. Accessibility / usability
Show actual age/timestamp, not only “24h” bucket label.

## 28. Security / privacy / rights
No additional PII required.

## 29. Performance / async jobs
Import/aggregation background jobs.

## 30. Acceptance criteria
- `ANA-SNP-AC01` Unavailable 6h point is not estimated.
- `ANA-SNP-AC02` ObservedAt remains distinct from publishedAt.
- `ANA-SNP-AC03` External deletion preserves snapshots.
- `ANA-SNP-AC04` Duplicate snapshot does not double count.

## 31. Test matrix
- single snapshot
- backfill
- late import
- deleted post

## 32. Open questions
- Age-bucket tolerance/default comparison policy needs analytical calibration.

## 33. Traceability
MASTER §288–290, §373
