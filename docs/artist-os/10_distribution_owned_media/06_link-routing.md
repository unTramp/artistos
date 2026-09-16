# Link Routing Engine

- **Status:** REVIEW COMPLETE
- **MASTER references:** §203–207, §50–52, §230, §407
- **Domain:** 10_distribution_owned_media
- **Feature slug:** `link-routing`
- **Requirement prefix:** `DST-LNK`

## 2. Purpose
Make campaign destinations and primary CTA explicit, time-aware and measurable instead of repeatedly editing links ad hoc.

## 3. User problem / job-to-be-done
Artists change pre-save, stream, video, ticket and merch destinations across a campaign. Without routing history and objective context links become stale, unmeasurable or contradictory.

## 4. Scope
### In scope
- LinkHub
- LinkDestination types
- primary destination by campaign/time
- direct vs smartlink vs website routing decision
- activation windows
- analytics configuration/history

### Out of scope / non-goals
- mandatory smartlink
- URL shortening service implementation
- full attribution engine
- PII CRM

## 5. Entry points
- Campaign/Release plan
- Profile Readiness
- Website
- Publication CTA preparation
- Distribution home

## 6. Preconditions and dependencies
- Campaign/objective
- destinations
- platform capability
- WebExperience/smartlink/direct URLs
- analytics config
- Release/Momentum window

## 7. Information architecture
LinkHub → destination list → current primary → activation timeline → route mode rationale → preview/test → activation/history → analytics.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER `LinkHub {artistId, campaignId?, primaryDestination, destinations[], analyticsConfig, activeFrom, activeUntil?}` and LinkDestination types STREAM/PRE_SAVE/VIDEO/TICKET/MERCH/WEBSITE/MEMBERSHIP/SOCIAL/CUSTOM.

## 10. Main happy-path workflow
1. Create/select LinkHub for artist/campaign
2. Add validated destinations
3. Set primary objective and route mode
4. Define activation window/phase if needed
5. Preview all destinations and CTA copy
6. User approves activation/change
7. Publications/profile/web use the active routing reference
8. Metrics retain destination/version context

## 11. Alternative workflows
- evergreen artist hub
- direct DSP link is preferable
- website is campaign landing
- smartlink provider unavailable
- destination expires or changes
- multiple regional destinations

## 12. User actions
- add/edit destination
- set primary
- schedule activation window
- test link
- disable destination
- switch routing mode
- copy active URL

## 13. State model
Hub/destination may be draft/active/inactive/expired operationally; MASTER does not freeze status enums. Primary resolution is time/campaign-aware and should preserve history.

## 14. Business rules
- `DST-LNK-001` LinkDestination type MUST use MASTER enum.
- `DST-LNK-002` Smartlink MUST NOT be treated as universally required.
- `DST-LNK-003` Routing mode SHOULD be selected by objective, capability and measurement needs with explicit rationale.
- `DST-LNK-004` A LinkHub MUST have at most one effective primary destination at a given campaign/time context unless the UX explicitly presents a chooser page as the primary destination.
- `DST-LNK-005` Time-aware CTA changes MUST preserve prior configuration/history.
- `DST-LNK-006` Expired/invalid destinations MUST NOT remain silently primary.
- `DST-LNK-007` Changing LinkHub routing MUST NOT rewrite historical Publication CTA snapshots.
- `DST-LNK-008` Preview/test MUST identify redirects and obvious invalid destinations where technically possible.
- `DST-LNK-009` Campaign-less artist LinkHub MAY act as evergreen routing; campaign hub may override by context.
- `DST-LNK-010` Regional/platform-specific destinations MAY be supported but must not expose hidden user profiling without privacy scope.
- `DST-LNK-011` Analytics configuration MUST distinguish click measurement from causal attribution.
- `DST-LNK-012` OS MUST work with plain direct URLs if no smartlink/website integration exists.
- `DST-LNK-013` Primary destination changes affecting active profile/campaign SHOULD enter attention/audit flow.
- `DST-LNK-014` AI MUST NOT fabricate availability, presave state or tracking capability of a destination.

## 15. AI behavior
AI can suggest route mode/primary destination from Campaign objective and current phase, and explain direct vs hub trade-offs. It cannot activate changes or invent attribution certainty.

## 16. Human approval
Activation/switch of audience-facing primary destination is human-approved; scheduled future switch may execute if the exact configuration was approved.

## 17. Validation
- valid URL/provider reference
- activation dates coherent
- one effective primary
- destination compatible with objective
- known expired destinations rejected/warned

## 18. UI states
- draft
- active
- future switch
- expired destination
- broken test
- provider unavailable
- analytics partial

## 19. Edge cases
- release date moves
- presave becomes stream link
- regional destination unavailable
- smartlink provider outage
- UTM/query stripping
- same link reused by multiple campaigns

## 20. Cross-module effects
- Campaign
- Profile Readiness
- Publications
- Owned Media
- Web Analytics
- Release Readiness
- Business Offers

## 21. Notifications and attention model
- primary destination broken/expired
- future switch cannot execute
- campaign phase changed but CTA stale

## 22. Search / filtering / sorting / bulk actions
Filter by campaign/type/status/time. Bulk destination import may be allowed; bulk activation across hubs requires explicit review.

## 23. Analytics and product telemetry
- link tested
- primary changed
- scheduled switch
- click event where available
- broken link detected
- manual override

## 24. Learning feedback
Click/conversion results may feed Analytics/Insights. They must not be interpreted as causal proof of routing superiority without suitable comparison.

## 25. Auditability / provenance
Version/record primary destination, activation interval, actor, reason and analytics configuration used by each campaign/publication context.

## 26. Desktop / mobile behavior
Desktop edits routing/timeline; mobile shows current destination, health and emergency switch with confirmation.

## 27. Accessibility / usability
Preview actual domain and destination type; make destructive switch/disable consequences clear.

## 28. Security / privacy / rights
Do not append or collect personal identifiers beyond declared analytics scope. Secrets from smartlink providers stay server-side.

## 29. Performance / async jobs
Link health checks/analytics imports may run asynchronously. Activation scheduler must be idempotent and timezone-safe.

## 30. Acceptance criteria
- `DST-LNK-AC01` Presave can switch to stream without rewriting historic CTAs.
- `DST-LNK-AC02` Direct link is valid without smartlink.
- `DST-LNK-AC03` Expired destination cannot silently remain primary.
- `DST-LNK-AC04` Active switch is audited and human-approved.
- `DST-LNK-AC05` Clicks are described as measured events, not automatic attribution.

## 31. Test matrix
- evergreen hub
- pre-release switch
- release date change
- broken link
- smartlink outage
- regional link

## 32. Open questions
- Formal LinkDestination schema/status/versioning is not specified in MASTER.
- Whether timed switches use JobService scheduler vs computed effective configuration requires engineering decision.

## 33. Traceability
MASTER §203–207, §50–52, §230, §407
