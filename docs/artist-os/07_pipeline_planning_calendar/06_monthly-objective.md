# Monthly Objective Planning

- **Status:** REVIEW COMPLETE — PRODUCT BEHAVIOR DEFINED, ENTITY BOUNDARY OPEN
- **MASTER references:** §156, §319, §357–358; entity is referenced behaviorally but not formally defined
- **Domain:** 07_pipeline_planning_calendar
- **Feature slug:** `monthly-objective`
- **Requirement prefix:** `PLN-OBJ`

## 2. Purpose
Give each planning period a small number of explicit priorities so Calendar and Strategy can make coherent trade-offs instead of optimizing every available metric at once.

## 3. User problem / job-to-be-done
Without a period objective, every release, evergreen idea, growth tactic and experiment competes equally. The artist needs a clear statement of what this month is for, what matters most and what constraints must be respected.

## 4. Scope
Monthly/period planning objective, primary outcome, supporting priorities, linked Campaigns/Releases, constraints, production capacity assumptions, target evidence/learning and review. This spec defines product behavior while intentionally leaving the formal entity schema open because MASTER v1.3 does not define `MonthlyObjective`.

## 5. Entry points
Calendar planning, Overview Current Focus, onboarding after baseline setup, Campaign workspace, Weekly Review/period rollover.

## 6. Preconditions and dependencies
Artist required. Campaign, Release, Rhythm, Narrative Mix and production capacity optional. Objective must not invent targets from missing data.

## 7. Information architecture
Period header → objective statement → primary outcome → active campaigns/releases → constraints/capacity → supporting priorities → learning agenda → planning consequences → review.

## 8. User roles and permissions
Single artist creates/approves objective. AI can draft but cannot silently establish strategic direction.

## 9. Core data model
No canonical MASTER entity exists. Product requires at minimum: period, statement, primaryGoal/outcome, supporting priorities, linked Campaign/Release IDs, constraints, capacity assumptions, optional target indicators, learning questions, status/effective dates and provenance. This MUST be resolved through Architecture Change Proposal/schema audit before implementation.

## 10. Main happy-path workflow
User starts new period → system summarizes current Campaigns/readiness/recent learnings/capacity → proposes or user writes objective → user approves → Rhythm/Slots/Calendar suggestions are generated from objective → Weekly Reviews reference it → period closes with outcome/learning review.

## 11. Alternative workflows
No campaign month; release month; recovery/low-capacity month; identity-building period; experiment-heavy month; objective changed mid-period; user chooses no formal numeric targets.

## 12. User actions
Create, edit, approve, revise with reason, link Campaign/Release, add/remove supporting priority, set capacity/constraints, close/review, duplicate structure for next period.

## 13. State model
Draft → Active → Closed; Revised may be represented through version history rather than a status. Formal status is open.

## 14. Business rules
- `PLN-OBJ-001` Planning MUST start from an explicit period objective or explicit choice to operate without one; system MUST NOT silently infer strategic priority.
- `PLN-OBJ-002` Objective SHOULD identify one primary outcome/focus to support trade-offs.
- `PLN-OBJ-003` Supporting priorities MAY coexist but MUST NOT obscure the primary focus.
- `PLN-OBJ-004` Numeric targets are optional and MUST be labelled as targets/assumptions, not predictions.
- `PLN-OBJ-005` Objective MAY be qualitative (e.g., establish Identity, build release readiness, sustain evergreen presence).
- `PLN-OBJ-006` Active Campaign/Release deadlines MUST be surfaced as constraints/context, not automatically made the objective.
- `PLN-OBJ-007` Known production capacity SHOULD influence feasibility warnings.
- `PLN-OBJ-008` Objective planning SHOULD include at least one learning question when meaningful.
- `PLN-OBJ-009` Calendar/Rhythm suggestions MUST be traceable back to objective and constraints.
- `PLN-OBJ-010` Changing an objective mid-period MUST preserve previous version and rationale.
- `PLN-OBJ-011` Objective change MUST NOT rewrite historical publication/performance data.
- `PLN-OBJ-012` AI MUST NOT choose business/creative goals autonomously based solely on engagement metrics.
- `PLN-OBJ-013` Identity optimization is not an implicit monthly goal unless explicitly chosen and approved.
- `PLN-OBJ-014` When available evidence cannot support a target recommendation, AI MUST say so.
- `PLN-OBJ-015` A low-output or rest/recovery month is valid if explicitly selected.
- `PLN-OBJ-016` Objective MUST remain useful without AI.
- `PLN-OBJ-017` Period closure SHOULD compare intended focus, executed work, outcomes and learnings without reducing success to one universal score.
- `PLN-OBJ-018` Formal persistence MUST NOT be implemented until entity boundary is approved through architecture/schema process.

## 15. AI behavior
Strategy Agent may synthesize current Campaigns, readiness, production capacity, validated learnings and recent metrics to draft options. It must separate facts, observations and recommendations; show trade-offs; avoid forecast certainty.

## 16. Human approval
Activation and revisions require explicit user approval. AI cannot auto-change the active objective.

## 17. Validation
Period not ambiguous; primary focus present for active objective; linked references valid; contradictory capacity/commitments trigger warning rather than silent mutation.

## 18. UI states
First objective, draft, active, mid-period revision, overloaded plan warning, no data/cold start, closed review, AI unavailable.

## 19. Edge cases
Two critical releases same month; release date slips; artist intentionally prioritizes non-performing creative work; numeric target impossible to validate; objective created after month already started.

## 20. Cross-module effects
Overview Current Focus, Rhythm, Slots, Calendar, Campaign prioritization, Weekly Review and Strategy consume active objective. Does not directly mutate Campaign goals or ContentUnit states.

## 21. Notifications and attention model
Attention for objective-plan contradictions (e.g., committed workload exceeds capacity) or critical linked deadline risk. No spam for qualitative target variance.

## 22. Search / filtering / sorting / bulk actions
History by period/status. No bulk objective operations.

## 23. Analytics and product telemetry
Time-to-plan, revisions, suggestion acceptance, planning completeness, objective→executed work traceability, user override reasons.

## 24. Learning feedback
Period review can generate observations/insights/hypotheses but not automatic validated learnings.

## 25. Auditability / provenance
Store versions, rationale, sources used by AI, linked entities and who approved.

## 26. Desktop / mobile behavior
Desktop is primary planning/review. Mobile shows current objective and supports quick note/revision draft, not dense planning.

## 27. Accessibility / usability
Use plain-language priority statements. Do not force SMART/OKR jargon or numeric targets.

## 28. Security / privacy / rights
Objectives may contain private business/creative strategy; keep internal unless explicitly exported.

## 29. Performance / async jobs
Summary/AI option generation async; active objective load immediate.

## 30. Acceptance criteria
- `PLN-OBJ-AC01` User can activate one clear period focus without numeric target.
- `PLN-OBJ-AC02` AI suggestions show evidence/trade-offs and require approval.
- `PLN-OBJ-AC03` Mid-period revision preserves old version/rationale.
- `PLN-OBJ-AC04` Calendar suggestions can explain relation to objective.
- `PLN-OBJ-AC05` Implementation is blocked from inventing a persistence model until schema boundary is approved.

## 31. Test matrix
Cold start; release month; no campaign; low capacity; conflicting campaigns; qualitative objective; numeric target; mid-period revision; AI outage.

## 32. Open questions
Critical architecture question: MASTER v1.3 references “Monthly Objective” as planning input but defines no first-class entity. Decide whether to introduce `PlanningObjective`/`PeriodObjective`, its scope (monthly only vs arbitrary period), schema/versioning and relationship to CampaignGoal.

## 33. Traceability
MASTER §156, §319, §357–358. Requires future Architecture Change Proposal if persisted as new domain entity.
