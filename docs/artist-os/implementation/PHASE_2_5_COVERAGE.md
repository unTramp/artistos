# Phase 2.5 — Runtime & Measurement Coverage

**Baseline:** MASTER v1.4 + AR-001…AR-062  
**Runtime baseline:** `main@0bb22633b47baed7798ce87830f3daf80d4219fe` + PR-F measurement closure  
**Purpose:** record what Phase 2.5 actually ships, how it is proven, what is measured, and what remains intentionally deferred.

## Product loop coverage

| Capability | Runtime state | Proof / owner | Phase 2.5 status |
| --- | --- | --- | --- |
| Today attention orchestration | Deterministic Attention projection over canonical state + OperationalActions | `attention-projection.ts`, Today E2E | COMPLETE |
| Current Focus | Canonical PlanningObjective with lifecycle, criteria and bounded related refs | PR #25/#26 | COMPLETE |
| OperationalAction loop | Start / Done / Block / Reopen for human/external actions | Daily OS loop E2E | COMPLETE |
| WHY / provenance | Human-readable traversable refs; unresolved refs fail soft | PR #27 | COMPLETE |
| Decision Memory | Canonical lifecycle, conflict guard, reversal/supersede lineage | PR #18 | COMPLETE |
| Learning Memory | CANDIDATE → TESTING → VALIDATED → STALE → DEPRECATED | PR #19 | COMPLETE |
| Weekly Review | Immutable epistemically-labelled decision ritual | PR #20/#25/#26 | COMPLETE |
| Brain vs Memory IA | Brain = current usable context; Memory = historical learning/decisions/reviews | PR #28 | COMPLETE |
| Contextual Learn → Apply | Optional micro-guidance attached to real attention items | PR #22 | COMPLETE |
| Command Palette | Navigation / launcher only; no hidden mutations | PR #23 | COMPLETE |
| Deep-work ergonomics | Contextual review forms + sectioned execution authoring | PR #29 | COMPLETE |

## Content Factory current-state coverage

| Slice | Current behavior | Boundary |
| --- | --- | --- |
| Manual Content Angle draft | Lightweight required surface + advanced progressive disclosure | Missing context remains explicit UNKNOWN |
| AI Angle proposal | Bounded Context Pack + source manifest + schema validation | Manual path remains canonical fallback when AI is unavailable |
| Angle review | Approve / Reject / Defer | Review evidence stays in owning workflow |
| Passive capture | Rejection may propose LOW-confidence Learning / Decision candidates | Never auto-validates memory |
| Content Unit | Explicit conversion from approved Angle | One canonical unit per Angle |
| Execution | Immutable revisions with Creative Core / Production / Edit / Publish Prep / Constraints work modes | Rights remains UNKNOWN until canonical Rights owner exists |
| Execution approval | Human approval; prior approved revision becomes SUPERSEDED | No hidden AI mutation |
| Memory-aware generation | Applicable fresh Validated Learnings can enter assembled generation context | Scope fails closed when applicability cannot be proven |

## Measurement contract

Product telemetry is metadata-only product analytics. It is **not** Artist Brain, evidence truth, or canonical artist memory.

### Measured now

| Metric | Current measurement |
| --- | --- |
| Recommendation explainability usage | `ATTENTION_EXPLANATION_OPENED` |
| Recommendation action opens | `ATTENTION_ACTION_OPENED` |
| Actual Today action outcomes | `ATTENTION_ACTION_OUTCOME_RECORDED` with STARTED / COMPLETED / BLOCKED / REOPENED, emitted only after confirmed backend success |
| Decision Memory reuse rate | DecisionMemory `MEMORY_REUSED` / `DECISION_CREATED` |
| Content generation memory reuse rate | ContentFactory `MEMORY_REUSED` / `CONTENT_CONTEXT_CONSUMED`; denominator exists only when provider actually consumed assembled context |
| Contextual guidance apply rate | `CONTEXTUAL_GUIDANCE_APPLIED` / `CONTEXTUAL_GUIDANCE_OPENED` |
| Passive memory capture count | passive Learning / Decision candidate events |
| Command Palette usage | opened / executed events |

Workspace-scoped summary:

`GET /api/v1/product-telemetry?windowDays=30`

Supported window: 1–365 days.

### Explicitly not over-claimed

- **Time to Meaningful Next Action** is not yet a trustworthy duration metric because a canonical session/start timestamp is not defined.
- **Automatic Context Capture Ratio** is not expressed as a percentage yet because the denominator of all eligible capture opportunities is not canonically instrumented.
- **Prior-decision conflict outcome quality** is not scored; conflict/override behavior exists, but outcome attribution needs future result/evidence owners.
- No global career score, intelligence score or recommendation-quality percentage exists.

## Representative E2E chain

The release-level proof is intentionally split across focused E2Es rather than one fragile mega-test:

1. `weekly-review.spec.ts`
   - validated Learning exists;
   - Weekly Review cites that Learning;
   - user turns review recommendation into canonical Decision;
   - user commits a canonical OperationalAction with WeeklyReview provenance.

2. `daily-os-loop.spec.ts`
   - Weekly Review recommendation becomes explicit Current Focus;
   - evidence-backed affinity surfaces the OperationalAction on Today;
   - WHY resolves canonical provenance;
   - user completes the action;
   - completed work leaves active Today;
   - PR-F verifies the confirmed completion is recorded as an attention outcome.

3. `learning-memory.spec.ts`
   - Learning lifecycle remains human-controlled;
   - validated Learning can be reused in Decision lineage.

4. `content-factory.spec.ts`
   - Factory works with AI unavailable;
   - rich canonical content/execution depth survives progressive disclosure;
   - immutable execution history remains intact.

## Deferred canonical owners

These are future-domain dependencies, not Phase 2.5 shortcuts:

- Campaign / Release canonical owner before target-specific PlanningObjective validation can be enabled.
- Experiment / Insight / Hypothesis / Evidence owner surfaces before unresolved lineage can become traversable canonical entities.
- Rights owner before publishability / clearance can be known.
- Production Capability owner before capability assumptions can be authoritative.
- Audio Segment owner before segment-specific context can be first-class.
- Result / Metric ingestion owner before recommendation effectiveness and override outcomes can be causally evaluated.

## Closure statement

Phase 2.5 is complete when PR-F is merged: the Daily OS operating loop is human-controlled, provenance-aware, memory-capable, contextually teachable and measurably instrumented within the boundaries of currently owned canonical domains.
