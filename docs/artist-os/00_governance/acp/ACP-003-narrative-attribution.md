# ACP-003 — Primary + Secondary Narrative Attribution

- **ACP ID:** ACP-003
- **Status:** APPROVED — MASTER v1.4 freeze
- **MASTER requirements affected:** 94, 99–101, 130–132, 296
- **Open-question references:** OQ-031, OQ-038, OQ-040

## Problem

MASTER v1.3 gives `ContentAngle` a singular `narrativeTrackId?`, while real content may legitimately advance more than one narrative track. Allowing unconstrained many-to-many attribution, however, would make Narrative Mix and analytics easy to game or double-count.

## Current architecture

- NarrativeTrack is first-class.
- Content Angle can reference one narrative track.
- NarrativeMixPlan compares target vs actual mix.
- Narrative Analytics measures performance by narrative track.

## Approved change

Adopt **one primary narrative track + optional secondary narrative associations**.

```text
ContentNarrativeLink
contentEntityType: ANGLE|CONTENT_UNIT
contentEntityId
narrativeTrackId
role: PRIMARY|SECONDARY
createdAt
```

Rules:

1. At most one PRIMARY NarrativeTrack per Content Angle/Content Unit.
2. Zero or more SECONDARY links are allowed when they materially represent the content.
3. On Angle → ContentUnit conversion, narrative associations are copied as a historical snapshot; later edits do not silently rewrite the original Angle.
4. Default Narrative Mix denominator = **published Content Units**, counted by PRIMARY track only.
5. Multiple platform Publications of one ContentUnit do not multiply narrative mix.
6. Secondary-track participation is displayed separately as overlap/coverage, not fractionally added to the primary mix.
7. Performance analytics may offer both PRIMARY-only and “participated in” views, clearly labeled.
8. AI may suggest secondary links but must not add them solely to improve apparent coverage.

## Why clarification is insufficient

This changes cardinality beyond the singular field currently implied by MASTER and affects analytics semantics across Narrative, Content and Publication.

## Product impact

Narrative remains measurable without forcing complex content into one artificial story bucket or inflating mix through multi-tagging.

## Data / migration impact

Existing `narrativeTrackId` maps to a PRIMARY link. No secondary links are invented during migration.

## AI / analytics / learning impact

Primary-only analytics remain clean; secondary overlap supports richer qualitative analysis. Learning must preserve the distinction.

## Risks

- Excessive secondary tagging reduces interpretability.
- Users may expect fractional weighting; this proposal intentionally avoids it in default analytics.

## Alternatives considered

1. Singular only — simple but loses legitimate overlap.
2. Unrestricted many-to-many with full counting — rejected due to double-counting.
3. Fractional weighting — mathematically tidy but difficult to explain and encourages fake precision.

## Decision

**APPROVED for MASTER v1.4:** one PRIMARY + optional SECONDARY narrative links; primary-only default mix and publication-independent counting.
