# ACP-006 — Multi-Parent Asset Derivation Graph

- **ACP ID:** ACP-006
- **Status:** PROPOSED
- **MASTER requirements affected:** 187–190, 396, 400
- **Open-question references:** OQ-096, OQ-097, OQ-099

## Problem

MASTER v1.3 models a Derived Asset with singular `parentAssetId`, but derivation types include `MIXED` and `REMIX`, which inherently may depend on multiple source assets. A singular parent loses provenance and breaks rights composition.

## Current architecture

- Asset is first-class.
- Derived Asset supports TRIM/CROP/COLOR_GRADE/CAPTIONED/MIXED/EXPORT/REMIX.
- Content Lineage must remain traceable.
- Rights restrictions propagate from source material.

## Proposed change

Replace the singular derivation assumption with a first-class edge model.

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

Rules:

1. A derived Asset may have one or many parents.
2. A single-parent derivative has exactly one source edge; multi-source MIXED/REMIX has multiple edges.
3. Cycles are forbidden.
4. Rights evaluation composes restrictions across every publish-relevant parent.
5. `parentAssetId` may remain temporarily as a compatibility/convenience projection for single-parent assets but is not canonical in the next MASTER revision.
6. Reference-only assets used solely for inspiration must not silently become publish-source parents; role and rights status remain explicit.
7. Lineage query service can traverse the graph in both directions.
8. Deleting/archiving a parent does not destroy lineage history.

## Why clarification is insufficient

The existing field is structurally unable to represent valid derivation types already listed by MASTER. This is a direct architecture mismatch.

## Product impact

- Accurate provenance for edits, composites, remixes and multi-camera/multi-audio outputs.
- Rights Guard can explain exactly which source blocks publication.
- Repurposing can trace every output back to original sources.

## Data / migration impact

Each existing `parentAssetId` becomes one AssetDerivation edge. The compatibility field can be retired after migration and query updates.

## AI / analytics / learning impact

AI can reason over provenance without guessing source contribution. Analytics must not infer causality from lineage alone.

## Risks

- Graph queries can become expensive without indexes.
- Overuse of generalized edges may obscure simple relationships; typed roles and derivationType mitigate this.

## Alternatives considered

1. Store `parentAssetIds[]` JSON — rejected due to referential integrity/query/rights limitations.
2. Forbid multi-source derivatives — incompatible with MIXED/REMIX and real production.
3. Create a separate Remix entity — too narrow; the same issue exists for composites and multi-source exports.

## Decision

**PROPOSED:** add AssetDerivation edge table and deprecate singular parent as canonical truth.
