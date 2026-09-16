# Revenue Goals & Scenarios

- **Status:** REVIEW COMPLETE
- **MASTER references:** §265–266, §268, §284–286
- **Domain:** 13_business_fan_value
- **Feature slug:** `revenue-goals`
- **Requirement prefix:** `BIZ-GOL`

## 2. Purpose
Let the artist define gross/net/take-home targets and reverse-plan multiple transparent scenarios without turning heuristics into laws.

## 3. User problem / job-to-be-done
A target such as “earn X this year” is not actionable unless assumptions about offer mix, prices, margins and audience conversion are visible.

## 4. Scope
### In scope
- RevenueGoal fields
- multiple reverse-planning scenarios
- assumptions
- progress from RevenueEvents
- gross/net/take-home distinctions

### Out of scope / non-goals
- guaranteed forecast
- tax planning
- one true “1000 fans” model

## 5. Entry points
- Business home
- annual/quarterly planning
- Campaign business objective

## 6. Preconditions and dependencies
- RevenueEvents
- RevenuePortfolio
- Offers/UnitEconomics
- currency policy

## 7. Information architecture
Create goal → choose target definition/period/currency → add assumptions → generate/manual scenarios → compare required units/revenue mix → select planning scenario/decision → track actual separately.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER `RevenueGoal {period, targetGrossRevenue, targetNetRevenue?, targetArtistTakeHome?, currency, deadline, assumptions[]}`. Scenario entity is not specified; may be versioned planning object pending schema.

## 10. Main happy-path workflow
1. Set period/deadline/currency
2. Enter gross and optional net/take-home target
3. Document assumptions
4. Build multiple source/offer scenarios
5. Review feasibility/operational load
6. Choose scenario as planning reference, not forecast
7. Compare actual events over time

## 11. Alternative workflows
- artist only knows desired take-home
- costs incomplete
- multi-currency revenue
- goal intentionally aspirational

## 12. User actions
- create/edit goal
- duplicate scenario
- change assumption
- archive scenario
- record planning decision

## 13. State model
Goal active/archived may be needed; scenarios version independently. Actual revenue never changes because a scenario is edited.

## 14. Business rules
- `BIZ-GOL-001` RevenueGoal MUST preserve gross/net/take-home distinctions from MASTER.
- `BIZ-GOL-002` At least one target basis MUST be explicit; UI MUST not conflate them.
- `BIZ-GOL-003` Reverse planning MUST show assumptions and arithmetic.
- `BIZ-GOL-004` `1000 fans × $100/year` MAY appear only as a scenario/heuristic, never as law.
- `BIZ-GOL-005` Scenarios MUST be clearly separated from actual RevenueEvents.
- `BIZ-GOL-006` Missing margin/cost assumptions MUST be explicit and reduce precision.
- `BIZ-GOL-007` AI MUST not assign guaranteed conversion rates or income probabilities.
- `BIZ-GOL-008` Actual progress MUST use compatible period/currency definitions or show conversion assumptions.
- `BIZ-GOL-009` Changing assumptions SHOULD version/recalculate scenario without rewriting prior Decision evidence.
- `BIZ-GOL-010` Multiple scenarios SHOULD be comparable by revenue mix, margin and operational load rather than a single “best” score.

## 15. AI behavior
AI can generate arithmetic scenario alternatives from user assumptions, flag unrealistic workload or missing variables, and never label them guaranteed forecasts.

## 16. Human approval
User sets goals/assumptions and decides which scenario informs action.

## 17. Validation
- deadline after period start
- currency set
- target numbers coherent
- scenario arithmetic deterministic

## 18. UI states
- draft goal
- active
- partial assumptions
- scenario comparison
- actual tracking
- archived

## 19. Edge cases
- goal currency differs from revenue
- negative actual adjustment
- goal changed mid-year
- missing net cost inputs

## 20. Cross-module effects
- Revenue Portfolio
- Offers
- Unit Economics
- Revenue Events
- Decision Memory

## 21. Notifications and attention model
- goal trajectory materially off under chosen assumptions
- scenario invalidated by offer change

## 22. Search / filtering / sorting / bulk actions
Filter period/status/currency. Scenario versions sortable by created date/assumption set.

## 23. Analytics and product telemetry
- goal created
- scenario generated
- assumption edited
- scenario selected
- goal changed

## 24. Learning feedback
Scenario vs actual differences may generate Business Insights/Hypotheses.

## 25. Auditability / provenance
Preserve assumptions/version, deterministic calculations and decision linkage.

## 26. Desktop / mobile behavior
Desktop planning; mobile progress/assumption summary.

## 27. Accessibility / usability
Always show whether number is target, scenario estimate or actual.

## 28. Security / privacy / rights
Financial goals are sensitive; access-controlled/exportable.

## 29. Performance / async jobs
Scenario calculation synchronous; AI narrative optional async.

## 30. Acceptance criteria
- `BIZ-GOL-AC01` 1000-fans heuristic is not hardcoded law.
- `BIZ-GOL-AC02` Scenario arithmetic is inspectable.
- `BIZ-GOL-AC03` Actual revenue remains separate.
- `BIZ-GOL-AC04` Missing costs reduce precision.

## 31. Test matrix
- gross-only goal
- take-home goal
- multi-currency
- goal changed
- missing costs

## 32. Open questions
- First-class RevenueScenario entity/versioning not defined in MASTER.

## 33. Traceability
MASTER §265–266, §268, §284–286
