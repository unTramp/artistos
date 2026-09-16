# ACP-002 — First-Class Release Model and Campaign Target Relationship

- **ACP ID:** ACP-002
- **Status:** PROPOSED
- **MASTER requirements affected:** 49–52, 112, 226–243, 401, 417, 430–431
- **Open-question references:** OQ-052, OQ-055, OQ-058

## Problem

MASTER v1.3 uses `Release` throughout DSP, launch, extensions, readiness and campaign workflows, but the Core Artist/Song/Campaign model does not define a first-class Release entity. `Song` also contains `releaseStatus` and `releaseDate`, which becomes ambiguous when a song appears on multiple releases or has alternate versions.

## Current architecture

- `Song` is first-class.
- Campaign can link Song/Release, but cardinality and ownership are unspecified.
- `ReleaseExtension` references `parentReleaseId` and `releaseId`.
- DSPReleasePlan, EditorialPitch, Release Readiness and Release Momentum all require a Release identity.
- `VIDEO` currently appears in `ReleaseExtension`, while DSPVideo and Content/Publication already model video surfaces.

## Proposed change

Introduce first-class **`Release`** and **`ReleaseTrack`** entities and make release lifecycle canonical there.

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

Campaign linkage:

```text
CampaignTarget
campaignId
targetType: ARTIST|SONG|RELEASE
targetId?
role: PRIMARY|RELATED
```

Rules:

1. A Campaign has at most one `PRIMARY` target in MVP, but may have multiple `RELATED` targets.
2. Release lifecycle is owned by `Release`, not `Song.releaseStatus`.
3. `Song.releaseStatus` becomes a derived compatibility projection and should not be the canonical persisted truth in the next architecture revision.
4. A Song may appear in multiple Releases without duplication of Song Brain.
5. Release-specific metadata belongs to Release/ReleaseTrack; song meaning/lyrics/segments remain Song-owned.
6. `ReleaseExtension` remains for musical release variants (`REMIX`, `ACOUSTIC`, `LIVE`, `STRIPPED`, `ALT_VERSION`, `COLLAB`).
7. **`VIDEO` should be removed from `ReleaseExtension`** in the next MASTER revision. Music/live/studio video is modeled by ContentUnit/DSPVideo/Publication, not as an audio Release.

## Why clarification is insufficient

Release is already a cross-domain foreign-key concept. Without a canonical entity, DSP, Campaign, Business and Distribution would each invent partial release records.

## Product impact

- Release Home/Readiness becomes stable.
- Editorial Pitch and DSP opportunity deadlines can reference one canonical Release.
- Multi-track release campaigns are possible without duplicating Songs.
- Catalog history becomes coherent across single → EP/album inclusion → alternate release.

## Data / migration impact

If legacy Song fields exist, migration creates a Release for each distinct historic release context where reliable evidence exists; ambiguous history must remain explicit rather than fabricated.

## AI / analytics / learning impact

Release-level analytics can aggregate track/song evidence while retaining song-level attribution. AI can reason about Campaign/Release context without treating every Song as a release.

## Risks

- ReleaseTrack metadata can become too DSP-specific.
- CampaignTarget polymorphism may be overused if unrelated orchestration relationships are added later.
- Migrating old Song release fields may be lossy when historic release metadata is incomplete.

## Alternatives considered

1. Keep release as Song fields — rejected due to multi-track/multi-release ambiguity.
2. Store Release only inside DSP — rejected because Campaign, Content and Business also need it.
3. Campaign owns Release — rejected because Release has lifecycle independent of any campaign.

## Decision

**PROPOSED:** add Release/ReleaseTrack and explicit CampaignTarget relationship; deprecate Song release lifecycle as source of truth and remove VIDEO from ReleaseExtension.
