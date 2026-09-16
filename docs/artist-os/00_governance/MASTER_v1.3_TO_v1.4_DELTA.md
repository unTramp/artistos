# Artist OS — MASTER v1.3 → v1.4 Candidate Delta

**Status:** CANDIDATE DELTA — pending human approval  
**Date:** 16 September 2026  
**Source of truth before approval:** `MASTER_ARCHITECTURE_v1.3.md`

## 1. Purpose

This document defines the **exact architecture delta** proposed for the next MASTER revision. It exists to prevent accidental rewriting of MASTER from memory, scattered open questions or implementation detail.

Only the changes listed here are intended to alter MASTER-level architecture. Engineering details, UX defaults and calibration thresholds remain outside this delta.

## 2. Add first-class PlanningObjective

### Add

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

### Replace conceptual usage

`Monthly Objective` becomes a default UX preset for a period-scoped `PlanningObjective`, not a month-specific domain entity.

### Preserve

- CampaignGoal remains campaign outcome semantics.
- RevenueGoal remains Business-owned.
- metrics may report progress but cannot auto-complete the objective.

## 3. Add first-class Release / ReleaseTrack

### Add

```text
Release
id
artistId
title
type: SINGLE|EP|ALBUM|COMPILATION|OTHER
status: DRAFT|PLANNED|SCHEDULED|RELEASED|DELAYED|CANCELLED|ARCHIVED
releaseDate?
originalReleaseDate?
artworkAssetId?
upc?
labelName?
createdAt
updatedAt

ReleaseTrack
releaseId
songId
sequence
versionLabel?
isFocusTrack
```

### Change ownership

- Release lifecycle becomes Release-owned.
- `Song.releaseStatus` is no longer canonical truth; it may exist temporarily as compatibility projection.
- Song meaning/lyrics/segments remain Song-owned.

## 4. Add explicit CampaignTarget relationship

### Add

```text
CampaignTarget
campaignId
targetType: ARTIST|SONG|RELEASE
targetId?
role: PRIMARY|RELATED
```

### Cardinality

- at most one PRIMARY target per Campaign in MVP;
- zero or more RELATED targets;
- Campaign orchestrates target work but does not own Song/Release lifecycle.

## 5. Remove VIDEO from ReleaseExtension

### Change

`ReleaseExtension` remains for musical release variants:

```text
REMIX
ACOUSTIC
LIVE
STRIPPED
ALT_VERSION
COLLAB
```

`VIDEO` is removed from ReleaseExtension.

Video work is represented through ContentUnit, DSPVideo, Asset and Publication according to existing ownership rules.

## 6. Change Narrative attribution cardinality

### Add

```text
ContentNarrativeLink
contentEntityType: ANGLE|CONTENT_UNIT
contentEntityId
narrativeTrackId
role: PRIMARY|SECONDARY
createdAt
```

### Rules

- maximum one PRIMARY narrative track per Angle/ContentUnit;
- zero or more SECONDARY links;
- Angle → ContentUnit conversion snapshots attribution;
- default Narrative Mix counts distinct published ContentUnits by PRIMARY track only;
- multi-platform Publications do not multiply mix;
- secondary overlap is reported separately.

### Migration

Existing singular `narrativeTrackId` maps to PRIMARY. No secondary links are fabricated.

## 7. Add OperationalAction

### Add

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

### Boundary rules

- not a generic project-management task system;
- source domain owns business truth;
- OperationalAction owns only operational completion state;
- Job remains machine/background work;
- Decision remains strategic commitment;
- actions may project into Overview/Calendar without ownership transfer.

## 8. Add Take and TakeAsset

### Add

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

### Change Shot status

Replace quality-selection semantics on Shot with planning/execution-only lifecycle:

```text
NOT_STARTED
IN_PROGRESS
SHOT
SKIPPED
```

### Rules

- GOOD/BAD/SELECTED belong to Take;
- one Shot may have many Takes;
- by default at most one selected Take per Shot;
- inferred mappings expose confidence and uncertain mappings require confirmation;
- selection changes are audited.

## 9. Add multi-parent AssetDerivation

### Add

```text
AssetDerivation
id
childAssetId
parentAssetId
role: PRIMARY_SOURCE|SECONDARY_SOURCE|AUDIO_SOURCE|VISUAL_SOURCE|REFERENCE_SOURCE
derivationType: TRIM|CROP|COLOR_GRADE|CAPTIONED|MIXED|EXPORT|REMIX
sequence?
metadata?
createdAt
```

### Change

Singular `parentAssetId` is no longer canonical for derivation provenance. It may remain temporarily as a compatibility projection for single-parent assets.

### Rules

- one or many parents allowed;
- cycles forbidden;
- rights evaluation composes publish-relevant parent restrictions;
- reference-only/inspiration assets are not silently treated as publish-source parents;
- lineage remains queryable in both directions.

## 10. Promote AR-001…AR-062 to companion architecture contracts

The next MASTER should reference the companion architecture-contract layer rather than copying every implementation detail into the core architecture text.

The following semantics become normative companions:

- Era activation cardinality and Identity precedence;
- SongIdentityContext inheritance/overrides;
- sensory visibility distinct from status;
- Narrative Mix counting semantics;
- lyrics document/asset model;
- no Performance root in MVP;
- Readiness projection + milestone snapshots;
- workspace timezone and UTC observation policy;
- ExecutionPackage subordinate to ContentUnit;
- no ProductionPlan/EvergreenItem duplicate roots;
- ContentSlot planning-only ownership;
- SeasonalOpportunity source ownership;
- Voice Note and transcript truth semantics;
- centralized Rights Decision Policy;
- StarterContentPack projection semantics;
- Publication adaptation snapshot ownership;
- effective-time LinkHub routing semantics;
- versioned WebExperience/WebSection ownership;
- DSPVideo not duplicating Publication;
- raw royalty evidence before aggregate snapshots;
- Geo testing through shared Experiment;
- Publicity/CRM boundary for creator/contact data;
- original-money preservation + FX provenance;
- attribution evidence without universal Attribution root;
- Artist Brain as projection;
- reproducible ResearchClaim promotion evidence;
- context provenance retention without chain-of-thought persistence;
- truthMode for narrative fragments;
- Song Brain ownership for song interpretation statements;
- optional segment equivalence;
- incidental AudioUsage does not redefine primary Song;
- Strategy change through AuditEvent/Decision;
- opaque canonical ContentUnit IDs;
- RecurringSeries lightweight lifecycle;
- locations/crew embedded in capabilities for MVP;
- ShootSession production estimate snapshots;
- repurposing derivative children subordinate until promoted;
- LinkDestination child lifecycle;
- Audience Capture aggregate/provider-owned PII boundary;
- raw web event vs MetricSnapshot separation;
- DSPOpportunity source and eligibility uncertainty;
- source-of-streams observation model;
- ArtistPlaylist external-reference semantics;
- SearchOpportunity Growth ownership;
- LiveSession lightweight participant references;
- RevenueEvent vocabulary and append-only corrections;
- effective-dated Offer/Membership terms;
- evidence-bounded audience analytics;
- Decision scope vocabulary;
- immutable WeeklyReview artifacts;
- Anti-AI rules distinct from IdentityConstraints;
- CandidateKnowledge promotion lifecycle.

## 11. Explicit non-changes

Do not add the following merely because they appeared in detailed product questions:

```text
LyricVersion root
Performance root
ExecutionPackage root
ProductionPlan root
EvergreenItem root
StarterContentPack permanent root
WebStory independent root
RevenueScenario primary root
Universal Attribution root
GeoExperiment root
Creator/Contact CRM
full task-management subsystem
Advertising execution domain
Publicity outreach domain
accounting ledger
inventory/order management
```

## 12. Migration semantics

The candidate architecture requires migration guidance, but not fabricated history.

Rules:

1. existing singular narrative links → PRIMARY only;
2. existing asset parent pointers → one AssetDerivation edge;
3. legacy Song release fields → Release records only where reliable context exists;
4. ambiguous release history stays UNKNOWN/annotated rather than invented;
5. legacy GOOD/SELECTED Shot states create synthetic Takes only with reliable asset/event evidence;
6. no AI-generated migration assumption becomes canonical without evidence or human confirmation.

## 13. Engineering impact

After human approval and MASTER v1.4 freeze:

- ACP-dependent `PROVISIONAL` markers in Engineering Spec can be converted to normative references;
- Logical Data Model should use PlanningObjective, Release, ReleaseTrack, CampaignTarget, OperationalAction, Take, TakeAsset and AssetDerivation as approved architecture;
- API/commands/events and migration docs should reference v1.4 rather than Freeze Candidate;
- no unrelated engineering decision should be elevated into MASTER during this operation.

## 14. Human approval gate

Before creating the normative `MASTER_ARCHITECTURE_v1.4.md`, explicitly approve or reject the coordinated delta:

```text
ACP-001 PlanningObjective
ACP-002 Release / ReleaseTrack / CampaignTarget
ACP-003 Narrative primary + secondary attribution
ACP-004 OperationalAction
ACP-005 Take
ACP-006 AssetDerivation graph
AR-001…AR-062 companion contracts
```

Approval should be treated as one architecture freeze decision unless a specific item is returned for revision.

## 15. Candidate decision

**RECOMMENDED:** adopt this complete delta as MASTER v1.4 Candidate.

Until explicit human approval, MASTER v1.3 remains the normative Source of Truth.