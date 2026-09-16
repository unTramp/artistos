# Narrative Analytics

## 1. Metadata
- **Spec ID:** `NAR-ANL`
- **Domain:** `03_narrative`
- **Feature:** Narrative Analytics
- **Status:** REVIEW
- **MASTER references:** 102, 287–300, 301–315, 319–321, 405, 454–455
- **Depends on:** Narrative Tracks, Content/Publication lineage, normalized metrics, baselines
- **Used by:** Narrative Home, Strategy, Insight/Hypothesis/Experiment/Learning, Weekly Review

## 2. Purpose
Measure how different Narrative Tracks perform **as storytelling dimensions** while preserving platform/format/song context, sample size, uncertainty and the difference between correlation and causation.

## 3. User problem / job-to-be-done
**JTBD:** “Help me understand how audiences respond to different parts of my story, but do not trick me into thinking a small noisy dataset proves which version of me I should become.”

## 4. Scope
Track-level descriptive analytics, comparison, distributions/medians, sample/confidence, selected metrics, drill-down and evidence handoff to Insight/Hypothesis workflows.

Out: causal attribution without experiment/evidence, automatic Identity changes, raw cross-platform rankings, single magic narrative score.

## 5. Entry points
Narrative → Analytics, Track detail, Narrative Home response card, Analytics filters, Weekly Review.

## 6. Preconditions and dependencies
Narrative-tagged Content/Publications and normalized metrics. Missing metrics remain NULL. Analytics must preserve measurement scope/time/platform.

## 7. Information architecture
- Period/platform/context filters.
- Track comparison table/cards.
- Metrics tabs/dimensions: reach, shares, saves, follows, comments, music conversion where available.
- Median + average + sample count where useful.
- Distribution/outlier context.
- Drill-down executions.
- Baseline comparison.
- Evidence/confidence panel.
- `Create Insight/Hypothesis` action.

## 8. User roles and permissions
Read access to metrics; artist can create/approve hypotheses/decisions according to Intelligence specs. Analytics Agent can propose Insights only.

## 9. Core data model
Reads:
- `NarrativeTrack`
- `ContentUnit`
- `Publication`
- `MetricSnapshot`
- baseline/derived metric views
- `Insight`, `Hypothesis`, `Experiment`, `Learning`

MASTER Narrative Analytics dimensions include:
`median reach, shares, follows, comments, music conversion, sample size, confidence`.
Additional normalized metrics may be viewed where canonical schema supports them.

## 10. Main happy-path workflow
1. User opens Narrative Analytics.
2. Selects period and platform/scope.
3. System resolves eligible narrative-tagged executions.
4. System normalizes metric availability and excludes no-data values without converting to zero.
5. System groups executions by Narrative Track.
6. UI shows sample count, median and relevant derived metrics.
7. Outliers are marked and remain visible.
8. User drills into Track executions and confounding dimensions (format/Song/platform/campaign where possible).
9. Analytics Agent may summarize bounded observations.
10. User can create an Insight/Hypothesis from selected evidence.

## 11. Alternative workflows
Single Track only; insufficient sample; mixed platforms; Track with one viral outlier; partial imports; historical Track; multi-factor campaign period.

## 12. User actions
Change scope/filters, select metric, compare Tracks, open execution, exclude invalid/import-error record through proper data workflow, create Insight/Hypothesis, export view where supported.

## 13. State model
View states: `NO_DATA | INSUFFICIENT_SAMPLE | DESCRIPTIVE | COMPARABLE | PARTIAL/STALE | ERROR`.
These are not causal-confidence labels.

## 14. Business rules
- **NAR-ANL-001** — Narrative Analytics MUST group performance by Narrative Track separately from Pillar, Format and Platform dimensions.
- **NAR-ANL-002** — Missing metric values MUST be NULL/unavailable, never treated as zero.
- **NAR-ANL-003** — Raw views/engagement MUST NOT be directly ranked across platforms without platform-specific context/baseline.
- **NAR-ANL-004** — Sample size MUST be visible for every Track comparison.
- **NAR-ANL-005** — Median SHOULD be shown alongside average for noisy distributions where the metric supports it.
- **NAR-ANL-006** — Outliers MUST remain identifiable and MUST NOT silently dominate the summary.
- **NAR-ANL-007** — One viral outlier MUST NOT become a narrative best practice by itself.
- **NAR-ANL-008** — Analytics wording MUST be bounded to observed scope/time/population.
- **NAR-ANL-009** — The system MUST distinguish observation/association from causal claim.
- **NAR-ANL-010** — Causal narrative conclusions require adequate experiment/design/evidence under Intelligence rules.
- **NAR-ANL-011** — Track performance MUST NOT automatically modify Identity Narrative, Track role, status, disclosure or target share.
- **NAR-ANL-012** — Identity change proposals require the stronger Identity learning pipeline defined by MASTER.
- **NAR-ANL-013** — Analytics MUST preserve context for Song, format, hook, campaign, market and platform where available to expose alternative explanations.
- **NAR-ANL-014** — Comparison MUST NOT imply the highest-reach Track is artistically “best”.
- **NAR-ANL-015** — Metrics selected for comparison SHOULD match the current objective when one exists.
- **NAR-ANL-016** — Music conversion and fan-value metrics MUST remain distinct from reach/engagement where available.
- **NAR-ANL-017** — Confidence MUST be explainable by evidence quantity/quality/consistency/freshness, not a fabricated precision score.
- **NAR-ANL-018** — Analytics Agent MUST NOT invent missing metrics or infer unavailable platform data as fact.
- **NAR-ANL-019** — Partial/stale imports MUST be visibly labeled.
- **NAR-ANL-020** — Historical Track analytics MUST use the Track/Identity/Era context that applied at execution time when lineage permits.
- **NAR-ANL-021** — Track-level summaries SHOULD allow drill-down to underlying Content Units/Publications.
- **NAR-ANL-022** — User-created exclusions/corrections to bad data MUST be auditable.
- **NAR-ANL-023** — A Track with insufficient sample MUST be labeled insufficient rather than ranked confidently.
- **NAR-ANL-024** — Narrative Analytics MUST NOT produce a single composite “Narrative Score”.
- **NAR-ANL-025** — Similar metric differences with materially different formats/campaigns SHOULD surface confounding warnings.
- **NAR-ANL-026** — Weekly Review MAY summarize narrative evidence but MUST preserve FACT/OBSERVATION/HYPOTHESIS/RECOMMENDATION labels.
- **NAR-ANL-027** — Insights created from Narrative Analytics MUST retain evidence links, sample size and scope.
- **NAR-ANL-028** — Contradictory evidence MUST remain visible rather than being averaged away into a false certainty.
- **NAR-ANL-029** — Old evidence MAY receive time-decay treatment at Learning layer but MUST not be deleted from historical analytics.
- **NAR-ANL-030** — The system MUST preserve the artist's right to continue a lower-performing but strategically/artistically important Narrative Track.

## 15. AI behavior
Analytics Agent may produce structured bounded observations:
- statement;
- scope/time/platform;
- metric(s);
- sample size;
- baseline/comparison;
- outlier note;
- possible alternative explanations;
- confidence explanation;
- suggested hypothesis/test.

Forbidden: missing-data invention, causal overclaim, rebrand recommendation as conclusion, “best storyline” verdict based on reach alone.

## 16. Human approval
Raw descriptive analytics require no approval. Promotion to Insight/Hypothesis/Learning/Decision follows Intelligence domain approval/state rules. Identity changes always require human review.

## 17. Validation
Metric provenance, snapshot windows, duplicate import handling, Track lineage, platform availability, selected period, baseline scope.

## 18. UI states
No data, insufficient sample, partial/stale import, outlier-heavy, comparable data, contradictory evidence, analytics provider/import error.

## 19. Edge cases
One Track only used on TikTok while another only on Instagram; one Track tied to release campaign; one post has 100× views; metrics unavailable for some Publications; Track changed role mid-period.

## 20. Cross-module effects
Creates evidence inputs for Insight/Hypothesis/Experiment/Learning/Decision. Does not mutate Identity/Narrative directly.

## 21. Notifications and attention model
Meaningful new evidence, major contradictory signal, stale analytics import, experiment result ready. Avoid noisy notifications for normal metric fluctuations.

## 22. Search / filtering / sorting / bulk actions
Period, platform, Track, Song, Campaign, Format/Pillar, market where available. Sort by metric/sample/name but labels must avoid implying evaluative winner.

## 23. Analytics and product telemetry
Analytics view usage, filters, drill-down, Insight/Hypothesis creation, Agent summary acceptance/correction, stale-data warning interactions.

## 24. Learning feedback
Primary output is evidence for scoped Narrative Insights/Hypotheses. Repeated evidence can progress through Learning states, with identity-level changes requiring higher threshold.

## 25. Auditability / provenance
Every derived summary should be reproducible from source Publications/Snapshots/filter scope. AI output retains AgentRun/context/schema versions.

## 26. Desktop / mobile behavior
Desktop primary comparison/drill-down. Mobile summary with sample/confidence and drill into individual Track; avoid dense multi-series charts.

## 27. Accessibility / usability
Tables accompany charts; metric definitions available; confidence not represented only by color; clear NULL/no-data labels.

## 28. Security / privacy / rights
Only aggregated audience metrics unless explicit integration scope permits more. No psychological profiling.

## 29. Performance / async jobs
Aggregation/baselines may be materialized/cached and refreshed asynchronously. Page must show last calculated/import timestamp. Analytics Agent is asynchronous and optional.

## 30. Acceptance criteria
1. Narrative Track analytics is separate from Pillar/Format analytics.
2. Sample size is shown for comparisons.
3. Missing metrics are not zeros.
4. Outlier effect is visible.
5. Cross-platform raw metrics are not naively ranked.
6. Analytics cannot auto-change Identity/Track strategy.
7. Insights retain evidence/scope.
8. Contradictory evidence remains visible.
9. A lower-performing strategic Track can remain active without system error.

## 31. Test matrix
Unit: NULL handling, median/outlier/sample calculations. Integration: lineage/baselines/imports. Agent eval: bounded claims/no invented data. E2E: publication metrics → Narrative Analytics → Insight → Hypothesis. Manual: partial/stale/cross-platform cases.

## 32. Open questions
1. Exact confidence computation remains a cross-domain Analytics/Intelligence design decision; Narrative must consume explainable confidence, not invent a separate model.
2. If multi-Track Content Units are supported, analytics attribution weighting must be defined globally rather than locally here.

## 33. Traceability
`NAR-ANL-001–030` → MASTER 102, 287–300, 301–315, 319–321, 405, 454–455.
