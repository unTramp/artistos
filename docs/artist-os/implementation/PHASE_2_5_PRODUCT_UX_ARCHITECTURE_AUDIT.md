# Phase 2.5 — Product / UX / Architecture Audit

**Audit baseline:** `main` at `aed1a141117b066c7fa048a46699beae0c36036c`  
**Normative architecture:** MASTER v1.4  
**Product contracts:** `PRODUCT_PRINCIPLES.md`, `UX_VISUAL_DIRECTION.md`, `PHASE_2_5_DAILY_OS_PLAN.md`  
**Audit intent:** evaluate the implemented Artist OS as one product after completion of the Phase 2.5 Daily OS slices, not as a collection of individually correct PRs.

---

## 1. Executive assessment

Phase 2.5 has a strong architectural foundation and already demonstrates the four intended product moments:

- **TODAY** — deterministic attention exists;
- **WHY** — recommendations expose reason, provenance, uncertainty and expected effect;
- **MEMORY** — Decisions and Learnings are durable, explicit and human-controlled;
- **LEARN** — contextual guidance can be opened inside the current task and returns to execution.

The next work should **not** be another broad horizontal domain. The highest-value work is a coherence pass that closes the operating loop and removes implementation complexity from the artist-facing surface.

The core issue is no longer missing primitives. It is that several implemented primitives are not yet connected tightly enough at the product layer:

`Weekly Review → Decision → Focus → Action → Completion → Result → Learning → later recommendation`

Parts of this loop work independently, but the artist can still fall into gaps between them.

### Audit conclusion

**Architecture:** healthy enough to build on.  
**Domain correctness:** generally strong.  
**Daily OS loop closure:** partial.  
**Artist-facing simplicity:** partial.  
**Navigation coherence:** partial.  
**Evidence/provenance integrity:** strong in data, weaker in traversal UX.  
**Measurement of product outcomes:** partial.

The recommended next phase is a **Product Coherence Closure**, delivered as a small sequence of focused PRs rather than a rewrite.

---

## 2. What should be preserved

The audit does **not** recommend changing these foundations:

1. Human-controlled material decisions.
2. Deterministic Today before AI advice.
3. Unknown over fabricated context.
4. Knowledge and Learning as separate concepts.
5. Immutable Weekly Review artifacts.
6. Explicit ContentAngle approval before ContentUnit commitment.
7. Explicit execution revision approval.
8. Prior Decision conflict as advisory memory, never a hard block.
9. Validated Learning reuse only when scope is relevant and freshness permits it.
10. AI generation as proposal-only with manual fallback.
11. Shallow primary attention surface.
12. Recommendation explainability through progressive disclosure.
13. No universal career score or fake intelligence score.
14. Contextual Guidance as optional capability, not a separate LMS.

These are differentiating product properties and should remain constraints during the cleanup.

---

## 3. Product loop map — current state

### 3.1 Working loops

#### Content creation

`Identity / Song Brain / Knowledge / validated Learning → AI or manual Angle → human review → ContentUnit → execution revision → approval`

This loop is materially real. In particular, `PgContentAngleContextReader` filters validated Learnings by freshness and relevant scope before putting them into generation context. This is a real example of compounding memory rather than decorative memory.

#### Learning to Decision

`Candidate Learning → Testing → Validated → Decision with BASED_ON Learning`

This is canonical, human-controlled and E2E-covered.

#### Weekly Review to Decision / Action

`Canonical state → immutable WeeklyReview → explicit Decision or OperationalAction`

This works and preserves provenance.

### 3.2 Incomplete loop joins

The weakest joins are:

- `Weekly Review → recommended next focus → PlanningObjective`;
- `PlanningObjective → meaningful action affinity` in the current primary UI;
- `OperationalAction → explicit completion` for action types that are not fully resolved by an owning-domain workflow;
- `Decision / Learning memory → later Today recommendation`;
- `OperationalAction result → product telemetry / learning opportunity`;
- raw provenance IDs → useful traversable context.

These joins should be repaired before adding another large domain.

---

# 4. P0 — Close the Daily OS operating loop

## P0.1 Current Focus is not discriminative enough

### Current behavior

`CurrentFocusEditor` creates only:

- `scope = ARTIST`;
- `priority = PRIMARY`.

The core `objectiveMatches()` rule treats an ARTIST objective as matching any OperationalAction.

### Product consequence

For OperationalActions, an ARTIST-level focus gives almost everything the same objective-alignment boost. Therefore:

- the active focus does not meaningfully distinguish release work from unrelated work;
- `Aligned with current objective` can become semantically weak;
- the ranking mechanic is structurally capable of Release/Campaign affinity, but the main UI cannot provide that context.

This was a reasonable boundary when the focus editor was introduced, but it is now a Phase 2.5 coherence gap.

### Recommended change

Add a lightweight **Focus target** step without exposing a generic Planning module.

Suggested artist-facing model:

- `Artist-wide`;
- `Release` — choose a known Release when that domain is available;
- `Campaign` — choose a known Campaign when available;
- `Custom focus` — only if a meaningful target reference can be preserved without free-form architecture IDs.

Do not expose raw `scope`, `campaignId` or `releaseId` inputs.

### Acceptance

- two equally urgent actions with different source targets rank differently when one matches the current focus;
- deadline / hard blocker can still outrank objective alignment;
- WHY explicitly names the matched focus and target;
- no focus silently changes because metrics changed.

---

## P0.2 Weekly Review does not explicitly close into Current Focus

### Current behavior

`RECOMMENDED_NEXT_FOCUS` items can be turned into a Decision, but there is no explicit `Set as current focus` flow from the Weekly Review ritual.

The user must:

1. read the recommended focus;
2. optionally create a Decision;
3. leave Weekly Review;
4. return to Today;
5. manually recreate the same intent as a PlanningObjective.

### Why this matters

The intended loop is:

`Weekly Review → Decision → PlanningObjective / OperationalAction → Today`

The implementation currently stops one interaction too early.

### Recommended change

Add explicit human-controlled action:

**Set as current focus →**

It should open a compact review form prefilled from the Weekly Review item and require confirmation before creating the PlanningObjective.

If a Decision was created first, preserve the Decision relationship where the existing provenance model supports it. Do not invent new canonical fields merely to make the UI look connected.

### Acceptance

- Weekly Review never silently changes focus;
- one explicit confirmation creates the new focus;
- the new focus appears immediately on Today;
- the source Weekly Review remains immutable;
- rerunning Weekly Review does not alter the confirmed focus.

---

## P0.3 OperationalAction has a canonical lifecycle but no first-class artist completion surface

### Current behavior

The API supports:

- start;
- block;
- complete;
- skip;
- expire;
- reopen.

Today can project OperationalActions and route the user to the source entity. However, there is no dedicated artist-facing `/actions` workspace in the reviewed UI.

This is correct for actions whose completion is naturally implied by the owning workflow, but it leaves manual/external OperationalActions without an obvious lifecycle surface.

### Product consequence

An action may be visible in Today indefinitely even after the user actually performed the external/manual work unless another workflow explicitly updates it.

### Recommended change

Do **not** build a generic task manager.

Instead add a compact action-control layer in the existing contextual UI:

- `Start` when useful;
- `Complete`;
- `Block` with a short reason;
- `Skip` with optional rationale;
- `Open source` / `Open external action`.

Show these only for canonical OperationalActions and preserve owning-domain truth boundaries.

For source-domain readiness items that are not OperationalActions, keep the existing `Open owning workflow` behavior.

### Acceptance

- manual/external OperationalAction can be completed from Today without hunting for an invisible API;
- completing the action removes it from active Attention after refresh;
- completion does not mutate foreign-domain truth;
- completion preserves canonical action evidence.

---

## P0.4 WeeklyReview-sourced OperationalActions lose their source destination on Today

### Current behavior

Today resolves known OperationalAction source types to routes such as:

- ContentUnit;
- ContentAngle;
- CandidateKnowledge;
- Identity;
- Song;
- Decision;
- Learning.

`WeeklyReview` is not handled and falls back to `/`.

### Recommended change

Resolve:

`WeeklyReview → /weekly-reviews/:id`

Prefer a shared entity-route resolver rather than adding more page-local `if` statements over time.

### Acceptance

- a WeeklyReview-created action opens its originating review;
- WHY provenance and execution destination point to the same understandable context.

---

# 5. P1 — Make memory visibly improve later recommendations

## P1.1 Today currently displays memory more than it uses memory

### Current behavior

Today reads recent Decisions and validated Learnings, but they are rendered in the `What compounds` memory panel. They are not passed into `AttentionProjectionService`.

Therefore a Today item can currently be:

- based on current domain state;
- based on OperationalAction provenance;
- objective-aligned;

but not directly based on a relevant Decision or Learning unless that memory has already changed source-domain state elsewhere.

### Important nuance

This is **not** a claim that memory reuse is absent from Artist OS.

Validated Learnings are already reused in ContentAngle generation context with freshness and scope filtering. That implementation should be preserved.

The gap is specifically the Daily OS recommendation layer.

### Recommended change

Introduce a bounded **recommendation memory context** rather than globally injecting all memory into every Attention item.

Rules:

- only attach a Decision/Learning when relevance can be demonstrated;
- preserve direct provenance in `basedOn`;
- stale/deprecated memory must not influence recommendations as active truth;
- a prior Decision conflict should be disclosed, not silently suppress the action;
- do not convert memory presence into a numeric score.

### Acceptance example

1. Artist rejects a content strategy repeatedly.
2. Evidence becomes a validated scoped Learning and/or active Decision.
3. A later recommendation touches the same song/platform/creative context.
4. WHY shows the relevant memory reference and explains whether the new action respects or deliberately re-tests it.
5. Changing context can justify re-testing through human override.

---

## P1.2 Add an E2E that proves memory changes a later proposal

Current E2E coverage proves:

`Learning → validation → Today visibility → Decision lineage`

It does not yet prove the stronger product promise:

`Learning → later recommendation/proposal actually uses that memory`.

### Recommended E2E

A representative deterministic integration/E2E should:

1. create a scoped Learning;
2. validate it;
3. invoke a later context assembly / proposal workflow in matching scope;
4. assert the Learning appears in the source manifest / proposal `basedOn` evidence;
5. assert a non-matching Song/Platform Learning does not leak into the proposal.

This becomes the canonical compounding-intelligence acceptance scenario.

---

## P1.3 Memory Reuse telemetry is not closed around the reviewed generation path

`MEMORY_REUSED` exists as a telemetry event name, but the reviewed ContentAngle generation route/service does not emit product telemetry when validated Learnings are included in context.

### Recommended change

Measure memory reuse at the moment a reusable memory item is actually consumed by a user-facing workflow, using metadata only:

- memory type;
- count;
- target workflow;
- target scope;
- no private text duplication.

Do not make telemetry another source of domain truth.

---

# 6. P1 — Remove architecture leakage from the artist-facing UX

The system currently explains its implementation more often than the artist needs.

This is the most repeated UX issue in the reviewed surfaces.

## 6.1 Examples of architecture leakage

### Identity

Artist-facing copy includes concepts such as:

- structured source of truth;
- artist-scoped;
- idempotent;
- canonical state;
- read model refreshed.

### Songs

The main Songs page explains that release lifecycle belongs to `Release / ReleaseTrack` and explicitly mentions `MASTER v1.4`.

### Brain / Knowledge

Primary UX exposes:

- versioned projection;
- canonical sources;
- `AR-062` lifecycle wording;
- promoted entity terminology;
- manual `Rebuild Artist Brain snapshot`.

### Execution

Primary UX exposes:

- canonical concept;
- canonical revision state;
- raw Identity / Era IDs;
- snapshot ownership language.

### AI Content Angle proposals

The artist can see:

- provider;
- model;
- token estimate;
- truncation/pruning state.

These are useful diagnostics but violate the approved product rule that internal AI/runtime plumbing should not be part of primary artist UX.

### Decision / Learning

Manual forms expose architecture-oriented fields such as:

- Decision `scope` as free text;
- `decisionKey` / Topic key;
- Learning `Source type`;
- Learning raw `Source ID` / canonical entity ID.

### Recommended change

Create an **artist-facing language pass** with one rule:

> Primary UX describes intent, creative state and consequence. Provenance/debug details remain available through progressive disclosure.

Examples:

- `Canonical source` → `Current source` / `Approved version`;
- `Source ID` → choose an existing piece of work/evidence, not type an ID;
- `Rebuild Artist Brain snapshot` → automatic rebuild after meaningful memory changes, or move manual rebuild to diagnostics;
- provider/model/token details → diagnostics drawer, not proposal result header.

Do not remove provenance from the system; change where and how it is exposed.

---

# 7. P1 — Replace browser prompts with workstation-grade contextual forms

`window.prompt` is still used in several important workflows:

- Factory defer/reject context;
- passive Decision candidate capture;
- Learning validation/stale/deprecate rationale;
- Learning → Decision;
- Weekly Review → Decision;
- Weekly Review → OperationalAction.

### Why this matters

These are material decisions and evidence-capture moments. Browser prompts:

- break visual consistency;
- cannot show source context beside the form;
- make structured rationale difficult;
- feel prototype-grade compared with the rest of the workstation UI.

### Recommended pattern

Use the existing right-side drawer pattern:

`context → proposed outcome → rationale → confirm`

For prior-decision/override style choices, support structured `What changed?` categories where relevant:

- Market;
- Song;
- Audience;
- Creative;
- Platform;
- Timing;
- Other.

Keep a free-text explanation for nuance.

---

# 8. P1 — Navigation / information architecture is no longer fully coherent

## Current primary nav

- Today;
- Create;
- Music;
- Brain;
- Memory;
- Account.

The approved near-term visual direction specified:

- Today;
- Create;
- Music;
- Brain;
- Account.

At the same time:

- Decisions and Learnings use `Memory` as active primary nav;
- Weekly Review uses `Brain` as active primary nav;
- Identity also resolves under Brain through shell mapping.

This makes the conceptual boundary between Brain and Memory unclear.

### Recommended direction

Restore shallow primary navigation and use **secondary workspace navigation** inside Brain.

Recommended primary sidebar:

- Today;
- Create;
- Music;
- Brain;
- Account.

Possible Brain sub-navigation:

- Knowledge;
- Decisions;
- Learnings;
- Weekly Review.

Identity may remain a contextual/deep workspace reachable from Brain, Today and Command Palette.

This keeps domain depth available without forcing every intelligence primitive into the global sidebar.

Do not finalize labels purely from architecture names; test them as artist concepts.

---

# 9. P1 — Provenance is strong in data but weak in traversal UX

## Decision detail

Decision references are rendered mostly as raw IDs. `supersedesDecisionId` is clickable, but generic references are not resolved into understandable destinations.

## Weekly Review

Review references are rendered as strings such as:

`refType:refId`

### Product consequence

The system technically has lineage, but the artist still has to interpret database-like identifiers instead of following the story:

`Learning → Decision → Action`

### Recommended change

Introduce one shared presentation primitive:

`EntityReferenceLink`

Responsibilities:

- resolve supported entity type to route;
- render human label/title when available;
- preserve compact mono ID only as secondary provenance detail;
- fail closed when an entity type has no route;
- be reusable in WHY drawer, Decision detail, Weekly Review and future lineage surfaces.

Do not fabricate labels if the referenced entity cannot be resolved.

---

# 10. P1 — Passive memory can be captured repeatedly without a visible semantic guard

The Factory passive-memory UI continues to surface every rejected angle with a rejection reason as a capture candidate.

Learning persistence creates independent Learning IDs and does not enforce semantic uniqueness by source ContentAngle reference.

Idempotency protects one request key, but it is not a semantic duplicate rule across refreshed sessions.

### Risk

A user can repeatedly create equivalent Learning candidates from one rejection and inflate memory noise.

### Recommended change

Before offering `Capture Learning candidate` / `Review Decision candidate`:

- check whether a live candidate/reference already exists for this ContentAngle + capture kind;
- show `Captured as candidate` with a link instead of another create button;
- permit another capture only through an explicit `Capture another interpretation` path if there is a legitimate different statement.

This should be implemented as product semantics, not only UI button disabling.

---

# 11. P1/P2 — Progressive disclosure should extend beyond Factory draft creation

Factory draft creation improved substantially, but the same principle is not yet consistent across specialist workspaces.

## Execution

The execution revision editor asks for many fields at once:

- format;
- intent;
- hook type/text;
- structure;
- performance concept;
- shot list;
- edit brief;
- caption;
- CTA;
- platform notes;
- feasibility;
- fallback.

### Recommended execution UX

Primary step:

1. Format / production intent.
2. Hook.
3. Structure / performance concept.
4. Shoot plan.

Secondary / advanced:

- caption / CTA;
- per-platform notes;
- fallback;
- detailed feasibility.

Preserve the rich canonical snapshot; simplify the default editing path.

## Factory workspace

The page currently combines:

- operating principles;
- AI proposals;
- manual draft creation;
- review queue;
- passive memory;
- angle library;
- production units.

The next UX pass should organize this into one coherent workflow without adding more global navigation.

Possible internal grouping:

- `Create`;
- `Review`;
- `In production`;
- `Library`.

This can be tabs/segmented local navigation or context-sensitive sections; it should not become four new sidebar domains.

---

# 12. P2 — Command Palette language sometimes promises an action but only navigates

The palette intentionally has a safe launcher-only boundary, which is good.

However labels such as:

- `Run Weekly Review`;
- `Add song`;
- `Create content angle`

currently navigate to the relevant workspace rather than performing or opening the exact action state.

### Risk

The verb implies execution while behavior is navigation.

### Recommended options

Either:

1. rename to explicit navigation (`Open Weekly Review`, `Open Add Song`, `Open Content Factory`); or
2. deep-link to a workspace state that opens the intended form, while still requiring the human to submit.

Do not turn the palette into hidden mutation automation.

---

# 13. P2 — Product telemetry does not yet measure the full MVP loop

Current telemetry covers useful interaction signals such as:

- WHY opened;
- action opened;
- passive candidate capture;
- contextual guidance opened/applied;
- Command Palette opened/executed.

The Phase 2.5 plan also calls for:

- attention completion;
- dismiss;
- snooze;
- Memory Reuse Rate;
- Automatic Context Capture Ratio;
- prior-decision conflict detection / override rate / outcome.

### Gaps

There is no complete product-level measurement path for several of these metrics yet.

### Recommended principle

Prefer canonical domain events where they already represent the truth:

- OperationalAction completion should be measured from canonical lifecycle state, not duplicated as a fake product state;
- Decision conflict/override should derive from Decision evidence;
- telemetry should record interaction/context only when canonical events cannot answer the product question.

Build metrics from both canonical events and lightweight telemetry rather than adding redundant truth tables.

---

# 14. P2 — The Phase 2.5 implementation plan contains stale canonical vocabulary

`PHASE_2_5_DAILY_OS_PLAN.md` is still marked **Active implementation plan**, but it contains pre-implementation lifecycle wording that no longer matches MASTER v1.4 / merged code.

Examples:

### OperationalAction

Plan text:

`OPEN | IN_PROGRESS | BLOCKED | COMPLETED | CANCELLED`

Implemented canonical lifecycle:

`OPEN | IN_PROGRESS | BLOCKED | DONE | SKIPPED | EXPIRED`

### Learning

Plan text:

`CANDIDATE | VALIDATED | STALE | REJECTED`

Implemented MASTER-aligned lifecycle:

`CANDIDATE | TESTING | VALIDATED | STALE | DEPRECATED`

### Risk

A future Codex/engineer can treat an “Active” plan as current implementation guidance and accidentally reintroduce obsolete enums.

### Recommended change

After the product-coherence closure sequence is agreed:

- mark completed Phase 2.5 slices as implemented;
- reconcile stale lifecycle vocabulary with MASTER v1.4;
- preserve historical intent without presenting obsolete contracts as active requirements;
- explicitly state that MASTER v1.4 wins on any remaining mismatch.

This is documentation reconciliation, not an architecture revision.

---

# 15. P2 — Song Brain visual maturity should wait for real audio data

Current Song Brain is structurally useful but still feels more like a knowledge workspace than audio-aware creative intelligence.

The visual direction calls waveform/segment visualization a signature pattern, **only when real audio/segment data exists**.

### Recommendation

Do not add a decorative waveform.

When real audio/timing/segment evidence is implemented, introduce:

- real waveform;
- named/typed audio segments;
- segment-level creative hooks / interpretations;
- lineage from segment evidence into content/recommendations.

Until then, the current absence of waveform is preferable to fake audio UI.

---

# 16. P2 — Manual Brain rebuild is a technical maintenance concept

`Rebuild Artist Brain snapshot` is visible as a primary artist command.

### Recommended behavior

A projection should normally rebuild automatically after relevant human-approved memory changes, or be refreshed lazily when read.

If manual rebuild remains useful for debugging/operations, move it behind technical diagnostics / provenance controls rather than requiring the artist to understand projection maintenance.

---

# 17. Four WOW moments — post-audit assessment

## TODAY — strong foundation, prioritization needs one correction

Works:
- deterministic attention;
- Current Focus visible;
- blockers and actions surfaced;
- one primary action is clear.

Needs:
- target-aware focus so objective alignment is meaningful;
- action lifecycle closure for manual/external actions.

## WHY — strongest Phase 2.5 surface

Works:
- reasons;
- based-on refs;
- uncertainty;
- expected effect;
- learning opportunity;
- basis maturity;
- optional guidance.

Needs:
- more human-readable/traversable provenance.

## MEMORY — strong canonical model, weaker integration

Works:
- Decision history;
- conflict/override;
- Learning lifecycle;
- validated Learning reuse in Factory context;
- Weekly Review artifacts.

Needs:
- memory should affect later relevant Today recommendations, not only appear in a side panel;
- manual memory forms should stop asking artists for raw IDs and internal keys.

## LEARN — complete enough for current slice

Works:
- contextual micro-guidance;
- optional;
- same drawer;
- returns to original action;
- AI-independent.

Needs:
- content expansion only when tied to real tasks; do not grow into a generic course library.

---

# 18. Recommended implementation sequence

The following sequence minimizes architectural churn and maximizes user-visible improvement.

## PR-A — Close the Daily OS loop

**Working title:** `feat: close Daily OS focus and action loop`

Scope:

- meaningful PlanningObjective target affinity;
- explicit Weekly Review `Set as current focus` confirmation;
- WeeklyReview source routing from OperationalAction;
- compact OperationalAction lifecycle controls for manual/external action types;
- E2E: Weekly Review → Focus → Today → Action → Complete → attention disappears.

Do not redesign the entire Planning domain.

---

## PR-B — Make memory affect relevant recommendations

**Working title:** `feat: connect scoped memory to recommendation context`

Scope:

- bounded relevant Decision/Learning context for Attention/recommendation assembly;
- no global memory injection;
- conflict disclosure where applicable;
- direct memory provenance in WHY;
- `MEMORY_REUSED` measurement at actual reuse points;
- E2E showing validated memory influencing a later matching proposal/recommendation and not leaking into a non-matching scope.

---

## PR-C — Artist-facing language + provenance UX

**Working title:** `refactor: simplify artist-facing intelligence UX`

Scope:

- remove MASTER/AR/idempotency/canonical/read-model wording from primary UI;
- hide provider/model/token details from normal AI results;
- replace raw provenance IDs with `EntityReferenceLink` / human labels;
- remove raw DecisionKey and source-ID maintenance from primary forms;
- replace browser prompts with contextual drawers/forms;
- preserve technical detail in provenance/diagnostics disclosure.

---

## PR-D — Restore shallow navigation coherence

**Working title:** `refactor: unify Brain and Memory navigation`

Scope:

- restore primary nav to `Today / Create / Music / Brain / Account` unless product review explicitly changes the visual contract;
- add local Brain navigation for Knowledge / Decisions / Learnings / Weekly Review;
- make active navigation state coherent across those pages;
- keep Command Palette as the fast cross-domain launcher.

---

## PR-E — Specialist workspace progressive disclosure

**Working title:** `refactor: simplify Factory and execution workspaces`

Scope:

- organize Factory around Create / Review / In production / Library;
- simplify execution revision default path;
- keep advanced fields accessible;
- add semantic guard for already-captured passive memory;
- no canonical schema reduction.

---

## PR-F — Phase 2.5 measurement + documentation reconciliation

**Working title:** `docs: close Phase 2.5 contracts and measurement`

Scope:

- reconcile stale plan enums;
- mark implemented slices accurately;
- document product metric derivation from canonical state + telemetry;
- add the final representative Daily OS E2E acceptance path;
- declare Phase 2.5 complete only after PR-A through the agreed subset above are green.

---

# 19. Recommended representative E2E after coherence closure

One final product-level test should stop testing features in isolation and prove Artist OS as an operating system.

Suggested scenario:

1. Sign up and onboard.
2. Activate Identity.
3. Add a Song / Song Brain context.
4. Create and reject an Angle with a meaningful reason.
5. Capture candidate Learning from normal work.
6. Validate after evidence/test setup.
7. Generate a later matching proposal and verify the validated Learning is reused.
8. Commit a Decision.
9. Generate Weekly Review.
10. Confirm recommended next focus into PlanningObjective.
11. Return to Today.
12. Verify the relevant action ranks higher because of target-aware focus.
13. Open WHY and verify real provenance/memory.
14. Open contextual Learn and return.
15. Complete the OperationalAction.
16. Verify it leaves active attention without mutating unrelated domain truth.

This is the product-level proof of:

`Context → Focus → Action → Result → Learning → Decision → Reuse → Better Next Action`

---

# 20. Exit criteria for Phase 2.5

Phase 2.5 can be considered product-coherent when all of the following are true:

- [ ] Current Focus meaningfully changes ranking for a relevant target.
- [ ] Weekly Review can explicitly create/confirm the next Current Focus.
- [ ] Manual/external OperationalActions have a human completion path.
- [ ] WeeklyReview-sourced actions return to their source review.
- [ ] At least one later Today recommendation directly cites relevant Decision/Learning memory.
- [ ] A representative E2E proves memory reuse affects later work.
- [ ] Primary artist UX no longer asks for raw canonical IDs in normal flows.
- [ ] Browser prompts are removed from material decision/review rituals.
- [ ] Provenance references are traversable where a supported route exists.
- [ ] Primary navigation has one coherent Brain/Memory model.
- [ ] Attention completion and Memory Reuse Rate are measurable from canonical state + telemetry.
- [ ] Active implementation docs use current MASTER v1.4 lifecycle vocabulary.
- [ ] No fake waveform, fake evidence, fake maturity score or fabricated lineage is introduced during polish.

After these conditions, expanding into another large horizontal domain becomes substantially safer because the existing core will behave like one coherent operating system rather than a set of correct but loosely joined workspaces.
