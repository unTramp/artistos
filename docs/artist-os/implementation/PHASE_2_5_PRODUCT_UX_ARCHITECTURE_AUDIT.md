# Artist OS — Post-Branch Product / UX / Architecture Reconciliation

**Audit baseline:** `main` at `aed1a141117b066c7fa048a46699beae0c36036c`  
**Audit branch:** `audit/phase-2-5-product-ux`  
**Normative architecture:** `MASTER_ARCHITECTURE_v1.4.md`  
**Companion contracts:** `AR-001…AR-062`  
**Secondary contracts:** Full Product Specs → Engineering Specs → implementation plans  
**Reviewed implementation sequence:** PR #8 through PR #23, with PR #7 Stage 0 as the baseline boundary  
**Audit intent:** verify that the vertical implementation created after Stage 0 still matches the frozen Artist OS architecture when reviewed as one evolving system rather than as isolated PRs.

---

## 1. Executive assessment

The implementation after Stage 0 is fundamentally sound. The project did **not** drift into a generic SaaS dashboard, a chatbot wrapper or an AI content generator. The strongest architectural decisions made in PR #8–#23 should be preserved:

- human-controlled material state changes;
- canonical ownership instead of duplicated truth;
- versioned Identity and explicit Era lineage;
- Song Brain epistemic separation;
- Artist Brain as a projection, not a second Identity store;
- Candidate Knowledge as staging/evidence, not permanent truth;
- ContentAngle before ContentUnit commitment;
- versioned execution revisions subordinate to ContentUnit;
- task-specific Context Assembly with provenance and budgets;
- AI proposals remaining non-canonical until explicit user action;
- OperationalAction separated from owning-domain truth;
- deterministic Attention/Today before AI advice;
- Decision Memory as advisory history rather than hard policy;
- canonical Learning separated from human education/guidance;
- immutable Weekly Review artifacts;
- progressive disclosure and honest UNKNOWN state;
- no fake career/intelligence score.

The main risk is **not that Artist OS is too complex internally**. The architecture is intentionally deep. The risk is that some implementation slices are only partially reconciled with later slices, and some early implementation documents still describe pre-freeze or intermediate contracts.

The correct product principle remains:

> **Do not remove useful system depth. Reduce how much of that depth the artist must manually manage at one moment.**

This audit therefore replaces the earlier framing of “simplify modules” with a stricter distinction:

1. preserve canonical/domain depth;
2. repair actual contract gaps;
3. complete missing cross-PR joins;
4. use contextual UX to hide implementation mechanics without hiding useful capability.

### Overall status

| Area | Assessment |
|---|---|
| Stage 0 runtime foundation | **Healthy / preserve** |
| Artist Foundation (#8) | **Strong vertical; one later cross-PR integration gap** |
| Content Factory (#9) | **Strong foundation; intentionally incomplete dependent fields** |
| Product Coherence (#10) | **Correct direction; now superseded by richer Daily OS** |
| Phase 2.5 plan strengthening (#11) | **Product direction strong; document now contains stale contract vocabulary** |
| OperationalAction (#13) | **Strong canonical match** |
| Attention / WHY (#14–15) | **Strong; objective affinity semantics need repair** |
| PlanningObjective (#16–17) | **Useful product slice but canonical schema is incomplete vs MASTER v1.4** |
| Decision Memory (#18) | **Strong canonical match** |
| Learning (#19) | **Strong canonical lifecycle; reuse applicability needs tightening** |
| Weekly Review (#20) | **Correct immutable ritual foundation; missing epistemic labels** |
| Passive Capture (#21) | **Strong product direction; preserve** |
| Contextual Guidance (#22) | **Strong semantic separation; preserve** |
| Command Palette / Maturity (#23) | **Correct polish slice; not the full long-term feature spec** |

---

## 2. Normative interpretation used by this audit

The project must be judged in this order:

```text
MASTER v1.4
↓
AR-001…AR-062
↓
Full Product Specs
↓
Engineering Specs
↓
Implementation plans
↓
PR-specific implementation choices
```

This matters because several implementation-plan phrases are older than the final frozen contract. Where code follows MASTER v1.4 but an implementation plan still contains an older enum, the code is **not** considered wrong; the plan is considered stale.

Likewise, a vertical slice may deliberately defer a dependent feature whose owning domain does not exist yet. That is not automatically a contract violation. The audit distinguishes four classes:

| Class | Meaning |
|---|---|
| **PRESERVE** | Implementation matches the normative design and should not be simplified away. |
| **INCREMENTAL** | Correct bounded slice; broader spec remains intentionally deferred. |
| **DOC DRIFT** | Runtime follows the normative model, but docs still describe an intermediate/old contract. |
| **CONTRACT GAP** | Current persisted/application behavior materially diverges from frozen normative architecture or a MUST-level product contract. |

---

# 3. PR #8 — Artist Foundation vertical

## 3.1 What #8 got right

PR #8 established the first real product vertical:

```text
Artist scope
→ Identity Version
→ Era
→ Song
→ Song Brain
→ Song Identity Context
→ Candidate Knowledge / Tone Corpus
→ approved Artist Brain knowledge
→ Artist Brain snapshot
```

This remains architecturally correct.

### Identity / Era

Preserve:

- one Artist-owned Identity root;
- immutable/versioned Identity versions instead of destructive overwrite;
- explicit human activation;
- one current active Era in the MVP time context;
- Era referencing a concrete Identity Version;
- historical content retaining the identity/era context used at the time.

The Phase 1 slice intentionally did **not** implement the full Identity Engine (archetypes, complete visual DNA, mystique, Brand Book, etc.). That was an explicit scope boundary, not an accidental loss of architecture.

### Song ownership

Preserve the decision that Song owns music/work meaning but not release lifecycle.

The current Song model correctly avoids making `releaseStatus`, release date or UPC canonical Song truth. Release / ReleaseTrack remains a future owner.

### Song Brain epistemic separation

Preserve:

```text
FACT
ARTIST_INTERPRETATION
AUDIENCE_INTERPRETATION
```

This is a high-value trust boundary. Audience interpretation must never silently overwrite artist-confirmed meaning.

### Candidate Knowledge

Preserve Candidate Knowledge as staging/evidence.

A PENDING candidate is not permanent truth. The implemented ARTIST_BRAIN promotion correctly creates a separate durable knowledge item after explicit user acceptance. Other destinations remain blocked until their owning workflow exists.

### Tone Corpus

Preserve canonical labels:

```text
AUTHENTIC
GOOD
NEUTRAL
DO_NOT_COPY
OUTDATED
```

Positive context using only AUTHENTIC/GOOD is correct. DO_NOT_COPY and OUTDATED remaining historical but excluded from positive style context is also correct.

## 3.2 Cross-PR gap discovered after #19 — Artist Brain does not yet compile validated Learnings

This is not a defect in the original #8 decision. At #8 time, the canonical Learning domain did not exist, so `validatedLearnings: []` was a valid explicit placeholder.

However, after PR #19 introduced canonical Learning, `PgKnowledgeWriter.rebuildArtistBrain()` still writes:

```text
hardRules: []
validatedLearnings: []
```

Therefore:

- validated Learnings already affect Content Factory through the Context Assembler;
- but the **versioned Artist Brain snapshot itself** still does not include/summarize them;
- a manual Brain rebuild cannot currently produce the v1.4 projection promised by AR-030 / Artist Brain spec.

### Classification

**CONTRACT GAP created by missing cross-PR reconciliation.**

### Required correction

Artist Brain rebuild should consume eligible validated Learnings using the same safety principles as generation context:

- status = VALIDATED;
- freshness respected;
- scope preserved;
- provenance retained;
- stale/deprecated Learning not presented as active durable context;
- no text or scope fabricated.

This does **not** mean Artist Brain and Learning Memory should be merged. Memory remains the canonical lifecycle/history owner; Artist Brain is a derived operational projection.

---

# 4. PR #9 — Content Factory vertical

## 4.1 Core Content Factory model is strong

The current ContentAngle model correctly preserves a structured concept layer before production commitment.

It includes:

- Song context;
- optional Campaign reference;
- idea;
- pillar;
- mode;
- goal;
- audience;
- platform targets;
- required assets;
- learning value;
- rationale;
- identity-fit rationale;
- production effort;
- explicit human review state.

The ContentUnit state machine matches the MASTER content lifecycle:

```text
IDEA
→ APPROVED
→ SCRIPT_READY
→ TO_SHOOT
→ SHOT
→ EDITING
→ REVIEW
→ READY
→ SCHEDULED
→ PUBLISHED
→ MEASURING
→ ANALYZED
→ ARCHIVED

Additional: BLOCKED | REJECTED | PAUSED
```

This should be preserved.

## 4.2 AI proposal boundary is correct

The AI path is one of the strongest pieces of #9.

The Strategy Agent:

- generates Angle cards, not final captions;
- validates structured output;
- requires `basedOn` references to belong to the assembled allowed-source manifest;
- exposes uncertainty;
- returns fewer candidates rather than knowingly generating filler;
- does not claim rights/publishability/campaign facts absent from context;
- remains usable with provider disabled because manual Factory still works.

AI output becomes canonical only after an explicit USER action, and even then it becomes a **DRAFT ContentAngle**, not an approved production commitment.

The accepted proposal retains AgentRun/artifact/prompt provenance.

### Classification

**PRESERVE.**

## 4.3 Context Assembler is architecturally correct but intentionally partial

The task-specific context pack correctly supports:

- active Identity;
- Song Brain;
- approved knowledge;
- Tone Corpus;
- validated Learnings;
- Campaign slot;
- platform constraints slot;
- production capability slot;
- recent content history;
- source references;
- missing-source disclosure;
- budgets;
- context version.

The current DB reader still returns:

```text
campaign: null
platformConstraints: []
productionCapability: null
```

because those owners are not implemented yet.

This is acceptable incremental behavior because the system explicitly marks missing context rather than inventing it.

### Classification

**INCREMENTAL.**

## 4.4 Learning applicability is too broad for several scopes

After PR #19, `PgContentAngleContextReader` filters:

- SONG Learning by matching Song subject;
- PLATFORM Learning by matching target platform;
- CAMPAIGN Learning is withheld until campaign identity is supported.

But other canonical scopes currently fall through as universally relevant:

```text
PILLAR
FORMAT
AUDIENCE
AUDIO_SEGMENT
NARRATIVE
MARKET
BUSINESS
IDENTITY
```

As memory grows, this can leak a scoped conclusion into unrelated generation.

Example:

`MARKET = Brazil` or `FORMAT = acoustic live` must not automatically behave like global artist truth for every future content request.

### Classification

**CONTRACT GAP / future correctness risk.**

### Required correction

Build explicit applicability predicates per supported scope. Until a target dimension is present in the request, withhold that scoped Learning rather than widening it to artist-global.

## 4.5 Campaign references can currently be dangling

`ContentAngle.campaignId` and `ContentUnit.campaignId` exist as UUID columns without a Campaign FK because Campaign runtime is not implemented.

The current writer validates Song ownership but does not validate a supplied Campaign ID.

The current artist UI does not expose this path, so normal user behavior is not creating invalid Campaign references. However, the API contract can accept an arbitrary UUID.

### Classification

**INCREMENTAL boundary with validation debt.**

### Required correction

Until Campaign ownership exists, either:

- reject supplied campaignId as unsupported, or
- validate against the future canonical Campaign repository once implemented.

Do not allow a temporary cross-domain UUID field to become accepted unverifiable truth.

## 4.6 Execution Package must remain deep

The current execution revision correctly has a versioned snapshot with:

- format;
- production intent;
- hook;
- structure;
- script/performance concept;
- shot list;
- edit brief;
- caption;
- CTA;
- platform notes;
- feasibility;
- fallback;
- rights explicitly UNKNOWN.

Do **not** remove these capabilities to make the screen visually simpler.

The full normative package also expects, when applicable:

- exact Audio Segment / AudioUsage reference;
- critical Identity constraints / approved deviation;
- ProductionCapabilityProfile / known production constraints.

Those owners were intentionally not implemented in #9, so their absence is currently **deferred completeness**, not a reason to flatten the model.

### Correct UX direction

Use contextual depth:

```text
Creative Core
→ Hook / Structure / Performance concept

Production
→ Intent / Shot plan / Audio / Setup

Edit
→ Edit brief / Platform adaptations

Publish prep
→ Caption / CTA

Constraints
→ Identity / Rights / Feasibility / Fallback
```

The system should increasingly prefill these from canonical context. The artist edits/reviews a prepared package rather than manually servicing every field.

## 4.7 Phase 2 governance documentation is incomplete

The implementation folder contains Stage 0 and Phase 1 completion reports, but no equivalent `PHASE_2_CONTENT_FACTORY_COMPLETION_REPORT.md`.

PR #9 itself listed final completion/traceability documentation as a remaining gate before Ready for Review, yet no such final report exists in current `main`.

This does not invalidate the code, but it creates traceability debt around what #9 considered complete versus intentionally deferred.

### Classification

**DOC / GOVERNANCE DRIFT.**

---

# 5. PR #10 — Product Coherence Foundation

PR #10 was directionally correct and should be preserved as the product pivot from “implemented architecture surfaces” into “daily Artist OS”.

It established:

- real signup → onboarding → Artist workspace;
- Today as the front door;
- dark creative-workstation direction;
- shallow primary navigation;
- explicit Product Principles and visual direction;
- demo seed/local workflow cleanup;
- deterministic product usefulness before AI.

Today v0 itself has since been replaced by canonical AttentionProjection, so its temporary direct-read logic is no longer a concern.

Some old specialist pages still pass strings such as `stage="Phase 1 · Artist Foundation"`, but `AppShell` no longer renders the `stage` prop. Therefore this is dead compatibility surface, not current artist-facing leakage.

### Classification

**PRESERVE; optional cleanup only.**

---

# 6. PR #11 — Phase 2.5 decision-intelligence plan strengthening

PR #11 made several important product corrections that remain valid:

- separate user operating loop from intelligence loop;
- `Deep domains, shallow attention` instead of equating architecture with navigation;
- PlanningObjective as focus context;
- recommendation explainability;
- bottleneck/readiness → action;
- prior Decision conflict as advisory, human-overridable memory;
- Decision lineage;
- System Learning vs human Contextual Guidance;
- Weekly Review as decision ritual;
- recommendation maturity without fake score;
- official TODAY / WHY / MEMORY / LEARN product acceptance moments.

These ideas should remain normative product guidance.

## 6.1 The implementation plan now contains stale lifecycle vocabulary

The active Phase 2.5 plan still contains intermediate language that conflicts with MASTER/current runtime.

Examples:

### OperationalAction

Old plan vocabulary:

```text
OPEN | IN_PROGRESS | BLOCKED | COMPLETED | CANCELLED
```

Normative/current runtime:

```text
OPEN | IN_PROGRESS | BLOCKED | DONE | SKIPPED | EXPIRED
```

### Learning

Old plan vocabulary:

```text
CANDIDATE | VALIDATED | STALE | REJECTED
```

Normative/current runtime:

```text
CANDIDATE | TESTING | VALIDATED | STALE | DEPRECATED
```

### Decision

The plan historically used wording that could be read as `SUPERSEDED` being a Decision state. MASTER/current runtime correctly keeps:

```text
ACTIVE | UNDER_REVIEW | REVERSED | EXPIRED
```

with supersession represented through lineage/reference semantics.

Later implementation PRs correctly chose MASTER over the stale plan.

### Classification

**DOC DRIFT.**

### Required correction

Reconcile the Phase 2.5 implementation plan after runtime closure. It should describe what actually shipped and defer to MASTER lifecycles instead of retaining intermediate design language.

---

# 7. PR #13 — OperationalAction Foundation

OperationalAction is one of the cleanest matches to v1.4.

Preserve:

```text
status:
OPEN | IN_PROGRESS | BLOCKED | DONE | SKIPPED | EXPIRED

priority:
LOW | NORMAL | HIGH | URGENT

executionMode:
MANUAL_NATIVE | EXTERNAL | API_ASSISTED | SYSTEM_CHECK
```

It correctly carries source domain/entity, due/not-before timing, optional external URL and completion evidence.

The completion rule also preserves human/evidence control: a non-user actor cannot simply mark work DONE without evidence.

### Remaining product gap

The lifecycle exists in API/core, but artist-facing action controls are incomplete for manual/external actions.

This is a **UI/loop-closure gap**, not a canonical model problem.

### Classification

**PRESERVE canonical model; complete artist-facing lifecycle surface.**

---

# 8. PR #14–#15 — AttentionProjection + Today / WHY

The architectural boundary is correct:

- Attention is rebuildable projection, not canonical truth;
- deterministic domain state and OperationalActions feed projection;
- ranking remains separate from source-domain ownership;
- every item can carry WHY / BASED ON / uncertainty / blockers / expected effect / learning / guidance;
- route knowledge remains outside core;
- WHY uses progressive disclosure rather than turning Today into a wall of explanation.

### Classification

**PRESERVE.**

## 8.1 Objective affinity semantics became weak after #17

`objectiveMatches()` currently behaves as:

```text
RELEASE → exact Release target
CAMPAIGN → exact Campaign target
otherwise ARTIST → matches every OperationalAction
```

Because the current Today editor creates an ARTIST objective, all OperationalActions can receive the same alignment boost.

That makes `Aligned with current objective` less meaningful than the product promise.

This is not primarily a #17 UI problem. ARTIST-level current focus is explicitly valid in MASTER. The issue is the affinity model.

### Required correction

Preserve simple artist-facing focus creation, but add meaningful structured affinity/provenance so an artist-wide objective can still express what work it advances.

Possible future sources include linked Song/Release/Campaign/reference targets or another approved structured target mechanism. Do not infer semantic similarity from free text and call it canonical truth.

### Classification

**CONTRACT / recommendation-quality gap.**

---

# 9. PR #16–#17 — PlanningObjective + Current Focus

The product decision to create a compact Today editor was correct. It avoids exposing the whole Planning domain prematurely and preserves human-controlled completion.

However, the persisted PlanningObjective foundation is not currently the full frozen v1.4 aggregate.

## 9.1 Missing canonical status lifecycle

MASTER v1.4 defines:

```text
status:
DRAFT | ACTIVE | COMPLETED | CANCELLED | ARCHIVED
```

The current implementation has no `status` column or core field. It effectively models state only through `completedAt`.

Consequences:

- no DRAFT objective state;
- no CANCELLED state;
- no ARCHIVED state;
- current/read models infer active state from date + `completedAt` rather than the full canonical lifecycle.

### Classification

**CONTRACT GAP.**

## 9.2 Missing `successCriteria[]`

MASTER v1.4 includes `successCriteria[]` in PlanningObjective.

The current core command and DB schema do not persist it.

The Today form does not need to expose a heavy criteria editor, but canonical persistence should not silently discard a frozen field from the aggregate.

### Classification

**CONTRACT GAP.**

## 9.3 CAMPAIGN / RELEASE references are shape-validated but not existence-validated

The core correctly enforces:

- CAMPAIGN scope requires campaignId;
- RELEASE scope requires releaseId;
- unrelated scopes cannot carry those IDs.

But the writer simply stores the UUID. There is currently no canonical Campaign/Release repository check or FK because those runtimes are absent.

Therefore the API can persist a dangling CAMPAIGN/RELEASE target even though the PR description described “scope/ref validation”.

The current Today UI creates only ARTIST objectives, so normal user flow is not affected yet.

### Required correction

Until the owner domains exist, unsupported target scopes should fail closed rather than accept arbitrary cross-domain UUIDs. Once Release/Campaign exist, validate artist-scoped canonical ownership.

### Classification

**CONTRACT GAP hidden by current UI boundary.**

---

# 10. PR #18 — Decision Memory

Decision Memory is architecturally strong.

Preserve:

```text
ACTIVE
UNDER_REVIEW
REVERSED
EXPIRED
```

Preserve:

- reason/rationale;
- review date;
- generic typed provenance references;
- `decisionKey` for deterministic conflict identity;
- supersession as lineage rather than new status;
- prior-decision conflict as advisory;
- explicit `What changed?` rationale before override;
- atomic reversal + new Decision creation;
- old context/history retained.

This is a good implementation of human-controlled strategic memory.

### Remaining maturity issue

Conflict detection is currently strongest when the workflow supplies a stable `decisionKey`. Manual free-text Decisions cannot magically provide semantic conflict identity.

Future Strategy/Recommendation workflows should supply deterministic topic/context keys where possible rather than asking artists to manually maintain architecture-oriented keys.

### Classification

**PRESERVE; improve automation/UX around conflict identity later.**

---

# 11. PR #19 — Learning Foundation

The canonical lifecycle is correct:

```text
CANDIDATE
TESTING
VALIDATED
STALE
DEPRECATED
```

Preserve:

- scope;
- confidence + rationale;
- supporting / contradicting / subject / context / derived-from references;
- explicit human rationale for VALIDATED;
- freshness;
- no automatic promotion from one result;
- stale/deprecated history retained;
- Learning semantically distinct from Knowledge.

The strongest result of #19 is that validated Learning already feeds later Factory generation through Context Assembler. That is a real compounding-memory loop.

### Cross-PR corrections required

Two issues must be fixed:

1. scope applicability beyond SONG/PLATFORM/CAMPAIGN is currently too broad;
2. Artist Brain snapshot rebuild never adopted validated Learnings after the Learning domain arrived.

### Classification

**PRESERVE canonical Learning; repair integrations.**

---

# 12. PR #20 — Weekly Review

The immutable artifact decision is correct and should not be replaced with a mutable DRAFT/COMPLETED CRUD lifecycle just because a traditional review UI might expect one.

Preserve:

- immutable period snapshot;
- generatedAt;
- configurationVersion;
- source snapshot references;
- rerun creates another artifact;
- deterministic facts work with AI disabled;
- Decision creation requires explicit human action;
- OperationalAction creation requires explicit human action;
- no silent PlanningObjective change;
- no fabricated fatigue/bottleneck signal.

## 12.1 Missing epistemic label is a real contract gap

The Weekly Review spec requires each synthesized statement to be explicitly labelled:

```text
FACT
OBSERVATION
HYPOTHESIS
RECOMMENDATION
```

Current `WeeklyReviewItemInput` stores only:

```text
text
references[]
```

Section grouping (`WHAT_HAPPENED`, `UNCERTAINTIES`, etc.) is not equivalent to an epistemic label.

### Why this matters

The label is not visual decoration. It prevents the OS from presenting an observation or recommendation with the authority of a fact.

### Classification

**CONTRACT GAP.**

### Required correction

Add an explicit epistemic label to persisted WeeklyReview items and generation/UI validation. Deterministic facts should be marked FACT; derived interpretations/recommendations must use their correct label.

## 12.2 Review source breadth is intentionally partial

The full Product Spec eventually expects experiments, narrative coverage, market signals, production needs and performance interpretation.

Current deterministic generation reads implemented canonical sources only:

- Decisions;
- OperationalActions;
- Learnings;
- PlanningObjective.

This is acceptable incremental implementation because missing domains are not fabricated.

### Classification

**INCREMENTAL.**

## 12.3 Recommended next focus does not yet close into PlanningObjective

A `RECOMMENDED_NEXT_FOCUS` item can become a Decision but cannot be explicitly confirmed into a new PlanningObjective from the review ritual.

The user must manually restate it in Today.

### Required correction

Add human-controlled:

```text
Review recommendation
→ Set as current focus
→ confirm fields
→ create canonical PlanningObjective
→ return to Today
```

No silent focus mutation.

### Classification

**PRODUCT LOOP GAP.**

## 12.4 WeeklyReview-sourced actions lose source navigation on Today

OperationalActions created from Weekly Review correctly preserve:

```text
sourceDomain = INTELLIGENCE
sourceEntityType = WeeklyReview
sourceEntityId = <review id>
```

But the current Today route resolver has no WeeklyReview mapping, so it falls back to `/`.

### Required correction

Route:

```text
WeeklyReview → /weekly-reviews/:id
```

Prefer a shared entity-reference route resolver.

---

# 13. PR #21 — Passive Capture + Factory progressive disclosure

This PR should be preserved, not reverted.

It correctly implements:

```text
normal human review
→ durable review/rejection evidence
→ optional low-confidence Learning candidate
→ optional Decision candidate for meaningful identity/tone/visual constraints
```

It explicitly does **not** convert one rejection into permanent truth.

The lightweight Factory draft is also correct:

```text
simple intent
→ optional advanced context
→ omitted context remains explicit UNKNOWN
```

The canonical rich ContentAngle model remains intact.

This is exactly the intended distinction between a deep system and a manageable surface.

### Classification

**PRESERVE.**

---

# 14. PR #22 — Contextual Guidance

This implementation follows the intended semantic boundary well.

Preserve:

- canonical `Learning` = what the system/artist learned from evidence;
- `Contextual Guidance` = optional human education before doing a task;
- no Lesson/LMS root;
- no guidance-created canonical Learning;
- `Need → Learn → Apply` inside the same recommendation context;
- user may skip guidance and execute immediately;
- AI is not required.

### Classification

**PRESERVE.**

---

# 15. PR #23 — Command Palette + Recommendation Maturity

## 15.1 Recommendation Maturity

The maturity implementation is correctly provenance-based rather than score-based.

Preserve descriptive states such as:

```text
FOUNDATION CONTEXT
CONTEXTUAL STATE
WORKFLOW EVIDENCE
ARTIST-SPECIFIC MEMORY
```

The label should remain a statement about direct recommendation provenance, not a general quality or “AI intelligence” score.

### Classification

**PRESERVE.**

## 15.2 Command Palette is a correct Phase 2.5 slice, not the full final feature

Current support includes:

- `⌘K` / `Ctrl+K`;
- static registered commands in one component;
- search;
- arrows / Enter / Escape;
- navigation/workflow launching;
- no hidden domain mutation;
- product telemetry.

The full Product Spec later expects more:

- registry-driven commands;
- contextual commands;
- entity search;
- recent commands;
- disabled reasons/prerequisites;
- context selection/prefill;
- explicit focus restoration/accessibility behavior;
- broader shipped quick actions as domains arrive.

Do not treat the current palette as a failed implementation. It is the correct bounded polish slice for the domains currently shipped.

### Classification

**INCREMENTAL.**

---

# 16. Brain vs Memory — preserve the semantic boundary

The earlier audit recommendation to “unify Brain / Memory navigation” was too broad and is withdrawn.

## Brain answers

> What does Artist OS know/use as operational context about this artist/song/task?

Examples:

- Artist Brain;
- Song Brain;
- Tone Corpus;
- approved Knowledge;
- Research claims / promoted domain knowledge;
- Context Assembly.

## Memory / Intelligence answers

> What happened, what did we infer/test/learn, and why did we decide what we decided?

Examples:

- Evidence;
- Insight;
- Hypothesis;
- Experiment;
- Learning;
- Decision;
- Weekly Review.

Validated/relevant Memory may feed Brain/context. That does not make the two domains equivalent.

### Current IA issue

The semantic split is correct, but global navigation is incomplete:

- `Memory` currently links directly to `/decisions`;
- Learnings also identify themselves under Memory;
- Weekly Review currently identifies under Brain in parts of the UI;
- future Experiments/Insights will also belong to Intelligence/Memory.

### Correct direction

Do **not** merge domain models.

Choose one coherent presentation architecture:

- either a real `/memory` / Intelligence workspace that organizes Decisions, Learnings, Weekly Reviews, Experiments, lineage;
- or a shallower global nav with those as secondary specialist routes.

The decision should be made as IA/product language, not by collapsing canonical ownership.

---

# 17. Artist-facing complexity — preserve capability, remove plumbing

The system often still explains implementation mechanics instead of artist work.

Examples include:

- “canonical” / “read model” / “artist-scoped” language;
- raw entity IDs in provenance;
- manual Decision `scope` / `decisionKey` fields;
- manual Learning source IDs;
- provider/model/token/truncation details in AI proposal surfaces;
- manual Brain rebuild wording;
- browser `window.prompt` for material review actions.

The correction is **not** to remove provenance, scope, versioning or execution detail.

The correction is progressive disclosure:

```text
Artist intent / consequence
↓
workable controls
↓
Why / provenance / constraints
↓
technical/debug detail when explicitly requested
```

This principle should drive future UI work across Brain, Memory, Factory and Execution.

---

# 18. Documentation reconciliation required

The codebase now contains several generations of documentation:

- archived v1.3 assumptions;
- Full Product Specs originally authored against v1.3 references;
- v1.4 MASTER freeze;
- AR companion contracts;
- implementation plans written before all later slices were complete.

Examples of stale documentation already confirmed:

- Phase 2.5 OperationalAction lifecycle wording;
- Phase 2.5 Learning lifecycle wording;
- intermediate Decision supersession language;
- Monthly Objective feature spec still describing the PlanningObjective entity boundary as unresolved even though v1.4 froze it.

### Required rule

Do not rewrite all 181 product specs indiscriminately.

Create a controlled v1.4 documentation reconciliation pass:

1. mark stale pre-freeze open questions resolved by v1.4/AR;
2. update lifecycle vocabulary where MASTER froze it;
3. keep future/deferred product behavior intact;
4. never rewrite a Product Spec merely to match an incomplete current implementation;
5. record current implementation coverage separately from normative product intent.

---

# 19. Revised priority plan

The next phase should not start with cosmetic simplification and should not add another large horizontal domain immediately.

## PR-A — Canonical contract reconciliation

Highest priority because these are actual correctness gaps.

Scope:

- bring PlanningObjective persistence/API to frozen v1.4 contract (`status`, `successCriteria[]`, explicit lifecycle);
- fail closed on unsupported CAMPAIGN/RELEASE references until canonical targets can be validated;
- add WeeklyReview epistemic labels;
- connect eligible validated Learnings into Artist Brain rebuild;
- tighten Learning scope applicability in Context Assembler;
- add regression/integration tests for each corrected contract.

No broad UX redesign in this PR.

## PR-B — Daily OS loop closure

Scope:

- meaningful objective/action affinity;
- Weekly Review → explicit PlanningObjective confirmation;
- compact OperationalAction lifecycle controls for manual/external work;
- WeeklyReview source routing from Today;
- preserve deterministic ranking and owning-domain truth.

## PR-C — Provenance / memory traversal

Scope:

- shared entity-reference resolver;
- human labels instead of raw IDs where possible;
- clickable Learning → Decision → Action / Weekly Review lineage;
- memory refs in WHY only when demonstrably relevant;
- no fabricated lineage.

## PR-D — Intelligence / Brain IA decision

Scope:

- preserve Brain vs Memory semantic boundary;
- decide whether Memory becomes a true workspace/hub;
- align Decisions, Learnings, Weekly Reviews and future Experiments under coherent product navigation;
- keep Today as orchestration layer regardless of nav depth.

## PR-E — Deep-work ergonomics, not feature removal

Scope:

- replace material `window.prompt` flows with contextual forms/drawers;
- move AI provider/model/token plumbing to diagnostics;
- improve Execution authoring into contextual sections/modes;
- keep all useful canonical execution fields;
- progressively add Audio Segment / Identity Constraint / Production Capability context as their owners arrive;
- keep Factory lightweight-draft progressive disclosure from PR #21.

## PR-F — Measurement + documentation reconciliation

Scope:

- complete attention outcome telemetry (completion / skip / relevant dismissal/snooze semantics where canonically appropriate);
- memory reuse telemetry at actual consumption points;
- close Phase 2.5 implementation documentation against shipped runtime;
- add missing Phase 2 Content Factory completion/coverage report or equivalent current-state coverage matrix;
- resolve old v1.3 feature-spec open questions that v1.4 already froze.

---

# 20. Representative product E2E after reconciliation

The strongest acceptance test should prove one continuous system rather than isolated screens:

```text
Create Artist / Identity
→ add Song / Song Brain context
→ set PlanningObjective
→ generate/review ContentAngle with bounded context
→ commit ContentUnit
→ approve execution revision
→ perform/complete OperationalAction
→ create evidence-backed Learning candidate
→ test/validate Learning
→ rebuild/use Artist Brain context
→ Weekly Review labels facts/observations/recommendations correctly
→ commit Decision
→ confirm next PlanningObjective
→ later matching generation/recommendation cites relevant prior memory
→ non-matching scoped memory is excluded
→ Today shows a better next action and can explain WHY
```

This is the product promise:

> Artist OS does not become valuable because it stores more records. It becomes valuable because prior work changes future context and decisions without taking control away from the artist.

---

# 21. Final product position after the post-branch audit

The implementation sequence after Stage 0 was the right strategy: vertical slices created real end-to-end product behavior while preserving ownership boundaries.

The project should **not** respond to current UX roughness by deleting domain depth.

Specifically:

- keep Brain and Memory semantically separate;
- keep the rich ContentAngle model;
- keep the rich Execution Package direction;
- keep Decision/Learning lifecycles and provenance;
- keep explicit UNKNOWN state;
- keep Context Assembler bounded and evidence-aware;
- keep Today selective;
- keep AI proposal-only.

The next work is reconciliation, not simplification:

```text
Frozen contract correctness
→ cross-PR integration
→ operating-loop closure
→ provenance traversal
→ contextual UX
→ broader domains
```

Only after these joins are reliable should Artist OS expand aggressively into the next major horizontal domain.
