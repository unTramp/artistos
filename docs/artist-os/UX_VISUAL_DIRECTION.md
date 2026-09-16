# Artist OS — UX / Visual Direction

**Status:** Active implementation guidance
**Reference:** approved dark Artist OS workstation prototype supplied during Phase 2.5
**Purpose:** preserve one coherent visual language while the product surface evolves.

This document is a visual/interaction contract. It does not redefine domain architecture or make every conceptual module a navigation item.

## 1. Design character

Artist OS should feel like a **premium creative workstation**:

- calm rather than playful;
- dense rather than oversized;
- technical where precision matters, emotional where artist context matters;
- dark, cinematic and understated;
- highly legible despite information density;
- professional tool, not generic SaaS dashboard;
- AI is present as capability, not as a giant chat box.

Keywords:

`cinematic · precise · restrained · editorial · creative workstation · nocturnal · evidence-aware`

## 2. Core color tokens

```text
Canvas        #08090C
Sidebar       #090A0E
Surface       #101216
Surface 2     #181A20
Deep Surface  #0D0F13
Border        #1E2028

Text          #F4F4F5
Muted         zinc / ~#71717A–#8A8F99

Violet        #8B5CF6
Indigo        #6366F1
Cyan          #06B6D4
Emerald       #10B981
Amber         #F59E0B
Crimson       #EF4444
```

### Semantics

- Violet / Indigo — primary action, selected state, Artist OS intelligence/context.
- Cyan — information / discovery / context signal.
- Emerald — validated / ready / approved / healthy.
- Amber — attention / action needed / uncertainty.
- Crimson — blocking / destructive / invalid.

Do not assign bright colors decoratively when there is no semantic reason.

## 3. Typography

Primary UI:

`Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

Mono / evidence / codes / metrics:

`SFMono-Regular, JetBrains Mono, Consolas, monospace`

### Hierarchy

- Product / page title: strong sans, tight tracking.
- Section title: compact sans, medium/semibold.
- Eyebrow: 8–10px, uppercase, increased tracking, muted/accent.
- Body: 10–13px on dense desktop surfaces.
- IDs / versions / timestamps / counts: mono.

Avoid giant marketing-style headings inside operational screens. Today may have one strong orientation heading, then density should increase quickly.

## 4. Layout

### Desktop shell

- compact left sidebar ~214px;
- top context / command bar ~70px;
- main work area can expand to ~1540px;
- 12–18px typical panel gaps;
- deep work screens can be wide;
- avoid excessive centered narrow SaaS layouts.

### Sidebar

Near-term primary navigation stays shallow:

- Today
- Create
- Music
- Brain
- Account

Future navigation may grow deeper as specialist workspaces arrive, but the user must never need to patrol the sidebar to reconstruct current priorities.

Selected item:

- subtle violet horizontal gradient;
- thin violet inset line on left;
- white text;
- no oversized pill.

Bottom of sidebar may contain one compact closed-loop status / product principle card.

## 5. Panels

Base panel:

```text
background: #101216
border: 1px solid #1E2028
radius: 14–18px
```

Nested panel:

```text
background: #0D0F13
border: 1px solid #1E2028
radius: 10–12px
```

Use subtle gradients only to establish hierarchy. Avoid glossy/glass-heavy visual noise.

## 6. Status and attention

Prefer semantic words over fabricated scores:

- READY
- ACTION
- REVIEW
- BLOCKED
- UNKNOWN
- VALIDATED
- DRAFT
- ACTIVE

Use thin status chips and small semantic dots.

Do not introduce global `Career Score`, `Artist Health 87%`, or other pseudo-precise summary numbers.

When readiness matters, prefer concrete state:

```text
RELEASE
5 checks passed · 3 blockers
```

rather than an arbitrary percentage.

## 7. Today / Attention pattern

Today is selective, not a duplicated dashboard.

Recommended hierarchy:

1. **CURRENT FOCUS** — active PlanningObjective when present.
2. **NOW** — one primary next action.
3. **NEXT / REVIEW** — 2–4 secondary attention items.
4. **BLOCKED** — only real blockers.
5. **MEMORY / LEARNING** — one meaningful reusable insight or explicit insufficient-evidence state.
6. compact contextual state cards.

Every recommendation should expose why it exists.

### Attention cards

Default card should remain compact:

```text
HIGH · 15 min
Submit Spotify editorial pitch
Release readiness · due tomorrow

[Start] [Why this?]
```

Do not put full reasoning on the card. Use progressive disclosure.

## 8. Explainability Drawer

`Why this?` should open a right-side drawer using a consistent information order:

### WHY THIS
Concrete present-tense reason the recommendation matters now.

### BASED ON
Compact provenance references such as:
- PlanningObjective;
- owning-domain state;
- validated Learning;
- prior Decision;
- current Identity / Song context;
- deadline / blocker.

### UNCERTAINTY
Use qualitative language backed by known state. Never fabricate confidence precision.

### EXPECTED EFFECT
What completing the action unlocks, resolves or advances.

### WHAT WE MAY LEARN
Only show when the action meaningfully produces evidence. Operational housekeeping may explicitly say `No learning objective — execution blocker.`

The drawer should feel evidential and calm, not like a verbose AI explanation panel.

## 9. Bottleneck / Readiness → Action pattern

Analytics should turn into work.

Preferred bottleneck pattern:

```text
BOTTLENECK
Production

9 approved ContentUnits are waiting.

RECOMMENDED ACTION
Schedule a 60-minute batch shoot

EXPECTED EFFECT
Unlock 5–7 waiting units
```

Preferred readiness pattern:

```text
RELEASE
Blocked

Artwork missing
Spotify pitch incomplete
Smart link unverified

[Resolve blockers]
```

Never show a bottleneck or blocker without a path into a resolvable action/workspace when such a path exists.

## 10. Song Brain / waveform

The approved prototype's waveform treatment is a signature visual pattern.

Use waveform/audio-segment visualization when real song/audio/segment data exists:

- horizontal waveform inside a dark nested panel;
- low visual noise;
- semantic accent color by segment/state where justified;
- segment cards below waveform;
- avoid fake waveform as decoration when no audio data exists.

Song Brain should feel more like an audio-aware creative intelligence surface than a database record form.

## 11. Provenance / Decision lineage

When intelligence history exists, use a compact traversable lineage rather than a generic log.

Example:

```text
EXP-014
   ↓
INS-037
   ↓
LEARN-008
   ↓
DEC-021
   ↓
ACTION-103
```

Use mono typography for IDs, subtle connector lines, restrained semantic accents and hover/click detail.

Do not fabricate missing lineage nodes. Broken or unknown links should be visibly absent rather than inferred for visual completeness.

## 12. Recommendation maturity

Compounding memory should become visible without a fake intelligence score.

Good patterns:

```text
EARLY CONTEXT
Identity · Song Brain · platform knowledge
```

or, when real counts exist:

```text
ARTIST-SPECIFIC EVIDENCE
42 publications · 7 experiments · 5 validated learnings · 12 decisions
```

Maturity is provenance density, not a gamified level.

## 13. Drawers

Use right-side drawers for deep context that should not replace the current working surface:

- recommendation evidence;
- Decision lineage;
- Content Angle detail;
- execution detail summary;
- Candidate Knowledge review;
- contextual help / guidance;
- jobs / long-running work.

Typical width: ~420–480px desktop.

Do not put every CRUD form in a drawer. Drawers are for contextual depth, not entire applications.

## 14. Contextual help and guidance

Prefer small info affordances and contextual explanations over permanent walls of instructional copy.

Help should answer:

- What is this?
- Why does it matter?
- What should I do here?

Where current work reveals a knowledge gap, help may evolve into contextual guidance:

```text
Learn before doing · 6 min
How Spotify editorial pitching works
[Learn] → [Continue to pitch]
```

Keep canonical system `Learning` distinct from human education/guidance.

Product language should describe artist outcomes, not internal architecture unless the user explicitly opens technical provenance/debug information.

## 15. AI UX

AI is a contextual proposal layer.

Primary surfaces should show:

- proposal;
- why;
- based on what;
- uncertainty / blockers;
- expected effect;
- learning opportunity;
- explicit human action.

Do not expose by default:

- token counts;
- prompt text;
- AgentRun IDs;
- model-provider plumbing;
- chain-of-thought.

Technical provenance may be available in developer/debug detail where appropriate.

AI should appear inside the operating system. A chatbot may exist as an optional command surface, but it must not be the required front door.

## 16. Forms

Canonical model richness does not justify giant default forms.

Preferred flow:

`simple intent → system fills context → user reviews → advanced fields on demand`

Example Content Factory default:

```text
What's the idea?
Song
[Develop idea]
```

Goal / audience / identity fit / learning value / effort / platforms can be proposed or progressively disclosed.

## 17. Empty states

Cold start must remain honest and visually intentional.

Good:

`No validated learning yet — Artist OS needs outcome evidence before reusing a pattern.`

Bad:

filling an empty card with generic AI advice to make the interface look complete.

## 18. Motion

Use restrained motion only for:

- drawer transitions;
- loading/progress;
- active selection;
- small attention changes.

Avoid consumer-app animation for its own sake.

## 19. Responsive behavior

Desktop is the primary deep-work surface.

Mobile/PWA should simplify aggressively:

- Today becomes single-column;
- On-Set becomes one-shot-at-a-time;
- review cards stack;
- sidebar becomes compact navigation;
- dense analytical tables should adapt or move to detail views.

## 20. Design anti-patterns

Do not drift toward:

- generic white/gray SaaS dashboards;
- neon cyberpunk overload;
- giant gradient cards everywhere;
- exposing every domain as mandatory primary navigation;
- forcing users to inspect multiple workspaces to reconstruct priorities;
- fake charts with no canonical evidence;
- fake waveform decoration;
- AI chat as the product homepage;
- large mandatory forms mirroring every database field;
- decorative status scores without operational meaning;
- black-box recommendations without `Why this?`.

## 21. Implementation rule

Every new primary UI PR should explicitly state:

1. which product task the screen helps complete;
2. which canonical state it reads/writes;
3. why the information deserves primary-surface visibility;
4. how it follows `Complex system, simple surface`;
5. how it follows this visual direction;
6. how a recommendation exposes reason/evidence/uncertainty when applicable;
7. whether it makes accumulated memory more visible or reusable.
