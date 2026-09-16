# DSP Release Plan

- **Status:** REVIEW COMPLETE
- **MASTER references:** §226, §230–233, §406
- **Domain:** 11_dsp
- **Feature slug:** `dsp-release-plan`
- **Requirement prefix:** `DSP-RLP`

## 2. Purpose
Turn each Release × DSP combination into an actionable plan of profile, pitch, visual, playlist, campaign-tool, launch and post-launch tasks.

## 3. User problem / job-to-be-done
A release can be technically distributed yet miss editorial deadlines, profile updates, visual assets or post-launch actions. Artists need platform-specific execution plans derived from capabilities, not generic checklists.

## 4. Scope
### In scope
- DSPReleasePlan task groups from MASTER
- per-platform task applicability/deadlines
- release readiness linkage
- manual/provider completion evidence
- post-launch tasks

### Out of scope / non-goals
- distribution delivery engine
- advertising campaign implementation
- publicity CRM

## 5. Entry points
- Release detail
- DSP home
- Release Readiness
- DSPOpportunity

## 6. Preconditions and dependencies
- Release
- DSPProfile
- PlatformCapability
- DSPOpportunity
- Campaign
- Assets/Content/Link routing

## 7. Information architecture
Select Release → platform plans generated/created → resolve applicable capabilities/opportunities → create grouped tasks → assign deadline/owner/source → execute/verify → launch/post-launch review.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER `DSPReleasePlan {releaseId, platform, profileTasks[], pitchTasks[], visualTasks[], playlistTasks[], campaignTools[], launchTasks[], postLaunchTasks[]}`. Task object schema/status is not defined and should align with a shared external-action/task model.

## 10. Main happy-path workflow
1. Create/open release DSP plan
2. System checks target platforms and current capabilities
3. Applicable task groups are populated with source/deadline
4. User removes marks N/A or adds manual task where needed
5. Complete tasks externally/integration
6. Verify evidence and readiness
7. Continue post-launch tasks after release

## 11. Alternative workflows
- DSP has no editorial pitch
- release already live
- late plan after deadline
- feature eligibility unknown
- one DSP receives release later

## 12. User actions
- add task
- mark N/A with rationale
- set/confirm deadline
- open opportunity
- record external completion
- reopen task
- link asset/content

## 13. State model
Plan active across release lifecycle; individual task states need canonical shared schema. Missed deadline is a task outcome/context, not a reason to delete the task.

## 14. Business rules
- `DSP-RLP-001` Each DSPReleasePlan MUST be scoped to one Release and one DSP/platform.
- `DSP-RLP-002` Task applicability MUST derive from verified capabilities/opportunities where possible.
- `DSP-RLP-003` Unsupported platform features MUST NOT appear as required blockers.
- `DSP-RLP-004` Deadlines from external platform rules MUST retain source/freshness.
- `DSP-RLP-005` Missed opportunity deadlines MUST be recorded honestly and not silently shifted.
- `DSP-RLP-006` Profile tasks SHOULD reference DSPProfile rather than duplicate profile state.
- `DSP-RLP-007` Visual/content/link tasks SHOULD reference owning domain entities rather than store copied truth.
- `DSP-RLP-008` Post-launch tasks MUST remain available after release date; plan is not complete merely because DAY_0 passed.
- `DSP-RLP-009` Plan generation MUST NOT imply all available DSP campaign tools should be used.
- `DSP-RLP-010` Unknown eligibility MAY create a verify task instead of a required activation task.
- `DSP-RLP-011` Release date changes MUST recalculate relative task timing while preserving prior deadlines/history.
- `DSP-RLP-012` DSPReleasePlan MUST remain functional as a manual checklist when integrations are absent.
- `DSP-RLP-013` Advertising/Publicity references remain extension points only and MUST NOT be expanded into v1.3 entities here.

## 15. AI behavior
AI may propose plan tasks from current capability/opportunity data and release context, label source/uncertainty, and prioritize. It cannot submit pitches or activate DSP paid tools without approval.

## 16. Human approval
User approves plan/task applicability and all external submissions/activations.

## 17. Validation
- release platform valid
- capability source current enough
- deadline/timezone valid
- referenced assets/tasks exist

## 18. UI states
- new plan
- partial
- ready for launch
- deadline missed
- unknown eligibility
- post-launch active
- catalog maintenance

## 19. Edge cases
- release date moves
- platform launch delayed
- opportunity disappears
- profile task completed outside OS
- release withdrawn

## 20. Cross-module effects
- Release Readiness
- DSPProfile
- Opportunities
- Campaign
- Distribution
- Assets
- Overview

## 21. Notifications and attention model
- deadline within threshold
- required task blocked
- release date changed
- external completion unverified

## 22. Search / filtering / sorting / bulk actions
Filter tasks by group/status/deadline/blocking. Bulk mark N/A only for shared verified reason; no bulk external submissions.

## 23. Analytics and product telemetry
- plan generated
- task accepted/removed
- deadline changed
- task completed
- N/A reason
- reopen

## 24. Learning feedback
Plan execution data can later inform operational process improvements; not automatically creative Learning.

## 25. Auditability / provenance
Store task source, deadline derivation, actor, external evidence and release-date version used.

## 26. Desktop / mobile behavior
Desktop plan/checklist; mobile upcoming tasks and evidence capture.

## 27. Accessibility / usability
Group tasks by outcome and show why each exists/source. Use absolute deadlines in addition to relative labels.

## 28. Security / privacy / rights
Do not expose private provider credentials or internal-only marketing plan text in public contexts.

## 29. Performance / async jobs
Opportunity/capability refresh async; plan is usable from cached structured state and marks staleness.

## 30. Acceptance criteria
- `DSP-RLP-AC01` Unsupported feature does not become blocker.
- `DSP-RLP-AC02` Release date change recalculates relative schedule without deleting history.
- `DSP-RLP-AC03` Manual completion is possible.
- `DSP-RLP-AC04` Unknown eligibility becomes verify task rather than false requirement.
- `DSP-RLP-AC05` Post-launch tasks remain after DAY_0.

## 31. Test matrix
- late plan
- date move
- feature unavailable
- unknown eligibility
- manual completion
- release withdrawn

## 32. Open questions
- Need shared task status/entity contract across DSPReleasePlan, LaunchActivationPlan and distribution external actions.

## 33. Traceability
MASTER §226, §230–233, §406
