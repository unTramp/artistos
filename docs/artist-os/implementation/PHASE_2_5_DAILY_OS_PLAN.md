# Phase 2.5 — Daily OS / Decision Intelligence

**Status:** Active execution roadmap — reconciled after post-branch audit
**Architecture baseline:** MASTER v1.4 remains frozen and normative.
**Current implementation track:** Post-audit reconciliation PR-A → PR-F
**Last reconciled:** 2026-09-18

## Goal

Turn the existing Artist Foundation + Content Factory into a daily operating system for an artist.

Primary acceptance statement:

> Open Artist OS → understand current state in 30–60 seconds → see the next meaningful action → understand why → act → preserve evidence/decision → make future recommendations better.

Artist OS connects two loops:

### User operating loop

`Context → Focus → Action → Result → Better Next Action`

### Intelligence loop

`Evidence → Insight / Hypothesis → Experiment → Learning → Decision → Reuse`

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
- Prior Decisions are advisory memory, never hard policy that silently removes human agency.
- Recommendation/action contracts must remain extensible for optional contextual guidance without requiring a Lesson/LMS domain.

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
- `WHAT WE MAY LEARN` — only when meaningful;
- `OPTIONAL GUIDANCE` — optional reference to contextual help/micro-guidance when the user may need knowledge before execution.

Deterministic blockers require deterministic explanation, not an AI-generated rationale.

Guidance metadata is an extension point only; Phase 2.5 does not require a new Lesson root entity or LMS architecture.

## Official demo acceptance test

Every representative Artist OS demo must demonstrate all four moments:

1. **TODAY** — Artist OS knows what I should do now.
2. **WHY** — Artist OS can explain why.
3. **MEMORY** — Artist OS remembers what we tried, decided and learned.
4. **LEARN** — when I lack context, Artist OS can offer relevant guidance before I act and return me to execution.

A release that cannot demonstrate these four moments is not yet a complete Daily OS experience.

## Implementation status and execution order

This section is the current implementation source of truth for Phase 2.5 execution.

The older logical labels `PR 11…18` used during planning no longer map 1:1 to GitHub PR numbers. They are intentionally retired here to avoid confusing plan order with repository history.

### Shipped Daily OS foundation

The following runtime slices are already in `main` and should be treated as foundation, not future work:

- **PR #10 — Product Coherence Foundation** ✅
  - real signup → onboarding → Artist workspace;
  - Today-first product shell;
  - deterministic Today baseline;
  - dark workstation direction;
  - AI-disabled usefulness.

- **PR #13 — OperationalAction Foundation** ✅
  - canonical lifecycle:
    `OPEN | IN_PROGRESS | BLOCKED | DONE | SKIPPED | EXPIRED`;
  - owning-domain truth remains separate;
  - source/provenance required;
  - completion does not overwrite foreign canonical state.

- **PR #14–#15 — Attention Projection + Today / WHY** ✅
  - rebuildable deterministic Attention projection;
  - WHY / BASED ON / uncertainty / blockers / expected effect / what may be learned;
  - Today remains an attention layer rather than a source of truth.

- **PR #16–#17 — PlanningObjective + Current Focus** ✅ foundation
  - explicit current focus on Today;
  - human-controlled completion;
  - later canonical gaps were corrected by PR #25.

- **PR #18 — Decision Memory** ✅
  - `ACTIVE | UNDER_REVIEW | REVERSED | EXPIRED`;
  - supersession preserved through lineage rather than a fake status;
  - prior decisions remain advisory and overridable with rationale.

- **PR #19 — Learning Foundation + Decision Lineage** ✅
  - canonical lifecycle:
    `CANDIDATE | TESTING | VALIDATED | STALE | DEPRECATED`;
  - Knowledge and Learning remain semantically separate;
  - validated memory can affect later context.

- **PR #20 — Weekly Review** ✅ foundation
  - immutable review artifact;
  - deterministic generation;
  - explicit Decisions / OperationalActions from review;
  - later epistemic and focus-loop gaps were corrected by PR #25/#26.

- **PR #21 — Passive Capture + Factory UX** ✅
  - rejection/review evidence captured from normal work;
  - low-confidence candidates rather than automatic truth promotion;
  - Factory progressive disclosure preserves the rich canonical model.

- **PR #22 — Contextual Guidance** ✅
  - human guidance remains separate from canonical Learning;
  - `Need → Learn → Apply` stays contextual and optional.

- **PR #23 — Command Palette + Recommendation Maturity** ✅
  - bounded command-palette slice;
  - provenance-backed maturity labels;
  - no fake intelligence score.

### Post-branch reconciliation track

#### Audit baseline — GitHub PR #24 ✅ MERGED

**Purpose:** review PR #8–#23 as one evolving product against frozen MASTER v1.4 and AR-001…AR-062.

Result:
- architecture direction confirmed;
- Brain vs Memory boundary preserved;
- Factory / Execution depth explicitly protected;
- real contract gaps separated from UX debt and intentional incremental scope;
- revised execution track PR-A → PR-F established.

Merge baseline after audit:
`c9b4d6db7aff2c5c8d3507862e0cd1eacb3670fd`.

#### PR-A — Canonical contract reconciliation — GitHub PR #25 ✅ MERGED

**Goal:** repair frozen-contract mismatches before further UX work.

Completed:
- PlanningObjective now persists canonical `status` lifecycle and `successCriteria[]`;
- unsupported CAMPAIGN / RELEASE objective targets fail closed until canonical owners can validate them;
- Weekly Review items persist explicit epistemic labels:
  `FACT | OBSERVATION | HYPOTHESIS | RECOMMENDATION`;
- eligible fresh `VALIDATED` Learnings are compiled into Artist Brain projection with provenance;
- Context Assembler no longer leaks scoped Learnings globally when target applicability cannot be proven;
- regression/integration coverage added.

Merged into `main` as:
`3ceaa8ae4a14da2280e8cf94abff7fa14224b5f0`.

#### PR-B — Daily OS loop closure — GitHub PR #26 ✅ READY FOR REVIEW

**Goal:** close the first human-controlled operating loop:

`Weekly Review → Current Focus → Today → OperationalAction → Result`

Implemented:
- PlanningObjective carries bounded `relatedRefs[]` for evidence-backed affinity;
- ARTIST focus no longer marks every OperationalAction as aligned;
- alignment requires demonstrable canonical lineage;
- Weekly Review `RECOMMENDED_NEXT_FOCUS` can be explicitly confirmed into a PRIMARY ARTIST PlanningObjective;
- an overlapping PRIMARY objective is never silently replaced;
- compact Start / Done / Block / Resolve blocker controls exist for `MANUAL_NATIVE` and `EXTERNAL` actions only;
- `API_ASSISTED` / `SYSTEM_CHECK` remain outside manual controls;
- completed actions leave the active Today interaction immediately after confirmed backend success;
- WeeklyReview-sourced actions route back to `/weekly-reviews/:id`;
- source-domain truth remains untouched by OperationalAction completion.

Validation:
- final head: `bb9837d0a176504d65d181061611d93ed6e55620`;
- CI #358 attempt 2: full green;
- representative E2E proves Weekly Review → Focus → aligned Today action → Done → removal from active action projection.

**State:** ready, intentionally not merged until explicit approval.

#### PR-C — Provenance / Memory Traversal ⏭ NEXT

**Goal:** make the existing intelligence graph understandable and traversable without inventing missing lineage.

Scope:
- introduce a shared typed entity-reference resolver for user-facing provenance;
- replace raw `Type:UUID` presentation with human labels where canonical readers can resolve them;
- support clickable traversal across existing evidence:
  `Learning ↔ Decision ↔ Weekly Review ↔ OperationalAction`;
- improve WHY / BASED ON so relevant memory refs are visible only when demonstrably applicable;
- preserve UNKNOWN / unresolved references honestly;
- no semantic search result may be promoted into canonical lineage merely because text looks similar;
- no Brain/Memory merge.

Acceptance:
- a user can answer “what led to this?” and “what happened next?” from supported lineage;
- broken/unresolvable refs fail soft in presentation but do not fabricate labels or relationships;
- Today remains selective rather than becoming a graph browser.

#### PR-D — Intelligence / Brain information architecture

**Goal:** make the semantic split understandable in product navigation while preserving domain ownership.

Scope:
- preserve:
  - Brain = current operational context / durable knowledge projection;
  - Memory / Intelligence = what happened, was inferred/tested/learned/decided and why;
- decide whether `Memory` becomes a real workspace/hub or remains shallow navigation with specialist routes;
- align Decisions, Learnings, Weekly Reviews and future Experiments under coherent language;
- fix misleading nav aliases such as top-level Memory pointing only at Decisions;
- keep Today as orchestration regardless of navigation depth.

Non-goal:
- do not collapse canonical Brain and Memory models.

#### PR-E — Deep-work ergonomics, not feature removal

**Goal:** make the deep system easier to operate without deleting useful capability.

Scope:
- replace material `window.prompt` flows with contextual forms/drawers;
- hide provider/model/token plumbing under diagnostics;
- restructure Execution authoring by working mode:
  - Creative Core;
  - Production;
  - Edit;
  - Publish Prep;
  - Constraints;
- preserve all useful canonical ContentAngle / Execution fields;
- keep Factory lightweight-draft progressive disclosure;
- progressively surface Audio Segment / Identity Constraints / Production Capability only as canonical owners become available.

Principle:

> Do not make Artist OS a simple app. Make the complex system simple to use.

#### PR-F — Measurement + documentation reconciliation

**Goal:** close Phase 2.5 as a measurable, documented product slice.

Scope:
- measure attention outcomes at actual action points;
- measure memory reuse where memory is actually consumed;
- reconcile stale Phase 2.5 vocabulary with MASTER v1.4;
- add missing Content Factory completion/coverage report or current-state coverage matrix;
- resolve pre-v1.4 Product Spec questions already frozen by MASTER/AR without rewriting future intent to match incomplete runtime;
- document final Phase 2.5 representative E2E and remaining deferred domain dependencies.

### Gate before another large horizontal domain

Do not expand aggressively into another major horizontal domain until:

- PR-A is merged ✅;
- PR-B is merged;
- PR-C provenance traversal is usable;
- one end-to-end flow visibly demonstrates prior evidence/memory improving a later action/recommendation;
- Today can explain WHY with trustworthy provenance;
- Weekly Review can close into the next focus/action loop;
- no known P0 MASTER v1.4 contract gap remains in the Phase 2.5 runtime.

## Today data-source rule

Today now consumes deterministic domain state plus canonical OperationalActions through the rebuildable Attention projection.

Rules:
- Today never becomes canonical ownership for domain state;
- deterministic blockers/review queues come from canonical readers;
- OperationalActions preserve source-domain/entity provenance;
- PlanningObjective influences ranking only through bounded, demonstrable affinity;
- missing context remains UNKNOWN rather than inferred into truth;
- AI is not required for Today to remain useful.

## MVP metrics

- Time to Meaningful Next Action < 60 seconds.
- Attention completion/open/dismiss/snooze rates.
- Memory Reuse Rate.
- Automatic Context Capture Ratio.
- Recommendation explainability usage (`Why this?` opened / recommendation acted on).
- Prior-decision conflict detection count, override rate and override outcome once Decision Memory exists.

## Four WOW acceptance moments

A representative Artist OS demo should be able to show:

1. **TODAY** — Artist OS knows what I should do now.
2. **WHY** — Artist OS can explain why.
3. **MEMORY** — Artist OS remembers what we tried, decided and learned.
4. **LEARN** — if I lack knowledge, Artist OS can teach me in the context of a real action and return me to execution.

## Stop conditions

Phase 2.5 is not considered reconciled until:
- PR-B is merged;
- PR-C provenance / memory traversal is complete enough to inspect supported lineage;
- Today recommendations can expose trustworthy WHY / BASED ON without raw-ID plumbing dominating the surface;
- at least one representative workflow proves reusable memory changes later context/action;
- documentation no longer contradicts MASTER v1.4 lifecycles or ownership boundaries;
- no remaining P0 contract gap identified by the post-branch audit is unresolved.

After these gates, PR-D/E/F may continue polishing and closing the phase while planning the next horizontal domain.
