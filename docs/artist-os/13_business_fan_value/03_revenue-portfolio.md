# Revenue Portfolio

- **Status:** REVIEW COMPLETE
- **MASTER references:** §267–268, §284–286
- **Domain:** 13_business_fan_value
- **Feature slug:** `revenue-portfolio`
- **Requirement prefix:** `BIZ-PRT`

## 2. Purpose
Show how reported/expected artist revenue is distributed across distinct revenue sources so strategy is not reduced to streaming alone.

## 3. User problem / job-to-be-done
Independent artists can earn through many channels, but fragmented data obscures concentration risk and operational trade-offs.

## 4. Scope
### In scope
- MASTER revenue source categories
- actual revenue mix
- scenario mix
- source-level trend
- concentration/context

### Out of scope / non-goals
- investment advice
- tax categorization
- forced diversification

## 5. Entry points
- Business home
- Revenue Goal scenario
- Analytics

## 6. Preconditions and dependencies
- RevenueEvents
- DSPRevenueSnapshot
- Live/Merch/Membership

## 7. Information architecture
Aggregate RevenueEvents → map source category → show actual portfolio by period → compare scenario/goal mix → inspect concentration and data completeness.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER categories STREAMING, LIVE_SHOWS, LIVE_STREAMS, MERCH, MEMBERSHIPS, PHYSICAL_MUSIC, DIGITAL_PRODUCTS, SYNC, BRAND_PARTNERSHIPS, CREATOR_SERVICES, OTHER.

## 10. Main happy-path workflow
1. Select period
2. Review actual revenue by category
3. Open source evidence
4. Compare to planning scenario
5. Create decision/hypothesis if concentration matters

## 11. Alternative workflows
- one source only
- category unknown
- barter/non-cash value
- multi-currency incomplete

## 12. User actions
- filter period/category
- reclassify with evidence
- open events
- export aggregate

## 13. State model
Portfolio is derived from immutable-ish events; category corrections preserve audit.

## 14. Business rules
- `BIZ-PRT-001` RevenuePortfolio categories MUST use MASTER vocabulary.
- `BIZ-PRT-002` Portfolio actuals MUST derive from RevenueEvents/import evidence, not scenario values.
- `BIZ-PRT-003` Unknown/unclassified source MUST not be forced into a misleading category; OTHER may be used with detail.
- `BIZ-PRT-004` Source concentration is descriptive and MUST not be presented automatically as “bad”.
- `BIZ-PRT-005` Missing revenue integrations MUST be disclosed before presenting portfolio completeness.
- `BIZ-PRT-006` Cross-currency aggregation MUST expose conversion assumptions/source/date.
- `BIZ-PRT-007` Non-cash/barter value MUST not be counted as revenue unless explicitly modeled as such.
- `BIZ-PRT-008` AI MUST not recommend a source solely because it has high gross revenue while ignoring margin/load/identity fit.
- `BIZ-PRT-009` Portfolio planning and actuals MUST remain visually distinct.

## 15. AI behavior
AI may summarize concentration/trade-offs and suggest scenario questions, not make investment-style prescriptions or fabricate missing income.

## 16. Human approval
Category corrections and business strategy decisions human-reviewed.

## 17. Validation
- event category valid
- period/currency clear
- conversion assumption exposed

## 18. UI states
- complete
- partial sources
- multi-currency
- unclassified
- no actual revenue

## 19. Edge cases
- refund shifts source negative
- royalty delay
- one event maps to multiple business lines

## 20. Cross-module effects
- Revenue Goals
- Unit Economics
- Revenue Events
- DSP/Live

## 21. Notifications and attention model
- data source stale
- large unclassified share

## 22. Search / filtering / sorting / bulk actions
Filter category/period/currency/campaign/offer.

## 23. Analytics and product telemetry
- category corrected
- portfolio viewed
- data completeness warning

## 24. Learning feedback
May generate business hypotheses but not automatic optimization rules.

## 25. Auditability / provenance
Preserve event-to-category mapping provenance.

## 26. Desktop / mobile behavior
Desktop charts/table; mobile summary.

## 27. Accessibility / usability
Show totals and missing-data caveats in text/table, not only pie chart.

## 28. Security / privacy / rights
Financial aggregates access-controlled.

## 29. Performance / async jobs
Aggregation async for large history.

## 30. Acceptance criteria
- `BIZ-PRT-AC01` Scenario values never appear as actual portfolio.
- `BIZ-PRT-AC02` Missing source integrations are disclosed.
- `BIZ-PRT-AC03` Concentration is descriptive, not moralized.
- `BIZ-PRT-AC04` Currency assumptions visible.

## 31. Test matrix
- single source
- missing data
- multi-currency
- negative adjustment

## 32. Open questions
- Mapping RevenueEvent.source to RevenuePortfolio enum needs canonical schema mapping.

## 33. Traceability
MASTER §267–268, §284–286
