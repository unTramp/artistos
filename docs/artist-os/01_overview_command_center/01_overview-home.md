# Overview / Command Center

## 1. Metadata

- **Spec ID:** `OVR-HOME`
- **Domain:** `01_overview_command_center`
- **Feature:** Overview / Command Center
- **Status:** REVIEW
- **Owner:** Product / Artist OS Core
- **MASTER references:** 8, 20, 24–25, 156, 192–194, 230–233, 287–300, 301–321, 347, 354, 357–361, 364, 368–370, 403, 449–457
- **Depends on:** Artist, active Identity Version, Songs/Releases, Campaigns, Pipeline, Calendar, Production, DSP/Distribution readiness, Analytics, Experiments, Learnings, Decisions, Jobs
- **Used by:** Artist daily workflow, Weekly Review entry point, all operational domains

### 1.1 Normative basis

This specification elaborates MASTER v1.3 without changing its architecture. MASTER explicitly states that Overview answers **“what requires attention now?”** rather than displaying all data, and names Current Focus, readiness, bottlenecks, KPI summary, narrative/content balance, experiments, key learning and upcoming decisions as dashboard blocks.

Product-level ordering, interaction and prioritization rules below are detailed behavior derived from those architectural requirements. Any future change that makes Overview a generic analytics dashboard conflicts with this spec and MASTER §357–358.

---

## 2. Purpose

Overview is the Artist OS command center. Its purpose is to compress the state of the entire operating system into a small number of actionable, explainable priorities so the artist can answer within seconds:

1. What am I trying to achieve now?
2. What requires my attention today?
3. What is blocked or becoming risky?
4. What should I do next?
5. What changed since I last looked?
6. What has the system actually learned?

Overview is not a reporting destination. Detailed analysis remains inside Analytics, DSP, Growth, Business, Identity and other domains.

---

## 3. User problem / job-to-be-done

An independent artist has many parallel concerns: release preparation, identity consistency, content pipeline, shoots, platform tasks, analytics, experiments, offers and decisions. Without an operating layer, the user must manually inspect many modules to determine what matters.

**JTBD:** “When I open Artist OS, show me the smallest useful set of things I need to understand or act on so that I can move the artist strategy forward without checking every module.”

---

## 4. Scope

### 4.1 In scope

- Current Focus / current objective context.
- Attention queue summary.
- Release/Campaign readiness summary.
- Production and pipeline bottlenecks.
- Profile/DSP readiness warnings.
- KPI summary scoped to current focus.
- Narrative and Content balance summary.
- Active experiments.
- Most relevant validated/candidate learning.
- Upcoming decisions requiring review.
- Job failures/progress only when they require or materially affect user action.
- Deep links into source domains.
- “Why this is here” explanations.
- First-use/partial-data states.

### 4.2 Out of scope / non-goals

- Full analytics explorer.
- Full calendar.
- Full pipeline board.
- Full notification center.
- Autonomous execution of publishing, spend, identity changes or destructive actions.
- A single opaque health score for the artist or campaign.
- Cross-platform raw metric ranking.
- A fixed universal “daily routine” imposed on every artist.

---

## 5. Entry points

- Primary route: `/`.
- App launch after authentication.
- Logo/Home navigation item.
- Command Palette → `Open Overview`.
- Completion redirect after onboarding where appropriate.
- Weekly Review → `Back to Overview`.
- Deep link with focus context, e.g. `/?focus=release:<id>` where implementation supports it.

---

## 6. Preconditions and dependencies

### Minimum precondition

An `Artist` record exists.

### Optional context dependencies

Overview progressively improves when the following exist:

- active `ArtistIdentityVersion`;
- current `EraIdentity`;
- current `Campaign` or monthly objective;
- Songs/Releases;
- `ProfileReadiness` / `DSPProfile` / `DSPReleasePlan`;
- Content Units / Publications;
- Shoot Sessions / Assets;
- MetricSnapshots;
- active Experiments;
- Learnings;
- Decisions;
- active/failed Jobs.

No optional missing domain may make the page unusable. Missing data is represented as missing context, never as zero performance.

---

## 7. Information architecture

### 7.1 Page hierarchy

```text
Overview
├─ Header / Current Focus
├─ Attention Now
├─ Readiness
│  ├─ Campaign / Release
│  ├─ Profile / Distribution
│  └─ DSP
├─ Flow & Production
│  ├─ Pipeline bottleneck
│  ├─ Production bottleneck
│  └─ Upcoming shoot / content commitment
├─ Performance Snapshot
├─ Narrative / Content Balance
├─ Active Experiments
├─ Key Learning
└─ Upcoming Decisions
```

### 7.2 Progressive disclosure

Each card supports three levels:

1. **Summary** — one-line state + optional value.
2. **Reason** — why it matters / evidence / due date / uncertainty.
3. **Source** — deep link to the authoritative domain.

Overview never duplicates the complete source-domain UI.

### 7.3 Current Focus

Current Focus may resolve from:

1. explicit user-pinned focus;
2. active Campaign / Release with the strongest current operational relevance;
3. current Monthly Objective;
4. onboarding state when the OS is not yet operational;
5. otherwise a neutral “No active focus” state with suggested next actions.

The system may suggest a focus but must not silently overwrite an explicitly pinned focus.

---

## 8. User roles and permissions

### MVP

Single artist/operator has full read access to Overview and may perform non-destructive quick actions exposed by source modules.

### Future readiness

Overview must be able to hide actions the current actor cannot perform, but team-role design is deferred by MASTER v1.3.

---

## 9. Core data model

Overview is primarily a **projection**, not a new god-object.

### 9.1 Suggested application projection

`OverviewSnapshot` may be materialized/cached at the application layer:

```text
artistId
focus
attentionItems[]
readinessSummaries[]
bottlenecks[]
kpiSummary
narrativeSummary
contentMixSummary
activeExperiments[]
keyLearnings[]
upcomingDecisions[]
jobSignals[]
generatedAt
sourceFreshness[]
```

This projection is not the source of truth for underlying entities.

### 9.2 CurrentFocus

```text
sourceType: USER_PINNED | CAMPAIGN | RELEASE | MONTHLY_OBJECTIVE | ONBOARDING | NONE
sourceId?
title
objective?
phase?
startAt?
endAt?
reason?
```

### 9.3 Derived values

- readiness counts and status are derived from source readiness models;
- bottlenecks are derived from Pipeline/Production/DSP/Decision state;
- KPI values are derived from canonical metrics;
- learning confidence is derived from Learning state/evidence;
- “stale” is derived from source freshness rules, not hardcoded dates in Overview.

---

## 10. Main happy-path workflow

1. User opens `/`.
2. System loads shell immediately without waiting for AI.
3. System resolves Current Focus.
4. System loads/caches domain projections in parallel.
5. System computes attention candidates using deterministic rules first.
6. System ranks and deduplicates candidates using the Attention Model.
7. User sees no more than the highest-priority actionable items above the fold.
8. User expands an item to see `Why this?`, source and uncertainty where relevant.
9. User opens the authoritative source domain or performs an allowed quick action.
10. After the source state changes, Overview refreshes the affected projection.
11. The resolved item disappears, downgrades, or changes state rather than remaining stale.

---

## 11. Alternative workflows

### 11.1 Cold start

When little/no data exists, Overview becomes a guided setup surface and prioritizes minimum operational readiness rather than fake KPI cards.

### 11.2 No active campaign/release

The focus area shows Evergreen / current objective / identity-building context and does not fabricate a campaign.

### 11.3 No analytics yet

Performance Snapshot displays `No data available` with a contextual import/setup action; values are not shown as `0`.

### 11.4 AI unavailable

Overview still works from structured domain state. AI-generated explanation/recommendation enhancements may be absent.

### 11.5 Several active campaigns

The user can switch focus context. Overview may suggest which campaign has nearer obligations, but cannot silently archive or deprioritize other campaigns.

---

## 12. User actions

| Action | Availability | Side effect | Reversible | Audit |
|---|---|---|---|---|
| Pin focus | when eligible target exists | changes explicit focus | yes | yes |
| Clear pinned focus | pinned focus exists | returns focus resolution to automatic | yes | yes |
| Open source | always for source-backed cards | navigation only | n/a | no |
| Dismiss informational item | dismissible low-risk item | hides until state changes / expiry | yes where history retained | yes |
| Snooze reminder | reminder supports snooze | changes reminder visibility | yes | yes |
| Run Weekly Review | feature available | creates/starts review workflow | yes before completion | yes |
| Retry failed job | retryable job | queues job retry | not destructive | yes |
| Accept suggested next action | suggestion has actionable destination | navigates/creates draft only as defined by source feature | varies | source feature |

Overview must not expose destructive quick actions such as permanent delete, identity activation/rebrand, publishing or spend without source-domain confirmation.

---

## 13. State model

Overview itself has presentation states rather than a domain lifecycle:

```text
FIRST_USE
PARTIAL
OPERATIONAL
DEGRADED
```

- `FIRST_USE`: Artist exists but operational context is not yet established.
- `PARTIAL`: Some domains configured; Overview can provide useful but incomplete state.
- `OPERATIONAL`: sufficient source domains exist for normal command-center behavior.
- `DEGRADED`: one or more data providers/jobs are unavailable or stale; structured local state still renders.

These states are derived and need not be persisted as authoritative domain status.

---

## 14. Business rules

- **OVR-HOME-001** — Overview MUST answer “what requires attention now?” and MUST NOT attempt to display all Artist OS data.
- **OVR-HOME-002** — Every operational card MUST have an authoritative source domain and deep link unless it is an onboarding-only card.
- **OVR-HOME-003** — Missing metrics MUST render as missing/unavailable, never as numeric zero.
- **OVR-HOME-004** — Overview MUST NOT create a global artist/campaign health score or fake precision score.
- **OVR-HOME-005** — Current Focus MUST preserve an explicit user-pinned focus until the user clears it or the referenced entity becomes invalid/archived.
- **OVR-HOME-006** — System-suggested focus MUST include a rationale.
- **OVR-HOME-007** — Attention ranking MUST prefer actionable, time-sensitive, blocking and decision-relevant states over informational vanity metrics.
- **OVR-HOME-008** — KPI summary MUST be scoped by platform/time/context and MUST NOT compare raw cross-platform views as if directly equivalent.
- **OVR-HOME-009** — Readiness shown on Overview MUST use the source domain’s readiness model; Overview MUST NOT invent independent readiness semantics.
- **OVR-HOME-010** — A key learning card MUST show Learning state/confidence or equivalent evidence context; candidate hypotheses MUST NOT be presented as validated truth.
- **OVR-HOME-011** — A performance outlier MUST NOT automatically become “what worked” without the analytics/learning layer accounting for sample size and variance.
- **OVR-HOME-012** — Overview MUST distinguish observation, hypothesis, recommendation and decision where those concepts appear together.
- **OVR-HOME-013** — Identity performance signals MAY create review/hypothesis attention but MUST NOT trigger automatic identity changes.
- **OVR-HOME-014** — Failed or stale integrations MUST visibly qualify affected cards rather than silently serving outdated state as current.
- **OVR-HOME-015** — Job progress MUST appear only when it materially affects the current workflow or requires attention; Overview is not a raw job monitor.
- **OVR-HOME-016** — Above-the-fold attention MUST be intentionally limited; lower-priority information is grouped under secondary sections rather than competing equally.
- **OVR-HOME-017** — Every recommendation generated or summarized on Overview MUST support `Why this?`, evidence/source and uncertainty where applicable.
- **OVR-HOME-018** — AI provider availability MUST NOT block initial Overview render.
- **OVR-HOME-019** — Overview MUST refresh affected summaries after source-domain state changes without requiring a full-page reload where practical.
- **OVR-HOME-020** — Overview MUST not expose publication, ad spend, permanent knowledge promotion, destructive action or identity activation as one-click autonomous actions.
- **OVR-HOME-021** — The page MUST support useful states for zero songs, zero publications, zero metrics and no campaign.
- **OVR-HOME-022** — Current Focus and attention logic MUST work for non-release periods, including evergreen, identity-building and experimentation.
- **OVR-HOME-023** — Narrative mix and Content Pillar mix MUST be shown as separate concepts when both are displayed.
- **OVR-HOME-024** — Narrative/content target deviations MUST be contextual warnings, not product errors.
- **OVR-HOME-025** — Overview data MUST preserve source timestamps/freshness so the user can distinguish current and stale summaries.
- **OVR-HOME-026** — Source-domain authority wins over cached Overview projection in case of conflict.

---

## 15. AI behavior

### Trigger

AI is optional for:

- concise natural-language summary of current state;
- explanation of why selected attention items matter;
- contextual suggested next actions;
- Weekly Review preview.

AI is not required for deterministic readiness, deadlines, counts, statuses or metric calculations.

### Context Request

```text
taskType: OVERVIEW_SUMMARY | NEXT_ACTION_EXPLANATION
artistId
campaignId?
songId?
goal?
identityVersionId?
```

### Context Pack

- hard rules;
- Identity Capsule;
- Current Focus;
- relevant readiness summaries;
- attention candidates;
- current experiments;
- recent validated learnings;
- upcoming decisions;
- freshness/source references.

### Structured output

```text
summary
priorityExplanations[]
nextActionSuggestions[] {
  action
  reason
  sourceRefs[]
  uncertainty
  destination
}
```

### Allowed

- summarize already-computed state;
- explain relationships;
- propose drafts/next steps;
- state insufficient evidence.

### Forbidden

- invent missing metrics;
- relabel hypothesis as fact;
- invent deadlines;
- mutate source entities;
- publish, delete, spend or activate identity;
- generate an opaque global score.

### Fallback

If AI fails, deterministic cards remain fully functional and the UI may show “AI explanation unavailable” without blocking actions.

---

## 16. Human approval

Human approval is required for all state-changing actions governed as explicit approval in source domains, including publishing, identity activation/change, permanent knowledge promotion, validated learning promotion where defined, destructive actions and future ad spend.

Overview may create drafts or navigation shortcuts, but does not weaken approval boundaries.

---

## 17. Validation

- Referenced entities must belong to current artist.
- Archived/deleted source entities cannot remain active focus without explicit historical mode.
- Date-sensitive cards must validate time zone and source timestamp.
- Readiness status must map to current source schema.
- Metrics must retain platform and observation time.
- Learning cards must resolve evidence/confidence metadata.
- Deep links must resolve or degrade to the nearest valid parent route.

---

## 18. UI states

### First-use

Show setup journey; do not render empty charts.

### Empty

Each empty block answers:

1. why this block matters;
2. why there is no data;
3. one best next action.

### Loading

Shell and section skeletons load independently. No full-screen AI spinner.

### Partial data

Render known state with explicit `Missing data` / `Not connected` qualifiers.

### Warning

Used for approaching deadlines, stale data, blocked pipelines, rights/approval issues.

### Error

Localize errors to affected card/domain where possible.

### Stale

Show source freshness and avoid language such as “current” when freshness cannot be established.

---

## 19. Edge cases

- Active campaign references archived Identity Version: show source state plus warning; never rewrite historical linkage.
- Release exists with no active campaign: readiness may still appear; focus is not auto-created as campaign.
- Multiple releases share deadlines: attention model deduplicates common blocking task if appropriate.
- Metric import is partial: card labels the period/data coverage.
- One viral publication dominates average: summary should prefer median/context as available.
- Current focus entity is deleted/archived: clear automatic projection and ask user to choose/confirm next focus.
- User intentionally ignores a readiness warning: preserve decision/dismissal history; do not silently reactivate every refresh unless state meaningfully changes.
- Platform capability becomes stale: card is marked stale and avoids asserting the old rule as fact.

---

## 20. Cross-module effects

Overview consumes but generally does not own domain state.

Potential consumed events:

```text
CampaignActivated
CampaignUpdated
ReleaseReadinessChanged
ProfileReadinessChanged
DSPReadinessChanged
ContentUnitStatusChanged
ShootSessionUpdated
PublicationCreated
MetricsImported
ExperimentStatusChanged
LearningPromoted
DecisionReviewDue
JobFailed
JobCompleted
IdentityVersionActivated
```

Overview may emit:

```text
OverviewFocusPinned
OverviewFocusCleared
AttentionItemDismissed
AttentionItemSnoozed
```

---

## 21. Notifications and attention model

Overview uses `02_attention-model.md` as the normative prioritization spec. It is a surface for attention, not the source of attention truth.

Only items that are actionable, blocking, time-sensitive, decision-relevant or materially uncertain should enter “Attention Now.” Informational summaries belong in lower sections.

---

## 22. Search / filtering / sorting / bulk actions

Overview itself has no global data table. It may offer:

- switch Current Focus;
- time-window selector for performance summary where supported;
- Top Content dimension tabs defined by MASTER (`Reach`, `Followers`, `Shares`, `Saves`, `Music Conversion`, `Fan Value`).

Bulk actions belong in source modules.

---

## 23. Analytics and product telemetry

Suggested telemetry:

```text
overview_opened
overview_focus_pinned
overview_focus_cleared
overview_attention_opened
overview_attention_dismissed
overview_source_opened
overview_next_action_accepted
overview_next_action_rejected
overview_ai_explanation_requested
overview_ai_explanation_failed
```

Measure:

- time from Overview open to first meaningful action;
- attention-card resolution rate;
- percentage of source navigation that resolves a blocker;
- suggestion acceptance/rejection reason;
- stale-card rate;
- Overview load latency excluding optional AI.

Do not optimize Overview for clicks alone; useful resolution matters more than engagement with the dashboard.

---

## 24. Learning feedback

Overview interactions are product telemetry, not automatically artist Learnings.

A dismissal/rejection may become evidence about workflow usefulness or recommendation quality, but must not become an artistic/content rule without the normal Insight/Hypothesis/Learning process.

---

## 25. Auditability / provenance

For each actionable recommendation/attention item retain or resolve:

- source entity IDs;
- source timestamp/freshness;
- rule/logic that surfaced it;
- AI run/config if AI wording was used;
- user action and timestamp;
- dismissal/snooze reason where captured.

---

## 26. Desktop / mobile behavior

### Desktop

Full command-center layout with multi-column secondary sections.

### Mobile/PWA

Simplified stack:

1. Current Focus;
2. Attention Now;
3. next operational action;
4. compact readiness;
5. active shoot/on-set shortcut if relevant.

Deep analytics tables and dense comparisons route to desktop-oriented source modules.

---

## 27. Accessibility / usability

- Full keyboard traversal.
- Visible focus states.
- Cards cannot rely on color alone for severity.
- “Why this?” is keyboard and screen-reader accessible.
- Deadlines show text labels, not only icons.
- Avoid motion that competes with priority reading.
- Destructive actions are never hidden behind ambiguous icon-only shortcuts.

---

## 28. Security / privacy / rights

- Internal canon/private Identity narrative is summarized only to the level necessary for the Overview card.
- No secrets/tokens appear in error states.
- Rights warnings may be surfaced, but sensitive license proofs remain in Asset/Rights domain.
- Cached projection must respect artist scope.

---

## 29. Performance / async jobs

- Initial shell and deterministic cards should render without waiting for AI.
- Heavy summaries may use cached application projections.
- AI summary generation uses `JobService` only if it exceeds interactive latency thresholds; otherwise can be requested on demand.
- Failed source imports/jobs do not fail the entire Overview.
- Cache invalidation must occur on relevant domain events or bounded freshness interval.

---

## 30. Acceptance criteria

1. **Given** a new artist with no songs or metrics, **when** Overview opens, **then** the user sees a guided next action and no fake zero KPI dashboard.
2. **Given** an active release with an approaching pitch/readiness task, **when** Overview opens, **then** the task appears in Attention Now with source, due context and deep link.
3. **Given** 11 approved Content Units and only 2 shot, **when** bottleneck rules evaluate the pipeline, **then** Overview may surface a production bottleneck without declaring causality or inventing a score.
4. **Given** metrics are unavailable, **then** Overview displays `No data available`, not zero values.
5. **Given** a learning is `CANDIDATE`, **then** Overview never labels it as validated.
6. **Given** AI provider outage, **then** Current Focus, readiness, attention and deterministic metrics still render.
7. **Given** the user pins Campaign B while Campaign A has a nearer deadline, **then** Current Focus remains B while Attention may still surface A’s time-critical task with rationale.
8. **Given** a source platform rule is stale, **then** any related Overview item carries stale qualification.
9. **Given** a source blocker is resolved, **then** the corresponding attention item is removed/downgraded after refresh.
10. **Given** multiple platforms have view metrics, **then** Overview does not rank them by raw views without platform-specific context.
11. **Given** narrative target vs actual differs, **then** Overview shows context/warning and does not classify the state as an error.
12. **Given** an Identity performance signal, **then** Overview may suggest review/hypothesis but cannot modify active identity.

---

## 31. Test matrix

### Unit

- focus resolver priority rules;
- attention ordering input/output;
- missing metric behavior;
- stale data qualification;
- deduplication rules;
- narrative/content mix separation.

### Integration

- source-domain projections;
- deep links;
- cache invalidation after domain events;
- job failure isolation.

### Agent eval

- overview explanation remains grounded in supplied state;
- no invented metrics/deadlines;
- hypothesis vs validated learning language;
- useful insufficient-evidence response.

### E2E

- first-use → create Identity/Song → Overview changes from onboarding to operational state;
- active release → resolve readiness blocker → Overview updates;
- import metrics → performance summary appears;
- failed integration → degraded card only, shell remains usable.

### Manual smoke

- desktop density and hierarchy;
- mobile priority ordering;
- keyboard navigation;
- no broken deep links.

---

## 32. Open questions

1. Should `MonthlyObjective` become a first-class entity or remain a Campaign/Planning projection? MASTER references the concept but does not define an entity.
2. Should Attention dismissals expire only on source-state change or also after a configurable time window?
3. How many “Attention Now” items should be visible before collapsing? Product default must be validated; no architecture dependency.
4. Should Current Focus allow multiple simultaneous pinned contexts or exactly one primary focus in MVP? Recommended MVP: one primary focus, with other urgent items still visible via Attention.

---

## 33. Traceability

| Product requirement | MASTER v1.3 |
|---|---|
| OVR-HOME-001–007 | 8, 357–358, 364 |
| OVR-HOME-008, 011 | 287–300, 359 |
| OVR-HOME-009 | 192–194, 230 |
| OVR-HOME-010, 012 | 301–321 |
| OVR-HOME-013, 020 | 20, 314–315, 415 |
| OVR-HOME-014, 025 | 33, 222 |
| OVR-HOME-015, 018 | 347–353 |
| OVR-HOME-017 | 24–25 |
| OVR-HOME-021 | 368 |
| OVR-HOME-022–024 | 148–159, 361 |
| Overall UI behavior | 354, 357–370 |
| MVP / success | 403, 449–457 |
