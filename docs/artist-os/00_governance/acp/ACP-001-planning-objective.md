# ACP-001 — PlanningObjective as a First-Class Planning Entity

- **ACP ID:** ACP-001
- **Status:** APPROVED — MASTER v1.4 freeze
- **MASTER requirements affected:** 151–156, 358, 403, 417, 429
- **Open-question references:** OQ-001, OQ-078

## Problem

MASTER v1.3 repeatedly uses **Monthly Objective** as an input to planning and the Overview experience, but it does not define a canonical entity, lifecycle, scope or relationship to Campaign Goals. If implementation starts without a decision, the same concept will likely be duplicated in Overview, Calendar and Campaign code.

## Current architecture

- Campaign has goals such as FOLLOWERS, REACH, STREAMS and REVENUE.
- Calendar is built from `Monthly Objective`, current Campaign, Narrative Mix, Evergreen requirements, Production Capacity, Existing Assets and Experiments.
- Overview exposes Current Focus and upcoming decisions.
- No `MonthlyObjective` entity exists in the canonical model.

## Approved change

Introduce a first-class **`PlanningObjective`** entity. “Monthly Objective” becomes a UX preset/view over a generic period-scoped planning objective rather than a month-only data model.

```text
PlanningObjective
id
artistId
title
statement
periodStart
periodEnd
scope: ARTIST|CAMPAIGN|RELEASE|EVERGREEN|CUSTOM
campaignId?
releaseId?
priority: PRIMARY|SECONDARY
status: DRAFT|ACTIVE|COMPLETED|CANCELLED|ARCHIVED
successCriteria[]
createdAt
updatedAt
completedAt?
```

Rules:

1. `PlanningObjective` expresses **operational focus for a period**, not a metric definition and not an analytics result.
2. `CampaignGoal` remains the campaign outcome dimension; `PlanningObjective` may reference a Campaign but is not replaced by CampaignGoal.
3. `RevenueGoal` remains a Business entity and may be referenced as evidence/constraint, not duplicated.
4. The default Calendar UI may create a calendar-month objective, but arbitrary date ranges are allowed.
5. MVP should allow one `PRIMARY` artist-level objective for an overlapping period, plus optional secondary objectives.
6. Objective completion is human-controlled; metrics may suggest progress but do not auto-complete it.
7. Historical objectives are immutable enough for decision provenance: edits after the period should create audit history.

## Why clarification is insufficient

The concept is referenced by multiple domains and affects ownership, identity, history and foreign-key relationships. Treating it as a transient UI field would cause duplication and ambiguous source of truth.

## Product impact

- Overview Current Focus can reference a canonical planning objective.
- Calendar generation has an explicit planning anchor.
- Weekly Review can compare intended objective vs actual execution without inventing intent retrospectively.
- Strategy Agent receives a stable period objective through Context Assembler.

## Data / migration impact

No production migration is required if adopted before Stage 1 schema implementation. If a temporary `monthlyObjective` JSON field already exists in repository code, Stage 0 audit should map it into `PlanningObjective` records.

## AI / analytics / learning impact

AI may suggest objective wording and success criteria, but activation/completion remains human-controlled. Analytics may report progress against objective criteria but must not infer the original objective after the fact.

## Risks

- Over-modeling personal planning if the entity becomes a generic task system.
- Confusion between CampaignGoal and PlanningObjective.
- Artificial pressure to define numeric targets where qualitative focus is appropriate.

## Alternatives considered

1. **Campaign field only** — rejected because evergreen/artist-level planning may exist without a Campaign.
2. **Calendar-only JSON** — rejected because Overview, Strategy and Reviews need the same intent history.
3. **Month-specific `MonthlyObjective` entity** — rejected because it unnecessarily encodes calendar granularity in the domain.

## Decision

**APPROVED for MASTER v1.4:** add `PlanningObjective`; keep `Monthly Objective` as a default UX period preset.
