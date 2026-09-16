# Calendar — Week / Month Planning

- **Status:** REVIEW COMPLETE
- **MASTER references:** §151–159, §200, §206, §231, §354, §356, §407
- **Domain:** 07_pipeline_planning_calendar
- **Feature slug:** `calendar`
- **Requirement prefix:** `PLN-CAL`

## 2. Purpose
Provide a temporal planning surface that combines campaign commitments, flexible content intent, shoots and publication timing without pretending every plan is an exact schedule.

## 3. User problem / job-to-be-done
Artists need to see workload and release rhythm across time, but conventional social calendars conflate an idea, a shoot date and a scheduled publication. Artist OS must show time while preserving domain semantics.

## 4. Scope
Week/Month views, ContentSlots, ContentUnits, scheduled Publications, ShootSessions, Campaign/Release milestones and relevant experiments/opportunities as typed calendar items; drag/move with validation; filters; capacity context.

## 5. Entry points
Primary `/calendar`; Overview upcoming; Pipeline card; Campaign/Release; Shoot planner; Rhythm/Objective.

## 6. Preconditions and dependencies
Artist required. Calendar works with partial data. Exact timezone policy must be defined at engineering level; item source/domain determines semantics.

## 7. Information architecture
Week/Month toggle → filters → objective/rhythm context → calendar grid → typed cards → detail drawer. Visual distinction between planning window, shoot, publication schedule and milestone is mandatory.

## 8. User roles and permissions
Single artist may plan/move own items. Moving external/native scheduled publication must respect provider capability and approval.

## 9. Core data model
Calendar is primarily a projection over ContentSlot, ContentUnit planning fields, Publication, ShootSession, Release/Campaign milestones, LiveSession and potentially SeasonalOpportunity. Avoid creating generic CalendarEvent copies of domain entities unless required for true user-created events.

## 10. Main happy-path workflow
Open month → see active objective/campaign milestones and current slots/work → create/accept slots → assign content → schedule shoots/publications when ready → move items as plans change → inspect conflicts/capacity → review actual published history.

## 11. Alternative workflows
No active objective; spontaneous publication; rescheduled release; native platform schedule changes externally; offline/manual publication; multiple timezones; flexible date window only.

## 12. User actions
Change view/date, create slot, open item, drag/move where allowed, assign content, create ShootSession, create/modify schedule, filter, jump to today/release date, mark manual publication from linked item.

## 13. State model
Calendar itself has no independent workflow state. Every item retains source-domain status. Drag behavior depends on item type.

## 14. Business rules
- `PLN-CAL-001` Calendar MUST distinguish planning intent from execution fact.
- `PLN-CAL-002` ContentSlot, ShootSession, Publication and Release milestone MUST retain distinct visual/type semantics.
- `PLN-CAL-003` Week and Month views MUST be supported.
- `PLN-CAL-004` Moving a ContentSlot changes planning window only; it MUST NOT mutate publication history.
- `PLN-CAL-005` Moving a scheduled Publication MUST invoke Distribution scheduling rules/provider capability rather than directly editing a generic date.
- `PLN-CAL-006` Moving a ShootSession MUST preserve shot/content links and warn about downstream date conflicts.
- `PLN-CAL-007` Historical published items MUST not be draggable into a new date as if history changed.
- `PLN-CAL-008` Calendar SHOULD show active Campaign/Release milestones relevant to planning.
- `PLN-CAL-009` Calendar SHOULD show capacity conflict context when known but MUST NOT auto-cancel artistic work.
- `PLN-CAL-010` Flexible slots/date windows MUST be visually different from exact scheduled times.
- `PLN-CAL-011` Missing date MUST be acceptable for Pipeline work that is not yet planned.
- `PLN-CAL-012` AI timing suggestions MUST be advisory and explain the basis (campaign deadline, capacity, own evidence, authoritative platform constraint or heuristic).
- `PLN-CAL-013` AI MUST NOT present generic “best time to post” as fact without current evidence.
- `PLN-CAL-014` Actual publication time SHOULD be preserved separately from planned/scheduled time.
- `PLN-CAL-015` External schedule drift/failure SHOULD be surfaced as reconciliation state, not silently overwritten.
- `PLN-CAL-016` Calendar filters SHOULD include Song, Campaign, Platform, mode/type and status.
- `PLN-CAL-017` Calendar MUST remain useful without AI and without publishing integrations.
- `PLN-CAL-018` Flexible capacity MUST remain visible rather than forcing 100% schedule fill.
- `PLN-CAL-019` Deliberate breaks/blackout periods SHOULD be representable without error semantics.
- `PLN-CAL-020` All date/time rendering MUST use a consistent user/workspace timezone policy while preserving source timestamps for audit.

## 15. AI behavior
May propose slots, timing and conflict resolution using objective/campaign/capacity and validated own evidence. Must not invent external schedule capability. Suggestions do not execute automatically.

## 16. Human approval
Moving planning slots can be direct user action. Native/API schedule changes, publish/cancel and major campaign date shifts require domain-specific confirmation.

## 17. Validation
Date/time valid; item-type transition supported; linked provider capability current; schedule conflicts shown; source entity not archived/deleted.

## 18. UI states
Empty month; partially planned; overloaded/conflicted; provider stale; schedule reconciliation warning; no AI; offline/manual-only; break period.

## 19. Edge cases
DST/timezone; release at midnight market-local; duplicated Publication across platforms; platform scheduling unavailable; release date changed; past slot unfilled; spontaneous post outside plan.

## 20. Cross-module effects
Consumes Objective/Rhythm/Pipeline/Campaign/Production/Distribution. Changes route back to owning domain service. Overview upcoming/bottleneck uses calendar projections.

## 21. Notifications and attention model
Upcoming required deadlines, scheduling failures, unresolved conflicts and release-critical gaps can surface. Routine calendar items should not create notifications by default.

## 22. Search / filtering / sorting / bulk actions
Filter typed items; optional hide/show shoots/milestones/slots; bulk move selected planning slots only when semantics safe.

## 23. Analytics and product telemetry
Calendar usage, drag reversals, planned-vs-actual publication, slot fill rate, reschedule frequency, conflict resolution.

## 24. Learning feedback
Planned-vs-actual operational data may inform sustainable planning; timing-performance hypotheses require Analytics/Experiment evidence.

## 25. Auditability / provenance
Preserve planned/scheduled/actual timestamps, source, timezone, edit actor and provider response where relevant.

## 26. Desktop / mobile behavior
Desktop full Week/Month. Mobile agenda/week compact view with quick actions; Month may be condensed/read-focused.

## 27. Accessibility / usability
Keyboard alternatives to drag, textual type/status, high-contrast focus, accessible date controls.

## 28. Security / privacy / rights
Calendar contains private plans/releases; access follows workspace security. No external calendar sync assumed in v1.3.

## 29. Performance / async jobs
Calendar projection should load without AI. Provider schedule reconciliation and suggestion generation may be async/cached.

## 30. Acceptance criteria
- `PLN-CAL-AC01` Week/Month views render typed planning/execution items distinctly.
- `PLN-CAL-AC02` Moving a slot cannot alter publication history.
- `PLN-CAL-AC03` Planned, scheduled and actual times are distinguishable.
- `PLN-CAL-AC04` Calendar works in manual/no-integration mode.
- `PLN-CAL-AC05` Flexible/empty capacity remains valid.
- `PLN-CAL-AC06` Drag actions have non-drag accessible alternatives.

## 31. Test matrix
Empty; content slots; shoots; scheduled/manual publications; provider failure; release reschedule; timezone; spontaneous post; break period; AI disabled.

## 32. Open questions
Canonical workspace timezone/day-boundary policy and whether external calendar integration enters future scope. Exact representation of flexible dateWindow on Month view needs UX prototyping.

## 33. Traceability
MASTER §151–159, §200, §206, §231, §354, §356, §407.
