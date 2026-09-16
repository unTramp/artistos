# DSP Opportunities

- **Status:** REVIEW COMPLETE
- **MASTER references:** §217–222, §227–228, §230
- **Domain:** 11_dsp
- **Feature slug:** `opportunities`
- **Requirement prefix:** `DSP-OPP`

## 2. Purpose
Track current DSP opportunities, eligibility and deadlines as evidence-backed operational knowledge instead of hardcoded platform folklore.

## 3. User problem / job-to-be-done
DSP features such as editorial pitch, countdown, video pitch or paid campaign tools appear with changing eligibility and regional/account constraints. The artist needs a current, source-backed opportunity queue.

## 4. Scope
### In scope
- DSPOpportunity entity
- MASTER opportunity types
- eligibility state/evidence
- deadline/source/freshness
- release/profile linkage
- manual verification

### Out of scope / non-goals
- guaranteed outcome prediction
- automatic activation/spend
- hardcoded follower thresholds
- scraping unsupported portals

## 5. Entry points
- DSP home
- Release plan
- Release Readiness
- Capability Registry

## 6. Preconditions and dependencies
- PlatformCapability
- Release/DSPProfile
- ResearchClaim/source
- current account/region state where available

## 7. Information architecture
Opportunity list → filter by release/platform/type → inspect eligibility/source/deadline → verify if uncertain → create/execute associated task → record outcome/status.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER `DSPOpportunity {type, eligibility, deadline?, status, sourceId, lastVerifiedAt}` with types EDITORIAL_PITCH, RELEASE_RADAR, ARTIST_PICK, COUNTDOWN, VIDEO_PITCH, DISCOVERY_MODE, SHOWCASE, MARQUEE, ARTIST_PLAYLIST. Eligibility/status enums are not frozen.

## 10. Main happy-path workflow
1. Refresh/import opportunities
2. System matches opportunities to relevant release/profile
3. Show verified/uncertain/ineligible/N/A state with source
4. User opens opportunity
5. Complete verification or linked action
6. Record outcome/expiration

## 11. Alternative workflows
- eligibility cannot be checked automatically
- platform capability exists but account not eligible
- deadline passed
- opportunity has no deadline
- paid DSP tool deferred/not in budget

## 12. User actions
- verify
- open source
- create linked task
- mark not applicable
- record outcome
- refresh

## 13. State model
Opportunity lifecycle must preserve historical occurrence/outcome. Exact status/eligibility enums to be defined; stale verification is distinct from ineligible.

## 14. Business rules
- `DSP-OPP-001` DSPOpportunity type MUST use MASTER enum.
- `DSP-OPP-002` Eligibility MUST NOT be inferred solely from stale/hardcoded follower thresholds.
- `DSP-OPP-003` Every platform-rule-based eligibility/deadline claim SHOULD link sourceId and lastVerifiedAt.
- `DSP-OPP-004` STALE/unknown eligibility MUST NOT be shown as eligible or ineligible certainty.
- `DSP-OPP-005` Opportunity availability MUST be platform/region/account-type aware when relevant.
- `DSP-OPP-006` Paid DSP opportunities such as SHOWCASE/MARQUEE MUST NOT trigger spend or activation in v1.3 automatically.
- `DSP-OPP-007` Release Radar or algorithmic exposure MUST NOT be represented as guaranteed placement/outcome.
- `DSP-OPP-008` Expired opportunities remain in history with deadline/outcome.
- `DSP-OPP-009` Opportunity absence from imported data MUST NOT prove platform feature unavailability unless source coverage supports that conclusion.
- `DSP-OPP-010` User MAY manually verify portal state and attach evidence/date.
- `DSP-OPP-011` Capability Registry and DSPOpportunity MUST not duplicate immutable truth; opportunity is contextual/instance-level, capability is rule-level.
- `DSP-OPP-012` AI MUST distinguish official rule from practitioner tactic/unverified platform rumor.

## 15. AI behavior
Research/Strategy agents may summarize opportunities and official eligibility evidence. They must not invent access or recommend bypassing platform rules.

## 16. Human approval
Submissions/activations/spend always human-controlled. Manual verification can be user-confirmed.

## 17. Validation
- type valid
- source/freshness present for external rules
- release/profile context valid
- deadline timezone/date valid

## 18. UI states
- eligible verified
- ineligible verified
- unknown
- stale
- expired
- completed
- not applicable

## 19. Edge cases
- feature renamed
- portal rollout differs by country
- invitation-only feature
- release deadline changes
- platform removes feature

## 20. Cross-module effects
- Capability Registry
- DSP Release Plan
- Release Readiness
- Editorial Pitch
- DSP Video
- Business/Advertising extension

## 21. Notifications and attention model
- verified deadline approaching
- eligibility stale near deadline
- new opportunity appears for active release

## 22. Search / filtering / sorting / bulk actions
Filter by platform/release/type/eligibility/deadline/status. Sort by nearest verified deadline and actionability.

## 23. Analytics and product telemetry
- opportunity discovered
- verified
- source opened
- action started/completed
- expired

## 24. Learning feedback
Outcome data may support future operational Insights but one acceptance/rejection never becomes a general rule.

## 25. Auditability / provenance
Preserve source, verification history, eligibility evidence, deadline, user assertions and outcome.

## 26. Desktop / mobile behavior
Desktop research/action queue; mobile deadline/eligibility checks.

## 27. Accessibility / usability
Use explicit uncertainty labels and absolute deadlines. Do not use celebratory UI that implies outcome guarantee.

## 28. Security / privacy / rights
Portal screenshots/evidence may contain account data; store only necessary proof under access controls.

## 29. Performance / async jobs
Refresh via provider/research jobs; failure preserves prior state as stale.

## 30. Acceptance criteria
- `DSP-OPP-AC01` Stale eligibility is not shown as current eligible.
- `DSP-OPP-AC02` No hardcoded follower threshold decides eligibility.
- `DSP-OPP-AC03` Expired opportunity remains in history.
- `DSP-OPP-AC04` Paid opportunity does not auto-spend.
- `DSP-OPP-AC05` Capability and opportunity remain distinct.

## 31. Test matrix
- unknown eligibility
- regional rollout
- deadline passed
- invitation-only
- feature removed

## 32. Open questions
- Define eligibility/status enums and whether opportunity instances are imported, computed or hybrid.

## 33. Traceability
MASTER §217–222, §227–228, §230
