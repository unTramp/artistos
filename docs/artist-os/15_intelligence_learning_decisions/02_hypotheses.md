# Hypotheses

- **Status:** REVIEW COMPLETE
- **MASTER references:** §303, §301–315
- **Domain:** 15_intelligence_learning_decisions
- **Feature slug:** `hypotheses`
- **Requirement prefix:** `INT-HYP`

## 2. Purpose
Turn Insights into explicit, testable claims with one main variable and target metric wherever feasible.

## 3. User problem / job-to-be-done
Without hypotheses, creators “try things” but cannot tell what was learned. The OS needs a statement that can actually be tested.

## 4. Scope
### In scope
- Hypothesis entity
- source Insight links
- testable variable
- target metric
- scope/status
- experiment creation

### Out of scope / non-goals
- vague strategic belief
- automatic proof

## 5. Entry points
- Insight
- Factory/Market/Business experiment actions
- Weekly Review

## 6. Preconditions and dependencies
- Insight evidence
- metric registry
- scope entities

## 7. Information architecture
Create from Insight → rewrite as testable statement → choose variable/target metric/scope → assess feasibility → approve → create Experiment.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER `Hypothesis {statement, sourceInsightIds, testableVariable, targetMetric, status}`.

## 10. Main happy-path workflow
1. create
2. edit
3. link/unlink source Insight
4. select target metric
5. create Experiment
6. archive/retest

## 11. Alternative workflows
- hypothesis from artist intuition without Insight
- qualitative target
- multi-factor creative portfolio idea

## 12. User actions
- create/edit
- mark untestable
- create experiment
- duplicate/reframe

## 13. State model
Status enum not defined; proposed/testing/resolved/archive likely but open.

## 14. Business rules
- `INT-HYP-001` Hypothesis SHOULD be falsifiable/testable where practical.
- `INT-HYP-002` One primary testable variable SHOULD be identified for controlled tests.
- `INT-HYP-003` Multi-factor creative hypotheses MAY exist but MUST be labelled accordingly.
- `INT-HYP-004` Target metric MUST be defined before interpreting the experiment where feasible.
- `INT-HYP-005` Source Insights SHOULD be linked when hypothesis derives from prior evidence.
- `INT-HYP-006` Intuition-origin hypotheses are allowed but MUST NOT be presented as evidence-backed learning.
- `INT-HYP-007` Hypothesis MUST remain distinct from an Experiment execution.
- `INT-HYP-008` AI MUST not write tautological/non-testable claims as high-confidence hypotheses.
- `INT-HYP-009` Identity-change hypotheses require stronger review threshold than tactical hypotheses.

## 15. AI behavior
AI can translate Insights into candidate testable hypotheses and flag confounds/untestable wording.

## 16. Human approval
User approves hypothesis and any identity-scoped hypothesis before experiment.

## 17. Validation
- statement testable or explicitly exploratory
- target metric valid
- source scope coherent

## 18. UI states
- draft
- testable
- testing
- resolved
- archived

## 19. Edge cases
- multiple variables
- target metric unavailable
- identity hypothesis
- intuition only

## 20. Cross-module effects
- Experiments
- Insights
- Identity Review
- Factory

## 21. Notifications and attention model
- hypothesis has no feasible metric/experiment
- identity hypothesis awaiting review

## 22. Search / filtering / sorting / bulk actions
Filter scope/status/target metric/source Insight.

## 23. Analytics and product telemetry
- hypothesis created
- experiment created
- reframed

## 24. Learning feedback
Hypotheses are pending claims, never permanent knowledge.

## 25. Auditability / provenance
Preserve source Insight lineage and edits.

## 26. Desktop / mobile behavior
Desktop authoring; mobile review.

## 27. Accessibility / usability
Use plain “We think X will change Y because…” structure.

## 28. Security / privacy / rights
Respect private scope.

## 29. Performance / async jobs
No async dependency.

## 30. Acceptance criteria
- `INT-HYP-AC01` Hypothesis names a testable variable.
- `INT-HYP-AC02` Target metric defined where feasible.
- `INT-HYP-AC03` Intuition-only hypothesis is labelled.
- `INT-HYP-AC04` Identity hypothesis gets stronger review.

## 31. Test matrix
- multi-factor
- metric unavailable
- identity change
- intuition

## 32. Open questions
- Hypothesis status enum should align with Experiment lifecycle.

## 33. Traceability
MASTER §303, §301–315
