# Artist OS Detailed Product Specification — Progress

**Architecture source:** MASTER v1.3 — frozen.

## Pass status

| Domain | Feature specs | Detailed pass | Stable product requirements | Notes |
|---|---:|---|---:|---|
| `01_overview_command_center` | 4 | REVIEW complete | 86 | Command center, attention model, command palette, onboarding/empty states |
| `02_identity` | 17 | REVIEW complete | 281 | Identity discovery → activation → Guard → version/review loop |
| `03_narrative` | 6 | REVIEW complete | 146 | Tracks, Beats, Differentiators, Mix/Coverage, Narrative Analytics |
| `04_songs_music` | 11 | REVIEW complete | 245 | Song Brain, meaning, lyrics, segments, audio, identity context, history and learnings |
| `05_campaigns_releases` | 6 | REVIEW complete | 91 | Campaign orchestration, goals, release lifecycle, launch activation, readiness, momentum windows |
| `06_content_factory` | 11 | REVIEW complete | 120 | Angles, review, exploration, execution, hooks, units, identity check, novelty/fatigue, adaptation |
| `07_pipeline_planning_calendar` | 8 | REVIEW complete | 130 | Pipeline, rhythm, evergreen, series, slots, objectives, calendar, seasonality |
| `08_production` | 9 | REVIEW complete | 133 | Capability-aware production, shoots, shots, On-Set, takes, voice notes, economics |
| `09_assets_media_rights` | 10 | REVIEW complete | 155 | Asset library, Smart Ingest, grouping, transcription, rights, lineage, derivatives, repurposing |
| `10_distribution_owned_media` | 10 | REVIEW complete | 131 | Profile readiness, starter pack, audit, publications, publishing, routing, website, capture, web analytics |
| `11_dsp` | 10 | REVIEW complete | 119 | DSP profiles/plans/opportunities, editorial pitch, source of streams, playlists, video, revenue |
| `12_growth_market` | 8 | REVIEW complete | 89 | Warm network, audience sources, search, markets, geo experiments, LIVE, creator collaboration |
| `13_business_fan_value` | 10 | REVIEW complete | 109 | Goals, portfolio, cohorts, offers, merch, economics, membership, revenue, attribution |
| `14_analytics` | 9 | REVIEW complete | 88 | Normalization, snapshots, baselines, outliers, hook/segment/market/fan-value analytics |
| `15_intelligence_learning_decisions` | 9 | REVIEW complete | 90 | Insights, hypotheses, experiments, learnings, decay, explore/exploit, decisions, reviews |
| `16_knowledge_research_context` | 9 | REVIEW complete | 87 | Artist/Song Brain knowledge, tone, claims, promotion, Context Assembler, debug |
| `17_ai_agents_jobs` | 13 | REVIEW complete | 92 | Orchestrator, specialist agents, config, runs, prompts, evals, routing, jobs |
| `18_platforms_integrations` | 9 | REVIEW complete | 59 | Capability/account/asset requirements, CSV mapping/dedupe, adapters, presence/verification |
| `19_settings_security_portability` | 6 | REVIEW complete | 41 | Settings, secrets/OAuth, privacy, audit, exports, logs |
| `20_product_quality_telemetry` | 6 | REVIEW complete | 42 | Product/AI telemetry, Smart Ingest/Identity KPIs, testing, DoD |

**Current total detailed requirements:** **2,334** stable product requirements across all 20 domains.

## Full-domain milestone

The first detailed **Full Product Spec** pass is complete across every domain directory. The work is now beyond scaffolding: each feature contains product purpose, user problem, flows, states, normative rules, AI behavior, human approval, validation, edge cases, cross-module effects, telemetry, provenance, acceptance criteria and tests.

The first cross-domain reconciliation is also complete:

- [`CROSS_DOMAIN_RECONCILIATION_PASS1.md`](CROSS_DOMAIN_RECONCILIATION_PASS1.md) — ownership, cross-domain contracts, E2E loops and boundary audit.
- [`OPEN_QUESTIONS_REGISTRY.md`](OPEN_QUESTIONS_REGISTRY.md) — consolidated unresolved product/schema questions that must not be silently invented.

## Key architecture/product invariants now specified

- Identity performance signals can create hypotheses, but cannot auto-rebrand the artist.
- `ContentUnit ≠ Publication`; planned Calendar timing ≠ actual publication fact.
- Asset possession/origin/credit does not imply publishing rights.
- `NULL/unknown/stale` remains distinct from zero/failed across analytics/readiness/platform rules.
- Campaign is an orchestration boundary, not a god-object.
- DSP remains distinct from social Distribution and Growth.
- Organic Growth remains distinct from Advertising.
- Business/Fan Value remains distinct from accounting and CRM.
- ResearchClaim governance separates primary-source facts, practitioner heuristics and artist-validated evidence.
- Context Assembler, not individual agents, owns bounded context selection.
- AI cannot publish/delete/spend/change permanent Identity/validated knowledge without explicit approval.
- Manual/CSV/no-AI operation remains first-class throughout the core loop.

## Architecture gaps / schema decisions

A corrected full extraction captures **203** feature-level open questions. Every question now has an explicit resolution layer: **90 proposed architecture resolutions**, **45 Engineering Spec**, **38 Calibration/Evals**, **26 UX/Product Policy**, and **4 Deferred**. See the resolution tracker rather than resolving them ad hoc.

High-impact schema themes include:

1. Campaign / Release / MonthlyObjective / ContentSlot canonical schemas and statuses.
2. `Take`, `ExecutionPackage`, `ProductionPlan`, `Performance` entity boundaries.
3. Publication/adaptation status/version boundaries and shared external-action/task model.
4. Multi-parent media lineage and centralized rights policy.
5. WebExperience/WebStory/LinkDestination versioning and lifecycle.
6. DSP opportunity/pitch/profile/video statuses and task ownership.
7. Revenue scenarios, currencies, event corrections and attribution evidence.
8. Insight/Hypothesis/Experiment review/status/version semantics.
9. Knowledge/Research source persistence, Context retrieval/indexing and AgentRun retention.
10. Cross-cutting timezone, currency, telemetry and policy registries.

None of these questions changes frozen MASTER v1.3 until an explicit Architecture Change Proposal is approved.


## Architecture resolution milestone

Completed after the first Full Product Spec pass:

- corrected `OPEN_QUESTIONS_REGISTRY`: **203** questions from all 181 feature specs;
- `ARCHITECTURE_GAP_CLASSIFICATION`: every question routed to ACP / architecture contract / engineering / UX / eval / deferred;
- **6 Architecture Change Proposals** drafted;
- **62 Architecture Resolution contracts** proposed;
- `OPEN_QUESTIONS_RESOLUTION_TRACKER`: no unowned architecture-review questions remain;
- `ARCHITECTURE_FREEZE_CANDIDATE`: exact next-MASTER change surface documented;
- Engineering Spec started with System Architecture, Data Model Conventions and Logical Data Model.

Important: MASTER v1.3 remains frozen until ACP review/freeze.

## Next documentation phase

```text
Full Product Spec — first pass ✅
↓
Cross-domain reconciliation — pass 1 ✅
↓
Architecture Gap / Schema Resolution — pass 1 ✅
↓
Architecture Freeze Candidate + 6 ACPs ✅
↓
Engineering Specification — pass 1 IN PROGRESS
↓
DB + APIs + domain events + jobs + UI state contracts
↓
tests mapped to product requirement IDs
↓
Codex implementation packages
```

## Engineering Specification — Pass 1 milestone

- Architecture gap classification: 203 open questions assigned to explicit resolution layers.
- Architecture change surface: 6 ACP packages (still PROPOSED; MASTER v1.3 remains authoritative until freeze approval).
- Companion architecture contracts: Architecture Resolution Pass 1 + Cross-Domain Reconciliation Pass 2.
- Engineering Spec Pass 1: documents 01–15 completed as DRAFT/PASS 1.
- Engineering areas covered: system architecture, data conventions, logical model, commands/events, application services, API, jobs/workers, AI runtime, storage/media, integrations, security/privacy, observability, testing/traceability, migrations/rollback, deployment/operations.
- ACP-dependent engineering contracts are explicitly marked PROVISIONAL.
- Next gate: Engineering consistency/traceability audit → Stage 0 Codex handoff package → architecture freeze review.
