# Artist OS — Engineering Spec 01: System Architecture

**Status:** DRAFT / Pass 1  
**Architecture baseline:** MASTER v1.3 §§36–47, 322–353, 339–350, 383–391.  
**Product baseline:** all 20 detailed Product Spec domains.

## ENG-SYS-001 — Deployment shape

MVP is a **modular monolith** with one product web application and a separately runnable worker process sharing domain/application packages and PostgreSQL.

```text
Browser / PWA
    ↓
Next.js Web Application
├─ Presentation / Route handlers / Server actions
├─ Application Services
├─ Domain Modules
├─ AI orchestration adapters
├─ Integration adapters
└─ Repository implementations
        ↓
PostgreSQL + pgvector
        ↘
       Job table / worker runtime
        ↘
       Local or S3-compatible object storage
```

No domain module may import a concrete external provider SDK directly.

## ENG-SYS-002 — Runtime processes

Minimum production runtime:

```text
web
worker
postgres
object storage (external or self-hosted provider)
```

Optional provider services (AI, email capture, platform APIs) remain external integrations.

## ENG-SYS-003 — Layer dependency direction

```text
presentation → application → domain
infrastructure → application/domain interfaces
ai → application/domain interfaces
integrations → application/domain interfaces
workers → application services
```

Forbidden:

```text
domain → Next.js
 domain → OpenAI/provider SDK
 domain → AWS/S3 SDK
 domain → platform SDK
 application → React UI component
```

## ENG-SYS-004 — Bounded modules

Code modules should align with product/domain ownership, not menu routes:

```text
artist
identity
narrative
music
campaigns
content
planning
production
assets
rights
distribution
dsp
growth
business
analytics
intelligence
knowledge
research
aiRuntime
platforms
settings
audit
telemetry
```

Cross-cutting shared code contains primitives only (IDs, Result, money/time helpers, pagination, tracing), not business logic from multiple domains.

## ENG-SYS-005 — Ownership rule

A table/entity has exactly one owning domain. Other domains reference it by ID or consume projections/services. No second “convenience truth” table may silently mirror mutable business state.

Examples:

- Identity owns Identity Versions; Artist Brain consumes a compiled projection.
- Content owns ContentUnit; Distribution owns Publication.
- Assets owns Asset metadata; Rights owns usage evaluation over AssetRights/lineage.
- Analytics owns normalized MetricSnapshot; source domains own raw facts.
- Intelligence owns Insight/Hypothesis/Experiment/Learning/Decision.

## ENG-SYS-006 — Transaction boundary

A synchronous request should mutate one owning aggregate/module transaction whenever possible. Cross-domain follow-up work is performed through explicit application orchestration and/or durable events/jobs.

Do not create a single transaction that updates every downstream projection after a ContentUnit change.

## ENG-SYS-007 — Domain events

Domain/application events exist for durable cross-module reactions, audit and jobs. They are **facts that happened**, not commands disguised as events.

Examples:

```text
IdentityVersionActivated
ContentUnitStatusChanged
ShootSessionCompleted
AssetIngestConfirmed
PublicationPublished
MetricsImported
ExperimentCompleted
LearningValidated
DecisionRecorded
ReleaseDateChanged
OperationalActionCompleted   # provisional ACP-004
```

Event delivery inside the modular monolith may use a PostgreSQL-backed outbox/dispatcher; Kafka is explicitly unnecessary for MVP.

## ENG-SYS-008 — Command discipline

All state-changing operations enter through application commands/services that enforce:

```text
authorization
validation
human-approval policy
current entity state
idempotency where external/retryable
rights / protected-data rules where relevant
audit event emission
```

UI, AI agents and workers do not write repositories arbitrarily.

## ENG-SYS-009 — AI boundary

AI returns structured proposals/results to application services. AI output is never considered committed domain state until the application validates and applies it under the required approval policy.

The application remains operational if AI providers are disabled.

## ENG-SYS-010 — Context boundary

Only Context Assembler selects knowledge/context for agent tasks. Specialist agents receive a prepared Context Pack plus explicit tool permissions. Agents must not independently query “all data about the artist.”

## ENG-SYS-011 — Background operations

The following always use JobService when they can be long-running, retried or provider-bound:

```text
transcription
embeddings
asset analysis
Smart Ingest
moodboard analysis
Brand Book generation
analytics import
platform refresh
agent workflows exceeding request latency budget
weekly review generation
preview generation
```

## ENG-SYS-012 — Deterministic-first UI

Entity pages, Dashboard base data, Pipeline, Calendar and Assets load deterministic persisted/projection data first. AI enrichment is separate async state and must not block primary rendering.

## ENG-SYS-013 — Projection policy

Read-heavy views may use computed/materialized projections when query cost requires it, but projections must declare:

```text
source entities
generation/update mechanism
freshness timestamp
rebuild path
```

A projection never becomes canonical just because the UI reads it most often.

## ENG-SYS-014 — Audit boundary

AuditEvent records security/product-significant changes: approvals, identity changes, knowledge promotion, rights override, config changes, publishing actions, destructive actions and strategic decisions.

High-volume telemetry is **not** stored as AuditEvent.

## ENG-SYS-015 — Raw import boundary

Where practical, imported CSV/API statements retain immutable import-batch/raw-row evidence before normalization. Normalized domain records reference import provenance. This is especially important for metrics and royalty evidence.

## ENG-SYS-016 — Failure isolation

An unavailable integration must degrade only workflows that depend on it. Examples:

- Spotify API unavailable → manual/CSV DSP workflows remain usable.
- AI unavailable → manual Factory/Pipeline/Decision workflows remain usable.
- object-analysis worker unavailable → uploaded assets remain browsable.

## ENG-SYS-017 — Provider replacement

Concrete providers are selected through application configuration / dependency injection. Replacing an AI/storage/publishing/analytics provider must not require a domain migration unless provider-specific external IDs/data are explicitly stored in adapter-owned records.

## ENG-SYS-018 — Provisional ACP boundaries

Until architecture freeze:

```text
PlanningObjective     # ACP-001
Release/ReleaseTrack  # ACP-002
Narrative link model  # ACP-003
OperationalAction     # ACP-004
Take/TakeAsset        # ACP-005
AssetDerivation       # ACP-006
```

may be represented in engineering diagrams/schema drafts, but migrations must be marked provisional and must not be merged as “MASTER-compliant” without ACP approval.

## ENG-SYS-019 — Single-artist-first, artist-scoped data

The product does not implement organization/billing/multi-tenant business logic in MVP. Domain rows still carry `artistId` where logically required to avoid destructive migration when multi-artist support arrives.

## ENG-SYS-020 — No hidden generic platform

Do not create premature generic engines such as universal workflow builder, universal CRM, universal rule engine or universal content graph solely to make the schema “future proof.” Generalization requires at least two proven domain uses with the same semantics.

## Acceptance criteria

- Domain package has no provider/UI imports.
- Primary app works with AI integrations disabled.
- Worker can run independently from web process.
- Every cross-domain mutation path names an owning application service.
- Every projection has a rebuild/source definition.
- ACP-provisional entities are visibly marked in schema docs.
