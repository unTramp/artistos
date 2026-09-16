# Artist OS — Architecture Review Pass 2

**Status:** REVIEW COMPLETE — RECOMMENDED FOR HUMAN APPROVAL  
**Date:** 16 September 2026  
**Baseline:** MASTER v1.3 + Full Product Spec Pass 1 + Architecture Resolution Pass 1 + Engineering Spec Pass 1  
**Purpose:** perform the explicit review gate required by `ARCHITECTURE_FREEZE_CANDIDATE.md` before producing the next MASTER candidate.

## 1. Review scope

This pass reviews the complete proposed architecture change surface:

- ACP-001 — PlanningObjective;
- ACP-002 — Release / ReleaseTrack / CampaignTarget;
- ACP-003 — primary + secondary Narrative attribution;
- ACP-004 — OperationalAction;
- ACP-005 — Take;
- ACP-006 — multi-parent AssetDerivation;
- AR-001…AR-062 companion architecture contracts;
- Core and Release E2E loops after the proposed model changes;
- scope boundaries for Advertising, Publicity, CRM and Accounting.

The pass does **not** edit or replace `MASTER_ARCHITECTURE_v1.3.md`. MASTER v1.3 remains normative until a human-approved freeze produces the next architecture version.

## 2. Review result

**Recommendation:** approve all six ACPs as one coordinated architecture revision.

No contradiction was found between the six ACPs. They resolve six structural ambiguities already present in the product specification and remove cross-domain duplication without creating unnecessary bounded contexts.

The 62 AR contracts remain compatible with the six ACPs. Where an AR depends on an ACP, that dependency is explicit rather than hidden.

Cross-domain ownership remains single-source:

```text
Planning intent           → PlanningObjective / Planning domain
Campaign outcome          → CampaignGoal / Campaign domain
Release lifecycle         → Release / ReleaseTrack
Creative master           → ContentUnit
Platform publication      → Publication
Production instruction    → Shot
Production attempt        → Take
Media provenance          → Asset + AssetDerivation
Rights decision           → centralized Rights policy over source facts
Human/external work       → OperationalAction
Machine/background work   → Job
Strategic commitment      → Decision
Observed evidence         → source records / MetricSnapshot
Learning                  → Insight → Hypothesis → Experiment → Learning → Decision
```

## 3. ACP review

### ACP-001 — PlanningObjective

**Recommendation:** APPROVE.

Why:
- MASTER already depends on “Monthly Objective” across Overview, Calendar, Strategy and Review;
- leaving it as a transient field would duplicate intent across modules;
- generic period scope is more stable than a month-specific entity;
- CampaignGoal and RevenueGoal remain distinct, preventing planning intent from becoming an analytics or finance surrogate.

Required invariant:
- objective completion remains human-controlled;
- no generic task-management expansion;
- one PRIMARY artist-level overlapping objective in MVP, optional secondary objectives.

### ACP-002 — Release / ReleaseTrack / CampaignTarget

**Recommendation:** APPROVE. This is the highest-impact architecture correction.

Why:
- Release is already referenced by DSP, readiness, launch, extensions and campaign workflows but is missing as a canonical entity;
- Song-level release lifecycle cannot represent one Song appearing across multiple Releases;
- CampaignTarget clarifies orchestration without transferring ownership to Campaign;
- removing `VIDEO` from ReleaseExtension restores the audio-release vs video-content boundary.

Required invariant:
- Song Brain remains Song-owned;
- Release metadata/lifecycle remains Release-owned;
- Campaign has at most one PRIMARY target in MVP plus RELATED targets;
- historic ambiguity is preserved as unknown rather than fabricated during migration.

### ACP-003 — Narrative attribution

**Recommendation:** APPROVE.

Why:
- singular attribution is too restrictive for real creative work;
- unrestricted many-to-many would double-count Narrative Mix;
- PRIMARY + SECONDARY preserves interpretability.

Required invariant:
- default Narrative Mix counts distinct published ContentUnits by PRIMARY track only;
- Publications do not multiply mix;
- secondary overlap is reported separately.

### ACP-004 — OperationalAction

**Recommendation:** APPROVE.

Why:
- Distribution, DSP, Profile Readiness and launch workflows all require the same human/external action semantics;
- separate domain task tables would duplicate state and UI;
- Job and Decision semantics remain protected.

Required invariant:
- OperationalAction never becomes a generic Jira-like subsystem;
- business truth remains in the source domain;
- DONE requires user confirmation or verifiable provider evidence where external execution is involved.

### ACP-005 — Take

**Recommendation:** APPROVE.

Why:
- Shot is a planned instruction while a Take is an execution attempt;
- current GOOD/SELECTED Shot semantics conflict with multiple-take On-Set workflows;
- TakeAsset enables correct Smart Ingest and media lineage.

Required invariant:
- Shot lifecycle is planning/execution only;
- GOOD/BAD/SELECTED belong to Take;
- inferred mappings expose confidence and require confirmation when uncertain;
- selection history is audited.

### ACP-006 — AssetDerivation graph

**Recommendation:** APPROVE.

Why:
- MIXED/REMIX/composite outputs can have multiple source assets;
- a singular parent cannot represent provenance or rights composition;
- typed derivation edges preserve simple and multi-source workflows with one model.

Required invariant:
- graph cycles are forbidden;
- publish-relevant parent restrictions compose into Rights evaluation;
- inspiration/reference assets never silently become publish-source parents.

## 4. Companion contract review — AR-001…AR-062

All 62 contracts were reviewed as one companion layer.

They are accepted for the **v1.4 candidate** because they clarify ownership/cardinality/lifecycle without creating hidden competing sources of truth.

Particularly important retained contracts:

- one active Era per artist time context;
- explicit Identity precedence and intentional deviation;
- Narrative Mix over published ContentUnits, not Publications;
- lyrics remain document/asset-backed in MVP;
- no dedicated Performance root in MVP;
- Readiness = current projection + optional milestone snapshots;
- one workspace timezone, UTC observation storage;
- ExecutionPackage stays subordinate to ContentUnit;
- no ProductionPlan/EvergreenItem/StarterContentPack duplicate roots;
- centralized Rights Decision Policy;
- Publication owns platform execution snapshot;
- Audience Capture remains aggregate/provider-owned for PII;
- raw web/royalty evidence remains distinct from normalized analytics;
- Geo testing reuses Experiment;
- creator/contact data stays lightweight until Publicity boundary;
- source money is never overwritten by converted money;
- revenue corrections are append-only;
- Artist Brain is a versioned projection, not duplicate canonical identity storage;
- research promotion retains reproducible evidence;
- context debug payloads are short-lived while provenance is long-lived;
- WeeklyReview is immutable/versioned;
- CandidateKnowledge has explicit promotion/merge lifecycle.

## 5. Core E2E loop after review

```text
Artist
→ Identity / Era
→ Song
→ PlanningObjective
→ Campaign / CampaignTarget
→ ContentAngle + Narrative attribution
→ ContentUnit + execution snapshot
→ ShootSession / Shot / Take
→ Asset / TakeAsset / AssetDerivation / Rights
→ Publication adaptation snapshot
→ source observations / MetricSnapshot
→ Insight
→ Hypothesis
→ Experiment
→ Learning
→ Decision / WeeklyReview
→ next planning cycle
```

**Result:** loop closes without duplicate source ownership.

## 6. Release E2E loop after review

```text
Song(s)
→ Release / ReleaseTrack
→ CampaignTarget(primary=Release)
→ Release Readiness
→ OperationalActions
→ DSPReleasePlan / DSPOpportunity / EditorialPitch
→ Content / LinkHub / WebExperience
→ Launch
→ Publication / DSP observations
→ source-of-streams / royalty evidence
→ Insight / Learning / Decision
```

**Result:** Release is now a stable cross-domain identity and no longer leaks into Song lifecycle or DSP-only storage.

## 7. Scope leak audit

No proposed change requires adding the following to core v1.4:

```text
Advertising campaign execution
Publicity / media outreach CRM
person-level fan CRM
accounting / bookkeeping / ledger
inventory/order management
team/project-management suite
```

Existing extension points remain sufficient.

## 8. Architecture risks retained intentionally

The candidate keeps the following risks explicit rather than hiding them:

1. polymorphic `CampaignTarget` and `OperationalAction` source references require application validation;
2. AssetDerivation graph requires cycle protection and indexed traversal;
3. offline Take creation requires idempotent synchronization;
4. historic release migration can contain UNKNOWN/ambiguous facts;
5. thresholds for confidence, similarity, fatigue, outliers and materiality remain calibration/eval concerns, not schema constants.

None of these risks invalidate the proposed ownership model.

## 9. Freeze-gate result

Architecture review checklist:

- [x] Review all 6 ACPs for contradictions with Full Product Spec.
- [x] Confirm AR-001…AR-062 are mutually compatible with the proposed ACP set.
- [x] Re-run entity ownership reasoning after ACP model changes.
- [x] Re-run Core E2E loop.
- [x] Re-run Release E2E loop.
- [x] Verify no Advertising/Publicity/CRM/Accounting scope leak.
- [x] Define exact MASTER delta in a dedicated document.
- [ ] Human approval of the coordinated v1.4 change set.
- [ ] Generate/freeze the next normative MASTER after approval.

## 10. Decision

**ARCHITECTURE REVIEW COMPLETE.**

The coordinated ACP-001…ACP-006 + AR-001…AR-062 change set is recommended as the basis of **MASTER v1.4 Candidate**.

This document is a review recommendation, not human approval and not a replacement for MASTER v1.3.