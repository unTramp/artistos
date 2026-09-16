# DSP Command Center

- **Status:** REVIEW COMPLETE
- **MASTER references:** §223–244, §230–235, §357–364
- **Domain:** 11_dsp
- **Feature slug:** `dsp-home`
- **Requirement prefix:** `DSP-HOM`

## 2. Purpose
Give the artist one operational view of DSP profile readiness, upcoming opportunities, release tasks, discovery sources and revenue evidence without mixing DSP behavior with social-platform analytics.

## 3. User problem / job-to-be-done
DSP work is fragmented across artist portals, distributor dashboards, spreadsheets and deadlines. The artist needs to know what requires action now for each release/platform, while preserving platform-specific uncertainty and capability differences.

## 4. Scope
### In scope
- cross-platform DSP summary
- profile readiness by DSP
- release plan/readiness overview
- deadline/opportunity attention
- source-of-streams highlights
- revenue/import freshness
- links to platform-specific work

### Out of scope / non-goals
- social analytics dashboard
- universal DSP score
- playlist hack recommendations
- autonomous submission/pitching

## 5. Entry points
- primary nav DSP
- Overview attention
- Release/Campaign
- Song/Release detail

## 6. Preconditions and dependencies
- DSPProfile
- DSPReleasePlan
- DSPOpportunity
- Release Readiness
- Capability Registry
- imports/manual verification
- Identity/Era

## 7. Information architecture
Current release focus → platform cards → urgent opportunities/deadlines → profile/readiness blockers → discovery/source summary → revenue/import freshness → next actions.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
A projection over DSPProfile, DSPReleasePlan, DSPOpportunity, Release Readiness, DiscoveryChannelPerformance, DSPRevenueSnapshot and Capability freshness. No new god-object.

## 10. Main happy-path workflow
1. Open DSP Command Center
2. System resolves active/upcoming releases and DSP accounts
3. Surface urgent verified opportunities and blockers
4. Choose release/platform
5. Complete or record external DSP tasks
6. Import/refresh performance data
7. Review source/revenue evidence and next operational actions

## 11. Alternative workflows
- no claimed DSP profiles
- no upcoming release
- manual-only DSP tracking
- platform feature unavailable in region/account
- data import stale

## 12. User actions
- open platform profile
- mark task complete with evidence
- refresh/import data
- open opportunity
- start editorial pitch draft
- dismiss non-applicable opportunity

## 13. State model
Command Center itself has no lifecycle. It reflects source entity states and data freshness. Unknown/stale must remain visible rather than be normalized to “all good”.

## 14. Business rules
- `DSP-HOM-001` DSP domain MUST remain separate from social metrics and social publication readiness.
- `DSP-HOM-002` Command Center MUST prioritize actionable release/profile/opportunity state rather than raw data volume.
- `DSP-HOM-003` Cross-platform comparisons MUST preserve platform-specific context and MUST NOT raw-rank incomparable metrics.
- `DSP-HOM-004` Unknown, stale or unavailable DSP data MUST be explicit.
- `DSP-HOM-005` Opportunity visibility MUST be backed by source/capability evidence and lastVerifiedAt.
- `DSP-HOM-006` No opportunity MUST be presented as guaranteed eligibility or outcome when the platform state is uncertain.
- `DSP-HOM-007` Profile/readiness issues SHOULD deep-link to the owning task/entity.
- `DSP-HOM-008` Command Center MUST remain useful with manual tracking/CSV imports and no DSP API.
- `DSP-HOM-009` Release deadlines SHOULD be calculated from verified platform/capability data rather than hardcoded folklore.
- `DSP-HOM-010` No “first 24 hours determine fate” narrative may appear.
- `DSP-HOM-011` Playlist/radio/algorithmic source metrics MUST be described as observed distribution, not causal platform intent.
- `DSP-HOM-012` Revenue cards MUST use imported reported royalties/effective historical rates, never a universal per-stream estimate.
- `DSP-HOM-013` AI recommendations MUST distinguish verified platform rule, own-data observation and external heuristic.

## 15. AI behavior
AI may summarize DSP action priorities and explain why based on release timing, profile/readiness and verified opportunities. It cannot invent platform eligibility, stream sources, royalty rates or editorial outcomes.

## 16. Human approval
External submissions/profile changes/feature activations are human-controlled. Computed summaries may update automatically from trusted data.

## 17. Validation
- release/platform references valid
- opportunity source/freshness shown
- metric missingness preserved
- currency/revenue period clear

## 18. UI states
- first-use/no DSP profiles
- manual-only
- healthy
- partial data
- stale import
- deadline warning
- provider unavailable

## 19. Edge cases
- release distributed to only some DSPs
- same feature name differs across platforms
- artist profile unclaimed
- portal state conflicts with imported data

## 20. Cross-module effects
- Release/Campaign
- Distribution
- Analytics
- Business revenue
- Platform Capability
- Overview

## 21. Notifications and attention model
- pitch deadline approaching
- profile blocker near release
- stale data during active launch
- unclaimed profile for relevant DSP

## 22. Search / filtering / sorting / bulk actions
Filter by release/platform/status/deadline. Sort attention by deadline/blocking impact. Bulk “mark complete” only when evidence applies; no bulk submissions.

## 23. Analytics and product telemetry
- DSP home opened
- task deep-link
- opportunity action
- manual verification
- data refresh/import

## 24. Learning feedback
DSP observations enter Analytics/Insights through normalized evidence. Command Center never promotes rules directly.

## 25. Auditability / provenance
Every external state displayed should expose source, verification time and manual/import/provider provenance where practical.

## 26. Desktop / mobile behavior
Desktop is the main planning surface. Mobile emphasizes urgent deadlines, task confirmation and concise launch health.

## 27. Accessibility / usability
Use platform names/icons plus text. Deadlines display absolute date/time/timezone and stale-data warnings.

## 28. Security / privacy / rights
OAuth/provider tokens server-side. Do not expose private royalty files or portal credentials outside authorized views.

## 29. Performance / async jobs
Refresh/import tasks can use JobService. UI loads from last-known structured state and does not block on AI/provider calls.

## 30. Acceptance criteria
- `DSP-HOM-AC01` Social views are not mixed into DSP source-of-stream cards.
- `DSP-HOM-AC02` Stale opportunity data is visibly stale.
- `DSP-HOM-AC03` Revenue does not use fixed universal rate.
- `DSP-HOM-AC04` Command Center works with manual records only.
- `DSP-HOM-AC05` Urgent verified deadline deep-links to its source task.

## 31. Test matrix
- no profiles
- upcoming release
- catalog only
- stale import
- manual-only
- mixed platform availability

## 32. Open questions
- Need canonical DSP task/external-action model shared with Release Readiness and Platform integrations.

## 33. Traceability
MASTER §223–244, §230–235, §357–364
