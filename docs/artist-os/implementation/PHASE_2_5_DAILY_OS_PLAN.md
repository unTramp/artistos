# Phase 2.5 — Daily OS / Decision Intelligence

**Status:** Active implementation plan
**Architecture baseline:** MASTER v1.4 remains frozen and normative.

## Goal

Turn the existing Artist Foundation + Content Factory into a daily operating system for an artist.

Primary acceptance statement:

> Open Artist OS → understand current state in 30–60 seconds → see the next meaningful action → understand why → act → preserve evidence/decision → make future recommendations better.

Artist OS connects two loops:

### User operating loop

`Context → Focus → Action → Result → Better Next Action`

### Intelligence loop

`Hypothesis → Experiment → Evidence → Learning → Decision → Reuse`

The user should feel the first loop every day; the second loop is what creates long-term compounding intelligence.

## Product constraints

- Complex system, simple surface.
- Domain architecture does not define navigation architecture.
- Attention must remain simple even if navigation grows deeper.
- Today must work with AI disabled.
- Deterministic state beats generic AI advice.
- No fake global career score.
- No second source of truth for recommendations.
- AI proposals remain non-canonical until explicit human commit.
- Passive context capture is preferred over additional forms.
- PlanningObjective is first-class prioritization context, not a replacement for CampaignGoal or RevenueGoal.
- Content Factory answers “What can we create?”; Today answers “What should we do now?”.

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

## UX model: Attention vs Navigation

### Attention Layer
Answers: **What needs my attention now?**

Primary surfaces:
- Today;
- Current Focus;
- Next Actions;
- blockers;
- review queues;
- recent validated Learning;
- decision reviews.

### Navigation Layer
Answers: **Where is the specialist workspace?**

Navigation may become deeper as domains arrive, but the user must never need to patrol the sidebar to reconstruct current priorities.

## Recommendation explainability contract

Every projected recommendation should be able to provide, through progressive disclosure:

- `WHY THIS` — concrete reason it matters now;
- `BASED ON` — PlanningObjective, domain state, evidence and memory refs;
- `UNCERTAINTY` — known vs inferred;
- `EXPECTED EFFECT` — what completing the action unlocks or changes;
- `WHAT WE MAY LEARN` — only when meaningful.

Deterministic blockers require deterministic explanation, not an AI-generated rationale.

## Implementation order

### PR 10 — Product Coherence Foundation ✅

Implemented:
- current product language instead of Stage 0 front-door wording;
- real signup → onboarding → Artist workspace;
- Today-first navigation shell;
- deterministic Today v0;
- dark workstation design direction;
- worker `.env` loading / local dev cleanup;
- demo seed;
- README / product principles / visual direction;
- E2E through real onboarding.

### PR 11 — OperationalAction Foundation

Implement canonical `OperationalAction` from MASTER v1.4 / ACP-004.

Minimum lifecycle:
`OPEN | IN_PROGRESS | BLOCKED | COMPLETED | CANCELLED`

Each action preserves source domain/entity and can carry due/blocker context.

Rules:
- not a generic task manager;
- actions may represent human/external work that cannot live only as owning-domain state;
- completion must not overwrite owning-domain truth;
- source context and provenance are required.

Acceptance:
- explicit human/external actions are durable and auditable;
- action state never duplicates owning-domain truth;
- completion emits durable event/audit evidence;
- Today can later project these actions without owning them.

### PR 12 — Attention Projection + PlanningObjective Prioritization

Implement deterministic `AttentionProjectionService`.

Initial rules over currently implemented domains:
- no active Identity → next action;
- pending Knowledge candidate → review;
- DRAFT/DEFERRED ContentAngle → review;
- APPROVED ContentAngle without ContentUnit → next action;
- ContentUnit without approved execution → high-priority action;
- DRAFT execution revision → review;
- due/blocked OperationalAction → attention item.

PlanningObjective integration:
- active PlanningObjective is visible Current Focus;
- when severity/deadline are otherwise comparable, work aligned to the active objective ranks higher;
- objective priority must never override a stronger hard blocker or due deadline without explicit policy.

Output is a rebuildable projection, not canonical truth.

Recommendation contract:
- recommendation;
- reasons;
- evidence refs;
- uncertainty;
- blocked by;
- expected effect;
- what may be learned;
- objective ref where applicable;
- action href.

### PR 13 — Today v1 + Explainability + Bottleneck/Readiness → Action

Replace temporary Today composition with canonical AttentionProjection output.

Primary sections:
- CURRENT FOCUS;
- NOW;
- NEXT;
- REVIEW;
- BLOCKED;
- RECENT LEARNING;
- RECENT DECISION.

Add Explainability Drawer:
- WHY THIS;
- BASED ON;
- UNCERTAINTY;
- EXPECTED EFFECT;
- WHAT WE MAY LEARN.

Bottleneck projection:
- detect supported deterministic bottleneck patterns;
- convert bottleneck into recommended action;
- show what completing the action is expected to unlock.

Readiness projection:
- prefer concrete passed checks + blockers;
- avoid arbitrary readiness percentages;
- each blocker should lead to a resolvable action or owning workspace.

Target: first meaningful action initiated within 60 seconds.

### PR 14 — Decision Memory + Prior-Decision Conflict Guard

Implement canonical Decision memory:
- what was decided;
- why;
- evidence refs;
- subject refs;
- review date;
- active / reversed / superseded state;
- reversal/supersede lineage.

Decision capture should be lightweight and often offered as a by-product of existing review flows.

Conflict guard:
- Strategy/recommendation assembly should surface relevant active prior Decisions;
- if a proposal materially conflicts with prior Decision memory, the system must disclose the conflict;
- generic AI best practice must not silently override artist-specific Decision history;
- changed context may justify reconsideration, but must be explicit.

Acceptance scenario:
- prior strategy was tested and rejected due to weak downstream evidence;
- a later recommendation either avoids repeating it or explains why context changed enough to reconsider.

### PR 15 — Learning Foundation + Decision Lineage

Implement Learning lifecycle and scope:
- CANDIDATE;
- VALIDATED;
- STALE;
- REJECTED.

Keep Knowledge and Learning semantically distinct:
- Knowledge = what is known about artist/song/domain;
- Learning = what was learned from actions/results.

Validated Learnings become eligible Artist Brain context.

Lineage UX/data contract should support traversal where evidence exists:

`Experiment → Insight → Learning → Decision → OperationalAction`

Do not fabricate missing links. UNKNOWN is acceptable.

### PR 16 — Weekly Review → Decisions → Actions

Versioned immutable weekly review snapshot:
- what happened;
- what changed;
- what was learned;
- what remains uncertain;
- fatigue / bottleneck signals where supported;
- decisions to make;
- recommended next focus;
- next OperationalActions.

Weekly Review is a decision ritual, not a BI report.

Deterministic facts first, optional AI summary second.

Review completion should support:
- accept decision;
- modify decision;
- need more evidence;
- create/confirm action.

### PR 17 — Passive Capture + UX Simplification

- capture review/rejection reasons as evidence;
- surface decision/learning candidates from normal workflows;
- simplify manual Factory form with progressive disclosure;
- keep canonical rich model while reducing required user input;
- instrument product telemetry for attention, decisions and memory reuse;
- prefer signals generated by normal work over CRM-like maintenance forms.

### PR 18 — Contextual Guidance / Learn → Apply

Do not build a full LMS.

Introduce contextual human learning attached to current tasks.

Separate naming from canonical system `Learning`.

Suggested UX concept: `Contextual Guidance` / `Learn` / `Micro-guide`.

Flow:

`Need → Learn → Apply → Measure`

Example:
- Spotify editorial pitch due tomorrow;
- user lacks context;
- offer `How Spotify pitching works · 6 min`;
- return directly to the pitch workflow.

Context Help (`WHAT IS THIS? / WHY IT MATTERS / HOW TO USE IT`) may evolve into this layer.

### Later polish — Command Palette + Recommendation Maturity

Command Palette may support both navigation and action queries:
- Add Song;
- Generate Angles;
- Start Shoot;
- Import Metrics;
- Run Weekly Review;
- What should I do next?;
- Show blockers;
- What did we learn this week?;
- What decisions are due for review?

Recommendation maturity should make compounding value visible without an artificial intelligence score.

Examples:

**Early context**
- Identity;
- Song Brain;
- authoritative platform knowledge.

**Artist-specific evidence**
- N publications;
- N experiments;
- N validated Learnings;
- N prior Decisions.

Only show counts that are real and provenance-backed.

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
- Recommendation explainability usage (`Why this?` opened / recommendation acted on).
- Prior-decision conflict detection count and resolution outcome once Decision Memory exists.

## Four WOW acceptance moments

A representative Artist OS demo should be able to show:

1. **TODAY** — Artist OS knows what I should do now.
2. **WHY** — Artist OS can explain why.
3. **MEMORY** — Artist OS remembers what we tried, decided and learned.
4. **LEARN** — if I lack knowledge, Artist OS can teach me in the context of a real action and return me to execution.

## Stop conditions

Do not expand into another large horizontal domain until:
- Today v1 is working;
- Decision Memory exists;
- Learning Foundation exists;
- at least one workflow demonstrates reusable memory affecting a later recommendation;
- recommendation explainability is visible in UX;
- Weekly Review can close into Decisions / Next Actions.
