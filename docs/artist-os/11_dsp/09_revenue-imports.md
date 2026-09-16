# DSP Revenue Imports

- **Status:** REVIEW COMPLETE
- **MASTER references:** §243–244, §264–286, §371–377
- **Domain:** 11_dsp
- **Feature slug:** `revenue-imports`
- **Requirement prefix:** `DSP-REV`

## 2. Purpose
Import reported streaming royalties and derive historical effective rates from actual statements instead of applying a universal per-stream estimate.

## 3. User problem / job-to-be-done
Artists commonly see misleading “Spotify pays X per stream” calculators. Actual royalties vary by platform, territory, period and rights/accounting context. The OS should ground business planning in reported statements.

## 4. Scope
### In scope
- DSPRevenueSnapshot
- royalty statement import/mapping
- reported royalty/currency/streams/period
- effective historical revenue per 1000 streams
- data provenance
- Business handoff

### Out of scope / non-goals
- tax/accounting
- forecast guarantee
- universal royalty rate
- rights-split accounting unless explicit future scope

## 5. Entry points
- DSP home
- Business Revenue
- CSV Wizard/import
- Release/Song analytics where attribution available

## 6. Preconditions and dependencies
- royalty statement/export
- platform/period/currency mapping
- canonical finance terminology
- exchange conversion only if explicitly sourced/configured

## 7. Information architecture
Upload/import statement → detect/map fields → preview/validate → import reported royalty/streams/period → calculate effective historical rate only where denominator valid → show trend/context → hand aggregate evidence to Business.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER `DSPRevenueSnapshot {platform, period, streams, reportedRoyalty, currency, effectiveRevenuePer1000Streams}`. More granular song/territory/right-type rows may remain source records pending schema scope.

## 10. Main happy-path workflow
1. Upload statement/export
2. System detects source and mapping template
3. User validates period/platform/currency/amount/stream denominator
4. Import idempotently
5. System computes effectiveRevenuePer1000Streams when meaningful
6. Review historical rates without extrapolating certainty
7. Link totals to Business revenue evidence

## 11. Alternative workflows
- statement has royalty but no streams
- multiple currencies
- reporting period differs from consumption period
- distributor aggregates several DSPs
- negative adjustment/correction

## 12. User actions
- upload
- map fields
- save mapping template
- exclude invalid row
- record adjustment note
- export normalized snapshots

## 13. State model
Imported snapshots are historical evidence. Corrections create corrected/import-version provenance rather than silently rewriting source statement.

## 14. Business rules
- `DSP-REV-001` Streaming revenue MUST use reported royalty statements as evidence when available.
- `DSP-REV-002` OS MUST NOT multiply streams by a fixed universal per-stream rate as factual revenue.
- `DSP-REV-003` EffectiveRevenuePer1000Streams MUST be labelled historical/effective and calculated only from compatible reported royalty and stream denominators.
- `DSP-REV-004` If stream denominator is missing/incompatible, effective rate MUST be NULL rather than estimated silently.
- `DSP-REV-005` Currency MUST be stored with reported amount.
- `DSP-REV-006` Currency conversion, if shown, MUST expose rate/source/date and preserve original currency.
- `DSP-REV-007` Reporting period MUST be explicit and MUST NOT be assumed equal to release performance window.
- `DSP-REV-008` Negative adjustments/corrections MUST be representable without coercing to zero.
- `DSP-REV-009` Distributor-aggregated statements MUST NOT be falsely attributed to a specific DSP/song if source does not support it.
- `DSP-REV-010` Imports MUST preserve source file/provider/mapping provenance and deduplicate repeats.
- `DSP-REV-011` Revenue import MUST not claim net artist take-home unless fees/splits scope actually supports that calculation.
- `DSP-REV-012` AI MUST not forecast guaranteed earnings from historical effective rate.

## 15. AI behavior
AI can explain statement anomalies/trends and help map fields, but calculations must be deterministic from structured values. Forecast scenarios belong to Business and must state assumptions.

## 16. Human approval
User confirms mapping and any manual correction/exclusion. Raw statements remain source evidence.

## 17. Validation
- currency valid
- period parseable
- amount numeric
- stream denominator nonnegative/compatible if rate calculated
- duplicate import key checked

## 18. UI states
- no imports
- mapping preview
- imported
- partial/denominator missing
- multi-currency
- corrected/adjusted
- import error

## 19. Edge cases
- refund/chargeback adjustment
- aggregated distributor statement
- royalty delayed months
- track ownership split
- statement duplicates prior period

## 20. Cross-module effects
- Business Revenue Events/Goals
- Analytics
- DSP home
- CSV Wizard

## 21. Notifications and attention model
- new statement available/import stale
- large correction/anomaly
- mapping schema changed

## 22. Search / filtering / sorting / bulk actions
Filter by platform/period/currency/import source. Bulk import supported through validated mapping; no hidden currency normalization.

## 23. Analytics and product telemetry
- statement uploaded
- mapping saved
- rows imported/skipped
- effective rate calculated
- duplicate prevented
- correction recorded

## 24. Learning feedback
Historical revenue can inform business scenarios and catalog observations; it does not produce creative Learning automatically.

## 25. Auditability / provenance
Keep source file hash/reference, mapping template/version, import actor/time, original amounts/currency and correction lineage.

## 26. Desktop / mobile behavior
Desktop import/reconciliation; mobile read-only summary and anomaly notice.

## 27. Accessibility / usability
Always label gross/reported royalty vs effective rate clearly with denominator and period.

## 28. Security / privacy / rights
Royalty statements are sensitive financial documents; restrict access/export and avoid logging raw contents.

## 29. Performance / async jobs
CSV parsing/import asynchronous for large files; deterministic/idempotent with preview and rollback strategy where feasible.

## 30. Acceptance criteria
- `DSP-REV-AC01` No fixed per-stream rate is used.
- `DSP-REV-AC02` Missing streams yields no invented effective rate.
- `DSP-REV-AC03` Original currency is preserved.
- `DSP-REV-AC04` Aggregated source is not misattributed.
- `DSP-REV-AC05` Duplicate import is prevented.

## 31. Test matrix
- no streams denominator
- multi-currency
- negative adjustment
- aggregated distributor
- duplicate statement
- late report

## 32. Open questions
- Need source-row granularity decision: snapshot-only vs normalized royalty line items feeding snapshots.

## 33. Traceability
MASTER §243–244, §264–286, §371–377
