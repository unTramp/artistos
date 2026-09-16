# Platform Adapters

- **Status:** REVIEW COMPLETE
- **MASTER references:** §374–378, §44–47
- **Domain:** 18_platforms_integrations
- **Feature slug:** `platform-adapters`
- **Requirement prefix:** `PLT-ADP`

## 2. Purpose
Implement TikTok, YouTube, Instagram/Meta and DSP integrations behind replaceable interfaces while preserving manual/CSV fallback.

## 3. User problem / job-to-be-done
Artist OS depends on external platforms whose APIs, fields and rules change. This feature makes integrations explicit, replaceable and freshness-aware while preserving manual operation.

## 4. Scope
### In scope
- official fields/APIs
- manual/CSV/API modes
- publishing after approval
- adapter capability discovery
- provider errors

### Out of scope / non-goals
- provider-specific business logic leaking into domain
- unsupported scraping/bypass tactics
- secrets in frontend

## 5. Entry points
- Settings/Integrations
- owning domain workflow
- CSV/import flow
- Platform/Presence admin

## 6. Preconditions and dependencies
- PlatformCapability/Research Claims
- provider credentials where connected
- JobService
- domain repositories

## 7. Information architecture
Identify source/platform → resolve current capability/schema → execute manual/import/API workflow → validate → persist normalized result + provenance → expose freshness/errors to owning domain.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
Integration-layer records reference domain entities; external IDs/source versions remain traceable.

## 10. Main happy-path workflow
1. Select platform/source
2. Resolve current supported mode
3. Preview/validate requested operation
4. Execute import/read/action only within permission
5. Persist normalized data/provenance
6. Surface failures/staleness

## 11. Alternative workflows
- manual-only
- API unavailable
- schema changed
- authorization expired
- partial provider data

## 12. User actions
- connect/disconnect where applicable
- import
- refresh
- inspect source/freshness
- retry safe job

## 13. State model
Integration state can be connected/degraded/disconnected/stale as implementation requires; domain truth is not erased by connector failure.

## 14. Business rules
- `PLT-ADP-001` domain independent from named platform SDK
- `PLT-ADP-002` official available fields only
- `PLT-ADP-003` manual/CSV fallback first-class
- `PLT-ADP-004` publishing approval required
- `PLT-ADP-005` search/SEO myths not hardcoded
- `PLT-ADP-006` Spotify metadata/profile/performance/royalty imports separated
- `PLT-ADP-007` creative tools registry not architectural dependency
- `PLT-ADP-008` adapter failure not break core OS

## 15. AI behavior
AI may assist detection/mapping/explanation but cannot invent platform state, bypass provider restrictions or expose credentials.

## 16. Human approval
Connection changes and audience-facing actions require explicit approval; read/import refresh may run automatically under configured scope.

## 17. Validation
- source/platform identified
- credential access server-side
- schema/capability current enough
- duplicate/idempotency checks

## 18. UI states
- manual
- connected
- partial
- stale
- degraded
- auth expired
- schema mismatch
- done

## 19. Edge cases
- platform rollout differs by region
- API field removed
- rate limit
- duplicate callbacks
- manual and API data conflict

## 20. Cross-module effects
- Capability Registry
- Research Claims
- owning domains
- Jobs
- Audit

## 21. Notifications and attention model
- auth expiry
- schema drift
- stale capability affecting active workflow

## 22. Search / filtering / sorting / bulk actions
Filter by platform/source/status/freshness. Bulk imports allowed with preview; bulk external writes require explicit safe support and approval.

## 23. Analytics and product telemetry
- connection status
- refresh/import result
- mapping override
- schema drift
- manual fallback

## 24. Learning feedback
Integration telemetry improves reliability and platform knowledge freshness; it does not become artist creative Learning by itself.

## 25. Auditability / provenance
Persist provider/source/version/external IDs/mapping/config and actor without secrets.

## 26. Desktop / mobile behavior
Desktop configuration/import; mobile status/urgent reconnect checks.

## 27. Accessibility / usability
Always distinguish unsupported, unknown and temporarily unavailable.

## 28. Security / privacy / rights
OAuth/API secrets encrypted server-side; least privilege; provider terms/privacy respected.

## 29. Performance / async jobs
External operations use JobService where long-running; idempotency/retry and provider rate limits enforced.

## 30. Acceptance criteria
- `PLT-ADP-AC01` Manual/CSV fallback remains available.
- `PLT-ADP-AC02` Stale rule is visibly stale.
- `PLT-ADP-AC03` Secrets never reach frontend/logs.
- `PLT-ADP-AC04` Schema drift does not silently corrupt imports.

## 31. Test matrix
- manual-only
- auth expiry
- schema change
- partial API
- duplicate import

## 32. Open questions
- Provider-specific implementation details belong to adapters; shared normalized contracts finalized in Engineering Spec.

## 33. Traceability
MASTER §374–378, §44–47
