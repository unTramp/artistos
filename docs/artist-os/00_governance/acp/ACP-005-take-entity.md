# ACP-005 — First-Class Take Entity and Shot/Take Semantics

- **ACP ID:** ACP-005
- **Status:** PROPOSED
- **MASTER requirements affected:** 164–174, 187, 396, 400
- **Open-question references:** OQ-085, OQ-086, OQ-087, OQ-092

## Problem

MASTER v1.3 defines Shot statuses including `GOOD` and `SELECTED`, while On-Set explicitly includes a take counter and controls `GOOD`, `BAD`, `SELECT`. Smart Ingest also groups takes. Without a first-class Take entity, the product cannot represent several attempts for one Shot without overwriting status or losing lineage.

## Current architecture

- `Shot` is the planned execution instruction.
- On-Set records multiple attempts.
- Assets are imported after shooting and can be grouped.
- No canonical `Take` entity exists.

## Proposed change

Introduce **`Take`** as the execution attempt under a Shot.

```text
Take
id
shootSessionId
shotId
takeNumber
startedAt?
endedAt?
status: CAPTURED|GOOD|BAD|SELECTED
captureSource: ON_SET|INGEST_INFERRED|MANUAL
notes?
createdAt
updatedAt

TakeAsset
takeId
assetId
role: PRIMARY_VIDEO|SECONDARY_VIDEO|AUDIO|PHOTO|OTHER
confidence?
confirmedByHuman
```

Revise Shot lifecycle to planning/execution state only:

```text
NOT_STARTED
IN_PROGRESS
SHOT
SKIPPED
```

Rules:

1. `GOOD`/`BAD`/`SELECTED` belong to Take, not Shot, in the next MASTER revision.
2. `Shot = SHOT` means at least one captured/confirmed take exists; it does not imply quality.
3. A Shot can have many Takes; a ShootSession can have many Shots.
4. At most one Take is `SELECTED` per Shot by default; explicit multi-select may be supported later for montage/coverage workflows.
5. START TAKE creates an idempotent local take record; offline capture is supported.
6. GOOD/BAD/SELECT may implicitly close an open Take. Explicit END TAKE is optional UX, not required domain semantics.
7. Smart Ingest may create `INGEST_INFERRED` Take candidates, but confirmation is required before canonical mapping when confidence is insufficient.
8. Selection history is audited; changing selected Take does not delete previous Takes.

## Why clarification is insufficient

The current MASTER has a semantic contradiction between Shot-level status and take-level controls. This affects database design, On-Set UX, Smart Ingest and asset lineage.

## Product impact

The user can shoot multiple attempts naturally, review them later and preserve which media belongs to which attempt.

## Data / migration impact

If existing Shot records use GOOD/SELECTED, migration creates a synthetic Take only when there is reliable asset/event evidence; otherwise preserve legacy state in migration notes rather than fabricating media lineage.

## AI / analytics / learning impact

AI may suggest best takes only in deferred advanced media scope; MVP selection remains human. Take counts and selection changes may support production telemetry but do not imply creative quality globally.

## Risks

- More records and synchronization complexity in offline PWA mode.
- Multi-camera takes require many asset links.
- Automatic inferred take creation can create false certainty if confidence is hidden.

## Alternatives considered

1. Keep all status on Shot — rejected because multiple attempts collapse into one state.
2. Derive Takes only from timestamp groups — rejected because on-set intentional take boundaries are valuable source evidence.
3. Treat each attempt as a Shot — rejected because it duplicates planning instructions and breaks shot-list semantics.

## Decision

**PROPOSED:** add Take + TakeAsset and simplify Shot status to planning/execution semantics.
