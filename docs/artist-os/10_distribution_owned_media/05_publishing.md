# Publishing Modes & Provider

- **Status:** REVIEW COMPLETE
- **MASTER references:** §200–202, §330, §374–377, §435–436
- **Domain:** 10_distribution_owned_media
- **Feature slug:** `publishing`
- **Requirement prefix:** `DST-PBL`

## 2. Purpose
Provide a safe abstraction for manual, native-scheduled, third-party and API publishing while keeping Artist OS useful when no publishing integration exists.

## 3. User problem / job-to-be-done
Publishing APIs vary by platform/account/region and can fail. The artist needs one operational workflow without coupling the domain to a vendor or sacrificing human control.

## 4. Scope
### In scope
- PublishingMode selection
- PublishingProvider abstraction
- capability checks
- approval and job state
- manual/native task tracking
- provider failure/retry/idempotency

### Out of scope / non-goals
- full autonomous autopost in MVP
- vendor-specific domain entities
- bypassing native restrictions
- ad spend

## 5. Entry points
- Publication preparation
- Calendar
- Distribution home
- Settings integrations

## 6. Preconditions and dependencies
- Publication
- PlatformCapability
- PlatformAccountProfile
- PublishingProvider
- JobService
- rights/Identity checks

## 7. Information architecture
Prepared Publication → capability/mode options → approval → provider/manual action → progress → confirmation/external ID → failure/recovery.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER PublishingMode enum: MANUAL_NATIVE, NATIVE_SCHEDULED, THIRD_PARTY_SCHEDULED, API_PUBLISHED. Provider is infrastructure abstraction; execution/job metadata belongs to application/integration layer.

## 10. Main happy-path workflow
1. Prepare a Publication
2. System resolves available publishing capabilities/modes
3. User chooses mode
4. Preflight checks run
5. User explicitly approves schedule/publish
6. System queues provider execution or creates manual/native task
7. Result updates Publication with provenance
8. Failures expose retry/fallback to manual

## 11. Alternative workflows
- no connected provider
- provider loses authorization
- platform supports schedule but not direct publish
- API rejects media
- manual post succeeds while OS offline

## 12. User actions
- choose mode
- connect/change provider via Settings
- approve schedule/publish
- cancel pending job where safe
- retry
- fallback to manual/native
- confirm manual completion

## 13. State model
Execution states are provider/job states, not a replacement for Publication status. Cancel/retry semantics depend on whether external execution has already occurred.

## 14. Business rules
- `DST-PBL-001` PublishingMode MUST use MASTER enum.
- `DST-PBL-002` Domain logic MUST depend on PublishingProvider interface rather than named vendors.
- `DST-PBL-003` Artist OS MUST remain fully usable for preparation/tracking in MANUAL_NATIVE mode.
- `DST-PBL-004` Available modes MUST be derived from current PlatformCapability/account restrictions, not hardcoded follower thresholds.
- `DST-PBL-005` Publish/schedule execution MUST require explicit application approval.
- `DST-PBL-006` Provider failure MUST NOT silently fall back to another external publish mode without user awareness.
- `DST-PBL-007` If execution outcome is uncertain, state MUST be UNKNOWN/needs verification rather than automatically retrying and risking duplicate posts.
- `DST-PBL-008` At-least-once job delivery MUST be protected by idempotency keys/provider identifiers.
- `DST-PBL-009` Cancellation MUST explain whether cancellation is local only or confirmed externally.
- `DST-PBL-010` Human-aware automation MUST preserve flex/spontaneous content paths and MUST NOT require all content to be scheduled.
- `DST-PBL-011` Expired/stale capability knowledge MUST trigger verification/warning before presenting a mode as guaranteed.
- `DST-PBL-012` Provider tokens/secrets MUST never be exposed to frontend logs/spec payloads.
- `DST-PBL-013` Rights/Identity/preflight warnings MUST be visible before execution; known blocking rights policy MUST prevent silent publish.
- `DST-PBL-014` Execution logs MUST record provider/mode/config/time/result without storing unnecessary private payloads.

## 15. AI behavior
AI can recommend a mode based on objective/capabilities and explain trade-offs; it cannot press publish, bypass approval or fabricate capability support.

## 16. Human approval
Every audience-facing publish/schedule action is human-approved. A previously approved scheduled job may execute at its approved time without another prompt if unchanged.

## 17. Validation
- capability current enough
- provider/account authorized when needed
- Publication valid
- media requirements met
- rights policy satisfied
- schedule in valid timezone/window

## 18. UI states
- manual-only
- provider connected
- authorization expired
- queued
- running
- success
- failed
- uncertain outcome
- cancellation pending

## 19. Edge cases
- API timeout after remote success
- media processed slowly by platform
- provider rate limit
- scheduled item edited externally
- timezone DST change
- duplicate provider webhook

## 20. Cross-module effects
- Publications
- Calendar
- Capability Registry
- Settings/Secrets
- Jobs
- Overview attention

## 21. Notifications and attention model
- authorization expiry before scheduled post
- publish failure
- uncertain external outcome
- scheduled time approaching with stale capability

## 22. Search / filtering / sorting / bulk actions
Filter Publication jobs by mode/provider/status. Bulk scheduling is allowed only when each item passes validation and final batch summary is approved.

## 23. Analytics and product telemetry
- mode selected
- approval granted/cancelled
- job queued/succeeded/failed
- manual fallback
- duplicate-prevention triggered

## 24. Learning feedback
Operational provider reliability may inform implementation decisions; it is not artist creative Learning.

## 25. Auditability / provenance
Record approval actor/time, immutable request hash/idempotency key, provider response reference and retries.

## 26. Desktop / mobile behavior
Desktop supports batch preparation; mobile supports approval, failure recovery and manual completion checks.

## 27. Accessibility / usability
Clear dangerous-action labels (“Publish now”, “Schedule externally”). Do not hide uncertainty behind green success until confirmed.

## 28. Security / privacy / rights
OAuth secrets encrypted server-side; least-scope permissions; never log access/refresh tokens.

## 29. Performance / async jobs
All external publish operations use JobService where asynchronous. Retry only retryable errors and guard uncertain outcomes against duplicate execution.

## 30. Acceptance criteria
- `DST-PBL-AC01` No provider is required for manual workflow.
- `DST-PBL-AC02` A stale unsupported capability cannot be presented as guaranteed.
- `DST-PBL-AC03` API timeout with unknown outcome does not blindly retry.
- `DST-PBL-AC04` Publishing requires explicit approval.
- `DST-PBL-AC05` Duplicate webhook does not create duplicate Publication/execution.

## 31. Test matrix
- manual mode
- native scheduled task
- third-party scheduler
- API success
- auth expiry
- timeout unknown
- retryable rate limit
- duplicate webhook

## 32. Open questions
- Need shared ExternalAction/Execution schema across publishing, DSP tasks and profile audit.

## 33. Traceability
MASTER §200–202, §330, §374–377, §435–436
