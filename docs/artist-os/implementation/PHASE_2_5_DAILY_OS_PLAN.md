# Phase 2.5 — Daily OS / Decision Intelligence

**Status:** Active implementation plan
**Branch:** `feat/daily-os-foundation`
**Architecture baseline:** MASTER v1.4 remains frozen and normative.

## Goal

Turn the existing Artist Foundation + Content Factory into a daily operating system for an artist.

Primary acceptance statement:

> Open Artist OS → understand current state in 30–60 seconds → see the next meaningful action → understand why → act → preserve evidence/decision → make future recommendations better.

## Product constraints

- Complex system, simple surface.
- Domain architecture does not define navigation architecture.
- Today must work with AI disabled.
- Deterministic state beats generic AI advice.
- No fake global career score.
- No second source of truth for recommendations.
- AI proposals remain non-canonical until explicit human commit.
- Passive context capture is preferred over additional forms.

## Visual direction

Use the approved Artist OS dark workstation reference as the design direction:

- canvas `#08090C`;
- surface `#101216`, secondary surface `#181A20`;
- border `#1E2028`;
- violet / indigo primary accents;
- cyan / emerald / amber / crimson semantic accents;
- compact left navigation;
- dense but calm panels;
- restrained mono typography for codes, timestamps and metrics;
- contextual help rather than permanent explanatory walls;
- waveform / audio visualization for Song Brain where real audio/segment data exists;
- drawers for deep context and evidence;
- professional workstation feeling rather than consumer-dashboard decoration.

The reference is a visual language, not a license to expose every planned domain as a sidebar item.

## Implementation order

### PR 10 — Product Coherence Foundation

Scope:
- replace Stage 0 wording with current product language;
- create real onboarding after signup;
- create Artist workspace without DevTools;
- introduce Today-first navigation shell;
- replace developer Overview with Today shell/projection v0;
- fix worker `.env` loading / local dev path;
- add demo-seed command and fixture strategy;
- update README and product principles;
- align design tokens with approved visual reference.

Acceptance:
- `pnpm dev` works from a normal local checkout with `.env` present;
- signup → onboarding → Artist OS works without DevTools;
- Today loads with AI disabled;
- no `Stage 0` wording remains in primary product UI;
- navigation remains shallow.

### PR 11 — OperationalAction Foundation

Implement canonical `OperationalAction` from MASTER v1.4 / ACP-004.

Minimum lifecycle:
`OPEN | IN_PROGRESS | BLOCKED | COMPLETED | CANCELLED`

Each action preserves source domain/entity and can carry due/blocker context.

Acceptance:
- explicit human/external actions are durable and auditable;
- action state never duplicates owning-domain truth;
- completion emits durable event/audit evidence.

### PR 12 — Attention Projection

Implement deterministic `AttentionProjectionService`.

Initial rules over currently implemented domains:
- no active Identity → next action;
- pending Knowledge candidate → review;
- DRAFT/DEFERRED ContentAngle → review;
- APPROVED ContentAngle without ContentUnit → next action;
- ContentUnit without approved execution → high-priority action;
- DRAFT execution revision → review.

Output is a rebuildable projection, not canonical truth.

Recommendation contract:
- recommendation;
- reasons;
- evidence refs;
- uncertainty;
- blocked by;
- what may be learned;
- action href.

### PR 13 — Today v1

Replace temporary Today shell with full Daily OS surface:
- NOW;
- NEXT;
- REVIEW;
- BLOCKED;
- RECENT LEARNING;
- RECENT DECISION.

Target: first meaningful action initiated within 60 seconds.

### PR 14 — Decision Memory

Implement canonical Decision memory:
- what was decided;
- why;
- evidence refs;
- subject refs;
- review date;
- reversal/supersede history.

Decision capture should be lightweight and often offered as a by-product of existing review flows.

### PR 15 — Learning Foundation

Implement Learning lifecycle and scope:
- CANDIDATE;
- VALIDATED;
- STALE;
- REJECTED.

Keep Knowledge and Learning semantically distinct:
- Knowledge = what is known about artist/song/domain;
- Learning = what was learned from actions/results.

Validated Learnings become eligible Artist Brain context.

### PR 16 — Weekly Review

Versioned immutable weekly review snapshot:
- what happened;
- what changed;
- attention;
- decisions;
- learnings;
- uncertainty;
- next focus.

Deterministic facts first, optional AI summary second.

### PR 17 — Passive Capture + UX Simplification

- capture review reasons as evidence;
- surface decision/learning candidates from normal workflows;
- simplify manual Factory form with progressive disclosure;
- keep canonical rich model while reducing required user input;
- instrument product telemetry for attention, decisions and memory reuse.

## Navigation target

Near-term primary navigation should remain small:

- Today
- Create
- Music
- Brain
- Account

Existing deep routes may remain addressable during migration, but new domains must not automatically become primary nav entries.

## Today v0 data sources

Before OperationalAction/AttentionProjection exist, Today v0 may use deterministic direct reads from currently implemented canonical state. This is a temporary read model only and must be replaced by `AttentionProjectionService` in PR 12.

Allowed Today v0 signals:
- identity state;
- song count / Song Brain availability;
- pending knowledge count;
- content angle review count;
- approved angle without unit count;
- content units lacking approved execution.

## MVP metrics

- Time to Meaningful Next Action < 60 seconds.
- Attention completion/open/dismiss/snooze rates.
- Memory Reuse Rate.
- Automatic Context Capture Ratio.

## Stop conditions

Do not expand into another large horizontal domain until:
- Today v1 is working;
- Decision Memory exists;
- Learning Foundation exists;
- at least one workflow demonstrates reusable memory affecting a later recommendation.
