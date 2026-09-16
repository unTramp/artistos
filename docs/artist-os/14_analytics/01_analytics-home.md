# Analytics Command Center

- **Status:** REVIEW COMPLETE
- **MASTER references:** §287–300, §319–320, §357–364
- **Domain:** 14_analytics
- **Feature slug:** `analytics-home`
- **Requirement prefix:** `ANA-HOM`

## 2. Purpose
Provide an evidence-first command center that answers what happened, compared with what baseline, with what uncertainty, and what deserves investigation next.

## 3. User problem / job-to-be-done
Artists often see many disconnected metrics but little trustworthy interpretation. The OS needs to reduce noise, preserve platform context and turn measurements into qualified observations—not premature rules.

## 4. Scope
### In scope
- normalized KPI summary
- platform/context filters
- baselines/outliers
- narrative/hook/segment/market/fan-value views
- data quality/freshness
- handoff to Insight

### Out of scope / non-goals
- single universal performance score
- cross-platform raw ranking
- automatic causal conclusions

## 5. Entry points
- primary nav Analytics
- Song/Campaign/Publication
- Weekly Review

## 6. Preconditions and dependencies
- MetricSnapshots
- imports/providers
- Publication lineage
- Baseline definitions
- shared intelligence

## 7. Information architecture
Scope selector → data quality → primary metrics → baseline comparison → outlier context → drilldowns by narrative/hook/segment/market/fan value → create qualified Insight.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
Projection over normalized metrics and analytical dimensions. No new all-purpose analytics entity.

## 10. Main happy-path workflow
1. Open Analytics
2. Choose period/platform/campaign/song/objective
3. System loads normalized metrics and data-quality state
4. Compare to relevant baselines
5. Inspect outliers and specialized breakdowns
6. Create Insight with evidence references

## 11. Alternative workflows
- cold start with no baseline
- single publication
- platform missing metric
- partial import
- viral outlier dominates average

## 12. User actions
- change scope
- toggle median/average/percentile
- open raw snapshot
- exclude invalid import with audit
- create Insight

## 13. State model
No feature lifecycle; state is data coverage/freshness and selected analytical context.

## 14. Business rules
- `ANA-HOM-001` Analytics MUST use normalized canonical concepts while preserving platform-specific raw/source metadata.
- `ANA-HOM-002` Non-existent/unavailable metric MUST be NULL/unknown, not zero.
- `ANA-HOM-003` Cross-platform raw views/engagement MUST NOT be ranked without platform-specific context/baselines.
- `ANA-HOM-004` Median SHOULD be shown alongside average for noisy distributions.
- `ANA-HOM-005` Sample size and period MUST accompany comparative claims.
- `ANA-HOM-006` Outliers MUST be identified so one viral event cannot silently define the baseline.
- `ANA-HOM-007` Analytics MUST distinguish observation from Insight/Hypothesis/Learning.
- `ANA-HOM-008` AI summaries MUST cite structured evidence and qualify uncertainty.
- `ANA-HOM-009` Data freshness/import coverage MUST be visible.
- `ANA-HOM-010` Platform metric-definition changes SHOULD create a discontinuity warning.
- `ANA-HOM-011` Objective-relevant metrics SHOULD be emphasized over generic vanity metrics.
- `ANA-HOM-012` Analytics home MUST remain useful without AI.

## 15. AI behavior
Analytics Agent summarizes structured data only, never fabricates missing metrics. It uses cautious language and can propose Insights, not promote Learnings directly.

## 16. Human approval
Insight creation/promotion and data corrections are human-reviewable; raw imports may process automatically through validated mappings.

## 17. Validation
- scope valid
- sample count known
- metric availability explicit
- baseline compatible

## 18. UI states
- no data
- cold start
- partial
- healthy
- stale
- outlier-heavy
- schema discontinuity

## 19. Edge cases
- platform backfills metrics
- deleted external post
- duplicate import
- metric renamed
- one huge outlier

## 20. Cross-module effects
- Insights
- Weekly Review
- Content/Song/Campaign
- Growth
- Business

## 21. Notifications and attention model
- data import stale
- schema discontinuity
- baseline invalid due to low sample

## 22. Search / filtering / sorting / bulk actions
Filter platform/song/campaign/pillar/narrative/format/market/period. Bulk export/Insight creation only from explicit selections.

## 23. Analytics and product telemetry
- analytics viewed
- scope changed
- baseline changed
- Insight created
- data warning opened

## 24. Learning feedback
Analytics supplies evidence to Insight/Hypothesis; no direct Learning promotion.

## 25. Auditability / provenance
Keep import/source/mapping/version provenance and any exclusions/corrections.

## 26. Desktop / mobile behavior
Desktop deep analysis; mobile KPI/data-quality summary.

## 27. Accessibility / usability
Charts include tables/tooltips, denominators and textual uncertainty; no color-only winner coding.

## 28. Security / privacy / rights
Metrics can be commercially sensitive; access/export controls apply. No unnecessary person-level data.

## 29. Performance / async jobs
Aggregations may be async/cached; core dashboard loads stored results without blocking on AI.

## 30. Acceptance criteria
- `ANA-HOM-AC01` Unavailable metric appears unknown, not zero.
- `ANA-HOM-AC02` Cross-platform raw ranking is absent.
- `ANA-HOM-AC03` Median and sample size are available for noisy comparisons.
- `ANA-HOM-AC04` Viral outlier is identified.
- `ANA-HOM-AC05` Insight handoff preserves evidence scope.

## 31. Test matrix
- cold start
- partial import
- viral outlier
- metric definition change
- deleted external post

## 32. Open questions
- Canonical baseline-window defaults and data-quality thresholds require calibration in engineering/eval pass.

## 33. Traceability
MASTER §287–300, §319–320, §357–364
