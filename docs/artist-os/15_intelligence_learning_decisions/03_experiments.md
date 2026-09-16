# Experiments

- **Status:** REVIEW COMPLETE
- **MASTER references:** §304–306, §312–315
- **Domain:** 15_intelligence_learning_decisions
- **Feature slug:** `experiments`
- **Requirement prefix:** `INT-EXP`

## 2. Purpose
Run structured tests that connect a hypothesis to control/variant, metrics, observation targets and an explicit decision.

## 3. User problem / job-to-be-done
Creators frequently change many things at once and later cannot tell why results differed. The OS needs test design discipline while still allowing creative portfolio tests.

## 4. Scope
### In scope
- Experiment entity
- control/variant
- primary/secondary metrics
- minimum observations
- start/end/status
- decision enum
- linked executions/evidence

### Out of scope / non-goals
- laboratory-grade causal certainty by default
- forced A/B test for every creative act

## 5. Entry points
- Hypothesis
- Factory Hook variants
- Geo Experiment
- Weekly Review

## 6. Preconditions and dependencies
- Hypothesis
- Content/Publication/Market/Business executions
- Analytics

## 7. Information architecture
Create from Hypothesis → define control/variant → primary metric/secondary metrics → minimum observations/time → run linked executions → collect evidence → analyze confounds → KEEP/RETEST/REJECT/INCONCLUSIVE → Learning candidate.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER Experiment fields and decision enum KEEP/RETEST/REJECT/INCONCLUSIVE.

## 10. Main happy-path workflow
1. create experiment
2. link executions
3. record deviation/confounder
4. extend/retest
5. close with decision

## 11. Alternative workflows
- multi-factor portfolio test
- no clean control
- experiment interrupted
- minimum observations not reached

## 12. User actions
- start
- pause if schema supports
- record note
- close decision
- clone retest

## 13. State model
Exact status enum not defined. Decision is separate from status.

## 14. Business rules
- `INT-EXP-001` Experiment MUST link to a Hypothesis.
- `INT-EXP-002` Primary metric SHOULD be set before results are reviewed where practical.
- `INT-EXP-003` Control and variant MUST be described explicitly.
- `INT-EXP-004` One important variable SHOULD change where feasible.
- `INT-EXP-005` Multi-factor creative tests MUST be labelled multi-factor and conclusions scoped accordingly.
- `INT-EXP-006` MinimumObservations MUST be a design parameter, not a universal hardcoded number.
- `INT-EXP-007` Failure to reach enough evidence SHOULD yield INCONCLUSIVE rather than forced KEEP/REJECT.
- `INT-EXP-008` Decision MUST use KEEP, RETEST, REJECT or INCONCLUSIVE.
- `INT-EXP-009` Confounders/deviations MUST be recordable and visible in analysis.
- `INT-EXP-010` Experiment outcome MUST not automatically become VALIDATED Learning.
- `INT-EXP-011` Identity-scoped experiments require stronger evidence/human review.
- `INT-EXP-012` AI MUST not retrofit the hypothesis/primary metric after seeing results without recording the change.

## 15. AI behavior
AI can critique design, identify confounders and summarize results from structured data. It cannot rewrite pre-registered fields silently or force a winner.

## 16. Human approval
User approves design changes, final decision and Learning promotion.

## 17. Validation
- hypothesis exists
- primary metric valid
- linked executions identifiable
- observation count computable or qualitative limitation explicit

## 18. UI states
- draft
- running
- partial
- complete
- inconclusive
- retest

## 19. Edge cases
- variant failed to publish
- platform algorithm shift
- paid boost contamination
- release date moved

## 20. Cross-module effects
- Analytics
- Factory
- Growth
- Learning
- Decision Memory

## 21. Notifications and attention model
- minimum observations reached
- major confounder
- experiment end date reached

## 22. Search / filtering / sorting / bulk actions
Filter scope/status/decision/metric/campaign/song.

## 23. Analytics and product telemetry
- experiment started
- design changed
- observation linked
- decision made
- retest cloned

## 24. Learning feedback
Experiment result produces candidate Learning with scope/confidence, not direct global rule.

## 25. Auditability / provenance
Preserve pre/post design versions, linked executions, evidence, confounders, decision rationale.

## 26. Desktop / mobile behavior
Desktop design/analysis; mobile status/notes.

## 27. Accessibility / usability
Clearly distinguish predeclared vs changed-after-start fields.

## 28. Security / privacy / rights
No special PII beyond underlying evidence.

## 29. Performance / async jobs
Analysis jobs async optional; state/links deterministic.

## 30. Acceptance criteria
- `INT-EXP-AC01` Not enough observations can close INCONCLUSIVE.
- `INT-EXP-AC02` Multi-factor test is labelled.
- `INT-EXP-AC03` Primary metric change is audited.
- `INT-EXP-AC04` Decision enum respected.
- `INT-EXP-AC05` No auto-validated Learning.

## 31. Test matrix
- interrupted
- multi-factor
- contaminated
- low sample
- retest

## 32. Open questions
- Experiment status enum and exact execution-arm relationship need schema freeze.

## 33. Traceability
MASTER §304–306, §312–315
