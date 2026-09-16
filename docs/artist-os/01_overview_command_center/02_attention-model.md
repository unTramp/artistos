# Attention & Bottleneck Model

## 1. Metadata

- **Spec ID:** `OVR-ATTN`
- **Domain:** `01_overview_command_center`
- **Feature:** Attention & Bottleneck Model
- **Status:** REVIEW
- **Owner:** Product / Artist OS Core
- **MASTER references:** 20, 24–25, 33, 146–147, 156, 159, 192–194, 227–233, 295, 301–321, 347–353, 357–358, 364, 368, 454–457
- **Depends on:** source-domain statuses, deadlines, readiness, Jobs, Learnings, Decisions, freshness registry
- **Used by:** Overview, future reminders/badges, Weekly Review

### 1.1 Normative basis

MASTER defines examples of bottleneck intelligence and explicitly frames Overview around what needs attention. It does not define a universal priority score. This spec therefore establishes an explainable rule-based attention model and explicitly prohibits a magic score.

---

## 2. Purpose

Convert distributed Artist OS state into a small, explainable queue of items that genuinely deserve human attention.

The model protects the artist from two opposite failure modes:

- **under-alerting:** missing a release deadline, blocker, failed job, rights issue or overdue decision;
- **over-alerting:** turning every metric movement or incomplete optional field into urgency.

---

## 3. User problem / job-to-be-done

**JTBD:** “Tell me what is blocking progress, expiring, risky, unresolved or decision-worthy without making me inspect every list and without manufacturing urgency.”

---

## 4. Scope

### In scope

- attention candidate generation;
- severity/category;
- deterministic priority ordering;
- deduplication;
- snooze/dismiss lifecycle;
- bottleneck detection;
- stale-source qualification;
- source/rationale visibility;
- limits on alert volume.

### Out of scope

- push/email notification transport;
- generic social notifications;
- engagement nudges designed to increase app opens;
- autonomous resolution of approval-required actions;
- opaque numerical priority scoring shown to the user.

---

## 5. Entry points

Attention items appear through:

- Overview → Attention Now;
- relevant source-domain banners;
- Weekly Review;
- future notification surfaces, if implemented.

There is no requirement for a separate `/notifications` route in v1.3.

---

## 6. Preconditions and dependencies

Each candidate needs:

- source entity;
- source state;
- reason/rule;
- timestamp or current status;
- destination/action when actionable;
- freshness metadata where relevant.

Deadline-based candidates require trusted source dates. Platform deadlines derived from capability/research knowledge must respect freshness/verification status.

---

## 7. Information architecture

### Attention categories

```text
BLOCKER
DEADLINE
APPROVAL
DECISION
STALE_DATA
FAILED_JOB
READINESS_GAP
EXPERIMENT
FATIGUE
OPPORTUNITY
INFORMATIONAL
```

`INFORMATIONAL` is normally excluded from the primary Attention Now queue unless the user explicitly configures otherwise in a future version.

### Attention severity

```text
CRITICAL
HIGH
MEDIUM
LOW
```

Severity is categorical and explainable. It is not a fake precision score.

### Attention item shape

```text
id
artistId
category
severity
title
reason
sourceType
sourceId
sourceRef
createdAt
dueAt?
freshness?
actionType?
destination?
blockingEntityIds[]
dedupeKey
state: ACTIVE | SNOOZED | DISMISSED | RESOLVED | EXPIRED
snoozedUntil?
resolvedAt?
```

This may be implemented as an application projection/event-derived record; architecture choice is deferred to engineering design.

---

## 8. User roles and permissions

Single-artist MVP: the user can inspect, dismiss/snooze eligible items and navigate to resolution.

An attention item never grants permission that the underlying domain action does not grant.

---

## 9. Core data model

### Bottleneck signal

A bottleneck is a derived relationship between work-in-state and limited downstream flow, not simply any large count.

Example candidates:

```text
11 APPROVED Content Units / 2 SHOT
8 READY Content Units / 0 scheduled within relevant campaign window
Shoot scheduled / missing required assets
Release approaching / critical readiness tasks incomplete
Experiment ended / no decision recorded
Decision review date passed
Job repeatedly failed / downstream workflow blocked
```

### Excluded pseudo-bottlenecks

- “Follower count is low” without defined objective/context;
- “You have not posted today” when no cadence requirement exists;
- “Narrative mix differs from target” treated as hard failure;
- “One post underperformed” without adequate evidence.

---

## 10. Main happy-path workflow

1. Source domains expose current structured state.
2. Deterministic rules produce attention candidates.
3. Candidates with stale/unverified prerequisites are qualified or suppressed according to rule confidence.
4. Candidates are deduplicated by underlying cause.
5. Priority ordering is computed from explainable dimensions.
6. Overview displays top actionable items.
7. User opens source or performs allowed action.
8. Source state changes.
9. Attention model re-evaluates.
10. Candidate becomes `RESOLVED`, changes severity, or remains active with updated rationale.

---

## 11. Alternative workflows

### User dismisses non-critical item

Dismissal hides it until source state meaningfully changes or a defined new occurrence happens.

### User snoozes deadline/decision item

Snooze hides it until `snoozedUntil` unless severity escalates to CRITICAL due to materially changed conditions.

### Source data becomes stale

The existing operational item may transform into `STALE_DATA` or add a stale qualifier rather than continuing to assert unsupported urgency.

### Conflicting signals

Example: high-performing content but fatigue risk. Show separate evidence-backed items if both are independently actionable; do not merge into a single verdict.

---

## 12. User actions

| Action | Rules |
|---|---|
| Open | always available when destination exists |
| Snooze | allowed for reminder-like items; not a substitute for source action |
| Dismiss | allowed when item is not a mandatory safety/rights confirmation; reason optionally captured |
| Mark resolved | generally not manual; resolution comes from source state |
| Retry | only failed retryable jobs |
| Review decision | navigates to Decision source |

Critical rights/security/destructive-confirmation requirements cannot be permanently dismissed through Overview alone.

---

## 13. State model

```text
ACTIVE → SNOOZED → ACTIVE
ACTIVE → DISMISSED
ACTIVE → RESOLVED
ACTIVE → EXPIRED
SNOOZED → RESOLVED
SNOOZED → ACTIVE     (time reached or material escalation)
DISMISSED → ACTIVE   (materially new source state/new occurrence)
```

`RESOLVED` is terminal for that occurrence; a new occurrence creates/reopens via a new deterministic occurrence key.

---

## 14. Business rules

- **OVR-ATTN-001** — Every attention item MUST reference a concrete source state or explicitly identified onboarding condition.
- **OVR-ATTN-002** — Attention priority MUST be explainable through dimensions, not exposed as an opaque magic score.
- **OVR-ATTN-003** — Blocking and deadline-sensitive work SHOULD outrank informational performance changes.
- **OVR-ATTN-004** — Approval-required work SHOULD surface when it blocks downstream progress or reaches a relevant deadline.
- **OVR-ATTN-005** — A metric movement alone MUST NOT create a high-severity item unless tied to a defined experiment, threshold/baseline or operational consequence.
- **OVR-ATTN-006** — A single viral/high outlier MUST NOT automatically generate a “repeat this” priority.
- **OVR-ATTN-007** — Content/Narrative target deviations are contextual signals and MUST NOT be classified as blockers by default.
- **OVR-ATTN-008** — Identity performance signals MUST route to hypothesis/review, not automatic identity change.
- **OVR-ATTN-009** — Platform-rule deadlines/eligibility MUST respect verification/freshness; stale rules cannot create unqualified critical alerts.
- **OVR-ATTN-010** — Duplicate symptoms with the same root cause SHOULD collapse into one item with affected entities listed.
- **OVR-ATTN-011** — Dismissal MUST NOT mutate source-domain truth.
- **OVR-ATTN-012** — Snooze MUST NOT change deadlines or source state.
- **OVR-ATTN-013** — Resolved state SHOULD be determined from source-domain conditions whenever possible.
- **OVR-ATTN-014** — Failed jobs SHOULD enter Attention only when user action is needed or a meaningful workflow is blocked.
- **OVR-ATTN-015** — Long-running healthy jobs MUST use progress UI and MUST NOT be treated as warnings.
- **OVR-ATTN-016** — An item MUST state `why now` when time/severity is part of its priority.
- **OVR-ATTN-017** — User-visible severity MUST be categorical (`Critical/High/Medium/Low`) and accompanied by reason; no `87/100 urgency` style UI.
- **OVR-ATTN-018** — Optional incomplete setup MUST NOT be framed as failure if it is not required for the user’s current objective.
- **OVR-ATTN-019** — Attention volume MUST be bounded on Overview; additional items may be collapsed/grouped.
- **OVR-ATTN-020** — An item generated from uncertain inference MUST disclose uncertainty and cannot masquerade as a deterministic blocker.
- **OVR-ATTN-021** — The same underlying condition MUST NOT recreate a dismissed item on every refresh unless occurrence/state materially changes.
- **OVR-ATTN-022** — Due-date calculations MUST use the artist/application timezone consistently.

### 14.1 Priority dimensions

Internal ordering may use ordinal dimensions such as:

```text
blockingImpact
urgency
deadlineProximity
requiredHumanAction
currentFocusRelevance
confidence
freshness
```

Implementation MAY calculate an internal ranking value, but the user-facing product MUST explain dimensions rather than display the numeric score.

---

## 15. AI behavior

AI is not required to decide deterministic blocker/deadline state.

Allowed uses:

- group semantically similar candidate items after deterministic candidate generation;
- produce concise reason wording grounded in structured inputs;
- suggest resolution sequence when several items compete;
- explain tradeoffs.

Forbidden:

- invent source conditions;
- invent due dates;
- convert vague “best practice” into critical urgency;
- infer psychological urgency/manipulation;
- automatically resolve items without source state change.

If confidence is insufficient, keep deterministic items separate rather than over-merging.

---

## 16. Human approval

Attention may prompt approval but cannot stand in for it. User must enter the source workflow and complete the approval action under that feature’s rules.

---

## 17. Validation

- source entity exists and belongs to artist;
- due date parsable and source-qualified;
- category allowed;
- current state still matches trigger condition;
- stale capability/research status checked;
- dedupe key stable for same occurrence;
- snooze date in future.

---

## 18. UI states

Attention item must support:

- active;
- snoozed;
- stale-qualified;
- failed-source/degraded;
- resolved transition feedback.

Empty state: `Nothing urgent right now` plus optionally current focus, not gamified praise.

---

## 19. Edge cases

- Deadline passes while source action remains possible: severity changes but item is not automatically expired.
- Deadline passes and opportunity is no longer available: item becomes expired and source domain records outcome/status.
- User dismisses a medium item; dependency later becomes a blocker: new material state may reactivate/escalate.
- One failed job supports several entities: one root-cause item can list affected workflows.
- Two platform capability records conflict: surface verification problem, do not choose silently.
- Readiness says READY but a newly discovered rights issue blocks publication: blocker wins operationally; readiness source must be recomputed by its domain.

---

## 20. Cross-module effects

Consumes states from all operational domains. It may emit only attention-lifecycle events, not business-domain state changes.

Useful event patterns:

```text
AttentionCandidateCreated
AttentionItemSnoozed
AttentionItemDismissed
AttentionItemResolved
AttentionItemEscalated
```

---

## 21. Notifications and attention model

This file is the canonical model. Future external notifications must be a delivery policy layered on top of these items and must not generate an independent competing urgency system.

---

## 22. Search / filtering / sorting / bulk actions

Overview queue supports implicit priority ordering. If a dedicated expanded view is later added, filters may include category, severity, domain and focus.

Bulk dismiss of critical/high items is not recommended for MVP.

---

## 23. Analytics and product telemetry

Track:

```text
attention_generated
attention_shown
attention_opened
attention_snoozed
attention_dismissed
attention_resolved
attention_escalated
attention_false_positive_reported
```

Key quality metrics:

- time-to-resolution by category;
- false-positive/dismiss rate;
- repeated-item rate;
- ratio of generated → shown (noise control);
- source-domain resolution after click;
- percentage of high/critical items that were stale or unverified (should be very low).

---

## 24. Learning feedback

Attention interaction can inform **product** improvement. It does not become artist strategy learning by default.

Repeated rejection of a Strategy recommendation may become candidate evidence in the recommendation/eval layer, not a validated artist learning automatically.

---

## 25. Auditability / provenance

Store/resolve:

- trigger rule version;
- source refs and state snapshot hash/timestamp where practical;
- severity/category;
- rationale;
- actor action;
- snooze/dismiss reason;
- resolution source event.

---

## 26. Desktop / mobile behavior

Desktop may show grouped items with details. Mobile shows only the top few items, each with a single primary action and large tap target.

---

## 27. Accessibility / usability

- Severity includes text/icon, not color only.
- “Dismiss” and “Snooze” labels must be distinct.
- Root cause and affected entities readable by screen readers.
- No auto-disappearing critical item before user can perceive the resolved state.

---

## 28. Security / privacy / rights

Attention reason should minimize sensitive private narrative content. Example: show “Identity approval required” rather than leaking protected internal canon in a shared-screen context.

---

## 29. Performance / async jobs

Candidate evaluation should be incremental/event-driven or cheaply recomputed. Heavy AI grouping must not block deterministic items. Job failures should be idempotently deduplicated.

---

## 30. Acceptance criteria

1. A release task with verified deadline and incomplete required action is surfaced with reason and source.
2. A stale unverified platform rule cannot produce an unqualified CRITICAL alert.
3. A single low-performing post does not automatically produce a high-priority “change strategy” item.
4. `11 approved / 2 shot` can create a production bottleneck only when the backlog is relevant to current capacity/campaign context.
5. Dismissing an item does not change underlying source status.
6. Snoozing an item does not change its deadline.
7. Resolving source state removes/resolves the attention item.
8. Two symptoms with one failed import/job can be deduplicated into one root-cause item.
9. Identity signal creates review/hypothesis path, never auto-rebrand.
10. User can see why a High/Critical item is high/critical without interpreting an opaque score.

---

## 31. Test matrix

### Unit
- candidate rules;
- priority comparison;
- dedupe;
- snooze/reactivation;
- stale rule suppression;
- timezone boundary.

### Integration
- pipeline bottleneck source;
- DSP deadline source;
- job failure source;
- learning/decision review source.

### Agent eval
- grounded summarization;
- no invented urgency;
- uncertain inference disclosure.

### E2E
- source issue → attention → user resolves source → attention resolved;
- stale capability → qualified warning rather than false critical alert.

---

## 32. Open questions

1. Persist AttentionItem occurrences or compute entirely from domain events/projections? Engineering audit should decide based on audit/history needs.
2. Default snooze presets are UX-level and require validation.
3. Whether user can configure category visibility in MVP; recommended: no advanced configuration initially.

---

## 33. Traceability

| Product requirement | MASTER v1.3 |
|---|---|
| OVR-ATTN-001–004 | 20, 357–358, 364 |
| OVR-ATTN-005–008 | 295, 301–315 |
| OVR-ATTN-009 | 33, 217–222, 227–230 |
| OVR-ATTN-014–015 | 347–353 |
| OVR-ATTN-017, 020 | 24–25 |
| OVR-ATTN-018–019 | 368, 357 |
| Overall bottleneck intent | 364, 454–457 |
