# Market Opportunities

- **Status:** REVIEW COMPLETE
- **MASTER references:** §252–255, §287–315
- **Domain:** 12_growth_market
- **Feature slug:** `market-opportunities`
- **Requirement prefix:** `GRO-MKT`

## 2. Purpose
Help the artist identify countries/regions/languages showing meaningful response using multiple signals and explicit uncertainty, rather than selecting markets from cheap reach alone.

## 3. User problem / job-to-be-done
International signals can conflict: a country may have cheap clicks but weak retention, or strong organic listeners but little social growth. The OS needs evidence dimensions, not a magic market score.

## 4. Scope
### In scope
- MarketOpportunity
- market signals from MASTER
- evidence/confidence
- song/genre/language context
- market comparison
- decision/hypothesis linkage

### Out of scope / non-goals
- automatic market ranking/winner
- political/demographic profiling
- cheap-cost-only optimization

## 5. Entry points
- Growth home
- Campaign
- Song analytics
- Geo Experiment

## 6. Preconditions and dependencies
- organic/DSP/social/search/collab signals
- market/language metadata
- future ad cost extension only as one signal

## 7. Information architecture
Select artist/song/campaign context → aggregate market signals → show dimensions/sample/freshness → compare markets without single score → create opportunity/hypothesis → test with content/live/collaboration/geo experiment.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER `MarketOpportunity {country, region?, language, songId?, genre?, signals, confidence}`. `signals`: organicListeners, followerGrowth, engagement, streamGrowth, playlistPresence, adPerformanceExtension, searchInterest, creatorInteractions.

## 10. Main happy-path workflow
1. Open markets
2. Choose scope/period
3. System displays comparable signals by market
4. Inspect one market evidence
5. Mark opportunity/watch/reject with rationale if product adds operational state
6. Create Geo Experiment or localized content test

## 11. Alternative workflows
- one signal only
- market sample tiny
- artist sings in different language
- diaspora response
- cheap paid signal conflicts with organic retention

## 12. User actions
- filter markets
- open evidence
- compare selected markets
- create geo experiment
- record decision

## 13. State model
Opportunity confidence is evidence-aware; exact lifecycle/status beyond MASTER is open.

## 14. Business rules
- `GRO-MKT-001` MarketOpportunity MUST expose dimensions/evidence rather than a single magic score.
- `GRO-MKT-002` Country/region priority MUST NOT be chosen solely from cheap acquisition/cost signals.
- `GRO-MKT-003` Market signals MUST retain period/source/sample where available.
- `GRO-MKT-004` Missing signal MUST be unknown, not zero.
- `GRO-MKT-005` Confidence MUST reflect evidence strength/coverage and be explainable.
- `GRO-MKT-006` Organic response, retention/music conversion and qualitative fit SHOULD be considered separately.
- `GRO-MKT-007` Language/genre/context SHOULD inform interpretation but MUST NOT become stereotype-based audience profiling.
- `GRO-MKT-008` Paid adPerformanceExtension, when available later, is one dimension and MUST NOT dominate automatically.
- `GRO-MKT-009` One viral market spike MUST be guarded as possible outlier.
- `GRO-MKT-010` Comparison across platforms MUST normalize context rather than raw-rank incomparable metrics.
- `GRO-MKT-011` AI MUST not declare a market “best” based on weak/mixed evidence; it may explain trade-offs and suggest tests.
- `GRO-MKT-012` Market decision should be preserved in Decision Memory when material.

## 15. AI behavior
Analytics/Strategy agents may summarize evidence and propose testable market hypotheses. They must show uncertainty and alternative explanations.

## 16. Human approval
User decides where to invest creative/operational attention and approves experiments.

## 17. Validation
- country/language valid
- sources dated
- sample shown where material
- confidence rationale present

## 18. UI states
- no data
- single-signal
- multi-signal opportunity
- conflicting signals
- stale
- outlier warning

## 19. Edge cases
- diaspora effect
- VPN/noisy geo
- platform country unavailable
- release only distributed in some markets

## 20. Cross-module effects
- Geo Experiments
- Campaign
- Search
- DSP
- Analytics
- Decision Memory

## 21. Notifications and attention model
- new meaningful market signal
- active market experiment diverges
- data stale

## 22. Search / filtering / sorting / bulk actions
Filter country/region/language/song/genre/signal/period. Multi-select comparison allowed; no automatic winner badge.

## 23. Analytics and product telemetry
- market viewed
- comparison
- opportunity created
- experiment launched
- decision recorded

## 24. Learning feedback
Market evidence feeds hypotheses/experiments and only repeated validated evidence becomes Learning.

## 25. Auditability / provenance
Preserve sources/periods/confidence rationale and decision history.

## 26. Desktop / mobile behavior
Desktop comparison; mobile selected market summary.

## 27. Accessibility / usability
Use tables alongside maps/charts if maps are later added; no color-only winner encoding.

## 28. Security / privacy / rights
Aggregate geographic signals only; no person-level location tracking by default.

## 29. Performance / async jobs
Imports/aggregation async; cached comparisons show freshness.

## 30. Acceptance criteria
- `GRO-MKT-AC01` No single market magic score.
- `GRO-MKT-AC02` Cheap acquisition alone cannot decide priority.
- `GRO-MKT-AC03` Missing signals stay unknown.
- `GRO-MKT-AC04` Outlier spike is flagged.
- `GRO-MKT-AC05` User can create test from a market hypothesis.

## 31. Test matrix
- tiny sample
- conflicting signals
- diaspora
- paid-vs-organic conflict
- stale geo

## 32. Open questions
- MarketOpportunity operational status and confidence calculation framework need later Analytics/schema calibration.

## 33. Traceability
MASTER §252–255, §287–315
