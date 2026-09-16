# Artist OS — Cross-Domain Reconciliation Pass 1

**Architecture source:** MASTER v1.3 — frozen.
**Scope:** first product-contract reconciliation after all 20 detailed domain passes.
**Status:** REVIEW COMPLETE — product layer; schema/engineering gaps remain explicit.

## 1. Purpose

This pass verifies that the detailed Product Specification behaves as one operating system rather than twenty isolated modules. It does **not** change MASTER v1.3. Any architecture-changing resolution must use an Architecture Change Proposal.

The reconciliation checks:

1. who owns each source of truth;
2. whether cross-domain transitions preserve lineage and history;
3. whether two domains accidentally claim ownership of the same fact;
4. whether AI/Analytics can bypass human approval or epistemic governance;
5. whether manual/CSV/no-AI fallback remains valid;
6. whether deferred Advertising/Publicity boundaries remain clean;
7. whether unresolved entity/status/version questions are visible before Engineering Spec.

## 2. Source-of-truth ownership matrix

| Concern | Canonical owner | Consumers / projections | Must not become duplicate truth |
|---|---|---|---|
| Artist identity / archetype / visual DNA / mystique | `02_identity` | Artist Brain, Factory, Production, Web, DSP, Guard | Artist Brain, Website, DSP profile |
| Narrative tracks / beats / differentiators | `03_narrative` | Factory, Calendar, Analytics, Campaign | Content Pillar / Web Story |
| Song meaning / lyrics / segments / audio usage | `04_songs_music` | Factory, Production, DSP, Analytics, Knowledge | Campaign / Publication |
| Campaign orchestration | `05_campaigns_releases` | Distribution, DSP, Growth, Business | child-domain internal state |
| Creative intent / Angle / ContentUnit | `06_content_factory` | Pipeline, Production, Publication, Analytics | Publication / Asset |
| Work planning / slots / calendar | `07_pipeline_planning_calendar` | Production, Distribution, Overview | Publication fact / Shoot fact |
| Shoot / shot / on-set execution | `08_production` | Assets, Factory lineage, Economics | Asset library |
| Binary/media / rights / derivation lineage | `09_assets_media_rights` | Production, Distribution, Web, DSP | ContentUnit / Publication |
| Publication execution fact | `10_distribution_owned_media` | Analytics, Profile Audit, Campaign | ContentUnit |
| DSP profile/opportunity/pitch/source/revenue state | `11_dsp` | Campaign, Analytics, Business | social Distribution / Growth |
| Organic market/search/live/collaboration intelligence | `12_growth_market` | Campaign, Analytics, Business | Advertising |
| Offer/revenue/fan-value/economics | `13_business_fan_value` | Campaign, Web, Analytics | accounting/CRM |
| Normalized observations / baselines / outliers | `14_analytics` | Insight/Review/Strategy | domain source facts |
| Insight/Hypothesis/Experiment/Learning/Decision | `15_intelligence_learning_decisions` | Strategy, Context, Reviews | raw metrics / ResearchClaim |
| Knowledge summaries / external claims / context packs | `16_knowledge_research_context` | all AI workflows | source domain records |
| AI runtime/config/jobs | `17_ai_agents_jobs` | all AI-assisted workflows | domain truth / permissions |
| Platform capabilities/import adapters/presence | `18_platforms_integrations` | Distribution, DSP, Growth | hardcoded rules in feature code |
| Secrets/privacy/audit/export/logs | `19_settings_security_portability` | all domains | domain business logic |
| Product telemetry/testing/DoD | `20_product_quality_telemetry` | product/engineering governance | artist learning/identity |

## 3. Non-negotiable cross-domain contracts

### 3.1 Identity contract

```text
Identity Version / Era
→ compact IdentityContextCapsule
→ Strategy / Factory / Production / Web / DSP
→ Guard check
→ intentional deviation if needed
→ performance evidence
→ Insight / Identity Hypothesis
→ repeated tests
→ Identity Review
→ human-approved Era/Identity evolution
```

Rules:
- performance never mutates Identity directly;
- Artist Brain is a compact projection, not duplicate identity storage;
- published historical outputs retain the Identity/Era version used at creation/publication;
- protected Internal Canon never leaks merely because a downstream surface requests “more story.”

### 3.2 Content-to-publication contract

```text
Content Angle
→ approved Execution Package
→ ContentUnit
→ Pipeline / Shoot / Assets
→ platform adaptation
→ Publication
→ MetricSnapshots
```

Rules:
- `ContentUnit ≠ Publication`;
- master concept history is never rewritten by later platform edits;
- actual `publishedAt` is distinct from planned Calendar timing;
- multiple Publications may legitimately reference one ContentUnit;
- external deletion does not erase internal publication/metric history.

### 3.3 Media / rights contract

```text
Source Asset
→ Rights / Origin
→ Derived Asset(s)
→ ContentUnit / Web / Brand Book / DSP usage
→ Publication
```

Rules:
- origin does not imply rights;
- credit does not equal license;
- derived assets inherit/compose restrictions;
- audience-facing surfaces consume centralized rights policy instead of inventing local “safe” rules;
- multi-source remix/mixed lineage remains an explicit schema gap.

### 3.4 Metrics-to-learning contract

```text
Raw / Imported Observation
→ normalized MetricSnapshot
→ compatible Baseline / Outlier context
→ Insight
→ Hypothesis
→ Experiment
→ Candidate Learning
→ human validation
→ Context Assembler / Strategy
→ Decision
```

Rules:
- NULL/unknown is not zero;
- correlation is not causation;
- one outlier is not a best practice;
- experiment result is not automatically a validated learning;
- stale/contradicted learning remains historical;
- Identity learning has a higher threshold than tactical learning.

### 3.5 External-knowledge contract

```text
External Source
→ ResearchClaim
→ authority / verification / freshness
→ REJECT | HEURISTIC | CANDIDATE | PROMOTE
→ domain knowledge or Experiment
```

Rules:
- practitioner advice is not a platform rule;
- primary sources are preferred for API/eligibility/monetization/operational constraints;
- stale claims cannot appear as current facts;
- own validated evidence may outrank generic advice, except authoritative current hard constraints.

### 3.6 AI contract

```text
Product workflow
→ Orchestrator
→ Context Request
→ Context Assembler
→ versioned AgentConfiguration
→ specialist agent + allowed tools
→ structured output
→ Guard / validation
→ human/application approval
→ owning-domain mutation
→ AgentRun / telemetry / eval
```

Rules:
- agents do not load “the whole Brain” themselves;
- no publish/delete/spend/permanent identity change without explicit application approval;
- Analytics Agent never invents missing data;
- provider/model choice never becomes domain dependency;
- AI outage must not break deterministic core workflows.

### 3.7 Campaign orchestration contract

Campaign references and coordinates child domains; it never becomes their storage owner.

```text
Campaign
├─ Release
├─ Content Units / Publications
├─ DSPReleasePlans / Opportunities
├─ LinkHub / WebExperience
├─ Market / LIVE / Collaboration
└─ Offers / Business evidence
```

Future `AdvertisingCampaign` / `PublicityCampaign` may attach through extension references only. Their internal entities are not part of v1.3.

## 4. Core E2E reconciliation

MASTER E2E Core:

```text
Create Artist
→ Identity
→ Song
→ Angle
→ Approve
→ Execution
→ Shoot
→ Smart Ingest
→ Select Take
→ Publish
→ Import Metrics
→ Insight
→ Hypothesis
→ Experiment
→ Learning
→ Decision
→ Next Strategy
```

### Product-contract result

Every transition is now represented by a detailed feature specification. The unresolved boundary is primarily **schema-level**, not missing product behavior:
- formal `Take` entity;
- `ExecutionPackage` persistence/versioning;
- multi-parent Derived Asset lineage;
- canonical Publication status;
- Context/Agent runtime contracts.

No transition requires AI to function at all stages: manual planning, shooting, ingest confirmation, publication tracking, CSV imports, Insight creation and Decision Memory all have deterministic/manual paths.

## 5. Release E2E reconciliation

MASTER E2E Release:

```text
Create Release
→ DSP Readiness
→ Editorial Opportunity
→ Content / Link plan
→ Launch
→ Post-launch metrics
→ Source analysis
→ Learning
```

### Product-contract result

The detailed specification now keeps the following separate:
- Release fact vs Campaign orchestration;
- general Release Readiness vs DSP-specific tasks;
- DSPOpportunity vs PlatformCapability;
- EditorialPitch draft/submission/outcome;
- ContentUnit vs platform Publication;
- LinkHub routing state vs historical publication CTA;
- source-of-streams observation vs causal explanation;
- royalty statement evidence vs business scenario.

The system explicitly rejects the “first 24 hours determine destiny” framing and preserves PRE_RELEASE / DAY_0 / DAY_1_7 / DAY_8_30 / DAY_31_90 / CATALOG as analytical/operational windows only.

## 6. Boundary audit

### Advertising

Clean boundary retained. Current core may store:
- AudienceSource = PAID;
- `adPerformanceExtension` market signal;
- future campaign extension reference;
- attribution/cost evidence imported later.

Current core does **not** define autonomous paid campaign creation, targeting, scaling or spend.

### Publicity / PR

Clean boundary retained. Current core may reference:
- PRESS WebSection;
- press hooks in Release Readiness;
- external creator/collaboration context;
- future campaign extension reference.

Current core does **not** define journalist CRM, media relationships, pitching workflow or earned-media attribution.

### CRM / fan PII

Clean boundary retained. AudienceCapture and FanValue remain aggregate by default. Person-level CRM requires a separate explicit feature/privacy scope.

### Accounting

Clean boundary retained. Business uses strategic revenue/unit economics evidence. Taxes, payroll, depreciation and double-entry bookkeeping remain deferred.

## 7. Cross-domain architecture gaps requiring Stage-0/schema decisions

These are product behavior that is now clear but whose canonical entity/schema boundary is not frozen in MASTER:

1. `MonthlyObjective` / period objective entity.
2. `Release` first-class schema and status model.
3. `Campaign` full schema/status and single-vs-multi Release relationship.
4. `Take` entity and Shot-vs-Take state semantics.
5. `ExecutionPackage` persisted/versioned entity vs ContentUnit structured fields.
6. `ProductionPlan` entity vs ExecutionPackage/ShootSession projection.
7. `ContentSlot` lifecycle/ownership/assignment.
8. `RecurringSeries` and `ContentRhythmTemplate` version/status details.
9. `EnvironmentRules` field schema.
10. `IdentityVerticalSpec` persistence schema.
11. Song-specific Interpretation Policy boundary.
12. Canonical Lyrics version/storage boundary.
13. Dedicated `Performance` entity vs projection.
14. Multi-parent Asset lineage for MIXED/REMIX.
15. Central Rights blocking matrix by usage surface.
16. Canonical Publication status enum.
17. Platform adaptation version vs Publication execution snapshot boundary.
18. Shared external action/task model across profile audit, publishing and DSP plans.
19. WebExperience/WebStory section/version/status model.
20. LinkDestination schema/status/timed-switch execution model.
21. DSPProfile field-status enums.
22. DSPOpportunity eligibility/status enums.
23. EditorialPitch status/outcome/version model.
24. DSPVideo status/reference relationship with Publication.
25. RevenueScenario versioning/entity.
26. Offer currency/status/versioning.
27. RevenueEvent correction/reversal representation.
28. Cohort-definition policy/calibration.
29. Insight/Hypothesis/Experiment status enums and experiment-arm representation.
30. WeeklyReview persisted artifact/versioning.
31. Artist Brain/Tone Corpus/Candidate Knowledge persistence/versioning.
32. Source archival/snapshot policy for ResearchClaim evidence.
33. Context retrieval chunk/index/ranking schema.
34. AgentRun/context-debug retention policy.
35. Unified workspace timezone/day-boundary policy across Release, Calendar and Analytics.
36. Canonical base-currency / FX policy for Business views.
37. Telemetry event schema/retention.

None of these gaps authorizes a silent MASTER change.

## 8. Product consistency findings

### Confirmed consistent

- Human approval boundary is consistent across Identity, Publishing, Business and AI.
- Missing/unknown/stale semantics are consistent across Analytics, Platform Rules, DSP and Readiness.
- Identity version lineage is consistently consumed downstream without allowing automatic performance-driven mutation.
- Rights are consistently treated as a cross-cutting constraint rather than asset origin.
- Publications and metrics preserve history rather than mutating master creative objects.
- Own validated evidence consistently gains weight as the system matures.
- Manual/CSV/no-AI fallback remains first-class across the full core loop.

### Needs Engineering Spec enforcement

- one shared status/event vocabulary where product behavior overlaps;
- transactional boundaries for cross-domain creation;
- event/outbox strategy for projections/readiness recomputation;
- idempotency across imports, publish jobs, provider callbacks and scheduled switches;
- versioning approach for historically meaningful snapshots;
- centralized timezone/currency/policy registries.

## 9. Next documentation layer

The Full Product Spec is now sufficiently complete to begin **Engineering Specification derivation**, but the correct next step is:

```text
Full Product Spec
→ Architecture Gap / Schema Resolution
→ Engineering Domain Contracts
→ DB schema + relational/JSONB decisions
→ API/Application services
→ Domain events / jobs
→ UI component/state contracts
→ tests mapped to product requirement IDs
→ Codex implementation packages
```

Engineering must derive from these product contracts; it must not redefine product behavior silently.
