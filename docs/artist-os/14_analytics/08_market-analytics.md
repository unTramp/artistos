# Market Analytics

- **Status:** REVIEW COMPLETE
- **MASTER references:** §252–255, §299
- **Domain:** 14_analytics
- **Feature slug:** `market-analytics`
- **Requirement prefix:** `ANA-MKT`

## 2. Purpose
Compare market response, retention and conversion with source/sample context so geography decisions reflect quality, not cheap reach alone.

## 3. User problem / job-to-be-done
Market data spans DSP, social, search, collaborations and future paid extensions. The artist needs comparable evidence with missingness and platform bias made visible.

## 4. Scope
### In scope
- market-level response/retention/conversion
- source breakdown
- period/song/campaign filters
- outlier/confidence
- geo experiment linkage

### Out of scope / non-goals
- single market winner score
- cheap-reach optimization

## 5. Entry points
- Analytics
- Growth Markets
- Geo Experiment

## 6. Preconditions and dependencies
- normalized market signals
- MarketOpportunity
- AudienceSource
- metrics

## 7. Information architecture
Choose song/campaign/period → compare market dimensions → inspect source/sample coverage → identify conflicts/outliers → create market Insight/Hypothesis/Experiment.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
Analytical projection over Growth/Metric/DSP data.

## 10. Main happy-path workflow
1. select markets
2. compare organic response/retention/conversion
3. open source details
4. exclude incompatible metrics transparently
5. create hypothesis

## 11. Alternative workflows
- one market only
- geo missing on some platform
- VPN/noise
- future paid cost available only for subset

## 12. User actions
- filter/compare
- open evidence
- create geo experiment

## 13. State model
No lifecycle.

## 14. Business rules
- `ANA-MKT-001` Market analytics MUST show multiple relevant dimensions rather than a single score.
- `ANA-MKT-002` Cheap reach/cost MUST NOT be the sole optimization target.
- `ANA-MKT-003` Missing geographic metrics MUST remain unknown.
- `ANA-MKT-004` Source/platform coverage differences MUST be visible.
- `ANA-MKT-005` Retention/music conversion SHOULD be separated from initial reach.
- `ANA-MKT-006` Sample size/outliers MUST be shown.
- `ANA-MKT-007` AI MUST not infer market quality from stereotypes or unsupported demographics.
- `ANA-MKT-008` Geo experiment evidence SHOULD be distinguished from observational comparison.
- `ANA-MKT-009` Paid extension data, when present, remains one dimension only.

## 15. AI behavior
AI synthesizes trade-offs and uncertainty, proposes geo experiments rather than declaring unsupported winners.

## 16. Human approval
Market strategy/experiment decisions human-controlled.

## 17. Validation
- market labels valid
- source/date/sample known where available

## 18. UI states
- partial geo
- observational
- experiment-backed
- outlier
- stale

## 19. Edge cases
- diaspora
- VPN
- platform rollout differences
- unequal release availability

## 20. Cross-module effects
- Growth/Markets
- Geo Experiments
- Campaign
- Insights

## 21. Notifications and attention model
- strong conflicting market signals

## 22. Search / filtering / sorting / bulk actions
Filter country/region/language/source/song/campaign/period.

## 23. Analytics and product telemetry
- market comparison
- experiment handoff

## 24. Learning feedback
Feeds MARKET scoped learning through shared pipeline.

## 25. Auditability / provenance
Preserve source coverage/context.

## 26. Desktop / mobile behavior
Desktop comparison; mobile selected markets.

## 27. Accessibility / usability
Accessible tables and explicit unknowns.

## 28. Security / privacy / rights
Aggregate only; no person-level location.

## 29. Performance / async jobs
Aggregation async.

## 30. Acceptance criteria
- `ANA-MKT-AC01` No cheap-reach-only winner.
- `ANA-MKT-AC02` Missing geo remains unknown.
- `ANA-MKT-AC03` Retention separated from reach.
- `ANA-MKT-AC04` Experiment evidence labeled separately.

## 31. Test matrix
- partial geo
- diaspora
- unequal exposure
- future paid data

## 32. Open questions
- Canonical retention definitions vary by source and need metric registry.

## 33. Traceability
MASTER §252–255, §299
