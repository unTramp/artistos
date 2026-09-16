# Audience Sources

- **Status:** REVIEW COMPLETE
- **MASTER references:** §247, §287–300
- **Domain:** 12_growth_market
- **Feature slug:** `audience-sources`
- **Requirement prefix:** `GRO-SRC`

## 2. Purpose
Classify how audience attention arrived so growth analysis can distinguish warm, organic, paid, collaboration, search, live, DSP and owned-media pathways.

## 3. User problem / job-to-be-done
Without source context, follower/listener growth is easy to misinterpret. The artist needs a normalized source dimension while preserving unknown attribution.

## 4. Scope
### In scope
- AudienceSource enum
- source attribution on relevant aggregates/events
- unknown/probable boundaries
- source mix over time

### Out of scope / non-goals
- person-level journey tracking
- perfect multi-touch attribution
- retroactive guessing

## 5. Entry points
- Growth Analytics
- Campaign
- Market opportunity
- Business attribution context

## 6. Preconditions and dependencies
- normalized metrics/events
- campaign/publication/live/DSP data
- attribution confidence where relevant

## 7. Information architecture
Import/observe event aggregate → map known source → preserve unknown where unresolved → show source mix → compare periods/campaigns → feed Insights.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER enum WARM_NETWORK, ORGANIC_DISCOVERY, PAID, COLLABORATION, SEARCH, LIVE, DSP, OWNED_MEDIA. Unknown may remain unset rather than inventing a new enum without schema decision.

## 10. Main happy-path workflow
1. Inspect source mix
2. review mapping/provenance
3. correct mapping template where evidence exists
4. create Insight from repeated pattern

## 11. Alternative workflows
- source cannot be determined
- mixed source campaign
- platform reports only broad category
- paid extension not installed

## 12. User actions
- filter source
- open provenance
- correct import mapping
- export aggregate

## 13. State model
Historical source attribution should be versioned/provenanced when mapping changes.

## 14. Business rules
- `GRO-SRC-001` AudienceSource MUST use MASTER categories when known.
- `GRO-SRC-002` Unknown source MUST remain unknown rather than guessed.
- `GRO-SRC-003` PAID source may be represented for imported/future extension evidence but does not make Advertising part of this domain.
- `GRO-SRC-004` Source attribution MUST expose confidence/provenance where inference rather than direct reporting is used.
- `GRO-SRC-005` Source mix MUST not imply person-level tracking by default.
- `GRO-SRC-006` Cross-platform source categories SHOULD not be assumed semantically identical without mapping notes.
- `GRO-SRC-007` Missing source data MUST not be interpreted as organic.
- `GRO-SRC-008` AI MUST not infer audience source from demographic stereotypes or unsupported proxies.
- `GRO-SRC-009` Source distribution changes are observations, not proof of causation.
- `GRO-SRC-010` Historical mapping corrections MUST preserve audit provenance.

## 15. AI behavior
AI can summarize source shifts from structured data and uncertainty, not assign unknown traffic based on guesswork.

## 16. Human approval
Mapping corrections/promoted insights are human-reviewable.

## 17. Validation
- category valid
- mapping source known
- confidence retained if inferred

## 18. UI states
- direct source
- probable/inferred
- unknown
- mapping changed
- partial data

## 19. Edge cases
- mixed attribution
- platform changes export labels
- same event attributed differently by providers

## 20. Cross-module effects
- Analytics
- Markets
- Campaign
- DSP
- Owned Media
- Future Advertising

## 21. Notifications and attention model
- large source shift with data-quality warning
- mapping schema changed

## 22. Search / filtering / sorting / bulk actions
Filter by source/platform/market/period/campaign. No person search.

## 23. Analytics and product telemetry
- source mapped
- mapping corrected
- unknown rate
- insight handoff

## 24. Learning feedback
Feeds source-aware Insights with uncertainty.

## 25. Auditability / provenance
Store raw source label, normalized source, mapping version and confidence/provenance.

## 26. Desktop / mobile behavior
Desktop charts; mobile summary.

## 27. Accessibility / usability
Always show UNKNOWN/unattributed share where meaningful.

## 28. Security / privacy / rights
No person-level identifiers required.

## 29. Performance / async jobs
Import normalization may run async.

## 30. Acceptance criteria
- `GRO-SRC-AC01` Unknown is never silently mapped to organic.
- `GRO-SRC-AC02` Paid remains a source label, not an Advertising implementation.
- `GRO-SRC-AC03` Mapping provenance is inspectable.
- `GRO-SRC-AC04` Source shift is not labelled causal.

## 31. Test matrix
- unknown
- mixed source
- provider schema change
- future paid import

## 32. Open questions
- Need canonical location for attribution-confidence metadata when AudienceSource is attached to aggregates.

## 33. Traceability
MASTER §247, §287–300
