# Command Palette & Quick Actions

## 1. Metadata

- **Spec ID:** `OVR-CMD`
- **Domain:** `01_overview_command_center`
- **Feature:** Command Palette & Quick Actions
- **Status:** REVIEW
- **Owner:** Product / Artist OS Core
- **MASTER references:** 20, 354–356, 365–367, 370, 383–391, 403
- **Depends on:** app routing, entity search/index, permission/action registry, source-domain create flows
- **Used by:** all desktop workflows; selected mobile quick capture flows

### 1.1 Normative basis

MASTER explicitly defines `⌘K` quick actions: New Idea, Add Song, Record Voice Note, Start Shoot, Generate Angles, Import Assets, Import Metrics, Create Experiment and Run Weekly Review. This spec makes those actions safe, contextual and extensible without turning the palette into a privileged bypass around domain validation.

---

## 2. Purpose

Provide a low-friction keyboard-first way to navigate Artist OS and start common workflows from anywhere while preserving all domain validation and approval boundaries.

---

## 3. User problem / job-to-be-done

**JTBD:** “When I know what I want to do, let me start it immediately without navigating through several sections.”

---

## 4. Scope

### In scope

- open global palette;
- route navigation;
- search key entities;
- start approved quick-create/capture workflows;
- contextual commands;
- recent commands;
- keyboard navigation;
- safe disabled-state explanations.

### Out of scope

- arbitrary natural-language agent with unrestricted tools;
- direct destructive commands;
- bypassing validation/approval;
- shell/terminal command execution;
- bulk data mutation.

---

## 5. Entry points

- Desktop: `⌘K` on macOS / `Ctrl+K` on Windows/Linux.
- Header button/icon.
- Mobile: optional compact `Quick Add` surface; full keyboard palette is desktop-first.

---

## 6. Preconditions and dependencies

- current artist context loaded;
- route/action registry available;
- contextual commands know current route/entity where applicable;
- source workflows can accept prefilled context.

Palette must still open when AI is unavailable.

---

## 7. Information architecture

```text
Command Palette
├─ Search input
├─ Suggested / contextual commands
├─ Create / Capture
├─ Navigate
├─ Recent
└─ Search results
```

### Core commands from MASTER

```text
New Idea
Add Song
Record Voice Note
Start Shoot
Generate Angles
Import Assets
Import Metrics
Create Experiment
Run Weekly Review
```

Additional safe navigation commands may include:

```text
Open Overview
Open Identity
Open Songs
Open Pipeline
Open Calendar
Open Assets
Open Analytics
Open Knowledge
Open Decisions
```

---

## 8. User roles and permissions

MVP single user can see all valid commands for the current artist. Future roles must filter commands through the same source-domain permission rules.

---

## 9. Core data model

Command definitions should be registry-driven rather than hardcoded across UI components.

```text
CommandDefinition
id
label
keywords[]
category
shortcut?
icon?
requiresContext[]
availabilityPredicate
disabledReason?
actionType: NAVIGATE | OPEN_FLOW | CAPTURE | SAFE_ACTION
route?
handlerKey?
```

Recent command history is UX state and should not become domain data.

---

## 10. Main happy-path workflow

1. User presses `⌘K`.
2. Palette opens with contextual and recent actions.
3. User types query or navigates with keyboard.
4. System filters commands/entities locally/quickly.
5. User selects `Generate Angles`.
6. If current Song/Campaign context is available, it is prefilled.
7. Source Content Factory flow opens.
8. Factory validates prerequisites and owns subsequent actions.
9. Palette closes and records non-sensitive recent usage telemetry.

---

## 11. Alternative workflows

### Missing prerequisite

Command can be disabled with explanation and a prerequisite action, or open source flow that handles missing context. Example: `Start Shoot` with no shoot plan may open Shoot creation rather than fail.

### Contextual entity search

Typing a song name may show `Open song` and context-valid actions like `Generate angles for <song>`.

### Mobile

Use a curated Quick Add sheet for capture-heavy commands, not a cramped replica of desktop palette.

---

## 12. User actions

- open/close palette;
- type/search;
- select command;
- navigate results;
- open entity;
- start create/capture flow;
- choose context if ambiguous.

Palette itself should not finalize source-domain destructive/approval-required operations.

---

## 13. State model

Presentation states:

```text
CLOSED
OPEN_IDLE
SEARCHING
CONTEXT_SELECTION
EXECUTING_SAFE_NAVIGATION
ERROR
```

Long-running source operations leave the palette and use their normal job/progress UI.

---

## 14. Business rules

- **OVR-CMD-001** — `⌘K` / `Ctrl+K` MUST open the global command palette on desktop unless focus is inside a component that explicitly reserves the shortcut for an accessibility-safe reason.
- **OVR-CMD-002** — The palette MUST include all MASTER-defined core quick actions when their source features exist in the build.
- **OVR-CMD-003** — Commands MUST delegate validation and mutation to source-domain workflows; the palette cannot bypass domain rules.
- **OVR-CMD-004** — Publishing, destructive deletion, permanent knowledge promotion, identity activation/change and spend MUST NOT execute directly from a single palette selection.
- **OVR-CMD-005** — Contextual commands MAY prefill Artist/Song/Campaign/Identity context but MUST show or allow correction when ambiguity exists.
- **OVR-CMD-006** — A disabled command MUST explain why it is unavailable when the reason is actionable.
- **OVR-CMD-007** — Palette search MUST prioritize exact command/entity matches before fuzzy low-confidence matches.
- **OVR-CMD-008** — Entity search results MUST be scoped to current artist in single-artist context.
- **OVR-CMD-009** — AI availability MUST NOT be required to navigate or find registered commands.
- **OVR-CMD-010** — Commands that invoke AI MUST open the relevant source workflow with its context/approval model rather than silently generating/persisting output in the palette.
- **OVR-CMD-011** — Recent commands MUST not expose sensitive internal-canon content in labels/history.
- **OVR-CMD-012** — Keyboard navigation MUST support arrows, Enter and Escape with predictable focus restoration.
- **OVR-CMD-013** — The palette MUST be extensible through a command registry so new domains do not require ad-hoc global UI logic.
- **OVR-CMD-014** — Search failure or indexing degradation MUST NOT prevent static core command access.
- **OVR-CMD-015** — Command execution telemetry MUST distinguish command selection from completion of the downstream workflow.
- **OVR-CMD-016** — Quick capture actions MUST minimize required fields and defer optional enrichment where MASTER low-friction principle applies.

---

## 15. AI behavior

The command palette itself should use deterministic/fuzzy search first.

Optional future natural-language interpretation may map phrases to a **bounded list of registered commands**, but it must not create free-form tool access.

If used:

```text
input: user query + registered commands + current route context
output: candidateCommandIds[] + confidence
```

Low confidence falls back to normal search results.

---

## 16. Human approval

The palette can start workflows but cannot reduce the approval level of the target action.

---

## 17. Validation

- command exists and enabled;
- route/handler exists;
- referenced entity belongs to current artist;
- prefilled IDs resolve;
- action registry and UI label match current feature availability.

---

## 18. UI states

- Empty query: contextual + recent commands.
- No results: show static core categories / “No matching command.”
- Disabled: visible with reason if useful.
- Loading entity search: commands remain usable.
- Index error: degrade to registered static commands.

---

## 19. Edge cases

- Same keyboard shortcut used by browser/input: respect focused editor semantics where necessary.
- User is in On-Set mobile workflow: global palette should not disrupt critical large-control interaction; Quick Add may be disabled/simplified.
- Song names collide: show distinguishing metadata.
- Archived entity appears in search: either exclude by default or label archived; never silently act as active context.
- Feature deferred/not shipped: command is not registered rather than showing dead UI.

---

## 20. Cross-module effects

No domain mutation is owned by the palette. It emits navigation/start-flow events and passes explicit context to destination flows.

---

## 21. Notifications and attention model

Attention items may expose `Open via Command Palette` only as navigation convenience. Palette is not an alert surface.

---

## 22. Search / filtering / sorting / bulk actions

Ranking preference:

1. exact command match;
2. exact entity match;
3. prefix/keyword match;
4. contextual command;
5. recent/fuzzy match.

No bulk mutation actions in MVP palette.

---

## 23. Analytics and product telemetry

```text
command_palette_opened
command_query_changed
command_selected
command_disabled_clicked
command_context_changed
command_downstream_started
```

Measure command-selection latency and downstream completion separately.

---

## 24. Learning feedback

Command usage can improve UX ranking/recent items but must not influence artist creative learnings.

---

## 25. Auditability / provenance

Navigation does not need domain audit. Starting consequential downstream workflow is audited by that source feature. Palette telemetry stores command ID, not sensitive free-text content beyond privacy-safe analytics policy.

---

## 26. Desktop / mobile behavior

Desktop-first full palette. Mobile uses a reduced Quick Add / quick navigation sheet oriented around Voice Note, Idea, Asset capture, Shoot and approvals.

---

## 27. Accessibility / usability

- focus trap while open;
- Escape closes and returns focus;
- screen-reader labels for category/result;
- no keyboard-only inaccessible action;
- selection remains visible when scrolling results.

---

## 28. Security / privacy / rights

- no secrets/tokens in searchable labels;
- no cross-artist entity leakage;
- sensitive internal narrative text should not be indexed into quick search unless explicitly safe.

---

## 29. Performance / async jobs

Palette should open immediately. Static command filtering is client-side or cached. Entity search can be debounced. Long-running work is never executed inside the palette; it transitions to source-domain job UI.

---

## 30. Acceptance criteria

1. `⌘K` opens the palette on desktop and Escape closes it with focus restoration.
2. All shipped MASTER core actions are discoverable.
3. `Generate Angles` from a Song context prefills that Song but allows correction.
4. Selecting a create command does not bypass source validation.
5. Publishing/destructive actions are not executable directly from one palette selection.
6. If entity search fails, static navigation/create commands still work.
7. Archived entities are not mistaken for active entities.
8. A disabled action explains actionable missing prerequisites.
9. AI outage does not break palette search/navigation.
10. Mobile receives a simplified quick-action surface rather than dense desktop UI.

---

## 31. Test matrix

### Unit
- command availability;
- ranking;
- artist scoping;
- recent command filtering.

### Integration
- route registration;
- Song/Campaign prefill;
- downstream create flows.

### E2E
- open palette → Add Song;
- current Song → Generate Angles;
- missing prerequisite → explanation/source flow;
- failed search index → static command fallback.

### Accessibility
- keyboard-only complete interaction;
- screen reader result announcement;
- focus restoration.

---

## 32. Open questions

1. Whether global entity search is part of v1 MVP or only command navigation; recommended: lightweight Song/Campaign search once those lists exist.
2. Whether mobile needs a search palette at all; recommended MVP: Quick Add sheet only.

---

## 33. Traceability

| Product requirement | MASTER v1.3 |
|---|---|
| OVR-CMD-001–002 | 365 |
| OVR-CMD-003–004, 010 | 20, 365 |
| OVR-CMD-006, 016 | 366 |
| OVR-CMD-013 | 354–356 |
| OVR-CMD-012 | 370 + usability derivation |
| Security/scoping | 383–391 |
| MVP presence | 403 |
