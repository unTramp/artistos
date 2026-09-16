# Content Rhythm Templates

- **Status:** REVIEW COMPLETE
- **MASTER references:** §148–156, §248, §313
- **Domain:** 07_pipeline_planning_calendar
- **Feature slug:** `content-rhythm`
- **Requirement prefix:** `PLN-RHY`

## 2. Purpose
Represent a preferred planning rhythm that protects continuity and strategic balance without hardcoding universal posting frequency or forcing filler content.

## 3. User problem / job-to-be-done
Artists need enough structure to avoid disappearing between releases, but rigid schedules quickly become unrealistic, creatively draining or platform-myth driven. The system needs a planning template, not a compliance quota.

## 4. Scope
Weekly/monthly preferred rhythm; desired balance across Campaign/Evergreen/Experimental and optional Pillar/Narrative targets; capacity-aware planning guidance; comparison of planned vs actual without punitive scoring.

## 5. Entry points
Planning settings, Calendar, Campaign planning, Evergreen Pool, Weekly Review, onboarding after minimum content context exists.

## 6. Preconditions and dependencies
Artist required. Identity/Narrative/Campaign and production capacity improve suggestions but are not mandatory. Posting cadence remains a configurable strategy variable.

## 7. Information architecture
Rhythm summary → period template → target categories → capacity assumptions → exceptions/flex policy → planned/actual review.

## 8. User roles and permissions
Single-artist user configures and approves rhythm. AI may propose template but cannot establish it as a rule without approval.

## 9. Core data model
Uses MASTER `ContentRhythmTemplate` plus optional period/targets. Final schema must support version/history or effective dates if rhythm changes are expected to affect retrospective interpretation.

## 10. Main happy-path workflow
User chooses planning horizon and capacity → system proposes/loads preferred rhythm → user adjusts balance/cadence → template becomes active planning guidance → Calendar uses it when proposing slots → actual activity is compared contextually during review.

## 11. Alternative workflows
No cadence preference; campaign-heavy month; deliberate break; low production capacity; high-frequency experiment; travel/health/availability reduction; platform-specific rhythm differences.

## 12. User actions
Create/edit/activate/retire template, change targets, set exception period, duplicate for new Era/campaign pattern, compare planned vs actual.

## 13. State model
Suggested/Draft → Active → Retired is sufficient product behavior; schema status is not frozen by MASTER and must be validated later.

## 14. Business rules
- `PLN-RHY-001` Content Rhythm MUST be advisory planning guidance, not a hard publishing quota.
- `PLN-RHY-002` The system MUST NOT encode a universal posting frequency as platform law.
- `PLN-RHY-003` Rhythm MAY express weekly/monthly preferred cadence as ranges or targets where useful.
- `PLN-RHY-004` Failing to meet a target MUST NOT be labelled a creative failure by default.
- `PLN-RHY-005` Rhythm planning MUST consider current production capacity when known.
- `PLN-RHY-006` Campaign commitments MAY temporarily override evergreen targets with explicit rationale.
- `PLN-RHY-007` Rhythm SHOULD preserve flexible capacity for spontaneous content.
- `PLN-RHY-008` Template MAY include Pillar/Narrative/Mode balance targets but MUST keep Narrative and Pillar as separate dimensions.
- `PLN-RHY-009` A deliberate low-output/break period MUST be representable without generating warning spam.
- `PLN-RHY-010` AI MUST NOT recommend filler solely to satisfy cadence.
- `PLN-RHY-011` `70/20/10` or any other content mix may be offered only as heuristic/template, not truth.
- `PLN-RHY-012` Platform-specific cadence differences MUST be treated as strategy/experiment settings unless backed by current authoritative constraints.
- `PLN-RHY-013` Template changes MUST NOT rewrite historical actuals.
- `PLN-RHY-014` Actual-vs-target views MUST expose denominator and period.
- `PLN-RHY-015` Rhythm MUST remain useful without AI.

## 15. AI behavior
Strategy Agent may propose rhythm based on goals, Campaigns, active Era, production capacity and own validated evidence. It must label external heuristics and uncertainty. It may suggest reducing output if capacity/quality constraints indicate overload.

## 16. Human approval
Activation and material rhythm changes require user approval. AI cannot auto-increase cadence.

## 17. Validation
Period valid; targets internally coherent; no hidden assumption that all slots must be filled; platform references current where used.

## 18. UI states
No template, suggested template, active, overloaded capacity warning, deliberate break, actual-behind-target context, actual-above-target context, AI unavailable.

## 19. Edge cases
Multiple campaigns overlap; artist posts spontaneous content not in plan; targets sum beyond capacity; Narrative Mix uses different denominator; template changes mid-month.

## 20. Cross-module effects
Calendar suggestions, Evergreen planning, Overview continuity signals and Weekly Review may consume active rhythm. Rhythm never changes ContentUnit state by itself.

## 21. Notifications and attention model
Only meaningful risk such as campaign commitments exceeding known capacity should surface. Missing arbitrary cadence target alone should not create urgent alerts.

## 22. Search / filtering / sorting / bulk actions
History filter by active/retired/effective period. No bulk operation required in MVP.

## 23. Analytics and product telemetry
Template adoption, manual edits to AI proposal, cadence adherence context, flex/spontaneous share, overload warnings accepted/dismissed.

## 24. Learning feedback
Rhythm experiments can feed hypotheses about sustainable output and audience response, but correlation between frequency and outcomes requires controlled interpretation.

## 25. Auditability / provenance
Track template versions/effective dates, user/AI author, rationale and source learnings/heuristics.

## 26. Desktop / mobile behavior
Desktop planning-first. Mobile shows current rhythm and allows quick exception/edit; full balance editor may be desktop-only.

## 27. Accessibility / usability
Use plain language such as “preferred” and “target,” not punitive “missed quota.” Charts require text equivalents.

## 28. Security / privacy / rights
No special rights impact. Availability/capacity data may be private and should not leave system unnecessarily.

## 29. Performance / async jobs
Mostly synchronous CRUD; AI proposal may run via JobService. Calendar reflow after template change can be asynchronous if expensive.

## 30. Acceptance criteria
- `PLN-RHY-AC01` User can define a preferred rhythm without mandatory exact post count.
- `PLN-RHY-AC02` Deliberate break does not create filler suggestions.
- `PLN-RHY-AC03` Capacity conflicts are explainable.
- `PLN-RHY-AC04` Narrative/Pillar targets are not conflated.
- `PLN-RHY-AC05` Historical actuals survive template changes.

## 31. Test matrix
No template; AI suggestion; manual-only; low capacity; break; overlapping campaign; high-frequency experiment; template changed mid-period; AI outage.

## 32. Open questions
MASTER does not define ContentRhythmTemplate field-level schema/status/versioning. Decide in schema pass whether rhythm targets are normalized child rows or JSONB configuration.

## 33. Traceability
MASTER §148–156, §248, §313.
