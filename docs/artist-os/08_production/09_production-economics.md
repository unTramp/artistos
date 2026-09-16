# Production Economics

- **Status:** REVIEW COMPLETE
- **MASTER references:** §186, §191, §264–268, §277
- **Domain:** 08_production
- **Feature slug:** `production-economics`
- **Requirement prefix:** `PRD-ECO`

## 2. Purpose
Help compare production scenarios using real resource cost and reusable output potential without reducing artistic value to financial efficiency.

## 3. User problem / job-to-be-done
Independent artists need to choose between “shoot at home”, “rent studio”, “hire videographer” or “reuse existing footage”. Cost matters, but lowest cost is not always the right creative decision.

## 4. Scope
Optional scenario cost estimates, acquisition requirements, usable derivative estimates, assumptions, actual vs estimate where known. Not accounting/tax.

## 5. Entry points
Production Agent plan, Shoot planning, AssetAcquisitionPlan, Business planning.

## 6. Preconditions and dependencies
Scenario/production plan exists. Costs optional; unknown remains unknown.

## 7. Information architecture
Scenario comparison → cost components → assumptions → expected usable outputs/derivatives → non-financial creative/identity constraints → decision note.

## 8. User roles and permissions
Single artist edits assumptions/actuals. AI may calculate/summarize from user-provided data.

## 9. Core data model
MASTER does not define a ProductionEconomics entity. Uses AssetAcquisitionPlan plus optional scenario estimates and later actual costs. Exact persistence boundary open.

## 10. Main happy-path workflow
Create two/three feasible production scenarios → enter known costs/resources → system calculates totals/ranges and derivative assumptions → show trade-offs with Identity/quality intent → user chooses scenario → decision provenance retained.

## 11. Alternative workflows
All costs zero/owned resources; unknown freelancer quote; currency mismatch; one expensive artistic exception; scenario with licensed stock vs original shoot.

## 12. User actions
Add/edit cost assumption, add quote, choose scenario, mark actual, remove financial comparison, link Decision.

## 13. State model
Draft estimate → Selected → Actualized/Closed; formal status not in MASTER.

## 14. Business rules
- `PRD-ECO-001` Production Economics MUST be optional and MUST NOT gate artistic work by default.
- `PRD-ECO-002` Unknown costs MUST remain unknown, not zero.
- `PRD-ECO-003` Estimated and actual costs MUST be visually/data-wise distinct.
- `PRD-ECO-004` Currency MUST be explicit for every comparable value or normalized with transparent FX source/date elsewhere.
- `PRD-ECO-005` “Usable derived assets” MUST be an estimate/actual count with assumptions, not guaranteed output.
- `PRD-ECO-006` Lowest cost MUST NOT be presented as universal best choice.
- `PRD-ECO-007` Identity fit, production intent, rights and operational load MUST remain visible alongside cost where relevant.
- `PRD-ECO-008` Existing owned equipment SHOULD not be assigned fictional rental cost unless user chooses an opportunity-cost model explicitly.
- `PRD-ECO-009` AcquisitionPlan MUST distinguish buy/rent/borrow/license/commission where known.
- `PRD-ECO-010` Rights/licensing costs MUST not imply permission unless actual RightsStatus/proof exists.
- `PRD-ECO-011` Production economics MUST NOT become full accounting/tax in v1.3.
- `PRD-ECO-012` AI MUST NOT fabricate market quotes or freelancer prices.
- `PRD-ECO-013` Scenario assumptions MUST be inspectable and editable.
- `PRD-ECO-014` User MAY choose a more expensive scenario for artistic reasons without warning framed as failure.

## 15. AI behavior
Can summarize scenarios and calculate from supplied values; may suggest missing cost categories but must not invent prices. If current external quote research is explicitly requested, that belongs to Research/integration with sourced evidence.

## 16. Human approval
Scenario choice and financial values human-controlled.

## 17. Validation
Currency, numeric ranges, actual vs estimate, no division by zero, derivative counts nonnegative/unknown.

## 18. UI states
No economics, partial estimate, unknown quote, comparable scenarios, selected, actualized.

## 19. Edge cases
Mixed currencies; free collaboration with hidden obligations; one shoot serves many campaigns; asset licensed only limited term.

## 20. Cross-module effects
Production decision, Asset acquisition, Business cost context and Decision Memory; not automatic RevenueEvent.

## 21. Notifications and attention model
Only selected production plan with unresolved critical cost/quote if it blocks scheduled shoot.

## 22. Search / filtering / sorting / bulk actions
Not primary; compare scenarios side-by-side.

## 23. Analytics and product telemetry
Feature use, estimate→actual variance, chosen scenario, manual corrections. Never optimize solely for cheapest cost.

## 24. Learning feedback
Can generate operational learnings around recurring cost/efficiency after sufficient observations.

## 25. Auditability / provenance
Assumption author/source/date, quote evidence link, selected scenario rationale.

## 26. Desktop / mobile behavior
Desktop comparison; mobile read/update quote/actual quickly.

## 27. Accessibility / usability
Clear estimate labels and units; no misleading precision.

## 28. Security / privacy / rights
Quotes/contracts may be private; rights proof handled by Asset Rights domain.

## 29. Performance / async jobs
Calculations synchronous; external research async only if explicitly requested.

## 30. Acceptance criteria
- `PRD-ECO-AC01` Unknown cost is not displayed as 0.
- `PRD-ECO-AC02` Estimate vs actual is distinct.
- `PRD-ECO-AC03` Lowest-cost scenario is not auto-selected as best.
- `PRD-ECO-AC04` Assumptions are visible/editable.
- `PRD-ECO-AC05` No accounting/tax behavior is implied.

## 31. Test matrix
Zero-owned setup; partial unknown cost; mixed currency; licensed stock; expensive creative exception; estimate actualization.

## 32. Open questions
Whether production cost estimates live on ShootSession, a dedicated scenario entity, Decision evidence, or Business cost model.

## 33. Traceability
MASTER §186, §191, §264–268, §277.
