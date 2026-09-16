# Artist OS — Engineering Spec 05: Application Services

**Status:** DRAFT / Pass 1

## 1. Purpose

Define orchestration services that compose domain rules, repositories, providers and jobs without moving business ownership out of bounded contexts.

## 2. Service design rules

### ENG-SVC-001 — One responsibility
An application service coordinates a use case; it does not become a new hidden domain model.

### ENG-SVC-002 — Repository ownership
Services access repositories through interfaces. A service may read across domains but writes through owning-domain commands/repositories only within declared orchestration.

### ENG-SVC-003 — Deterministic core
Where a decision can be computed from persisted rules/data, use deterministic code first. AI may explain/suggest, not replace deterministic invariants.

### ENG-SVC-004 — Explainability contract
Recommendation-producing services return:

```text
recommendation
reason[]
evidenceRefs[]
uncertainty[]
blockedBy[]
whatWillBeLearned?
```

### ENG-SVC-005 — Provenance
Every service that produces a recommendation/projection records source entity versions and relevant configuration version.

## 3. Core services

### 3.1 ContextAssemblerService

Responsibilities:
- accept ContextRequest;
- enforce priority ordering and budgets;
- load hard rules, Identity capsule, Song, Campaign/Planning objective, relevant learnings/platform/market knowledge;
- deduplicate/conflict-mark sources;
- return ContextPack + provenance manifest;
- persist compact assembly metadata on AgentRun.

Must not:
- invent missing artist facts;
- load entire knowledge base by default;
- persist full private prompt indefinitely.

### 3.2 ReadinessService

Computes current readiness projections for:

```text
Identity
Profile
Release
DSP Profile
Publication/Distribution preconditions
```

Contract:

```text
status
checks[] { key, state, reason, sourceRef, freshness? }
blockingChecks[]
recommendedActions[]
computedAt
sourceVersions[]
```

Rules:
- `UNKNOWN/STALE` is distinct from `FAILED/NOT_READY`;
- optional work cannot block readiness;
- accepted milestone snapshots may be persisted for history.

### 3.3 RightsDecisionService

Inputs:

```text
assetIds[]
intendedUsageSurface
platform?
commercialContext?
derivationTraversal=true
```

Output:

```text
ALLOW|WARN|BLOCK|UNKNOWN
findings[]
blockingSourceAssets[]
licenseEvidenceRefs[]
requiredAttribution[]
expiresAt?
```

Rules:
- evaluates every publish-relevant ancestor in derivation graph;
- credit never upgrades rights status;
- override is separate audited command.

### 3.4 IdentityGuardService

Inputs: content/asset/website/brand-book candidate + active Identity/Era + deviations.
Output: `ALIGNED|PARTIALLY_ALIGNED|OUTSIDE_IDENTITY` + findings.

Rules:
- hard constraints and protected mystique are deterministic where possible;
- stylistic assessment may use AI but must expose evidence/rationale;
- no fake numeric score;
- approved IdentityDeviation suppresses only covered findings.

### 3.5 PlanningService

Coordinates:

```text
PlanningObjective [PROVISIONAL ACP-001]
Campaign
NarrativeMixPlan
Evergreen requirements
Production capacity
Existing assets
Active experiments
ContentSlots
```

Produces suggested slots/actions but does not auto-schedule publication.

### 3.6 ContentStrategyService

Produces ContentAngles from ContextPack.

Responsibilities:
- constrain output count;
- require rationale/learning opportunity;
- avoid near-duplicates;
- attach Song/Narrative/Campaign/goal context;
- compute production feasibility hints;
- run Identity/novelty checks before presenting.

### 3.7 ProductionFeasibilityService

Inputs: proposed execution + capability profile + location + time/budget constraints.
Outputs preferred feasible plan + fallback(s) + missing requirements.

Rule: cannot recommend unavailable gear as if owned.

### 3.8 SmartIngestService

Pipeline:

```text
Asset registration
→ metadata normalization
→ device-time correction
→ candidate grouping
→ shot/take mapping suggestion
→ confidence
→ human confirmation
```

**PROVISIONAL ACP-005** for Take linkage.

No low-confidence suggestion becomes canonical without confirmation.

### 3.9 PublicationOrchestrator

Responsibilities:
- validate ContentUnit state;
- evaluate rights;
- validate platform capability/freshness;
- create Publication execution snapshot;
- schedule/manual/API execution according to PublishingMode;
- reconcile provider result;
- emit publication events.

Must not rewrite ContentUnit creative premise.

### 3.10 ReleaseOrchestrator

**PROVISIONAL ACP-002/ACP-004.**

Coordinates canonical Release with:

```text
Readiness
DSPReleasePlan
OperationalActions
Content plan
LinkHub
WebExperience
LaunchActivationPlan
post-launch observations
```

It never owns those child-domain entities.

### 3.11 MetricsImportService

Pipeline:

```text
Upload/API payload
→ source detection
→ mapping template
→ preview/validation
→ immutable batch/raw evidence
→ canonical normalization
→ duplicate detection
→ snapshots
→ downstream recompute request
```

Rules:
- no metric = NULL;
- import corrections produce new batch/version;
- raw evidence retention configurable.

### 3.12 AnalyticsService

Computes platform-scoped baselines, medians, percentiles, derived rates, outlier context and sample-size metadata.

Must not create causal claims.

### 3.13 InsightService

Transforms structured observations into bounded candidate Insights.

Output requires:

```text
statement
scope
evidenceRefs
sampleSize
confidence
alternativeExplanations
status
```

AI may draft wording; structured evidence is authoritative.

### 3.14 ExperimentService

Responsibilities:
- validate hypothesis and measurable target;
- define arms/variables;
- enforce experiment status transitions;
- attach observations;
- evaluate KEEP/RETEST/REJECT/INCONCLUSIVE under configured calibration;
- never auto-promote identity change.

### 3.15 LearningService

Promotes candidate/tested findings to Learning with scope/confidence/freshness. Validation requires evidence threshold + human approval according to policy.

### 3.16 DecisionMemoryService

Records strategic Decision + reason/evidence links and review date. Reversal creates history; never overwrites why the old decision existed.

### 3.17 WeeklyReviewService

Aggregates facts/observations/hypotheses/recommendations under explicit labels. Uses current metrics, experiments, fatigue, narrative coverage and decisions.

Identity changes are recommendations/hypotheses only; weekly review cannot activate identity changes.

### 3.18 ResearchGovernanceService

Responsibilities:
- extract ResearchClaims;
- assign claim type/authority/freshness;
- verify/cross-check;
- mark stale/contradicted;
- route to REJECT/HEURISTIC/CANDIDATE/PROMOTE;
- preserve evidence snapshot/hash/provenance.

### 3.19 OperationalActionService

**PROVISIONAL ACP-004.**

Creates/updates cross-domain human/external action state while preserving source-domain truth. Can surface due/blocked items to Overview projections.

### 3.20 AttentionProjectionService

Produces `Attention Now` items from deterministic domain states and OperationalActions. Dismiss/snooze state is UX projection metadata, not mutation of source problem.

## 4. Cross-service interaction rules

### ENG-SVC-006 — No recursive orchestration loops
Services may invoke lower-level domain/application commands but must avoid circular service graphs. Long chains become explicit workflow orchestrators/jobs.

### ENG-SVC-007 — Rebuildable projections
Attention, readiness, baselines, Artist Brain, retrieval chunks and similar projections define a deterministic rebuild path.

### ENG-SVC-008 — External calls behind adapters
Publishing, transcription, embeddings, platform refresh, storage and AI model calls occur through provider interfaces.

### ENG-SVC-009 — Time/freshness injected
Services receive clock/freshness policy dependency; tests must not depend on wall-clock globals.

### ENG-SVC-010 — Money conversion injected
FX conversion uses explicit rate source/date and never overwrites original money.

## 5. Acceptance criteria

- Every major cross-domain workflow has one named orchestrator/service.
- Services do not introduce duplicate source-of-truth state.
- Rights, readiness, identity guard, context assembly and analytics are centralized rather than reimplemented per screen.
- AI-dependent services have deterministic/manual degraded path where product spec requires it.
