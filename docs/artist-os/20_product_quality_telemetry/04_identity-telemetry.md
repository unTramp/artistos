# Identity Workflow Telemetry

- **Status:** REVIEW COMPLETE
- **MASTER references:** §395, §53–92
- **Domain:** 20_product_quality_telemetry
- **Feature slug:** `identity-telemetry`
- **Requirement prefix:** `QTY-IDN`

## 2. Purpose
Measure friction and acceptance in Identity discovery without turning the workflow into psychological scoring.

## 3. User problem / job-to-be-done
Artist OS is complex enough that product quality can regress invisibly. We need explicit product telemetry and test gates tied to real user outcomes and architectural rules.

## 4. Scope
### In scope
- time to activation
- corrections
- moodboard pattern acceptance
- Brand Book generation/use
- Guard overrides

### Out of scope / non-goals
- surveillance-style telemetry
- vanity DAU as sole success definition
- quality claims without measurement

## 5. Entry points
- Product/engineering quality dashboard
- Agent/config review
- release checklist

## 6. Preconditions and dependencies
- event instrumentation
- test infrastructure
- AgentRun/audit data
- domain acceptance criteria

## 7. Information architecture
Define metric/test → collect/run with versioned context → analyze regression/quality → create issue/config rollback/product decision → preserve evidence.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
Telemetry/test artifacts reference product versions/configs; they do not become domain source of truth.

## 10. Main happy-path workflow
1. Set baseline/criteria
2. Collect or run test
3. Review result/sample/context
4. Identify regression or success
5. Take explicit product/engineering action
6. Re-measure

## 11. Alternative workflows
- insufficient sample
- instrumentation change
- test flaky
- AI model/provider change

## 12. User actions
- view
- filter
- compare versions
- open failing requirement/test
- record decision

## 13. State model
Telemetry evolves with metric definition versions; test status follows CI/manual verification systems.

## 14. Business rules
- `QTY-IDN-001` telemetry measures workflow not personality truth
- `QTY-IDN-002` corrections treated as product feedback
- `QTY-IDN-003` no archetype accuracy score presented as psychology
- `QTY-IDN-004` activation time not optimized at expense of thoughtful review
- `QTY-IDN-005` private identity data minimized in telemetry
- `QTY-IDN-006` major version changes not triggered automatically

## 15. AI behavior
AI may summarize telemetry/test failures but cannot declare subjective quality solved without evidence/human review.

## 16. Human approval
Release/config promotion decisions remain human/product controlled except allowed automatic rollback on objective regressions.

## 17. Validation
- metric/test definition version known
- sample/context present
- privacy rules respected

## 18. UI states
- no baseline
- collecting
- healthy
- warning
- regression
- insufficient sample
- instrumentation changed

## 19. Edge cases
- metric definition changed
- small sample
- provider model update
- manual smoke missed edge case

## 20. Cross-module effects
- Agent Config/Evals
- All domains
- Development process

## 21. Notifications and attention model
- objective regression
- DoD failure
- telemetry instrumentation broken

## 22. Search / filtering / sorting / bulk actions
Filter version/domain/workflow/agent/date/result. Bulk comparisons allowed; no automatic identity optimization.

## 23. Analytics and product telemetry
- metric emitted
- test run
- regression detected
- rollback/decision

## 24. Learning feedback
Quality evidence drives product/engineering improvements, not artist creative Learning unless explicitly relevant and separately reviewed.

## 25. Auditability / provenance
Preserve definition/version/sample/test commit/config and result provenance.

## 26. Desktop / mobile behavior
Desktop quality dashboards; normal artist UI only receives relevant non-technical warnings.

## 27. Accessibility / usability
Metric definitions and pass/fail rationale must be readable; avoid opaque composite quality scores.

## 28. Security / privacy / rights
Telemetry minimizes private content and does not log secrets/PII unnecessarily.

## 29. Performance / async jobs
CI/tests and analytical rollups may run asynchronously; release gate waits only on required checks.

## 30. Acceptance criteria
- `QTY-IDN-AC01` Metric/test result is reproducible enough to inspect.
- `QTY-IDN-AC02` Small samples are labelled.
- `QTY-IDN-AC03` DoD cannot pass with broken routes/console errors.
- `QTY-IDN-AC04` AI quality and cost are not collapsed into one score.

## 31. Test matrix
- small sample
- instrumentation change
- provider model change
- test regression

## 32. Open questions
- Exact telemetry event schema/retention and CI implementation belong to Engineering Spec.

## 33. Traceability
MASTER §395, §53–92
