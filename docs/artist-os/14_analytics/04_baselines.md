# Baselines & Comparative Context

- **Status:** REVIEW COMPLETE
- **MASTER references:** §291–293, §300
- **Domain:** 14_analytics
- **Feature slug:** `baselines`
- **Requirement prefix:** `ANA-BSL`

## 2. Purpose
Create comparable historical reference distributions by platform and relevant creative/context dimensions so performance claims have a meaningful denominator.

## 3. User problem / job-to-be-done
Without baselines, a raw 10k views figure is meaningless. Artists need to know how similar work typically performed on that platform and period.

## 4. Scope
### In scope
- platform + pillar/format + period baselines
- optional song/narrative/market scopes
- median/average/percentiles
- sample size/recency

### Out of scope / non-goals
- global universal benchmark
- cross-platform raw benchmark

## 5. Entry points
- Analytics comparison
- Content/Song/Narrative analytics

## 6. Preconditions and dependencies
- MetricSnapshots
- Content metadata
- Publication platform
- period filters

## 7. Information architecture
Choose comparison context → system selects compatible historical observations → calculate distribution → show median/average/percentiles/sample → compare target observation with caveats.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
Baseline is derived analytical projection; persistence/cache optional. Scope definition must be inspectable.

## 10. Main happy-path workflow
1. Open comparison
2. inspect baseline scope
3. broaden/narrow context
4. view sample publications
5. create Insight if evidence supports

## 11. Alternative workflows
- too few comparable items
- era changed
- platform metric definition changed
- one song dominates baseline

## 12. User actions
- change scope
- exclude known invalid data
- save preferred analytical view

## 13. State model
Baseline validity changes with source data/scope; not a permanent entity truth.

## 14. Business rules
- `ANA-BSL-001` Baseline MUST be platform-specific at minimum.
- `ANA-BSL-002` Raw cross-platform baseline MUST NOT be used.
- `ANA-BSL-003` Baseline SHOULD include pillar/format and period when sample permits.
- `ANA-BSL-004` Optional song/narrative/market narrowing MUST show reduced sample size.
- `ANA-BSL-005` Median SHOULD be primary/visible for noisy data; average may accompany it.
- `ANA-BSL-006` Percentiles SHOULD be supported where sample size is meaningful.
- `ANA-BSL-007` Sample size MUST always be shown.
- `ANA-BSL-008` Outliers MUST not be silently removed; exclusion/robust statistics policy must be transparent.
- `ANA-BSL-009` When sample is insufficient, system MUST say so rather than manufacture confidence.
- `ANA-BSL-010` Metric-definition/schema discontinuities SHOULD split or warn baseline.
- `ANA-BSL-011` AI MUST not describe a weak baseline as definitive norm.

## 15. AI behavior
AI can explain baseline choice and suggest comparable scope, but computation is deterministic and uncertainty explicit.

## 16. Human approval
User may adjust scope/exclusions; Insight promotion remains reviewed.

## 17. Validation
- compatible metric
- platform same
- sample count known
- period definition clear

## 18. UI states
- no baseline
- small sample
- healthy
- outlier-heavy
- schema discontinuity

## 19. Edge cases
- new platform
- new format
- only two posts
- major identity reset
- viral post dominates

## 20. Cross-module effects
- Outliers
- Hook/Segment/Narrative/Market analytics
- Insights

## 21. Notifications and attention model
- baseline invalidated by schema change

## 22. Search / filtering / sorting / bulk actions
Filter baseline by platform/format/pillar/song/narrative/market/period.

## 23. Analytics and product telemetry
- baseline viewed
- scope adjusted
- insufficient sample warning

## 24. Learning feedback
Baseline comparisons feed evidence, not automatic learning.

## 25. Auditability / provenance
Cache/formula/scope version should be reproducible.

## 26. Desktop / mobile behavior
Desktop detailed distribution; mobile median/sample summary.

## 27. Accessibility / usability
Explain scope in plain language (“last 12 short-form performance posts on Instagram”).

## 28. Security / privacy / rights
No extra PII.

## 29. Performance / async jobs
Aggregation/cache background optional.

## 30. Acceptance criteria
- `ANA-BSL-AC01` Platform differs → no raw comparison.
- `ANA-BSL-AC02` Small sample yields insufficient baseline.
- `ANA-BSL-AC03` Median/sample visible.
- `ANA-BSL-AC04` Outliers are not silently discarded.

## 31. Test matrix
- new format
- small sample
- schema change
- viral outlier

## 32. Open questions
- Minimum sample guidance should be calibrated per analysis type rather than globally hardcoded.

## 33. Traceability
MASTER §291–293, §300
