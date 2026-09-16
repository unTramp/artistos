# Profile Content Audit

- **Status:** REVIEW COMPLETE
- **MASTER references:** §195–196, §197–202, §287–320
- **Domain:** 10_distribution_owned_media
- **Feature slug:** `profile-audit`
- **Requirement prefix:** `DST-AUD`

## 2. Purpose
Provide a deliberate KEEP/ARCHIVE/REPACKAGE/PIN/IGNORE review of existing profile content without treating cleanup or feed aesthetics as growth laws.

## 3. User problem / job-to-be-done
Artists accumulate old posts across eras and goals. They need to decide what still represents them, what can be reused, and what should stop receiving attention—without deleting history based on a simplistic engagement ranking.

## 4. Scope
### In scope
- audit actions from MASTER
- platform/publication context
- identity/era relevance
- historical performance context
- optional FeedPreview as gut-check
- manual task output

### Out of scope / non-goals
- automatic deletion
- universal engagement threshold
- grid-aesthetic optimization as core KPI
- rewriting historical metrics

## 5. Entry points
- Distribution home
- Profile Readiness
- Starter Pack
- Publication detail
- Identity era transition

## 6. Preconditions and dependencies
- Publications
- Content Units
- Identity/Era
- rights
- metrics where available
- platform capability for PIN

## 7. Information architecture
Audit queue → publication preview/evidence → suggested action → user decision → action task/external completion → audit history. Optional FeedPreview is secondary.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
ProfileContentAudit action enum: KEEP, ARCHIVE, REPACKAGE, PIN, IGNORE. Audit record should reference Publication/ContentUnit, identity context, evidence and decision timestamp; final schema open.

## 10. Main happy-path workflow
1. Choose platform and audit scope
2. System gathers relevant publications and context
3. User reviews one-by-one or grouped
4. System may suggest an action with reasons
5. User accepts/changes/skips
6. External actions are tracked as tasks unless provider supports approved execution
7. Audit summary updates profile readiness/starter coverage

## 11. Alternative workflows
- No metrics available
- old post is off-identity but important history
- high-performing post conflicts with current era
- platform cannot pin
- same ContentUnit has different platform outcomes

## 12. User actions
- KEEP
- ARCHIVE task
- REPACKAGE to Factory
- PIN task
- IGNORE
- undo internal decision where external action not executed
- open lineage/metrics

## 13. State model
Audit decision state: unreviewed → decided; external execution is tracked separately. KEEP/IGNORE are internal decisions. ARCHIVE/PIN may be pending/completed/failed externally pending implementation.

## 14. Business rules
- `DST-AUD-001` Profile audit MUST preserve historical Publication/metrics records regardless of external archive action.
- `DST-AUD-002` KEEP MUST NOT imply “best performer”; representativeness and current objective may justify it.
- `DST-AUD-003` ARCHIVE MUST be user-approved and MUST NOT delete the internal Publication record.
- `DST-AUD-004` REPACKAGE MUST create a new planned derivative/adaptation path with lineage rather than mutate the old publication.
- `DST-AUD-005` PIN recommendations MUST respect platform capability and slot limits when known.
- `DST-AUD-006` IGNORE means no profile action now and MUST NOT erase the item from analytics/history.
- `DST-AUD-007` FeedPreview MUST remain optional and MUST NOT block publication/audit completion.
- `DST-AUD-008` Visual grid harmony MUST NOT override Identity, narrative, rights or campaign utility.
- `DST-AUD-009` AI suggestions MUST cite relevant identity/performance/context evidence and uncertainty.
- `DST-AUD-010` Missing metrics MUST be shown as missing, not interpreted as poor performance.
- `DST-AUD-011` Audit MAY be scoped to an Era transition, campaign preparation or general cleanup and MUST record scope.
- `DST-AUD-012` External state uncertainty MUST be explicit when the OS cannot verify whether archive/pin was executed.

## 15. AI behavior
AI may cluster old profile content and suggest actions using Identity/Era, role coverage and metrics. It cannot infer deletion-worthy content from low reach alone or execute external destructive actions.

## 16. Human approval
All archive/pin external actions and repackage approval are human-controlled. AI suggestions can be bulk-reviewed but not auto-applied externally.

## 17. Validation
- audit target is a known Publication/profile item
- PIN capability/slot status checked if relevant
- rights checked before repackaging
- historical metrics remain immutable

## 18. UI states
- unreviewed
- suggested
- decided
- external action pending
- completed
- external state unknown
- provider failure

## 19. Edge cases
- post deleted manually outside OS
- publication URL changed
- old identity version intentionally retained
- pinned slot occupied
- collab post controlled by another account

## 20. Cross-module effects
- Profile Readiness
- Starter Pack
- Factory/Repurposing
- Identity/Era
- Analytics
- Platform Capability

## 21. Notifications and attention model
- era transition audit recommended
- pending archive/pin before campaign
- external execution failed

## 22. Search / filtering / sorting / bulk actions
Filter by audit decision, era, song, pillar, platform, age and publication status. Bulk internal decisions may be allowed with explicit confirmation; destructive external actions remain granular/reviewed.

## 23. Analytics and product telemetry
- audit started/completed
- suggestion acceptance
- manual override reason
- repackage conversion
- external task completion/failure

## 24. Learning feedback
Audit decisions can inform profile operations. They become creative Learning only through evidence-aware analytics/experiment flow, not automatically.

## 25. Auditability / provenance
Preserve proposed action, final decision, rationale, actor, identity version, evidence references and external execution result.

## 26. Desktop / mobile behavior
Desktop supports dense audit grid/list and FeedPreview. Mobile supports quick item review and pending external task confirmation.

## 27. Accessibility / usability
Keyboard review should support clear focus and undo for internal decisions. Destructive external actions require explicit wording.

## 28. Security / privacy / rights
Never surface private/internal-canon material in repackaging suggestions. Respect rights and collaboration ownership.

## 29. Performance / async jobs
Large audits can precompute thumbnails/metrics asynchronously; decisions must save incrementally and be idempotent.

## 30. Acceptance criteria
- `DST-AUD-AC01` ARCHIVE never deletes internal history.
- `DST-AUD-AC02` REPACKAGE creates lineage to a new work item.
- `DST-AUD-AC03` FeedPreview is optional.
- `DST-AUD-AC04` Missing metrics are not scored as failure.
- `DST-AUD-AC05` PIN is not recommended when capability is unsupported/stale without warning.

## 31. Test matrix
- old era
- no metrics
- manual deleted post
- collab content
- pin slot full
- bulk review

## 32. Open questions
- Need canonical external-action/task representation shared with Distribution/DSP/Platform adapters.

## 33. Traceability
MASTER §195–196, §197–202, §287–320
