# Publication Tracking

- **Status:** REVIEW COMPLETE
- **MASTER references:** §197–202, §287–300, §371–377
- **Domain:** 10_distribution_owned_media
- **Feature slug:** `publications`
- **Requirement prefix:** `DST-PUB`

## 2. Purpose
Represent each platform-specific publication as its own operational and analytical entity while preserving lineage to the master Content Unit.

## 3. User problem / job-to-be-done
A single creative concept is often posted differently on Instagram, TikTok, YouTube or other surfaces. Treating all posts as one Content Unit loses actual captions, URLs, audio usage, timing and metrics.

## 4. Scope
### In scope
- Publication entity and lifecycle
- platform-specific metadata/history
- manual/native/API tracking
- ContentUnit lineage
- metric/import linkage
- external identifiers/URLs

### Out of scope / non-goals
- duplicating the full ContentUnit
- platform-specific analytics normalization details beyond linkage
- autonomous publishing

## 5. Entry points
- Pipeline/Calendar scheduled item
- Content Unit detail
- Distribution home
- import wizard
- provider callback/manual publication capture

## 6. Preconditions and dependencies
- ContentUnit
- platform account/capabilities
- platform adaptation
- AudioUsage
- rights
- PublishingMode

## 7. Information architecture
Publication list/detail → canonical ContentUnit reference → platform execution snapshot → status/history → metrics → external link.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER `Publication {id, contentUnitId, platform, platformContentId?, publishedAt?, url?, status, captionVersion, audioUsage}` plus implementation metadata such as publishingMode/provider reference/status history pending schema freeze.

## 10. Main happy-path workflow
1. Create or prepare platform Publication from a Content Unit
2. Apply/confirm platform-specific adaptation
3. Choose publishing mode
4. Schedule or mark manual plan
5. After publish, record external ID/URL/time
6. Attach metric snapshots/imports
7. Preserve publication-specific history and link back to Content Unit

## 11. Alternative workflows
- manual post with no external ID
- provider publishes then callback delayed
- publication fails
- content deleted externally later
- same ContentUnit posted twice on same platform intentionally

## 12. User actions
- create publication
- edit pre-publish metadata
- schedule/unschedule where supported
- mark manually published
- attach external URL/ID
- open platform
- archive internal operational view without deleting history

## 13. State model
MASTER does not define Publication status enum. Product requires pre-publish/published/failure/history behavior; exact enum is an open schema item. Published facts must not be rolled back by editing a ContentUnit.

## 14. Business rules
- `DST-PUB-001` Publication MUST be distinct from ContentUnit.
- `DST-PUB-002` One ContentUnit MAY have zero, one or many Publications.
- `DST-PUB-003` Two Publications for the same ContentUnit/platform MUST be allowed when they represent intentional separate executions.
- `DST-PUB-004` Publication MUST preserve the exact platform-specific caption/adaptation/audio context used at execution time.
- `DST-PUB-005` Editing the master ContentUnit after publication MUST NOT rewrite historical Publication metadata.
- `DST-PUB-006` PublishedAt MUST represent actual/verified publish time when known, not planned schedule time.
- `DST-PUB-007` PlatformContentId/url MAY be absent in manual mode and MUST NOT block internal tracking.
- `DST-PUB-008` Publication metrics MUST attach to the Publication, not directly overwrite master ContentUnit fields.
- `DST-PUB-009` External deletion/unavailability MUST preserve historical Publication and metrics.
- `DST-PUB-010` PublishingMode/provider MUST be recorded or inferable for operational diagnostics.
- `DST-PUB-011` Rights/Identity checks SHOULD run before execution but their result is historical evidence, not permission to rewrite past publication.
- `DST-PUB-012` Platform-specific adaptations MUST preserve lineage to the same master concept unless the product boundary creates a distinct ContentUnit.
- `DST-PUB-013` Duplicate detection MUST distinguish import duplicate from intentional repost.
- `DST-PUB-014` Publication creation MUST remain possible without a connected API/provider.
- `DST-PUB-015` No missing metric/ID MAY be represented as zero or fabricated value.

## 15. AI behavior
AI can draft platform-specific text/adaptation and summarize publication history; it cannot assert publication occurred without external/manual evidence or invent IDs/metrics.

## 16. Human approval
Publish/schedule actions require explicit approval according to mode. Manual “mark published” is a user assertion and must be audited.

## 17. Validation
- ContentUnit exists
- platform valid
- caption/audio references valid
- rights not knowingly blocking
- publishedAt/timezone coherent
- external ID uniqueness rules scoped correctly

## 18. UI states
- planned/prepared
- scheduled
- publishing
- published
- failed
- external state unknown
- externally unavailable
- partial metadata

## 19. Edge cases
- repost same platform
- crosspost uses different audio
- manual publish date entered later
- provider callback duplicate
- external post deleted
- URL shortlink changes

## 20. Cross-module effects
- Content Unit/Pipeline
- Calendar
- Publishing
- Analytics
- Profile Audit
- DSP only where platform is DSP-adjacent
- Lineage

## 21. Notifications and attention model
- scheduled publication fails
- published URL/ID missing after provider execution
- external post unavailable for active campaign

## 22. Search / filtering / sorting / bulk actions
Filter by platform/status/song/campaign/date/mode. Bulk prepare/schedule may be supported when provider/capabilities allow; bulk mark-published requires careful confirmation/import provenance.

## 23. Analytics and product telemetry
- publication created
- scheduled
- publish success/failure
- manual mark published
- external ID linked
- duplicate resolved

## 24. Learning feedback
Publication response feeds Analytics/Insights. Operational publish success alone is not a creative Learning.

## 25. Auditability / provenance
Immutable-ish execution snapshot: actor/provider, mode, planned vs actual time, exact adaptation, external IDs, audit events and later external-status changes.

## 26. Desktop / mobile behavior
Desktop handles multi-platform preparation. Mobile supports publish-check, URL capture and status confirmation.

## 27. Accessibility / usability
Clearly separate planned time from actual published time; provide copy/open actions with accessible labels.

## 28. Security / privacy / rights
Tokens/provider credentials server-side. Rights/private metadata excluded from public payload. Preserve only needed external IDs.

## 29. Performance / async jobs
API/third-party publishing runs through JobService/provider callbacks with idempotency. Manual mode has no job dependency.

## 30. Acceptance criteria
- `DST-PUB-AC01` One ContentUnit can produce two Publications with different captions.
- `DST-PUB-AC02` Editing ContentUnit later does not alter published snapshot.
- `DST-PUB-AC03` Manual publication can exist without platformContentId.
- `DST-PUB-AC04` External deletion preserves history.
- `DST-PUB-AC05` Metrics attach to Publication.

## 31. Test matrix
- manual publish
- API success
- API callback delayed
- duplicate callback
- intentional repost
- external deletion
- cross-platform variants

## 32. Open questions
- Canonical Publication status enum is not defined by MASTER and needs schema freeze.
- Clarify persisted boundary between adaptation version and Publication execution snapshot.

## 33. Traceability
MASTER §197–202, §287–300, §371–377
