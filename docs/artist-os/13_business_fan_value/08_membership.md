# Membership Programs

- **Status:** REVIEW COMPLETE
- **MASTER references:** §279–283, §271
- **Domain:** 13_business_fan_value
- **Feature slug:** `membership`
- **Requirement prefix:** `BIZ-MEM`

## 2. Purpose
Model membership tiers, benefits, capacity and aggregate economics so recurring fan value can be planned sustainably without turning Artist OS into the membership provider.

## 3. User problem / job-to-be-done
Membership can create recurring value but overpromised benefits and artist-time load can make it unsustainable. The OS needs tier/benefit planning and aggregate retention economics.

## 4. Scope
### In scope
- MembershipProgram/Tier/Benefit
- provider reference
- capacity/access rules
- delivery cost/artist time/scalability
- aggregate analytics
- offer linkage

### Out of scope / non-goals
- billing engine
- member CRM/person records
- content paywall implementation

## 5. Entry points
- Business home
- Offer
- Website
- Live membership access

## 6. Preconditions and dependencies
- provider
- Fan cohorts aggregates
- RevenueEvents
- Identity/Campaign

## 7. Information architecture
Create program → define tiers/price/billing → benefits/capacity/access → estimate delivery cost/time → approve provider setup externally → import aggregate membership analytics → review sustainability.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER MembershipProgram, MembershipTier and MembershipBenefit plus metrics MRR, ActiveMembers, NewMembers, Churn, Retention, ARPU, TierDistribution, UpgradeRate.

## 10. Main happy-path workflow
1. Connect/select provider
2. Define tiers and benefits
3. Estimate delivery cost/time/scalability
4. Check capacity/identity fit
5. Launch externally
6. Import aggregate metrics/revenue
7. Review churn/retention/load

## 11. Alternative workflows
- single tier
- capacity-limited personal benefit
- free trial not modeled explicitly
- provider reports incomplete metrics

## 12. User actions
- create/edit tier
- add benefit
- set capacity
- archive tier
- refresh aggregate analytics

## 13. State model
Program/tier status enums not defined; provider remains source for actual subscriptions/member records.

## 14. Business rules
- `BIZ-MEM-001` MembershipProgram MUST reference a provider rather than implement billing in v1.3.
- `BIZ-MEM-002` MembershipTier fields MUST preserve price/billingPeriod/benefits/capacity/access rules.
- `BIZ-MEM-003` Benefits SHOULD include delivery cost, artist time estimate and scalability.
- `BIZ-MEM-004` Capacity-limited benefits MUST reflect real capacity, not fake scarcity.
- `BIZ-MEM-005` Aggregate membership analytics MAY be stored without importing member PII.
- `BIZ-MEM-006` MRR/ARPU/churn/retention definitions MUST follow provider/source semantics and period.
- `BIZ-MEM-007` OS MUST NOT fabricate retention when cohort data is unavailable.
- `BIZ-MEM-008` AI may suggest tier structures but MUST not promise recurring income or infer willingness to pay.
- `BIZ-MEM-009` Benefit sustainability/artist load SHOULD be visible alongside revenue.
- `BIZ-MEM-010` LIVE membership access MAY link to LiveSession without duplicating membership truth.
- `BIZ-MEM-011` Disconnecting provider MUST preserve historical aggregates.

## 15. AI behavior
AI can draft tier/benefit scenarios based on identity and capacity, and summarize aggregate churn/retention. It cannot subscribe users, alter billing or inspect member identities by default.

## 16. Human approval
Pricing, benefits, capacity and provider launch remain human-controlled.

## 17. Validation
- billing period/price coherent
- capacity real if set
- benefits have load fields where relevant
- aggregate metrics source documented

## 18. UI states
- draft
- active
- tier capacity concern
- provider stale
- archived
- metrics partial

## 19. Edge cases
- tier price changes
- benefit removed for future members
- provider churn definition differs
- member PII webhook arrives

## 20. Cross-module effects
- Offers
- Live
- Website
- RevenueEvents
- Fan Cohorts

## 21. Notifications and attention model
- churn spike
- capacity-heavy benefit overcommitted
- provider sync stale

## 22. Search / filtering / sorting / bulk actions
Filter tier/status/period; no member-person search.

## 23. Analytics and product telemetry
- tier created
- benefit edited
- provider connected
- aggregate metrics imported
- capacity warning

## 24. Learning feedback
Membership outcomes may inform offer/business learnings with aggregate evidence.

## 25. Auditability / provenance
Preserve tier/benefit versions and provider metric definitions/provenance.

## 26. Desktop / mobile behavior
Desktop tier planning/analytics; mobile program health.

## 27. Accessibility / usability
Clearly show recurring price period and real capacity.

## 28. Security / privacy / rights
Member PII stays with provider by default; secrets server-side.

## 29. Performance / async jobs
Provider metrics/revenue imports async/idempotent.

## 30. Acceptance criteria
- `BIZ-MEM-AC01` No member list is required.
- `BIZ-MEM-AC02` Capacity is real, not deceptive.
- `BIZ-MEM-AC03` Provider defines actual subscription state.
- `BIZ-MEM-AC04` Missing retention is not fabricated.

## 31. Test matrix
- single tier
- capacity benefit
- provider stale
- price change
- PII webhook

## 32. Open questions
- Tier/version lifecycle and benefit-change semantics for existing vs new members need provider-aware engineering design.

## 33. Traceability
MASTER §279–283, §271
