# Artist OS — UI Redesign Implementation Plan

**Status:** Active migration plan  
**Runtime baseline:** `main@a9e5b737bc2abbfb27d1bc0a6349d1b715b21bce`  
**Architecture baseline:** frozen MASTER v1.4 + approved AR / ACP contracts  
**UX baseline:** `docs/artist-os/UX_VISUAL_DIRECTION.md`  
**Purpose:** migrate the current Artist OS UI toward the approved project-aligned creative intelligence workstation without changing domain ownership, canonical lifecycles, API contracts or human-control semantics.

This file is intentionally runtime-specific and may change as implementation progresses.

The stable UX constitution lives in:

`docs/artist-os/UX_VISUAL_DIRECTION.md`

---

# 1. Migration goal

The redesign is a **presentation and interaction refactor over a working canonical product**, not a greenfield rewrite.

Primary target:

> preserve Artist OS intelligence and canonical behavior while making hierarchy, orientation, deep work and current-state clarity materially better.

The current product already has strong workflows. The redesign should solve:

- oversized editorial headings on operational screens;
- too many equal-weight cards;
- long pages where overview, capture, review and history compete;
- forms dominating index screens;
- insufficient distinction between global navigation, local peer views and sections of one object;
- weak numbered orientation in deep-work flows;
- screen-specific visual patterns not yet unified by a design system;
- occasional semantic copy drift between Brain and Memory;
- inconsistent surface nesting and action hierarchy.

---

# 2. Non-goals

This redesign must not:

- create a new canonical domain;
- change MASTER v1.4;
- rewrite route ownership;
- collapse Brain and Memory;
- change Decision/Learning/OperationalAction/Execution lifecycles;
- turn Execution into a Next-only wizard;
- add fake waveform/audio data;
- add fake analytics/readiness scores;
- promote deferred Campaign/Release/Rights/Experiment/Result owners into fake connected UI;
- make AI required for canonical workflows;
- replace provenance with generic AI prose;
- remove canonical fields merely to simplify visuals.

Default rule for UI PRs:

```text
Domain contracts changed: NO
```

Any exception requires a separate architecture/product decision, not a stealth redesign patch.

---

# 3. Current global IA to preserve

```text
Today
Create
Music
Brain
Memory
Account
```

Specialist routes remain available without entering global navigation automatically:

```text
/identity
/decisions
/learnings
/weekly-reviews
/actions/:id
/factory/units/:id
/songs/:id
```

---

# 4. Navigation migration model

The redesign standardizes three navigation types.

## Global sidebar

Major workspaces only.

## Local segmented navigation

Peer views inside one workspace family.

Initial targets:

```text
Brain:
Overview | Inbox | Tone & Voice

Memory:
Overview | Decisions | Learnings | Weekly Reviews
```

Durable peer views must remain URL-addressable and browser Back/Forward compatible.

## Numbered authoring rail

For sections of one working object.

Execution:

```text
01 Creative Core
02 Production
03 Edit
04 Publish Prep
05 Constraints
```

Weekly Review uses numbered narrative sections for reading/orientation, not persisted workflow state.

---

# 5. Documentation reconciliation included in this track

The docs-only reconciliation patch should update:

## README

Change:

```text
Phase 2.5 — Daily OS / Decision Intelligence 🚧
```

to complete status and replace stale “next” language with shipped capabilities.

## Phase 2.5 plan

Change the status from:

```text
Closure PR-F in review
```

to a completed/reconciled status through PR-F.

## Phase 2.5 coverage

Update runtime baseline from pre-merge:

`main@0bb226...` + PR-F closure

to:

`main@a9e5b737bc2abbfb27d1bc0a6349d1b715b21bce`

No product semantics change in this cleanup.

---

# 6. PR strategy

Do not redesign the entire product in one PR.

Recommended sequence:

```text
R0  Doctrine + implementation-plan reconciliation
P0  Design System foundation
P1  Today
P2  Execution
P3  Brain
P4  Weekly Review
P5  Music / Song Brain
P6  Memory family
P7  Identity
P8  Factory library/history coherence
P9  Final cross-screen polish / accessibility audit
```

Each PR should remain focused and reviewable.

Do not merge a later visual slice merely because it depends on an unreviewed earlier slice. Keep the implementation chain understandable and CI-green.

---

# 7. P0 — Design System foundation

P0 must not redesign domain behavior.

## 7.1 Token consolidation

Centralize:

```text
color.*
surface.*
text.*
border.*
radius.*
spacing.*
type.*
shadow.*
motion.*
density.*
```

Tasks:

- reconcile current dark tokens;
- remove competing legacy warm/brown accents unless a deliberate semantic role remains;
- define stable spacing scale;
- define typography scale;
- define surface levels;
- define status semantic colors;
- define focus-ring tokens;
- define motion durations/easing;
- introduce internal density primitives for future compact UI without exposing a user preference.

## 7.2 Shell

Standardize:

- sidebar width;
- top command bar;
- main workspace padding;
- max-width rules;
- responsive collapse behavior.

## 7.3 Shared typography

Implement/reconcile:

- `PageHeader`;
- functional H1;
- editorial supporting subtitle;
- eyebrow;
- section heading;
- metadata/mono styles.

Remove routine 64px-style operational headings.

## 7.4 Button hierarchy

Standardize:

- `PrimaryButton`;
- `SecondaryButton`;
- `TextAction`;
- destructive styling.

One dominant primary action per module.

## 7.5 Surface hierarchy

Implement/reconcile:

- `Surface`;
- `SectionSurface`;
- card rules;
- maximum practical nested surface depth.

## 7.6 Status components

Implement/reconcile:

- `StatusChip`;
- `ConfidenceChip`;
- `EpistemicChip`.

Critical rule:

> shared component appearance does not define domain lifecycle.

Add tests/story coverage where practical to ensure a generic component accepts domain-provided values rather than encoding one mega-status enum.

## 7.7 Navigation primitives

Implement:

- `LocalSegmentedNav`;
- `LocalSegmentedNavItem`;
- `NumberedAuthoringRail`;
- `AuthoringSection`.

Deep-link rule:

- route-backed peer segments use real links/URLs;
- Back/Forward works;
- selected state derives from URL where applicable;
- authoring section state may remain local when it is one unsaved object, but switching sections must preserve local form state.

## 7.8 Overlay primitives

Reconcile:

- Drawer;
- Modal;
- InlineCommitForm;
- DetailDisclosure.

Accessibility requirements:

- focus entry;
- trap when modal;
- Escape where safe;
- close control;
- focus restore.

## 7.9 Accessibility foundation

P0 should provide shared support for:

- visible focus;
- screen-reader-only utility;
- accessible status region;
- reduced-motion tokens;
- consistent form labels/errors;
- touch-target spacing primitives.

## P0 acceptance

- no domain API changes;
- no lifecycle changes;
- no route semantics changes;
- current E2E remains green;
- command palette remains operational;
- keyboard/focus behavior is not regressed;
- visual primitives are reusable by subsequent screen PRs.

---

# 8. P1 — Today

Today defines the daily product value and should be the first screen migrated onto the new system.

## Current problem

The semantics are strong, but hierarchy can become visually flatter than the product model warrants.

## Target composition

```text
TODAY
What needs attention now?

Current Focus

Primary Next Action
[Start / Done / Block] [Why this?]

Attention Queue
compact rows

Context / Memory rail
relevant only
```

## Tasks

- reduce oversized heading treatment;
- keep Current Focus visible but not dominant over the next action;
- make one primary next action unmistakable;
- convert secondary attention to compact rows;
- keep blockers visible without dashboard sprawl;
- preserve current deterministic ordering;
- preserve completion removal from active projection;
- refine Why drawer scanability;
- preserve Contextual Guidance entry where supported;
- use right rail only for actually relevant memory/context.

## Acceptance

- 30–60 second operating test remains viable;
- Start/Done/Block/Reopen unchanged;
- Why provenance unchanged;
- AI-disabled path unchanged;
- no new ranking source;
- no domain dashboard widgets added.

---

# 9. P2 — Execution

Execution becomes the benchmark for numbered deep-work UX.

## Target authoring rail

```text
01 Creative Core
02 Production
03 Edit
04 Publish Prep
05 Constraints
```

## Tasks

- make numbered rail visually directional and persistent enough for orientation;
- selected section must be obvious;
- allow free switching;
- preserve all unsaved local form state;
- derive optional section-completion cues from current form data only;
- keep one canonical “Save new execution revision” action;
- keep revision history compact and secondary;
- clearly separate APPROVED vs SUPERSEDED revision presentation;
- preserve Rights = UNKNOWN;
- ensure approval never implies publishability;
- improve constraints/context rail if supported by current data.

## Accessibility

- rail keyboard behavior;
- current section announced;
- clear focus states;
- no forced Next-only sequence;
- no inaccessible horizontal-only navigation.

## Acceptance

- immutable revision behavior unchanged;
- approval/rejection unchanged;
- all current fields remain writable;
- no per-step persistence/lifecycle invented.

---

# 10. P3 — Brain

Brain becomes the benchmark for contextual intelligence workspace UI.

## Current problem

Overview, capture, review queue and Tone Corpus management currently compete in one long scroll.

## Target local navigation

```text
Overview | Inbox | Tone & Voice
```

## Overview

Prioritize:

- current Brain snapshot;
- Identity context;
- approved knowledge;
- Tone Corpus summary;
- applicable Learning/hard-rule summary.

## Inbox

Use:

> **Review before it enters Artist Brain.**

Candidate cards emphasize:

- statement;
- source;
- destination;
- provenance;
- review/promote action.

## Tone & Voice

Group real excerpts by canonical labels.

Do not infer personality scores or abstract traits unless backed by canonical data.

## Tasks

- correct Brain copy away from “Memory that earns permanence”;
- separate capture/review modes;
- reduce long vertical stacking;
- add URL-addressable peer views;
- preserve canonical Brain rebuild behavior;
- preserve Candidate lifecycle and human promotion.

## Acceptance

- Memory is not a Brain tab;
- no candidate enters durable Brain without existing canonical action;
- no new Knowledge lifecycle;
- no fake source visualization.

---

# 11. P4 — Weekly Review

Weekly Review becomes the benchmark for narrative hierarchy.

## Target narrative

```text
01 What happened
02 What changed
03 What was learned
04 What remains uncertain
05 Signals requiring attention
06 Decisions to make
07 Recommended next focus
08 Next actions
```

## Tasks

- add clear numbered section hierarchy;
- add compact sticky narrative index for long reviews;
- stable section anchors where useful;
- current section indicator is orientation only;
- preserve epistemic chips;
- visually differentiate FACT / OBSERVATION / HYPOTHESIS / RECOMMENDATION without implying unsupported numeric confidence;
- keep Decision / Action / Focus commits contextual and explicit;
- reduce equal-weight panel competition.

## Acceptance

- review remains immutable;
- regeneration semantics unchanged;
- provenance unchanged;
- actions/decisions/objectives remain separate canonical writes;
- empty sections do not invent content.

---

# 12. P5 — Music / Song Brain

## Music catalog

Current Add Song form should stop dominating the index.

Target:

```text
MUSIC

Songs                                      + Add Song
Search / filters
Catalog
```

Add Song opens focused modal/drawer/create state.

Use real artwork only when canonical/user-owned.

## Song Brain

Current supported structure:

- metadata;
- Story;
- Meaning;
- Identity Context;
- scoped statements.

Improve master/detail visual quality without rendering future modules.

## Waveform

Do not implement until canonical Audio Asset / SongSegment data exists.

When implemented later:

- real waveform only;
- textual timestamps/segments;
- accessible equivalent;
- no fake best-hook markers.

## Acceptance

- incomplete Songs remain supported;
- interpretation types remain distinct;
- Identity context remains referenced, not duplicated;
- no global song score.

---

# 13. P6 — Memory family

Make `/memory`, `/decisions`, `/learnings`, and `/weekly-reviews` feel like one coherent workspace family without merging canonical models.

## Shared local navigation

```text
Overview | Decisions | Learnings | Weekly Reviews
```

Each item uses real route/deep-link navigation.

## Memory overview

- Brain vs Memory boundary remains clear;
- domain summaries are compact;
- recent chronology remains chronology, not ranking.

## Decisions

Prioritize:

1. decision;
2. rationale;
3. scope;
4. evidence;
5. lifecycle/history.

## Learnings

Prioritize:

- statement;
- state;
- confidence/rationale;
- scope;
- evidence;
- current action.

## Acceptance

- specialist route ownership unchanged;
- stale/deprecated/reversed history remains inspectable;
- no chronology-as-importance visual ranking.

---

# 14. P7 — Identity

Current page should become current-state first.

Target:

```text
IDENTITY

Current Identity
Current Era
Draft / Review
Version history
Era timeline
```

Actions:

```text
Edit identity
New version
New Era
```

move into focused contextual authoring.

Safe current local navigation:

```text
Overview | Era | Versions
```

Do not render future Visual DNA / Narrative / Mystique / References tabs before their canonical data exists.

---

# 15. P8 — Factory library/history coherence

Factory creation semantics are already stronger than its visual hierarchy.

## Priority order

1. waiting review;
2. create/propose new Angle;
3. approved Angles waiting for Content Unit conversion;
4. Angle history/library;
5. Content Units.

## Tasks

- keep lightweight draft;
- retain advanced progressive disclosure;
- strengthen review queue visually;
- lighten history cards;
- move verbose why/identity-fit/learning/audit data into detail disclosure;
- eliminate remaining browser-prompt interaction;
- make explicit Angle → Content Unit conversion clear;
- preserve AI proposal diagnostics behind optional detail.

## Acceptance

- Approve/Defer/Reject unchanged;
- passive capture unchanged;
- AI proposal remains non-canonical;
- manual AI-disabled path remains complete.

---

# 16. P9 — Cross-screen polish / accessibility audit

After benchmark screens land:

- test full keyboard-only journey;
- test focus restore across command palette/drawers/modals;
- inspect heading hierarchy;
- inspect dark-mode contrast;
- inspect reduced motion;
- inspect async status announcements;
- inspect mobile touch targets;
- verify segmented-nav deep links and Back/Forward;
- remove stale duplicate CSS/token systems;
- check card nesting depth;
- check primary-action competition;
- run representative screen screenshots for visual regression review.

---

# 17. Shared component target

Expected presentation layer after P0–P8:

```text
AppShell
Sidebar
SidebarItem
CommandBar

PageHeader
EditorialSubtitle

LocalSegmentedNav
LocalSegmentedNavItem

NumberedAuthoringRail
AuthoringSection

ContextRail

Surface
SectionSurface

StatusChip
ConfidenceChip
EpistemicChip

CurrentFocusCard
AttentionPrimaryCard
AttentionRow

ReviewCandidateCard
LearningCard
DecisionCard
WeeklyReviewSection
SourceReference

SongRow
SongBrainHeader
SongWaveform          // deferred until real data
SongSegmentCard       // deferred until real data

EmptyState

PrimaryButton
SecondaryButton
TextAction

Drawer
Modal
InlineCommitForm
DetailDisclosure
```

Components should remain presentation-focused. Domain actions remain in owning feature/application layers.

---

# 18. Deferred owners — do not fake during redesign

Current runtime does not yet own full canonical surfaces for:

- Campaign / Release target ownership;
- Experiment / Insight / Hypothesis / Evidence;
- Rights;
- Production Capability;
- Audio Segment;
- Result / Metric ingestion.

UI consequences:

```text
Rights: UNKNOWN
Audio segments: not connected yet
Result evidence: unavailable
```

This is preferred to visual completeness with invented data.

---

# 19. Visual regression review

Every screen PR should include before/after screenshots at representative desktop widths.

Recommended visual review questions:

1. Can I identify the page and primary task in 3–5 seconds?
2. Is there one dominant action?
3. Are secondary items actually secondary?
4. Do cards represent real semantic objects?
5. Is there more than two visible nested surface levels?
6. Does the screen expose technical plumbing too early?
7. Is navigation type correct?
8. Can a URL restore the current peer view?
9. Are UNKNOWN/deferred states honest?
10. Does the UI still feel artist-specific rather than admin-like?

---

# 20. Accessibility review checklist per PR

- [ ] keyboard-only primary flow works;
- [ ] focus indicator visible;
- [ ] overlay focus enters/restores correctly;
- [ ] Escape behavior correct;
- [ ] headings are logical;
- [ ] controls have accessible names;
- [ ] form errors are associated and recoverable;
- [ ] async statuses are announced where needed;
- [ ] color is not the only status signal;
- [ ] contrast is acceptable;
- [ ] reduced motion is respected;
- [ ] mobile controls meet practical touch-target sizing;
- [ ] visualizations have textual alternatives.

---

# 21. PR template for UI redesign

Each UI PR description should include:

```text
Product task:
Canonical state read:
Canonical state written:
Routes affected:
Domain contracts changed: YES / NO
Human approval preserved:
AI-disabled path preserved:
UNKNOWN semantics preserved:
Accessibility impact:
Deep-link / URL behavior:
Visual reference pattern used:
Progressive disclosure change:
E2E impact:
Before/after screenshots:
```

---

# 22. Definition of Done for each redesign PR

- current semantics preserved;
- no stealth domain changes;
- canonical lifecycle preserved;
- no data fields deleted for visual convenience;
- human approval preserved;
- AI-disabled path preserved;
- UNKNOWN preserved;
- accessibility checklist addressed;
- route/deep-link behavior correct;
- no fake media/metrics/provenance;
- existing lint/typecheck/unit/integration/build/E2E pass;
- representative visual screenshots reviewed.

---

# 23. Definition of success for the redesign track

The redesign is complete when Artist OS still has the same architectural depth but no longer feels like a sequence of equally weighted CRUD surfaces.

An artist should experience:

> **I know where I am. I know what matters. I know why it matters. I can act without reconstructing the architecture.**

The redesign must make Artist OS feel like one coherent creative intelligence workstation rather than a set of individually correct screens.
