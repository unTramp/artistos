# Fan Value Analytics

- **Status:** REVIEW COMPLETE
- **MASTER references:** §269–271, §282, §300
- **Domain:** 14_analytics
- **Feature slug:** `fan-value-analytics`
- **Requirement prefix:** `ANA-FAN`

## 2. Purpose
Analyze audience size and relationship depth as separate axes using aggregate cohort, membership and revenue evidence.

## 3. User problem / job-to-be-done
Large follower counts can coexist with low retention or paid support. The OS needs to show depth without creating invasive fan scores.

## 4. Scope
### In scope
- aggregate fan cohort trends
- membership metrics
- revenue/support depth
- audience size vs depth matrix
- period/source coverage

### Out of scope / non-goals
- individual fan scoring
- psychological profiling
- cross-platform person identity stitching

## 5. Entry points
- Analytics
- Business Fan Cohorts
- Membership

## 6. Preconditions and dependencies
- FanValueCohort aggregates
- Membership analytics
- RevenueEvents
- audience metrics

## 7. Information architecture
Select period/source → show audience size → show depth/cohort/membership measures separately → inspect coverage/definitions → create business/audience Insight.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
Projection over aggregate Business/Growth data.

## 10. Main happy-path workflow
1. compare periods
2. inspect cohort definitions
3. view membership retention/ARPU
4. create Insight

## 11. Alternative workflows
- no commerce integration
- membership only
- followers without identity linkage
- multi-provider overlap unknown

## 12. User actions
- filter source/cohort/period
- open definition
- create Insight

## 13. State model
No lifecycle.

## 14. Business rules
- `ANA-FAN-001` Audience size and audience depth MUST remain separate axes.
- `ANA-FAN-002` Follower count MUST NOT imply high fan value.
- `ANA-FAN-003` Person-level fan scoring MUST NOT be introduced by analytics default.
- `ANA-FAN-004` Cohort definitions/source coverage MUST be inspectable.
- `ANA-FAN-005` Unknown overlap across providers/platforms MUST not be deduplicated by guesswork.
- `ANA-FAN-006` Membership MRR/retention/ARPU MUST preserve provider definition/period.
- `ANA-FAN-007` Revenue depth metrics MUST distinguish actual purchases/revenue from clicks/engagement.
- `ANA-FAN-008` AI MUST not infer sensitive traits or loyalty from sparse behavior.
- `ANA-FAN-009` Fan-value insights MUST remain aggregate unless explicit future privacy scope exists.

## 15. AI behavior
AI summarizes aggregate depth trends and caveats; no individual profiling.

## 16. Human approval
Insight/Learning promotion human-reviewed.

## 17. Validation
- aggregate only
- definition known
- period/source explicit

## 18. UI states
- no depth data
- partial
- membership-rich
- provider overlap unknown

## 19. Edge cases
- same member across providers unknown
- gift purchase
- refund

## 20. Cross-module effects
- Business
- Membership
- Fan Cohorts
- Insights

## 21. Notifications and attention model
- depth data stale
- provider definition change

## 22. Search / filtering / sorting / bulk actions
Filter cohort/source/period; no individual search.

## 23. Analytics and product telemetry
- fan-value view
- definition opened
- Insight created

## 24. Learning feedback
Feeds AUDIENCE/BUSINESS scoped learning.

## 25. Auditability / provenance
Preserve provider/source definitions.

## 26. Desktop / mobile behavior
Desktop matrix/trends; mobile summary.

## 27. Accessibility / usability
Avoid ranking fans or manipulative labels.

## 28. Security / privacy / rights
Aggregate/privacy-first.

## 29. Performance / async jobs
Aggregation/import async.

## 30. Acceptance criteria
- `ANA-FAN-AC01` Follower growth alone is not fan-value growth.
- `ANA-FAN-AC02` No individual score.
- `ANA-FAN-AC03` Provider overlap unknown is explicit.
- `ANA-FAN-AC04` Actual purchase differs from click.

## 31. Test matrix
- followers only
- membership only
- provider overlap
- refund

## 32. Open questions
- A unified aggregate depth index is intentionally not defined; keep dimensions explicit.

## 33. Traceability
MASTER §269–271, §282, §300
