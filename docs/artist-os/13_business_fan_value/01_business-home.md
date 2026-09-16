# Business & Fan Value Command Center

- **Status:** REVIEW COMPLETE
- **MASTER references:** §264–286, §287–315
- **Domain:** 13_business_fan_value
- **Feature slug:** `business-home`
- **Requirement prefix:** `BIZ-HOM`

## 2. Purpose
Give the artist a strategic view of revenue goals, portfolio, offers, fan-value depth and unit economics without turning Artist OS into accounting software.

## 3. User problem / job-to-be-done
Artists often see follower/stream counts without understanding what value exchange is sustainable. They need revenue scenarios, offer economics and audience depth with correct financial terminology.

## 4. Scope
### In scope
- revenue goal progress
- revenue portfolio
- offers/membership/merch summaries
- fan-value cohorts
- unit economics warnings
- revenue-event evidence

### Out of scope / non-goals
- tax/accounting
- payroll
- double-entry bookkeeping
- guaranteed income forecast

## 5. Entry points
- primary nav Business
- Overview
- Campaign
- Offer/Membership

## 6. Preconditions and dependencies
- RevenueGoal
- RevenueEvent
- Offer/Merch/Membership
- FanValueCohort aggregates
- DSP revenue
- Live revenue

## 7. Information architecture
Goal context → actual reported revenue → portfolio mix → active offers → audience depth → economics/operational load → scenarios/next decisions.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
Projection over Business entities. Financial labels preserve gross, fees, COGS, contribution and net-operating distinctions.

## 10. Main happy-path workflow
1. Open Business
2. Choose period/currency context
3. Review goal vs reported evidence
4. Inspect revenue sources and active offers
5. Review unit economics and fan-value depth
6. Create/edit scenario/offer/decision

## 11. Alternative workflows
- no revenue yet
- multi-currency
- free community strategy
- no person-level ecommerce integration
- incomplete cost data

## 12. User actions
- set goal
- create scenario
- open offer
- record/import revenue event
- review cohort aggregate
- create decision

## 13. State model
No lifecycle; reflects underlying business entities and data completeness.

## 14. Business rules
- `BIZ-HOM-001` Business Engine MUST remain strategic and MUST NOT become full accounting/tax software.
- `BIZ-HOM-002` Gross revenue, fees, COGS, fulfillment, contribution margin and net operating result MUST be labelled distinctly.
- `BIZ-HOM-003` Revenue MUST NOT be called salary/profit unless the value actually matches that definition.
- `BIZ-HOM-004` Missing costs MUST be visible and MUST prevent false precision in margin/net calculations.
- `BIZ-HOM-005` Revenue scenarios MUST expose assumptions and MUST NOT be presented as forecasts guaranteed to occur.
- `BIZ-HOM-006` Fan value depth and audience size MUST be shown as separate dimensions.
- `BIZ-HOM-007` Free/community actions MUST not be labelled business failures solely because they generate no immediate revenue.
- `BIZ-HOM-008` Business recommendations MUST respect Identity and trust; deceptive scarcity is prohibited.
- `BIZ-HOM-009` Person-level fan data remains out of scope by default.
- `BIZ-HOM-010` AI MUST not promise income, fabricate conversion or fill missing financial values silently.
- `BIZ-HOM-011` DSP imported royalties and other evidence SHOULD preserve source/period/currency.
- `BIZ-HOM-012` Material business decisions SHOULD be recordable in Decision Memory.

## 15. AI behavior
AI may build transparent scenarios, summarize portfolio/economics and identify missing assumptions. Calculations should be deterministic; model language must distinguish scenario from actual.

## 16. Human approval
Prices, offers, membership launches and material financial decisions remain human-controlled.

## 17. Validation
- currency explicit
- period explicit
- missing costs flagged
- actual vs scenario separated

## 18. UI states
- cold start
- partial cost data
- multi-currency
- active offers
- goal at risk
- data stale

## 19. Edge cases
- refunds/negative revenue
- barter collaboration
- royalty delay
- free live
- currency conversion missing

## 20. Cross-module effects
- DSP Revenue
- Growth/Live
- Campaign
- Analytics
- Decision Memory

## 21. Notifications and attention model
- negative-margin active offer
- goal assumption invalidated
- membership churn/revenue import stale

## 22. Search / filtering / sorting / bulk actions
Filter by period/source/offer/currency. No person-level buyer search by default.

## 23. Analytics and product telemetry
- goal created
- scenario viewed
- offer opened
- missing-cost warning
- decision recorded

## 24. Learning feedback
Business evidence flows through Insights/Hypotheses where appropriate; actual financial records remain facts, not creative learnings.

## 25. Auditability / provenance
Preserve source/provenance, currency, period, assumptions and manual corrections.

## 26. Desktop / mobile behavior
Desktop is primary finance/strategy surface; mobile high-level health and offer alerts.

## 27. Accessibility / usability
Every number labels gross/net/estimated/reported. Do not imply precision when inputs are estimates.

## 28. Security / privacy / rights
Financial documents and provider integrations are sensitive. Aggregate fan data by default.

## 29. Performance / async jobs
Imports/aggregation async; dashboard loads from stored structured data.

## 30. Acceptance criteria
- `BIZ-HOM-AC01` Missing cost prevents false precise contribution margin.
- `BIZ-HOM-AC02` Scenario assumptions are visible.
- `BIZ-HOM-AC03` Revenue is not labelled profit by default.
- `BIZ-HOM-AC04` Free community activity is not revenue failure.
- `BIZ-HOM-AC05` No person-level fan list appears.

## 31. Test matrix
- no revenue
- missing costs
- multi-currency
- negative adjustment
- free live

## 32. Open questions
- Canonical business base currency and currency-conversion policy need engineering/product freeze.

## 33. Traceability
MASTER §264–286, §287–315
