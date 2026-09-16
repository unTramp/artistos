# ACP-004 — Shared OperationalAction for Human / External Tasks

- **ACP ID:** ACP-004
- **Status:** APPROVED — MASTER v1.4 freeze
- **MASTER requirements affected:** 192–202, 226–230, 233, 348–353, 358, 364
- **Open-question references:** OQ-059, OQ-103, OQ-106, OQ-114, OQ-116

## Problem

Profile audits, Release Readiness, DSPReleasePlan, LaunchActivationPlan and publishing workflows all need trackable actions such as “update bio,” “submit pitch,” “schedule natively,” “replace artwork,” or “verify profile.” Without a shared contract, every domain will create a nearly identical task table with incompatible status semantics.

## Current architecture

- JobService models background machine work.
- Decision models strategic decisions.
- Campaign coordinates child domains.
- Multiple product specs require user/external operational actions, but MASTER does not define their shared representation.

## Approved change

Introduce cross-cutting **`OperationalAction`**.

```text
OperationalAction
id
artistId
sourceDomain
sourceEntityType
sourceEntityId
platform?
title
description?
actionType
status: OPEN|IN_PROGRESS|BLOCKED|DONE|SKIPPED|EXPIRED
priority: LOW|NORMAL|HIGH|URGENT
dueAt?
notBefore?
executionMode: MANUAL_NATIVE|EXTERNAL|API_ASSISTED|SYSTEM_CHECK
externalUrl?
completedAt?
evidenceRef?
createdAt
updatedAt
```

Rules:

1. `OperationalAction` is **not** a generic project-management task system.
2. The source domain owns business truth; OperationalAction owns operational completion state only.
3. Completing an action may invoke a validated application command, but cannot directly mutate arbitrary domain fields.
4. `Job` remains machine/background execution; `OperationalAction` represents a human/external-world action or externally verifiable step.
5. Actions may be projected into Overview Attention and Calendar without transferring ownership.
6. A failed external verification may reopen an action with audit history.
7. Domain-specific payload belongs behind typed `actionType` contracts, not an unbounded magic JSON bag.
8. Future team ownership/assignees are deferred; single-artist MVP assumes self-owned actions.

## Why clarification is insufficient

The same operational concept appears in at least Distribution, DSP and Campaign orchestration. Separate implementations would create state drift and duplicated UI.

## Product impact

- One consistent “what do I need to do?” interaction model.
- Overview can surface due/blocked actions without knowing every domain schema.
- Release Readiness can show actionable gaps instead of static checklist failures.

## Data / migration impact

Existing domain-specific action rows, if any, should migrate to OperationalAction with source references. Domain facts remain in their original tables.

## AI / analytics / learning impact

AI may draft/recommend actions. It cannot mark external work DONE without user confirmation or verifiable provider evidence. Completion telemetry can measure operational bottlenecks but is not artistic success evidence.

## Risks

- Scope creep into Jira-like task management.
- Polymorphic source references can weaken referential integrity; application validation is required.
- Domain-specific statuses could be flattened too aggressively.

## Alternatives considered

1. Separate task table per domain — rejected as duplication.
2. Reuse JobService — rejected because human/external actions are not background jobs.
3. Store actions inside Campaign JSON — rejected because many actions exist outside Campaigns and need queryability/audit.

## Decision

**APPROVED for MASTER v1.4:** add OperationalAction as a cross-cutting operational primitive with strict domain ownership boundaries.
