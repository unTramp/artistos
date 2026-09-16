# Fan Value Cohorts

- **Status:** REVIEW COMPLETE
- **MASTER references:** §269–271, §300
- **Domain:** 13_business_fan_value
- **Feature slug:** `fan-cohorts`
- **Requirement prefix:** `BIZ-FAN`

## 2. Purpose
Represent audience depth as aggregate cohorts from casual attention to repeat buyer/member without defaulting to person-level psychological profiling.

## 3. User problem / job-to-be-done
Follower count does not show relationship depth. Artists need aggregate signals of engagement and paying/member behavior while preserving privacy boundaries.

## 4. Scope
### In scope
- MASTER cohort enum
- aggregate counts/rates
- funnel transitions where data supports
- source/time context
- privacy boundary

### Out of scope / non-goals
- individual fan score
- psychological profiling
- cross-platform identity stitching by default

## 5. Entry points
- Business home
- Audience analytics
- Membership/Offer analytics

## 6. Preconditions and dependencies
- aggregate engagement/commerce/membership data
- privacy scope
- RevenueEvents

## 7. Information architecture
Import/derive aggregate cohort counts from available data → show size/depth over time → inspect gaps/data coverage → connect to offers/scenarios without exposing individuals.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER FanValueCohort: CASUAL, ENGAGED, HIGH_AFFINITY, PAYING, REPEAT_BUYER, MEMBER. Funnel: DISCOVERY → FOLLOWER → ENGAGED → HIGH_AFFINITY → FIRST_PURCHASE → REPEAT_PURCHASE → MEMBER/ADVOCATE.

## 10. Main happy-path workflow
1. Select period/source scope
2. System shows supported cohort aggregates
3. Display unknown coverage/definitions
4. Compare changes
5. Use cohort as audience segment input for Offer planning

## 11. Alternative workflows
- no commerce data
- membership provider only
- social engagement but no identity linkage
- cohort definitions partially observable

## 12. User actions
- filter cohort/source/period
- open definition
- export aggregates
- create Offer targeting assumption

## 13. State model
Cohort labels are analytical categories, not permanent identities of people. Aggregates may be snapshots over period.

## 14. Business rules
- `BIZ-FAN-001` FanValueCohort MUST use MASTER enum.
- `BIZ-FAN-002` Cohorts MUST be aggregate by default; person-level membership requires explicit CRM/ecommerce scope.
- `BIZ-FAN-003` OS MUST NOT create hidden “fan value scores” for individuals.
- `BIZ-FAN-004` Follower count MUST not be treated as equivalent to high affinity or paying status.
- `BIZ-FAN-005` Cohort definitions MUST disclose which observable signals support them.
- `BIZ-FAN-006` Unknown/unobservable transitions MUST remain unknown.
- `BIZ-FAN-007` Cross-platform identity stitching MUST not be assumed.
- `BIZ-FAN-008` High-affinity inference from engagement alone SHOULD be conservative and explainable.
- `BIZ-FAN-009` Offer planning MAY target a cohort conceptually without exposing individual identities.
- `BIZ-FAN-010` AI MUST not infer sensitive personal traits from cohort behavior.
- `BIZ-FAN-011` Fan depth and audience size MUST remain separate analytical axes.

## 15. AI behavior
AI can summarize aggregate cohort changes and scenario implications, but cannot profile individuals or infer hidden traits.

## 16. Human approval
Any future person-level integration requires explicit feature/privacy approval outside default v1.3 behavior.

## 17. Validation
- aggregate source documented
- definitions visible
- no person IDs stored by default

## 18. UI states
- no data
- partial cohorts
- aggregate healthy
- definition changed
- provider stale

## 19. Edge cases
- member also repeat buyer
- same person unknown across providers
- social engagement cannot be linked to purchase

## 20. Cross-module effects
- Offers
- Membership
- Revenue Goals
- Analytics

## 21. Notifications and attention model
- cohort data stale
- definition/source changed

## 22. Search / filtering / sorting / bulk actions
Filter cohort/source/period. No person-level search.

## 23. Analytics and product telemetry
- cohort snapshot updated
- definition viewed
- offer assumption created

## 24. Learning feedback
Cohort shifts can become business Insights with clear data limitations.

## 25. Auditability / provenance
Preserve source/definition/version/period.

## 26. Desktop / mobile behavior
Desktop funnel/aggregates; mobile summary.

## 27. Accessibility / usability
Use plain definitions and uncertainty; no gamified ranking of fans.

## 28. Security / privacy / rights
Privacy-first aggregate processing; no sensitive inference.

## 29. Performance / async jobs
Provider aggregate imports async.

## 30. Acceptance criteria
- `BIZ-FAN-AC01` No individual fan score exists by default.
- `BIZ-FAN-AC02` Follower count is not high affinity.
- `BIZ-FAN-AC03` Cross-platform identity is not assumed.
- `BIZ-FAN-AC04` Cohort definitions are inspectable.

## 31. Test matrix
- no commerce
- membership-only
- overlapping cohorts
- unlinked providers

## 32. Open questions
- Formal cohort-definition thresholds/rules should be configurable/evidence-based and not hardcoded prematurely.

## 33. Traceability
MASTER §269–271, §300
