# Growth & Market Command Center

- **Status:** REVIEW COMPLETE
- **MASTER references:** §245–263, §287–315, §357–364
- **Domain:** 12_growth_market
- **Feature slug:** `growth-home`
- **Requirement prefix:** `GRO-HOM`

## 2. Purpose
Provide a single evidence-aware view of organic discovery, markets, search, LIVE, collaborations and growth experiments without collapsing them into paid advertising.

## 3. User problem / job-to-be-done
Artists receive growth signals from many surfaces but often chase the cheapest or loudest metric. The OS needs to show where genuine audience response is emerging and what can be tested next.

## 4. Scope
### In scope
- organic growth summary
- market/search/live/collaboration signals
- audience-source mix
- active growth experiments
- next actions with evidence

### Out of scope / non-goals
- paid advertising engine
- magic growth score
- viral prediction
- autonomous outreach

## 5. Entry points
- primary nav Growth
- Overview
- Campaign
- Analytics

## 6. Preconditions and dependencies
- AudienceSource
- MarketOpportunity
- SearchIntent
- LiveSession
- CreatorCollaboration
- Analytics/Learnings

## 7. Information architecture
Current growth focus → audience-source mix → market opportunities → search opportunities → LIVE/collab activity → experiments → evidence-backed next actions.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
Projection over Growth-domain entities and shared Analytics/Experiment evidence. No monolithic Growth entity.

## 10. Main happy-path workflow
1. Open Growth
2. Select period/campaign/song
3. System aggregates available organic signals
4. Inspect markets/search/live/collab dimensions
5. Open active experiment or create hypothesis
6. Choose next action with rationale

## 11. Alternative workflows
- very small data set
- single market only
- no connected platforms
- paid data absent
- catalog period without active campaign

## 12. User actions
- change scope
- open evidence
- create experiment
- mark opportunity not relevant
- refresh/import data

## 13. State model
No dedicated lifecycle; reflects source entities and evidence freshness.

## 14. Business rules
- `GRO-HOM-001` Growth domain MUST remain distinct from Advertising.
- `GRO-HOM-002` Growth recommendations MUST expose underlying dimensions/evidence rather than a single magic score.
- `GRO-HOM-003` Cheap acquisition/cost alone MUST NOT determine market priority.
- `GRO-HOM-004` Unknown/missing signals MUST remain unknown rather than negative evidence.
- `GRO-HOM-005` Organic, collaboration, search, live, DSP and owned-media sources MUST remain distinguishable.
- `GRO-HOM-006` Posting cadence MUST be treated as configurable strategy/experiment variable, not platform law.
- `GRO-HOM-007` Growth advice MUST distinguish own-data learning, platform rule and practitioner heuristic.
- `GRO-HOM-008` One viral/outlier event MUST NOT become best practice automatically.
- `GRO-HOM-009` AI MUST not claim future virality or guaranteed growth.
- `GRO-HOM-010` Growth home MUST remain useful in manual/CSV mode.
- `GRO-HOM-011` Recommendations SHOULD prefer a testable next action when uncertainty is high.
- `GRO-HOM-012` Advertising extension data MAY appear as future evidence but MUST not be implemented as core logic here.

## 15. AI behavior
AI may synthesize organic signals and propose experiments, but must qualify low sample size, missing data and confounders. It cannot invent audience quality or predict guaranteed growth.

## 16. Human approval
Experiments, collaborations, public actions and strategy changes remain human-controlled.

## 17. Validation
- scope dates valid
- signal source/provenance known
- sample size visible where used
- stale data flagged

## 18. UI states
- cold start
- partial data
- active experiment
- stale imports
- no opportunity
- manual-only

## 19. Edge cases
- viral outlier
- market signal conflict
- paid extension absent
- platform metric definition changes

## 20. Cross-module effects
- Analytics
- Experiments
- Campaign
- DSP
- Distribution
- Business

## 21. Notifications and attention model
- high-potential opportunity with expiring timing
- active experiment missing data
- unexpected market shift needing review

## 22. Search / filtering / sorting / bulk actions
Filter by market/source/campaign/song/period. Sort opportunities by evidence relevance, not opaque rank.

## 23. Analytics and product telemetry
- scope changed
- opportunity opened
- experiment created
- recommendation accepted/rejected

## 24. Learning feedback
Signals feed Insight → Hypothesis → Experiment → Learning; command center does not promote rules itself.

## 25. Auditability / provenance
Store source/evidence references for recommendations and user decisions.

## 26. Desktop / mobile behavior
Desktop strategy surface; mobile concise signals and active experiment checks.

## 27. Accessibility / usability
Charts expose denominators/sample size. Avoid “winner” labels where evidence is weak.

## 28. Security / privacy / rights
No person-level fan profiling by default. Provider credentials remain protected.

## 29. Performance / async jobs
Data imports/refresh can be async; UI uses cached structured data and staleness markers.

## 30. Acceptance criteria
- `GRO-HOM-AC01` Cheap cost alone never determines market priority.
- `GRO-HOM-AC02` Missing signal is not treated as poor performance.
- `GRO-HOM-AC03` Posting cadence appears as experiment/strategy variable.
- `GRO-HOM-AC04` Viral outlier does not auto-promote a rule.
- `GRO-HOM-AC05` Manual data still supports the view.

## 31. Test matrix
- cold start
- viral outlier
- conflicting markets
- stale data
- manual-only

## 32. Open questions
- Growth recommendation prioritization may later need a transparent multi-objective decision model; do not freeze a score now.

## 33. Traceability
MASTER §245–263, §287–315, §357–364
