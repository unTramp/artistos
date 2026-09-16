# Artist OS — Architecture Freeze Candidate

**Status:** CANDIDATE — not yet MASTER.  
**Base:** MASTER v1.3 + Full Product Spec Pass 1 + Architecture Resolution Pass 1.  
**Purpose:** define the exact change set that should be reviewed before producing the next frozen MASTER revision and full Engineering Specification.

## 1. What is frozen already

The following remain authoritative from MASTER v1.3:

- Human-Controlled / AI-Assisted / Evidence-Driven / Closed-Loop principles.
- Identity before optimization; no auto-rebrand.
- Campaign as orchestration boundary.
- ContentUnit distinct from Publication.
- Asset/Rights/Lineage separation.
- DSP distinct from social Distribution/Growth.
- Organic Growth distinct from Advertising.
- Business/Fan Value distinct from accounting/CRM.
- ResearchClaim governance and freshness.
- Context Assembler as the only context-assembly owner.
- AI permission model and no-AI deterministic operation.
- single-artist-first modular monolith architecture.

## 2. Proposed MASTER-level changes

Only six unique architecture changes are currently proposed.

### FC-01 — PlanningObjective

Adopt ACP-001: first-class period-scoped PlanningObjective. “Monthly Objective” becomes a UX preset.

### FC-02 — Release / ReleaseTrack / CampaignTarget

Adopt ACP-002: Release becomes first-class, Song release lifecycle ceases to be canonical, Campaign gains one primary target + related targets, VIDEO leaves ReleaseExtension.

### FC-03 — Narrative primary + secondary attribution

Adopt ACP-003: one primary NarrativeTrack plus optional secondary narrative associations; primary-only default Narrative Mix.

### FC-04 — OperationalAction

Adopt ACP-004: shared human/external operational action primitive, clearly distinct from Job and Decision.

### FC-05 — Take

Adopt ACP-005: Take becomes first-class; Shot status returns to planning/execution semantics; take quality/selection moves to Take.

### FC-06 — Multi-parent Asset derivation

Adopt ACP-006: AssetDerivation edge becomes canonical for MIXED/REMIX/composite provenance and rights composition.

## 3. Proposed companion architecture contracts

`AR-001` through `AR-062` in `ARCHITECTURE_RESOLUTION_PASS1.md` define cross-domain semantics that do not require broad new bounded contexts.

Key examples:

- single active Era per artist time context;
- deterministic Identity/Era/Song/Deviation precedence;
- Song-specific interpretation inherited through SongIdentityContext;
- Narrative Mix counts published ContentUnits, not Publications;
- lyrics stay document/asset-backed in MVP;
- no dedicated Performance root in MVP;
- Readiness = computed current projection + optional milestone snapshots;
- workspace timezone + UTC observation storage;
- no top-level ExecutionPackage / ProductionPlan / EvergreenItem / StarterContentPack;
- ContentSlot remains planning intent;
- centralized Rights Decision Policy;
- Publication owns platform execution snapshot;
- timed LinkHub truth derives from effective configuration, not job success;
- WebExperience uses immutable versions;
- AudienceCapture remains aggregate / PII-provider-owned;
- Revenue corrections are append-only;
- Artist Brain is a versioned projection;
- Research evidence and Context provenance remain reproducible without retaining chain-of-thought.

## 4. Explicit non-changes

Do **not** add the following merely because they appeared as open questions:

```text
LyricVersion root
Performance root
ExecutionPackage root
ProductionPlan root
EvergreenItem root
StarterContentPack permanent root
WebStory independent root
RevenueScenario primary root
Universal Attribution root
GeoExperiment root
Creator/Contact CRM
full task-management subsystem
```

## 5. Deferred scope preserved

Only four unresolved items remain intentionally outside current scope:

1. Brand Book sharing/collaboration permissions.
2. Curator relationship CRM — future Publicity/Outreach ownership.
3. Inventory/order-level commerce integration.
4. Multi-user authorization/reviewer roles beyond single-artist MVP.

## 6. Engineering questions do not block architecture

45 questions are routed to Engineering Specification: enums, persistence, provider adapters, raw-event storage, retention, data shapes and infrastructure choices. These must conform to the freeze candidate and may not silently change domain ownership/cardinality.

## 7. Calibration questions do not block schema

38 items involve thresholds, similarity, minimum sample size, confidence, fatigue/outlier classification, retrieval weights and eval behavior. They should remain configurable/evidence-driven and must not be encoded as architecture constants.

## 8. UX questions do not block schema

26 items concern defaults, onboarding completeness, collapsed counts, mobile affordances, labels and other interaction decisions. They belong to UX/Interaction Specification and product configuration.

## 9. Freeze checklist

Before a next MASTER revision is produced:

- [ ] Review all 6 ACPs for contradictions with Full Product Spec.
- [ ] Confirm AR-001…AR-062 are consistent with product requirements.
- [ ] Run entity ownership audit after ACP model changes.
- [ ] Re-run Core and Release E2E loops with new Release/Take/OperationalAction models.
- [ ] Verify no Advertising/Publicity/CRM/Accounting scope leak.
- [ ] Produce delta document `MASTER v1.3 → next architecture version`.
- [ ] Only then generate the next frozen MASTER.

## 10. Decision rule

Until the freeze checklist is approved, `MASTER_ARCHITECTURE_v1.3.md` remains the normative source of truth and this document is a **candidate change set**, not a silent architecture update.
