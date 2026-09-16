# DSP Profiles

- **Status:** REVIEW COMPLETE
- **MASTER references:** §224–225, §217–222, §230
- **Domain:** 11_dsp
- **Feature slug:** `profiles`
- **Requirement prefix:** `DSP-PRF`

## 2. Purpose
Track whether each DSP artist profile is claimed, identity-aligned and operationally complete for the artist’s current release/era.

## 3. User problem / job-to-be-done
Artist profiles on streaming services often have outdated images, bios, links, merch, events or feature state. The OS needs a structured readiness view without assuming every DSP offers the same fields.

## 4. Scope
### In scope
- DSPProfile fields from MASTER
- claimed/profile URL state
- bio/image/social/events/merch/optional artist-pick/playlist/video status
- identity/era references
- readiness and evidence/freshness

### Out of scope / non-goals
- editing DSP profile via unofficial automation
- universal completeness score
- social profile fields

## 5. Entry points
- DSP home
- Release Readiness
- Identity/era transition
- platform-specific profile task

## 6. Preconditions and dependencies
- active Identity/Era
- DSP PlatformCapability
- manual/provider state
- profile assets/rights

## 7. Information architecture
DSP list → select platform → claim/state → identity assets → capability-specific sections → blockers/tasks → readiness/history.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER `DSPProfile {platform, artistId, claimed, profileUrl, bioStatus, imageStatus, socialLinksStatus, eventsStatus, merchStatus, artistPickStatus?, playlistStatus?, videoStatus?, readiness}`. Individual status enums are not defined; evidence/verification metadata required at implementation.

## 10. Main happy-path workflow
1. Add/identify DSP profile
2. Verify claimed status and URL
3. System resolves which profile capabilities exist
4. Check current assets/fields against Identity/Era and release needs
5. Create manual/integration tasks for gaps
6. Record completion/evidence
7. Readiness updates

## 11. Alternative workflows
- profile unclaimed
- feature unavailable on DSP
- artist intentionally has no merch/events
- DSP caches old image
- different regional storefront view

## 12. User actions
- set/verify profile URL
- mark claim status
- attach evidence
- open identity check
- create update task
- mark non-applicable capability

## 13. State model
Claimed is factual state. Readiness is a contextual projection. Optional field statuses may be N/A/unknown; exact enums remain schema decisions.

## 14. Business rules
- `DSP-PRF-001` DSPProfile MUST be platform-specific.
- `DSP-PRF-002` Profile capability fields MUST only be evaluated when the DSP/account actually supports them.
- `DSP-PRF-003` Profile assets/bio/merch/video SHOULD reference active Identity/Era and may run Identity Guard.
- `DSP-PRF-004` Identity Guard warning MUST NOT automatically edit a live DSP profile.
- `DSP-PRF-005` Claimed=false MUST not imply profile does not exist; it means artist control is not verified.
- `DSP-PRF-006` Unknown claim/profile state MUST remain unknown when evidence is absent.
- `DSP-PRF-007` Optional features such as Artist Pick/video MUST NOT reduce readiness when unsupported or irrelevant.
- `DSP-PRF-008` Profile readiness SHOULD be release/objective aware where a field matters only for a specific launch.
- `DSP-PRF-009` External profile state MUST retain source and last-verified time.
- `DSP-PRF-010` Changing active Identity/Era SHOULD mark relevant profile assets for review, not auto-replace them.
- `DSP-PRF-011` Rights must be valid for profile images/video/merch assets.
- `DSP-PRF-012` DSPProfile MUST remain manageable in manual mode if no API exposes profile edits/state.

## 15. AI behavior
AI can compare current structured profile data to Identity/Era, draft bios and prioritize gaps. It cannot claim a profile, upload assets or assert external state without evidence.

## 16. Human approval
Claiming, profile edits and acceptance of identity-sensitive public assets are human-controlled.

## 17. Validation
- profile URL platform matches
- capability known/current enough
- asset rights valid
- identity version resolvable

## 18. UI states
- unclaimed
- claimed/partial
- ready
- unknown external state
- stale
- capability N/A
- identity review suggested

## 19. Edge cases
- duplicate artist profile
- wrong artist mapped
- DSP image cached
- old era intentionally retained
- profile claim managed by distributor/team

## 20. Cross-module effects
- Identity
- Release Readiness
- Platform Capability
- Assets/Rights
- DSP Release Plan

## 21. Notifications and attention model
- unclaimed profile before launch
- identity-critical asset outdated
- profile URL/mapping uncertain

## 22. Search / filtering / sorting / bulk actions
Filter DSP profiles by claimed/readiness/staleness. No bulk external profile edits.

## 23. Analytics and product telemetry
- profile verified
- claim status changed
- identity warning
- task completed
- manual evidence attached

## 24. Learning feedback
Profile state is operational evidence; profile change impact may later be tested/learned through analytics.

## 25. Auditability / provenance
Record external source/verification, identity version used, manual overrides and profile task history.

## 26. Desktop / mobile behavior
Desktop detailed profile checklist; mobile launch-readiness summary and manual verification.

## 27. Accessibility / usability
Separate unsupported/N/A from missing. Provide direct “open DSP profile” where URL trusted.

## 28. Security / privacy / rights
Profile credentials/tokens never stored client-side. Public profile metadata itself is not private, but internal identity rationale may be.

## 29. Performance / async jobs
Provider refresh async; last-known state remains with stale marker if refresh fails.

## 30. Acceptance criteria
- `DSP-PRF-AC01` Unsupported feature is N/A, not failed.
- `DSP-PRF-AC02` Identity change triggers review, not auto-edit.
- `DSP-PRF-AC03` Unclaimed does not mean nonexistent.
- `DSP-PRF-AC04` Manual profile tracking works without API.
- `DSP-PRF-AC05` Rights-blocked image is not recommended as ready.

## 31. Test matrix
- unclaimed
- duplicate mapping
- old era
- capability unavailable
- manual-only
- cache delay

## 32. Open questions
- Status enums for individual DSPProfile fields and readiness need schema definition.

## 33. Traceability
MASTER §224–225, §217–222, §230
