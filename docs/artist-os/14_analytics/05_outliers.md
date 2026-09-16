# Outlier Detection & Virality Bias Guard

- **Status:** REVIEW COMPLETE
- **MASTER references:** §294–295, §22
- **Domain:** 14_analytics
- **Feature slug:** `outliers`
- **Requirement prefix:** `ANA-OUT`

## 2. Purpose
Identify unusually high observations and prevent a single viral result from becoming an automatic strategy rule.

## 3. User problem / job-to-be-done
Creator datasets are heavy-tailed. Average performance can be distorted by one hit, causing false conclusions about hooks, formats or markets.

## 4. Scope
### In scope
- NORMAL/HIGH_OUTLIER/VIRAL_OUTLIER labels
- robust baseline context
- outlier-aware summaries
- virality bias warnings

### Out of scope / non-goals
- guaranteed viral prediction
- punishing high performers
- automatic exclusion

## 5. Entry points
- Analytics charts
- Insight creation
- Weekly Review

## 6. Preconditions and dependencies
- Baseline distribution
- MetricSnapshot
- sample size

## 7. Information architecture
Compute/flag relative outlier → show baseline/distribution → include result in history but distinguish its leverage → require broader evidence before generalizing pattern.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER outlier enum NORMAL, HIGH_OUTLIER, VIRAL_OUTLIER. Exact statistical thresholds intentionally not frozen.

## 10. Main happy-path workflow
1. Inspect outlier badge
2. view comparison distribution
3. include/exclude from a specific exploratory calculation transparently
4. create outlier-specific hypothesis

## 11. Alternative workflows
- small sample prevents classification
- all posts improve due to external event
- viral post has paid boost
- platform changed distribution

## 12. User actions
- open context
- mark known confounder
- compare robust statistics

## 13. State model
Label may be recomputed as baseline evolves; historical analysis snapshot should preserve the label/rules used.

## 14. Business rules
- `ANA-OUT-001` Outlier label MUST use MASTER enum when assigned.
- `ANA-OUT-002` Exact thresholds MUST be calibrated and MUST NOT be presented as universal virality law.
- `ANA-OUT-003` Outlier observation MUST remain in historical data.
- `ANA-OUT-004` Analytics SHOULD use robust statistics/median to reduce undue outlier leverage.
- `ANA-OUT-005` One VIRAL_OUTLIER MUST NOT automatically create a VALIDATED Learning.
- `ANA-OUT-006` Sample size/variance/confounders MUST be considered before generalization.
- `ANA-OUT-007` Paid/collaboration/external amplification SHOULD be recorded as context where known.
- `ANA-OUT-008` AI MUST not claim it can reproduce virality from one result.
- `ANA-OUT-009` Outlier classification MUST distinguish statistical unusualness from artistic quality.

## 15. AI behavior
AI may explain why an item is unusual relative to baseline and propose follow-up test. It cannot promise replication.

## 16. Human approval
Known confounder annotation and Insight promotion human-reviewed.

## 17. Validation
- baseline sufficient to classify or label unavailable
- comparison metric same
- known boosts/context surfaced

## 18. UI states
- unclassified
- normal
- high outlier
- viral outlier
- confounded

## 19. Edge cases
- tiny sample
- paid boost
- celebrity share
- platform outage
- all posts shift upward

## 20. Cross-module effects
- Baselines
- Insights
- Experiments
- Weekly Review

## 21. Notifications and attention model
- new viral outlier prompts review without automatic strategy change

## 22. Search / filtering / sorting / bulk actions
Filter outlier label; sorting by deviation allowed with context.

## 23. Analytics and product telemetry
- outlier classified
- context opened
- confounder added

## 24. Learning feedback
Outliers motivate hypotheses, not rules.

## 25. Auditability / provenance
Store detection method/version/context for reproducibility.

## 26. Desktop / mobile behavior
Desktop distribution view; mobile warning badge/context.

## 27. Accessibility / usability
Avoid celebratory “hack found” language.

## 28. Security / privacy / rights
No special privacy concern beyond metrics.

## 29. Performance / async jobs
Detection can run in analytics jobs.

## 30. Acceptance criteria
- `ANA-OUT-AC01` Viral outlier remains in history.
- `ANA-OUT-AC02` No validated learning is auto-created.
- `ANA-OUT-AC03` Small sample may leave item unclassified.
- `ANA-OUT-AC04` Paid boost can be recorded as confounder.

## 31. Test matrix
- tiny sample
- paid boost
- celebrity share
- baseline shift

## 32. Open questions
- Threshold/eval calibration required before implementation.

## 33. Traceability
MASTER §294–295, §22
