# Content Slots

- **Status:** REVIEW COMPLETE
- **MASTER references:** §151–159, §206, §231
- **Domain:** 07_pipeline_planning_calendar
- **Feature slug:** `content-slots`
- **Requirement prefix:** `PLN-SLT`

## 2. Purpose
Represent planning capacity/windows before exact content or publication time is known, allowing the calendar to preserve strategic intent and flexibility.

## 3. User problem / job-to-be-done
Artists often know “I want a campaign post Thursday-ish” or “keep one flexible Reel slot this weekend” before the exact ContentUnit exists. Forcing every plan into an exact scheduled publication creates fake precision.

## 4. Scope
MASTER `ContentSlot`, date windows, platform, mode, optional preferred Pillar/Narrative and priority, assignment/unassignment of ContentUnit, flexible vs committed planning.

## 5. Entry points
Calendar, Monthly Objective, Campaign planning, Rhythm template, Evergreen planning.

## 6. Preconditions and dependencies
Artist and planning period. Platform may be target/general depending UX; exact Publication is not required.

## 7. Information architecture
Calendar slot card → slot details → intent/preferences → candidate ContentUnits/opportunities → assign/replace/leave flexible.

## 8. User roles and permissions
Single artist manages slots. AI may propose slots/assignments but cannot schedule/publish without approval.

## 9. Core data model
MASTER `ContentSlot {dateWindow, platform, mode: PLANNED|FLEX|CAMPAIGN|EXPERIMENT, preferredPillar?, preferredNarrativeTrack?, priority}`. Product needs identity/artist ownership, optional assigned ContentUnit and provenance; schema audit must define these without silently altering MASTER.

## 10. Main happy-path workflow
Planning creates slot → user sees intent/window → system suggests matching approved/evergreen work → user assigns a ContentUnit or keeps slot open → later converts to exact schedule/Publications if desired.

## 11. Alternative workflows
Slot intentionally left empty; exact content planned before slot; multi-platform master concept; experiment slot; campaign deadline slot; spontaneous item consumes FLEX slot; slot deleted/replanned.

## 12. User actions
Create/edit/move/resize date window, assign/unassign content, convert mode, duplicate, delete, lock as explicit commitment where supported.

## 13. State model
Open → Filled/Assigned → Converted/Completed or Cancelled can be derived; MASTER defines mode, not slot lifecycle status.

## 14. Business rules
- `PLN-SLT-001` ContentSlot MUST represent planning intent, not proof of scheduled publication.
- `PLN-SLT-002` A slot MAY remain empty by design.
- `PLN-SLT-003` `FLEX` slots MUST preserve freedom for spontaneous content and SHOULD NOT trigger “missing content” warnings by default.
- `PLN-SLT-004` `CAMPAIGN` slots SHOULD retain Campaign context/urgency where known.
- `PLN-SLT-005` `EXPERIMENT` slots SHOULD retain Experiment context and controlled-variable intent.
- `PLN-SLT-006` Slot dateWindow MUST support ranges/broad windows, not only exact timestamps.
- `PLN-SLT-007` Assigning a ContentUnit MUST NOT automatically change it to `SCHEDULED` unless a real publication schedule is created.
- `PLN-SLT-008` Preferred Pillar and Narrative Track are hints/constraints, not required if slot purpose does not need them.
- `PLN-SLT-009` Candidate assignment SHOULD consider readiness, platform compatibility, Campaign, Narrative/Pillar balance, effort and fatigue.
- `PLN-SLT-010` Candidate assignment MUST NOT use opaque viral scoring.
- `PLN-SLT-011` A spontaneous unit MAY satisfy/replace a FLEX slot with explicit user confirmation or automatic retrospective association if user approves.
- `PLN-SLT-012` Moving/deleting a slot MUST NOT mutate historical publication data.
- `PLN-SLT-013` Platform capability uncertainty MUST be shown when slot depends on a stale/unverified platform rule.
- `PLN-SLT-014` Slots MUST remain usable without AI.

## 15. AI behavior
May propose slots from Monthly Objective/Rhythm/Campaign deadlines and suggest matching units. Must distinguish exact constraints from heuristic timing advice and explain selection.

## 16. Human approval
User approves proposed slot creation/assignment. No publish action occurs from slot alone.

## 17. Validation
Valid dateWindow; platform recognized; referenced Pillar/Narrative valid; assigned unit not archived/rejected; experiment/campaign references consistent where mode requires them.

## 18. UI states
Open, filled, exact-schedule-linked, flex, conflict/overcapacity, stale capability, no candidate, cancelled.

## 19. Edge cases
Window spans release boundary; same ContentUnit targeted by multiple platform slots; slot exists after campaign cancellation; timezone changes; exact schedule later moved.

## 20. Cross-module effects
Monthly planning creates slots; Calendar renders; Pipeline assignment context; Distribution creates actual Publication scheduling; Overview may surface unfilled required campaign slot near deadline.

## 21. Notifications and attention model
Only committed/required campaign or experiment slots approaching window without viable content should surface as attention. FLEX emptiness is not urgent.

## 22. Search / filtering / sorting / bulk actions
Filter mode/platform/Campaign/filled state. Bulk move windows may be allowed with confirmation; bulk assignment conservative.

## 23. Analytics and product telemetry
Slots created/filled/cancelled, time-to-fill, suggestion acceptance, slot→publication conversion, flex utilization.

## 24. Learning feedback
Slot outcomes inform planning accuracy/capacity observations, not content-performance causality.

## 25. Auditability / provenance
Who/what created slot, edits, assignment history, relation to objective/rhythm/campaign.

## 26. Desktop / mobile behavior
Desktop drag/calendar planning; mobile quick assign/move within simplified date controls.

## 27. Accessibility / usability
Do not rely solely on color for modes. Drag operations need keyboard/menu alternatives.

## 28. Security / privacy / rights
No direct rights logic; candidate asset/content may be rights-blocked and must show that state.

## 29. Performance / async jobs
Candidate matching may be async/cached; CRUD immediate.

## 30. Acceptance criteria
- `PLN-SLT-AC01` Slot can exist without exact ContentUnit.
- `PLN-SLT-AC02` FLEX slot can remain empty without warning.
- `PLN-SLT-AC03` Assignment does not falsely set SCHEDULED.
- `PLN-SLT-AC04` Date windows support non-exact planning.
- `PLN-SLT-AC05` Required campaign-slot risk can surface to Overview.

## 31. Test matrix
Open flex; campaign slot; experiment slot; assignment; unassign; exact schedule conversion; campaign cancelled; timezone shift; AI outage.

## 32. Open questions
MASTER omits ContentSlot identity/status/assignment fields. Schema pass must define ownership and relationship to ContentUnit/Publications.

## 33. Traceability
MASTER §151–159, §206, §231.
