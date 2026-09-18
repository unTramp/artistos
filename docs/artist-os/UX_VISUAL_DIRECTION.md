# Artist OS — UX / Visual Direction

**Status:** Active normative presentation / interaction doctrine  
**Applies to:** product UI, UX architecture, interaction design, accessibility, design system and UI implementation  
**Architecture baseline:** frozen MASTER v1.4 + approved AR / ACP contracts  
**Product baseline:** current canonical runtime and Product Principles  
**Purpose:** define how Artist OS presents complex canonical workflows without changing domain ownership, routes, lifecycles or product semantics.

> **Architecture and canonical workflows define WHAT Artist OS is.  
> This document defines HOW those workflows are presented.**

Visual references define quality, composition and interaction patterns only. They never create product semantics.

---

## 1. Source-of-truth hierarchy

When implementation guidance conflicts, use:

1. `MASTER_ARCHITECTURE_v1.4.md`
2. approved AR / ACP contracts
3. current canonical runtime/domain implementation
4. `PRODUCT_PRINCIPLES.md`
5. this UX / Visual Direction
6. approved visual references
7. historical prototypes

### Critical rule

Never infer functionality from a visual reference.

A reference must never silently create:

- a canonical domain;
- an entity;
- a lifecycle;
- a route;
- a global navigation item;
- a metric;
- an evidence relationship;
- an AI conclusion;
- a waveform or media state unsupported by real data.

If a reference conflicts with Artist OS semantics, preserve Artist OS semantics and adapt the pattern.

---

## 2. Product feeling

Artist OS should feel like a **premium dark creative intelligence workstation** for a working artist.

It should be:

- cinematic;
- intelligent;
- restrained;
- editorial;
- calm;
- precise;
- artist-specific;
- evidence-aware;
- mature;
- professional.

It should not feel like:

- a generic SaaS admin panel;
- a CRUD back office;
- an enterprise database browser;
- a dashboard full of unrelated widgets;
- a chatbot-first product;
- a cyberpunk UI;
- a gamified productivity app.

Keywords:

`cinematic · precise · restrained · editorial · creative workstation · nocturnal · evidence-aware`

---

## 3. Core UX law

Every important screen must answer quickly:

1. **Where am I?**
2. **What matters here?**
3. **What can I do now?**
4. **Why does it matter?**
5. **What happens next?**

Artist OS may remain architecturally deep. The visible surface must not force the artist to reconstruct that complexity manually.

The operating principle remains:

> **Complex system. Simple surface.**

---

## 4. Preserve the current global IA

The primary navigation is intentionally shallow:

```text
Today
Create
Music
Brain
Memory
Account
```

Do not promote future MASTER domains into the sidebar merely because they exist architecturally.

Specialist routes may exist without becoming global navigation items.

Examples include:

```text
/identity
/decisions
/learnings
/weekly-reviews
/actions/:id
/factory/units/:id
/songs/:id
```

Global navigation answers:

> Which major workspace am I in?

Domain architecture must not define sidebar architecture.

---

## 5. Three navigation grammars

Artist OS uses three distinct navigation concepts.

### 5.1 Global sidebar

Use for major workspaces only.

Current family:

```text
Today
Create
Music
Brain
Memory
Account
```

### 5.2 Local segmented navigation

Use for peer views of one coherent workspace family.

Examples:

```text
Brain:
Overview | Inbox | Tone & Voice

Memory:
Overview | Decisions | Learnings | Weekly Reviews
```

Rules:

- local segments must reflect real supported views;
- do not place Memory inside Brain;
- peer views that represent durable navigable states must have shareable URLs;
- browser Back / Forward must work predictably;
- refreshing or sharing a deep link must preserve the selected peer view;
- do not implement route-level peer views as ephemeral React-only state;
- path routes are preferred when the view is already a canonical route; query/search params are acceptable for supported subviews when route proliferation is unnecessary.

### 5.3 Numbered authoring rail

Use for sections of one complex working object.

Canonical Execution pattern:

```text
01 Creative Core
02 Production
03 Edit
04 Publish Prep
05 Constraints
```

This is **not** a strict wizard.

The user must be free to move between sections without committing intermediate canonical state. Numbering provides orientation, sequence and completion cues; the canonical save contract remains one Execution Revision.

For unsaved authoring sections, local UI state is acceptable provided:

- switching sections does not lose unsaved work;
- no fake per-step lifecycle is persisted;
- navigation remains keyboard accessible;
- the final save creates the canonical revision exactly as before.

---

## 6. Brain and Memory remain separate

### Brain

> Current usable context Artist OS can safely apply now.

Examples:

- active Identity reference;
- Era context;
- approved Artist knowledge;
- Tone Corpus;
- applicable validated Learnings;
- compiled Brain projection.

### Memory

> Historical intelligence, learning, decisions and review lineage.

Examples:

- Decisions;
- Learnings;
- Weekly Reviews;
- later Evidence / Insight / Hypothesis / Experiment when their canonical owners exist.

Validated Memory may feed Brain. That does not make Brain and Memory the same product surface.

### Copy rule

Avoid calling Brain itself “Memory”.

For Candidate Knowledge prefer:

> **Review before it enters Artist Brain.**

or:

> **Review before it becomes reusable context.**

Do not use copy that implies Candidate Knowledge enters the Memory workspace.

---

## 7. App shell

Use a stable desktop structure:

```text
┌───────────────┬────────────────────────────────────────────┐
│               │ Global Command Bar                         │
│               ├────────────────────────────────────────────┤
│ Sidebar       │ Main Workspace                             │
│               │                                            │
└───────────────┴────────────────────────────────────────────┘
```

Recommended desktop targets:

```text
Sidebar:          220–232 px
Top bar:           64–68 px
Main max width:   1400–1540 px where useful
Main padding:       32–40 px
Panel gap:           14–20 px
```

Avoid oversized empty space around operational headings.

Desktop is the primary deep-work surface.

---

## 8. Global command bar

Preserve the existing `⌘K / Ctrl+K` Command Palette.

It is a launcher, not an autonomous command executor.

It may:

- navigate;
- search supported commands;
- enter workflows;
- expose keyboard navigation.

It must not perform hidden mutations.

Keep the bar visually quiet. Do not expose raw IDs, token counts, model plumbing or debug state in the primary shell.

---

## 9. Sidebar

Use:

- icon + label;
- compact vertical rhythm;
- subtle violet selected state;
- no oversized pill;
- no deep nested navigation tree.

A small closed-loop status may exist in the footer, but it must never compete with navigation or Current Focus.

---

## 10. Typography

Operational screens must not look like marketing landing pages.

Recommended desktop hierarchy:

```text
Page eyebrow       10–11 px
Page title         36–44 px
Page description   14–16 px
Section title      20–24 px
Card title         14–18 px
Body               13–15 px
Metadata           10–12 px
```

Use:

- Inter / system sans for product UI;
- mono for evidence IDs, timestamps, versions and compact technical metadata.

Prefer:

```text
Decisions
Remember the choice, not just the outcome.
```

over using the editorial sentence itself as a giant functional H1.

---

## 11. Design tokens

Centralize tokens. Do not grow parallel ad-hoc visual systems.

Recommended groups:

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

Prepare spacing primitives so a future compact density can exist without rewriting components.

Do **not** expose a user-facing density switch until a real product need exists.

---

## 12. Color and surface system

Core direction:

```text
Canvas        #08090C
Sidebar       #090A0E
Surface       #101216
Surface 2     #181A20
Deep Surface  #0D0F13
Border        #1E2028

Text          #F4F4F5
Muted         #71717A–#8A8F99

Violet        #8B5CF6
Indigo        #6366F1
Cyan          #06B6D4
Emerald       #10B981
Amber         #F59E0B
Crimson       #EF4444
```

Semantics:

- Violet / Indigo — primary action, selected state, Artist OS intelligence/context.
- Cyan — information, provenance, discovery, context signal.
- Emerald — validated, approved, aligned, complete.
- Amber — attention, review, uncertainty, blocker.
- Crimson — destructive, invalid, reject-risk.

Bright colors require semantic justification.

### Glow

Glow is an accent, not a theme.

Allowed:

- selected nav;
- active Brain/intelligence context;
- occasional primary CTA;
- restrained contextual emphasis.

Avoid neon outlines, glowing every card and animated gradient work surfaces.

---

## 13. Surface and card rules

A card should represent a meaningful semantic object.

Good card objects include:

- OperationalAction;
- Current Focus;
- Learning;
- Decision;
- Candidate Knowledge;
- Song;
- Content Angle;
- Content Unit;
- Weekly Review item;
- current Identity;
- provenance/source summary.

Do not use cards merely as spacing containers.

Avoid:

```text
card
  card
    card
      input
```

Aim for no more than two visibly nested surface levels.

---

## 14. Status system

Shared status components may reuse shape, typography and semantic color.

**Shared appearance does not create a shared lifecycle.**

Status semantics remain domain-scoped.

Examples:

- `SUPERSEDED` is valid where the owning domain defines it, such as Execution Revision;
- Decision remains governed by its own canonical statuses such as `ACTIVE | UNDER_REVIEW | REVERSED | EXPIRED`;
- a shared `StatusChip` must never introduce a state into a domain that does not own it.

Prefer semantic words over pseudo-scores.

Avoid:

- Career Score;
- Artist Health 87%;
- Brain Intelligence 76%;
- arbitrary readiness percentages.

Concrete checks and blockers are preferred.

---

## 15. Progressive disclosure

Visible first:

> artist intent / useful consequence

Then:

> workable controls

Then:

> why / evidence / constraints

Then:

> technical detail

Raw IDs, timestamps, revision UUIDs, model/provider/token counts and audit plumbing belong in detail or diagnostics, not primary UI.

Canonical model richness does not justify giant default forms.

---

## 16. Forms are states, not page architecture

Prefer:

- modal;
- drawer;
- inline edit mode;
- focused authoring section.

Avoid permanently displaying occasional create/edit forms at the top of index screens.

Index screens should primarily support their dominant recurring task.

Examples:

- Music: browse/open songs first; Add Song is an action.
- Identity: understand current Identity/Era first; version/Era creation is contextual.
- Brain: separate Overview, Inbox and Tone & Voice rather than stacking all capture/review modes in one scroll.
- Factory: keep lightweight draft creation, but prioritize waiting review work.

Drawers are for contextual depth, not entire applications.

---

## 17. Human-control visual grammar

Artist OS must visibly distinguish proposal from committed truth.

Useful conceptual states:

```text
Suggested
Candidate
Review
Approved
Validated
Committed
```

These are **presentation semantics**, not a universal lifecycle.

Use explicit verbs where state changes matter:

```text
Review & promote
Commit decision
Approve execution
Set current focus
Create Content Unit
```

Core rule:

> **AI proposes; humans commit.**

---

## 18. UNKNOWN is first-class

Never fill missing state with visual fiction.

Use:

```text
Unknown
Not connected
Not set yet
Insufficient evidence
No approved source yet
```

Especially for deferred owners such as:

- Rights;
- Audio Segments;
- Campaign / Release target ownership;
- Experiment lineage;
- Production Capability;
- Result / effectiveness metrics.

Honest absence is a product quality signal.

---

## 19. Copy language

Primary copy should speak in artist/product language.

Prefer:

> Review before it enters Artist Brain.

over:

> Candidate Knowledge Promotion Queue.

Prefer:

> What should the viewer feel?

over:

> Creative intent field.

Prefer:

> No approved execution yet.

over:

> Revision relation absent.

Technical terminology remains available in provenance, diagnostics and detail views.

---

## 20. Visual media

Artist OS should visually belong to artists, but media must be real.

Use when canonical or user-owned data exists:

- artwork;
- content thumbnail;
- performance still;
- reference image;
- asset preview.

If media is missing:

- use neutral iconography;
- use designed placeholders;
- show the missing state honestly.

Never fabricate creative thumbnails as if they were artist assets.

---

## 21. Today

Today is the most selective surface in Artist OS.

Recommended order:

```text
TODAY
What needs attention now?

Current Focus

Primary Next Action
[Start / Done / Block] [Why this?]

Attention Queue
- compact blocker/review/memory item
- compact blocker/review/memory item

Context / Memory rail
- recent relevant Decision
- validated Learning
- recent execution when useful
```

One primary next action should visually dominate.

Secondary attention should be compact.

Do not turn Today into a general dashboard for every domain.

Current deterministic Attention projection and human-controlled OperationalAction behavior must remain unchanged.

---

## 22. Explainability drawer

Preserve `Why this?` as a signature Artist OS interaction.

Canonical order:

```text
WHY THIS
BASED ON
BASIS MATURITY
UNCERTAINTY
EXPECTED EFFECT
WHAT WE MAY LEARN
optional LEARN BEFORE DOING
primary target action
```

Rules:

- provenance must be real;
- unresolved refs fail soft;
- no fake confidence score;
- no chain-of-thought;
- deterministic state should not be replaced by generic AI prose;
- primary target action remains clear.

Use compact source references and stronger visual section separation.

---

## 23. Prior-decision conflict

A conflict with Decision Memory is advisory.

Preferred pattern:

```text
CONFLICT WITH PRIOR DECISION

Previous choice + rationale

[Review prior context]
[Proceed anyway]
```

Proceeding may request “What changed?” and a lightweight rationale.

The UI must communicate caution, not prohibition.

Human override remains possible.

---

## 24. Create / Content Factory

Factory answers:

> **What can we create?**

It is not Today.

Preserve the real operating model:

```text
01 Intent
02 Human Judgment
03 Memory
```

This is explanatory structure, not a persisted wizard state.

Priority order:

1. review work already waiting;
2. create/propose a new Angle;
3. approved Angles awaiting Content Unit conversion;
4. Angle library/history;
5. Content Units.

### Draft creation

Keep the default draft lightweight.

Advanced canonical fields remain optional and progressively disclosed.

Missing optional context remains semantically UNKNOWN / not set yet.

### AI proposals

Treat AI as a proposal layer.

Show useful context/provenance and proposal controls. Provider/model/token details belong in diagnostics.

Manual canonical workflows remain first-class when AI is disabled.

### Review

Approve / Defer / Reject semantics must remain unchanged.

Rejection forms should be contextual, not browser prompts.

Passive capture never auto-promotes canonical truth.

### Content Unit

Preserve:

> Approved Content Angle ≠ Content Unit.

Conversion remains explicit.

---

## 25. Execution

Execution is the canonical benchmark for guided deep work.

Use a numbered authoring rail:

```text
01 Creative Core
02 Production
03 Edit
04 Publish Prep
05 Constraints
```

Rules:

- selected section is obvious;
- sections remain freely switchable;
- section switching preserves unsaved local state;
- no fake persisted step lifecycle;
- save creates one immutable Execution Revision;
- approval/rejection semantics remain unchanged;
- revision history remains secondary to current authoring;
- approval never implies publishability;
- Rights remains UNKNOWN until a canonical owner exists.

Lightweight derived completion cues are allowed if they are computed from real current form data and never persisted as invented lifecycle state.

---

## 26. Music

Music is catalog-first.

Preferred default:

```text
MUSIC

Songs                                      + Add Song

[ Search songs… ]       All | Original | Covers

Song catalog
...
```

Creating a Song is occasional work. Browsing and opening Song Brain is the primary page intent.

Do not invent artwork. Use real artist assets or neutral placeholders.

---

## 27. Song Brain

Design around current real Song Brain data first:

- Song metadata;
- Story;
- Meaning;
- FACT statements;
- ARTIST_INTERPRETATION statements;
- AUDIENCE_INTERPRETATION statements;
- Identity reference;
- Era reference;
- Song-specific visual notes/anchors/allowed overrides.

Recommended current structure:

```text
SONG BRAIN
Song title

Overview
- Story
- Meaning
- Identity Context
- Statements
```

### Waveform rule

A waveform is a signature future pattern, but only when canonical Audio / SongSegment data exists.

Do not render:

- decorative equalizers;
- random waveform bars;
- invented timestamps;
- synthetic “best hook” labels.

When enabled, waveform must have an accessible textual companion with timestamps and segment labels.

---

## 28. Brain

Brain answers:

> What does Artist OS know and safely use now?

Functional title first:

```text
BRAIN
Your Artist Brain

Current usable context Artist OS can safely apply
to creative and strategic work.
```

Recommended local navigation:

```text
Overview | Inbox | Tone & Voice
```

Potential future peer views may appear only when meaningful canonical data exists.

### Overview

Compact current-state modules may include:

- Identity Context;
- Approved Knowledge;
- Tone Corpus;
- applicable Learning / Hard Rules.

Use real counts/statuses only.

### Inbox

Human-facing pattern:

> **Review before it enters Artist Brain.**

Candidate cards should emphasize statement, source/provenance, destination and review action.

### Tone & Voice

Use real excerpts grouped by canonical Tone Corpus labels.

Tone Corpus is evidence/examples, not a fictional personality score.

---

## 29. Memory

Memory is the history/intelligence workspace.

Functional title first:

```text
MEMORY
History, learning and decisions.

Remember what happened — and why it matters next.
```

Use local navigation:

```text
Overview | Decisions | Learnings | Weekly Reviews
```

Existing canonical routes may remain separate while sharing one workspace family.

Chronology is chronology, not ranking.

Do not imply newest = most important, most true or best.

---

## 30. Decisions

Primary visual order:

1. choice;
2. why;
3. scope;
4. evidence;
5. review/reversal state.

Recommended page copy:

```text
DECISIONS
Remember the choice, not just the outcome.
```

Decision detail may progressively disclose:

```text
Decision
Why
Based on
Scope / review timing
Supersedes / reversed by
History / audit
```

Prior conflicts remain advisory.

---

## 31. Learnings

Preserve the canonical lifecycle visually without turning the page into lifecycle administration.

Primary content:

- statement;
- confidence + rationale;
- scope;
- evidence/provenance;
- current action.

Canonical states remain owned by Learning:

```text
CANDIDATE
TESTING
VALIDATED
STALE
DEPRECATED
```

Validation/deprecation rationale should be contextual.

---

## 32. Weekly Review

Weekly Review is an immutable decision ritual, not BI.

Use a numbered narrative:

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

For long reviews, a compact sticky narrative index may show:

```text
01 02 03 04 05 06 07 08
```

Requirements:

- it is navigation/orientation only;
- it does not create workflow state;
- current section is announced accessibly;
- keyboard users can navigate the same content;
- deep links to meaningful review sections are encouraged when stable anchors exist.

Preserve epistemic labels:

```text
FACT
OBSERVATION
HYPOTHESIS
RECOMMENDATION
```

Do not flatten them into equal authority.

Decision / Action / Focus commits remain explicit and separate canonical writes.

---

## 33. Identity

The page should primarily communicate current Identity, not database mutation controls.

Current safe structure:

```text
IDENTITY

Current Identity
Current Era
Draft / Review
Version history
Era timeline
```

Actions such as:

```text
Edit identity
New version
New Era
```

should open focused contextual UI.

Safe current local navigation:

```text
Overview | Era | Versions
```

Future Visual DNA / Narrative / Mystique / References views may appear only when the corresponding canonical data exists.

---

## 34. Right contextual rail

Use selectively.

Good candidates:

- Today — recent relevant memory/context;
- Brain — Tone/Voice snapshot and source context;
- Song Brain — Identity context and future canonical audio context;
- Execution — constraints, provenance, current Song/Identity references.

Do not add a rail merely to fill horizontal space.

---

## 35. Button hierarchy

Use at most three visible levels:

### Primary

Filled violet. One dominant action per module.

### Secondary

Dark surface + border.

### Tertiary

Text/link action.

Avoid several same-weight purple buttons competing in a small area.

---

## 36. Motion

Use restrained motion, typically 150–250ms, for:

- drawers;
- segmented selection;
- hover/focus feedback;
- compact state changes;
- skeleton/loading;
- navigation transitions where useful.

Respect `prefers-reduced-motion`.

Avoid:

- constant glow animation;
- bouncing cards;
- particle backgrounds;
- “AI magic” animation on every action.

---

## 37. Accessibility contract — WCAG 2.2 AA baseline

Artist OS targets **WCAG 2.2 AA** for product UI.

Accessibility is part of the design contract, not a post-redesign cleanup.

### Keyboard

- all interactive controls must be keyboard reachable;
- visible focus must never be removed without an equivalent replacement;
- focus order must follow visual/logical order;
- custom segmented controls, rails and menus need expected arrow-key/Tab behavior;
- `Escape` closes dismissible overlays where safe;
- destructive or commit actions must never be triggered by focus movement alone.

### Overlay focus

For Modal / Drawer / Command Palette:

- move focus into the overlay on open;
- trap focus while modal semantics are active;
- provide a clear close control;
- support Escape where dismissal is safe;
- restore focus to the initiating control on close.

### Structure and semantics

- use meaningful page landmarks;
- maintain logical heading hierarchy;
- use native buttons/links where possible;
- do not communicate status by color alone;
- icon-only controls require accessible names;
- tables/lists should preserve semantic structure.

### Forms and errors

- every input has a persistent programmatic label;
- validation errors are associated with the field;
- error text explains how to recover;
- required state is communicated accessibly;
- async save/validation status should be announced to assistive technology when materially relevant.

### Contrast

- text, controls, focus indicators and semantic states must meet WCAG AA contrast requirements;
- muted text must remain readable on dark surfaces;
- accent glow must never be the only boundary/focus indicator.

### Motion

- honor `prefers-reduced-motion`;
- no essential information may depend on animation;
- loading/progress must have a non-motion semantic equivalent.

### Touch targets

On mobile/PWA:

- design primary interactive targets around ~44×44 CSS px where practical;
- do not fall below WCAG 2.2 AA target-size requirements unless a defined exception applies;
- preserve spacing between dense controls.

### Status announcements

Important asynchronous changes such as:

- save succeeded/failed;
- action completed;
- validation failed;
- long-running operation state changed

should expose appropriate accessible status messaging without stealing focus unnecessarily.

### Media and visualization

- waveform/segment visuals require textual alternatives;
- image meaning requires appropriate alt treatment;
- decorative imagery must not pollute screen-reader output.

---

## 38. Responsive behavior

Desktop remains the primary deep-work surface.

At smaller widths:

- sidebar collapses;
- right rail stacks below;
- segmented navigation may scroll horizontally;
- dense tables become lists/details;
- Today becomes single-column;
- Execution authoring rail remains understandable;
- waveform, when real, retains textual fallback;
- primary actions remain reachable without excessive horizontal scrolling.

Do not merely compress a 1500px layout until it becomes unreadable.

---

## 39. Shared presentation component layer

Recommended shared components:

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
SongWaveform          // gated by real data
SongSegmentCard       // gated by real data

EmptyState

PrimaryButton
SecondaryButton
TextAction

Drawer
Modal
InlineCommitForm
DetailDisclosure
```

Presentation components should remain as domain-agnostic/dumb as practical.

A visual component must not reimplement domain lifecycle behavior.

Feature/application layers own domain actions; shared components render state and interaction affordances.

---

## 40. Visual benchmark usage

Use known patterns instead of inventing a new visual grammar per screen.

### Today

Benchmark for attention hierarchy and next-action clarity.

### Execution

Benchmark for numbered deep-work authoring.

### Brain

Benchmark for contextual intelligence, segmented navigation and review queues.

### Weekly Review

Benchmark for narrative hierarchy and long-form orientation.

### Music / Song Brain

Benchmark for artist-specific catalog/detail UI and future evidence-backed audio visualization.

References are North Stars for composition, density and interaction quality only.

---

## 41. Telemetry boundary

Product telemetry is metadata-only analytics.

It must not become:

- Artist Brain truth;
- an artist-facing intelligence score;
- fake recommendation confidence;
- behavioral “memory” without canonical product semantics.

UI may use telemetry for product measurement, not to fabricate artist knowledge.

---

## 42. Empty states

Empty states should teach the product.

Good:

```text
No validated Learnings yet.

Artist OS will reuse a pattern only after
evidence has been reviewed and validated.
```

Bad:

```text
No data.
```

Also bad:

inventing generic AI advice to make a screen look populated.

---

## 43. Design anti-patterns

Do not drift toward:

- generic white/gray SaaS dashboards;
- neon cyberpunk overload;
- giant gradient cards everywhere;
- exposing every domain as global navigation;
- forcing users to patrol workspaces to reconstruct priorities;
- fake charts;
- fake waveform decoration;
- AI chat as the homepage;
- huge mandatory forms mirroring database schemas;
- decorative global scores;
- black-box recommendations;
- hard-blocking a human because Memory conflicts with a new choice;
- local-only segmented states that cannot be deep-linked when the view is a durable peer route;
- visual state that invents domain lifecycle.

---

## 44. Global acceptance criteria

A redesigned screen is accepted only if:

- current domain behavior is preserved;
- API contracts are not weakened for visual convenience;
- canonical lifecycle is not replaced by UI-only state;
- human approval remains explicit;
- UNKNOWN remains honest;
- AI-disabled workflow still works;
- primary task is obvious;
- primary vs secondary information is visually clear;
- technical metadata is secondary;
- unnecessary card nesting is removed;
- page can be scanned quickly;
- navigation type is semantically correct;
- durable peer views remain deep-linkable;
- visual references did not create unsupported functionality;
- provenance remains accessible;
- WCAG 2.2 AA expectations are met;
- responsive behavior remains usable;
- existing lint/typecheck/unit/integration/build/E2E gates continue to pass.

---

## 45. UI implementation rule

Every UI redesign PR must state:

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
```

Default expectation for presentation-only redesign:

```text
Domain contracts changed: NO
```

If a visual recommendation conflicts with product semantics:

> preserve product semantics.

If a visual recommendation requires data the runtime does not own:

> omit it or show an honest deferred/unknown state.

---

## 46. Definition of success

The redesign succeeds when Artist OS retains the same architectural depth, but the artist experiences:

> **I understand where I am, what matters, why the system is showing this, and what I should do next.**

Final principle:

> **Do not simplify Artist OS by removing its intelligence.  
> Simplify the way that intelligence is presented.**
