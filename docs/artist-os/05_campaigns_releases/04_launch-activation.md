# Launch Activation Plan

- **Status:** REVIEW COMPLETE
- **MASTER references:** §203–206, §226–233, §262, §319, §401
- **Domain:** 05_campaigns_releases
- **Feature slug:** `launch-activation`
- **Requirement prefix:** `CMP-LCH`

## 2. Purpose
Coordinate the concrete actions around a release launch without converting the OS into an autonomous publishing/spend machine.

## 3. User problem / job-to-be-done
At launch, the artist must coordinate content, DSP actions, links, owned media, creator activity and optional email/press/ads extensions. The problem is timing and dependency coherence, not generating a giant checklist.

## 4. Scope
MASTER LaunchActivationPlan channels/contentUnits/pressActions/adsExtensionPoints/emailActions/creatorActions; product adds readiness, ownership/reference, timing, status and rationale. Advertising/Publicity remain extension boundaries.

## 5. Entry points
Release detail, Campaign, Release Readiness, Momentum window.

## 6. Preconditions and dependencies
Release required; campaign recommended. Launch can still be tracked manually.

## 7. Information architecture
Launch summary → critical actions → content → DSP → link/website → creator → optional email → future publicity/ads extensions → completion/risks.

## 8. User roles and permissions
MVP user approves actions. Future external/team owners can be represented later without changing domain ownership.

## 9. Core data model
Canonical `LaunchActivationPlan` per MASTER references a Release and typed action references. Final action schema can use generic orchestration items referencing owner domain + entity ID rather than copying data.

## 10. Main happy-path workflow
Generate/compose plan → review critical actions → link existing work/create missing work in owner modules → resolve dependencies → execute manually/native provider → mark/import completion → day-of overview shows only relevant current actions.

## 11. Alternative workflows
Minimal launch; no website; no creator activity; surprise drop; launch date moves; some actions intentionally skipped.

## 12. User actions
Add/remove/reorder action, mark optional/critical, link entity, mark manually done, open owner module, request suggestion, defer, skip with reason.

## 13. State model
Action projection: `PLANNED / READY / BLOCKED / IN_PROGRESS / DONE / SKIPPED / CANCELLED`; final persistence design TBD.

## 14. Business rules
- `CMP-LCH-001` Launch plan MUST distinguish critical vs optional actions.
- `CMP-LCH-002` Launch plan MUST reference existing canonical domain entities whenever one exists.
- `CMP-LCH-003` User MAY intentionally skip an optional action without reducing a fake readiness score.
- `CMP-LCH-004` System MUST explain why an action is suggested and what dependency it serves.
- `CMP-LCH-005` Future press/ad actions MUST remain extension points and MUST NOT invent future schemas.
- `CMP-LCH-006` Publishing, spend and outbound outreach MUST require explicit approval in their owning modules.
- `CMP-LCH-007` Launch plan MUST update attention after release date change.
- `CMP-LCH-008` A release MAY use a deliberately minimal activation plan.
- `CMP-LCH-009` System MUST NOT claim coordinated launch guarantees algorithmic distribution.
- `CMP-LCH-010` Same action MUST not be duplicated if already represented through linked domain entity.
- `CMP-LCH-011` Completion may be imported from provider evidence or manually confirmed; source must be visible.
- `CMP-LCH-012` Stale platform capability must block certainty, not necessarily the whole plan.
- `CMP-LCH-013` Day-of view should prioritize unresolved critical actions and current CTA, not full historical checklist.
- `CMP-LCH-014` Launch plan must remain useful without AI.

## 15. AI behavior
Propose plan from Release/Campaign/Identity/DSP readiness/Platform capabilities/available assets. Explain omissions and uncertainty. Do not create fake “best launch time”.

## 16. Human approval
Plan approval optional as a whole, but sensitive actions require explicit action-level approval.

## 17. Validation
Linked action reference must resolve or show broken reference. Time must be consistent with release date/window. Unsupported capability flagged.

## 18. UI states
No plan, suggested draft, active, blocked, release-day, completed, stale capability, partial provider state.

## 19. Edge cases
Date change hours before launch; content not ready; DSP pitch missed; smartlink unavailable; provider reports completion late.

## 20. Cross-module effects
Calendar, Overview, Link Routing, DSP, Content/Pipeline, Creator Collaboration, future Publicity/Advertising.

## 21. Notifications and attention model
Only deadline/dependency/approval-based notifications; no generic “post more” reminders.

## 22. Search / filtering / sorting / bulk actions
Filter by channel/status/criticality/owner module. Bulk mark done only for manual actions with confirmation.

## 23. Analytics and product telemetry
Plan adoption, action completion latency, manual vs linked work, date-change rework, skipped-action reasons.

## 24. Learning feedback
After launch, plan execution can be contextual evidence; do not infer that a single omitted/completed action caused performance.

## 25. Auditability / provenance
Who/what marked action done; source of suggestion; linked domain entity; skip reason.

## 26. Desktop / mobile behavior
Desktop planning; mobile day-of action list optimized for quick execution/check-off.

## 27. Accessibility / usability
Criticality uses labels/icons/text, not only color.

## 28. Security / privacy / rights
Unreleased assets and private campaign notes stay internal.

## 29. Performance / async jobs
Suggestion generation async; persisted plan loads immediately.

## 30. Acceptance criteria
- `CMP-LCH-AC01` User can create minimal launch plan manually.
- `CMP-LCH-AC02` Existing Content/DSP/Link items are linked, not duplicated.
- `CMP-LCH-AC03` Release-date change highlights affected actions.
- `CMP-LCH-AC04` Future Ads/PR appear only as extension references.
- `CMP-LCH-AC05` Day-of mobile view shows unresolved critical/current actions first.
- `CMP-LCH-AC06` AI outage does not prevent plan use.

## 31. Test matrix
Minimal plan, AI-generated draft, duplicate entity link, date change, stale capability, skipped optional item, manual completion, provider completion.

## 32. Open questions
Generic orchestration action entity vs typed join tables; future owner/assignee model deferred.

## 33. Traceability
MASTER §233 LaunchActivationPlan, §20 Human Approval, §413–448 Advertising/Publicity boundary.
