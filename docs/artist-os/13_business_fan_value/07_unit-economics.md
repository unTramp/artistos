# Unit Economics

- **Status:** REVIEW COMPLETE
- **MASTER references:** §268, §277, §274, §286
- **Domain:** 13_business_fan_value
- **Feature slug:** `unit-economics`
- **Requirement prefix:** `BIZ-UEC`

## 2. Purpose
Calculate transparent per-unit economics for offers so pricing and operational decisions use real cost components instead of gross revenue alone.

## 3. User problem / job-to-be-done
A high retail price can still produce weak contribution after production, fulfillment and fees. Artists need deterministic economics with missing-data warnings.

## 4. Scope
### In scope
- UnitEconomics fields
- gross/contribution margin
- scenario vs actual inputs
- cost completeness
- offer linkage

### Out of scope / non-goals
- tax accounting
- overhead allocation/depreciation
- guaranteed profitability

## 5. Entry points
- Offer/Merch
- Business home
- Revenue scenario

## 6. Preconditions and dependencies
- price
- production/fulfillment/platform/payment/return cost estimates
- currency

## 7. Information architecture
Open offer economics → enter/confirm cost components → deterministic calculation → show margin and missing inputs → compare scenarios/provider quotes → save decision context.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER `UnitEconomics {price, productionCost, fulfillmentCost, platformFee, paymentFee, estimatedReturnCost, grossMargin, contributionMargin}`. Currency and exact gross-margin formula semantics need schema/financial definition.

## 10. Main happy-path workflow
1. Enter price/costs
2. System validates units/currency
3. Calculate gross/contribution margins deterministically
4. Flag missing estimated costs
5. Compare alternatives
6. Use selected scenario in Offer/Revenue planning

## 11. Alternative workflows
- zero fulfillment digital product
- percentage fee vs fixed fee
- returns unknown
- provider quote range

## 12. User actions
- edit inputs
- duplicate scenario
- compare
- mark estimate/actual if implementation supports
- link decision

## 13. State model
Economics version/scenario should preserve historical assumptions; final schema unresolved.

## 14. Business rules
- `BIZ-UEC-001` Unit economics calculations MUST be deterministic from explicit inputs.
- `BIZ-UEC-002` Missing cost MUST NOT default to zero unless user explicitly confirms zero.
- `BIZ-UEC-003` Gross revenue and contribution margin MUST remain distinct.
- `BIZ-UEC-004` EstimatedReturnCost MUST be labelled estimate when not actual.
- `BIZ-UEC-005` Fees expressed as percentages/fixed amounts must be normalized transparently in implementation.
- `BIZ-UEC-006` Negative contribution margin MUST be shown accurately and not hidden.
- `BIZ-UEC-007` AI MUST not invent costs to complete a scenario.
- `BIZ-UEC-008` Comparison SHOULD include operational load qualitatively when relevant, not margin alone.
- `BIZ-UEC-009` Historical scenarios/actuals MUST preserve assumptions/quotes used at the time.
- `BIZ-UEC-010` Unit economics MUST not claim net business profit when broader operating costs/taxes are excluded.

## 15. AI behavior
AI may explain drivers and suggest which missing input to obtain; arithmetic remains deterministic.

## 16. Human approval
User owns cost assumptions and pricing decisions.

## 17. Validation
- same currency or explicit conversion
- numeric ranges valid
- zero cost explicitly confirmed
- formula version known

## 18. UI states
- incomplete
- complete estimate
- negative margin
- alternative scenarios
- historical

## 19. Edge cases
- percentage fee tiers
- returns exceed estimate
- multi-currency provider
- free offer

## 20. Cross-module effects
- Offers
- Merch
- Revenue Goals
- Decision Memory

## 21. Notifications and attention model
- negative margin active offer
- key cost missing/stale

## 22. Search / filtering / sorting / bulk actions
Filter/compare by offer/provider/scenario/date.

## 23. Analytics and product telemetry
- cost input changed
- calculation viewed
- negative margin warning
- scenario selected

## 24. Learning feedback
Economics may support business decisions, not creative identity learning by default.

## 25. Auditability / provenance
Version assumptions/formula and input provenance.

## 26. Desktop / mobile behavior
Desktop comparison; mobile margin summary/warning.

## 27. Accessibility / usability
Show equation/components and estimated/actual labels.

## 28. Security / privacy / rights
Financial values sensitive; no customer PII needed.

## 29. Performance / async jobs
Synchronous calculation; no AI dependency.

## 30. Acceptance criteria
- `BIZ-UEC-AC01` Missing cost is not silently zero.
- `BIZ-UEC-AC02` Negative margin is visible.
- `BIZ-UEC-AC03` Contribution margin is not called net profit.
- `BIZ-UEC-AC04` Arithmetic reproducible from inputs.

## 31. Test matrix
- missing cost
- zero cost
- negative margin
- percentage fee
- multi-currency

## 32. Open questions
- Formal formula definitions and currency handling must be frozen with finance terminology during engineering spec.

## 33. Traceability
MASTER §268, §277, §274, §286
