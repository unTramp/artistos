# Profile Readiness

- **Status:** REVIEW COMPLETE
- **MASTER references:** §192–196, §203–216, §357–368
- **Domain:** 10_distribution_owned_media
- **Feature slug:** `profile-readiness`
- **Requirement prefix:** `DST-PRF`

## 2. Purpose
Turn “is my profile ready to receive attention?” into an explicit, explainable operational state before campaigns or cold acquisition send people to a weak destination.

## 3. User problem / job-to-be-done
Independent artists often drive traffic to a profile that does not yet explain who they are, what to listen to, or what action to take. The OS needs a readiness model that identifies missing essentials without rewarding cosmetic perfection.

## 4. Scope
### In scope
- ProfileReadiness dimensions from MASTER
- readiness status and rationale
- platform-scoped readiness where inputs differ
- links to remediation actions
- historical readiness snapshots when useful for campaign/decision context

### Out of scope / non-goals
- universal social-media score
- mandatory nine-post grid
- follower-count quality judgment
- automatic profile edits on third-party platforms

## 5. Entry points
- Distribution home
- Overview attention card
- Campaign/Release Readiness
- platform account page
- command palette “Check profile readiness”

## 6. Preconditions and dependencies
- active Artist Identity/Era where available
- Presence/PlatformAccountProfile
- LinkHub/primary CTA where applicable
- representative published content
- Campaign context when readiness is checked for a specific objective

## 7. Information architecture
Readiness summary → dimension cards → evidence/source → blockers/warnings → recommended remediation → history/context. The UI separates REQUIRED blockers from optimization opportunities.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER `ProfileReadiness {identityEstablished, profilePhotoReady, bioReady, primaryCTAReady, linkDestinationReady, representativeContentCount, pinnedContentReady, activeCampaignVisible, status}`. Detailed spec may compute evidence references and checkedAt metadata without changing the MASTER entity shape.

## 10. Main happy-path workflow
1. Open a platform/profile readiness view
2. Choose general readiness or a campaign objective
3. System resolves current evidence for each readiness dimension
4. System marks each dimension satisfied, missing, unknown or stale
5. Overall status is derived with explanation
6. User opens a missing item and fixes it in the owning module/platform
7. Readiness recomputes without overwriting historical campaign evidence

## 11. Alternative workflows
- New artist with no identity yet
- Platform does not support pinning or link capability
- Profile is intentionally minimal by Identity/Mystique policy
- Campaign does not need a profile as primary destination
- Data imported manually and freshness is unknown

## 12. User actions
- Run/re-run readiness check
- open evidence
- jump to fix action
- mark external task completed with source/date
- dismiss an optimization suggestion
- view historical readiness context

## 13. State model
MASTER status enum: NOT_READY → MINIMUM_READY → READY → OPTIMIZED. This is an operational projection, not a content-quality score. Regressions are allowed when prerequisites expire/change.

## 14. Business rules
- `DST-PRF-001` Overall readiness MUST be explainable by individual dimensions; no magic numeric score.
- `DST-PRF-002` NOT_READY MUST mean one or more objective-critical prerequisites are absent/blocked, not merely that optimization could improve.
- `DST-PRF-003` MINIMUM_READY MUST represent a usable destination that explains the artist and supports the current primary action, even if optional enhancements are missing.
- `DST-PRF-004` READY MUST require the relevant identity/profile/CTA/content fundamentals for the selected objective.
- `DST-PRF-005` OPTIMIZED MUST be treated as contextual and reversible, never as permanent certification.
- `DST-PRF-006` RepresentativeContentCount MUST be interpreted with role coverage and relevance; a hardcoded count such as nine MUST NOT be required.
- `DST-PRF-007` Unsupported platform features MUST be N/A rather than failed.
- `DST-PRF-008` Unknown or stale external platform state MUST NOT be silently treated as ready.
- `DST-PRF-009` Identity/Mystique policy MAY intentionally justify a sparse profile and MUST be considered before recommending more disclosure.
- `DST-PRF-010` Campaign-specific readiness MAY differ from general profile readiness and MUST identify the objective/context used.
- `DST-PRF-011` Readiness changes MUST NOT directly publish/edit third-party profiles.
- `DST-PRF-012` Readiness evidence SHOULD link to the owning entity, publication, capability source or manual verification record.
- `DST-PRF-013` Cold-acquisition planning SHOULD surface a high-attention warning when destination readiness is below the campaign minimum.
- `DST-PRF-014` Profile readiness MUST remain useful in manual/CSV mode without connected APIs.
- `DST-PRF-015` Historical readiness at campaign/release decision time SHOULD be preserved or reconstructable for later analysis.

## 15. AI behavior
AI may summarize gaps, prioritize remediation and explain why a dimension matters using Identity/Campaign/Platform Capability context. It must not invent external profile state, fabricate platform requirements, or equate aesthetic preference with readiness. If evidence is missing, output UNKNOWN with a manual-check action.

## 16. Human approval
The user approves external profile edits, pin/unpin actions and CTA changes. Computed readiness itself can update automatically from trusted internal evidence.

## 17. Validation
- status enum valid
- platform capability used before evaluating unsupported feature
- external evidence has source/date where claimed
- CTA destination resolves and is active when counted ready
- rights-sensitive assets are not recommended for profile use if blocked

## 18. UI states
- first-use checklist
- partial/unknown
- ready
- optimization suggestions
- stale external state
- provider unavailable
- campaign-specific warning

## 19. Edge cases
- profile intentionally has no bio
- link feature unavailable by region/account type
- old pinned content still visible externally
- campaign link expired
- identity version changes after profile assets were created

## 20. Cross-module effects
- Overview attention
- StarterContentPack
- ProfileContentAudit
- Link Routing
- Campaign/Release Readiness
- Platform Capability Registry
- Identity Guard

## 21. Notifications and attention model
- objective-critical readiness regression
- campaign starting with NOT_READY destination
- stale capability/evidence near launch
- CTA destination expires

## 22. Search / filtering / sorting / bulk actions
Filter by platform, status and campaign context. Sorting by urgency/last verified is useful. Bulk actions are limited to recheck/mark-for-review; the system must not bulk-assert external readiness without evidence.

## 23. Analytics and product telemetry
- readiness check started/completed
- dimension fixed from OS
- manual external verification
- suggestion dismissed/reason
- time from first-use to MINIMUM_READY

## 24. Learning feedback
Readiness outcomes are operational evidence, not creative Learning by default. Repeated conversion problems may later contribute to an Insight/Hypothesis through Analytics.

## 25. Auditability / provenance
Store checkedAt, evidence/source, actor for manual verification and material readiness transitions. External state claims must retain provenance/freshness.

## 26. Desktop / mobile behavior
Desktop shows full evidence/remediation matrix. Mobile supports status summary, urgent checks and quick external verification; profile redesign work remains desktop-friendly.

## 27. Accessibility / usability
Use plain-language questions (“Can a new visitor tell what to listen to?”) alongside internal labels. Status cannot rely on color alone; each blocker has an actionable path.

## 28. Security / privacy / rights
Do not scrape/store unnecessary PII. External profile tokens remain server-side. Internal identity/private narrative must not leak into public-profile recommendations beyond approved disclosure policy.

## 29. Performance / async jobs
Readiness computation is synchronous over internal state; provider refresh can run through REFRESH_PLATFORM_DATA. A failed refresh preserves last-known state as stale rather than zeroing it.

## 30. Acceptance criteria
- `DST-PRF-AC01` Given a profile missing an objective-critical CTA, readiness does not report READY for a stream-driving campaign.
- `DST-PRF-AC02` An unsupported pinning capability is shown N/A, not failed.
- `DST-PRF-AC03` A stale external state is labelled stale/unknown.
- `DST-PRF-AC04` No rule requires exactly nine representative posts.
- `DST-PRF-AC05` Fixing internal CTA/LinkHub data recomputes readiness without publishing externally.

## 31. Test matrix
- empty artist
- minimum-ready profile
- campaign-specific stream objective
- unsupported capability
- stale API data
- intentional mystique/minimal profile
- manual-only platform

## 32. Open questions
- Should readiness persistence be a computed projection only or also store campaign-time snapshots?
- Define exact REQUIRED-vs-OPTIONAL dimension policy per objective without hardcoding platform-specific UI rules.

## 33. Traceability
MASTER §192–196, §203–216, §357–368
