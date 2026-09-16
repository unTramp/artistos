# Starter Content Pack

- **Status:** REVIEW COMPLETE
- **MASTER references:** §194, §127–147, §192–202, §403–410
- **Domain:** 10_distribution_owned_media
- **Feature slug:** `starter-pack`
- **Requirement prefix:** `DST-STP`

## 2. Purpose
Help a new or reset artist profile communicate a coherent minimum representation before acquisition, without forcing a rigid grid template.

## 3. User problem / job-to-be-done
A profile can contain content yet still fail to communicate “who is this artist, what do they sound like, and why stay?” The artist needs a role-based starter set derived from existing content/capacity rather than generic posting quotas.

## 4. Scope
### In scope
- role-based starter coverage
- candidate selection from existing Content Units/Publications
- gap generation via Content Factory
- campaign/profile objective context
- pin recommendations where capability exists

### Out of scope / non-goals
- fixed nine-post requirement
- automatic archive/delete of old posts
- mandatory aesthetic grid
- fake social proof

## 5. Entry points
- Profile Readiness missing representative content
- Distribution home
- onboarding
- Profile Content Audit
- Campaign setup

## 6. Preconditions and dependencies
- Content library/Publications
- Identity
- Song catalog
- Content Factory
- platform capabilities
- rights status

## 7. Information architecture
Starter Pack summary → roles covered → best existing candidates → missing roles → create/repackage actions → optional pin plan.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
Logical role coverage. MASTER examples: ARTIST_INTRO, PERFORMANCE, SONG_DISCOVERY, PERSONALITY, VISUAL_IDENTITY, BTS. Persistent entity is not defined; implementation may be projection/plan pending schema review.

## 10. Main happy-path workflow
1. Select target platform/profile and primary objective
2. System evaluates existing published/ready content by role
3. Existing candidates are ranked with rationale, not a global score
4. Missing roles are shown
5. User can select existing content, repackage, or create a new Angle
6. Optional pin plan is prepared if supported
7. Profile readiness consumes completed coverage

## 11. Alternative workflows
- Established artist already has enough representative content
- identity deliberately minimizes personality/BTS
- no original song released yet
- platform has limited pin slots
- rights block a candidate

## 12. User actions
- accept candidate
- choose another
- mark role not applicable with reason
- send gap to Factory
- repackage
- prepare pin/unpin task

## 13. State model
Draft coverage plan → minimum coverage achieved → profile-context complete. It is not a publication state machine; referenced Content Units retain their own states.

## 14. Business rules
- `DST-STP-001` Starter Pack MUST be role-based, not hardcoded to a fixed post count.
- `DST-STP-002` Role examples from MASTER MUST be configurable/contextual rather than universal mandatory categories.
- `DST-STP-003` Existing valid content SHOULD be reused before generating filler.
- `DST-STP-004` A role MAY be marked not applicable when Identity/era/objective justifies it; the reason is preserved.
- `DST-STP-005` Pack completion MUST NOT require feed-grid visual perfection.
- `DST-STP-006` Candidate selection MUST consider rights and current Identity/Era alignment.
- `DST-STP-007` Older content MAY remain useful when still representative; recency alone MUST NOT force replacement.
- `DST-STP-008` Archived/rejected content MUST NOT be silently reactivated.
- `DST-STP-009` Pin recommendations MUST respect current platform capability/freshness.
- `DST-STP-010` The system MUST NOT automatically pin, archive or publish as part of pack generation.
- `DST-STP-011` When no suitable candidate exists, the system SHOULD create a scoped Content Factory brief rather than generic “post more”.
- `DST-STP-012` Pack status SHOULD feed Profile Readiness but MUST NOT become an independent vanity score.

## 15. AI behavior
AI can map content to roles, explain candidate fit and propose missing-role Angles using Identity/Song/Campaign context. It must not invent that content is published or available externally.

## 16. Human approval
User chooses candidates, not-applicable exceptions and all external pin/archive/publish actions.

## 17. Validation
- candidate content exists and is usable
- rights allow intended use
- role assignment has rationale
- platform capability current before pin task

## 18. UI states
- no content
- partial coverage
- complete minimum coverage
- role N/A
- rights blocked candidate
- stale identity candidate

## 19. Edge cases
- cover artist without originals
- new era invalidates old visuals
- same publication covers multiple roles
- one Content Unit has several platform Publications

## 20. Cross-module effects
- Profile Readiness
- Factory
- Pipeline
- Profile Audit
- Identity
- Publications

## 21. Notifications and attention model
- profile acquisition starts before minimum coverage
- selected pinned content becomes unavailable
- identity change makes pack stale

## 22. Search / filtering / sorting / bulk actions
Filter candidates by role/song/era/platform/state. Bulk assign roles can be offered with review; bulk publish/archive is out of scope.

## 23. Analytics and product telemetry
- candidate accepted/rejected
- role marked N/A
- gap sent to Factory
- time to minimum coverage

## 24. Learning feedback
Role acceptance may improve future operational recommendations but does not automatically become a creative Learning.

## 25. Auditability / provenance
Record selected candidate, rationale, user override and identity version used for the plan.

## 26. Desktop / mobile behavior
Desktop supports comparative selection. Mobile supports reviewing/accepting candidates and quick role status.

## 27. Accessibility / usability
Explain roles in artist language, not taxonomy jargon. Allow one asset/content item to satisfy multiple legitimate roles.

## 28. Security / privacy / rights
Respect RightsStatus and Mystique/Interpretation policies; do not expose protected story material to fill a role.

## 29. Performance / async jobs
Candidate classification may run async for large libraries; deterministic manual selection remains available.

## 30. Acceptance criteria
- `DST-STP-AC01` No fixed nine-post rule is present.
- `DST-STP-AC02` An existing valid performance can satisfy PERFORMANCE without regeneration.
- `DST-STP-AC03` A role can be N/A with recorded reason.
- `DST-STP-AC04` Rights-blocked content is not recommended as publishable.
- `DST-STP-AC05` Pack generation never publishes automatically.

## 31. Test matrix
- new artist
- cover artist
- established catalog
- new era
- limited pin capability
- rights conflict

## 32. Open questions
- Should StarterContentPack be persisted as a plan entity or computed from role assignments/profile context?

## 33. Traceability
MASTER §194, §127–147, §192–202, §403–410
