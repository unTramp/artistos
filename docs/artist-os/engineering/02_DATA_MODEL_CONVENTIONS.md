# Artist OS — Engineering Spec 02: Data Model Conventions

**Status:** DRAFT / Pass 1

## ENG-DATA-001 — PostgreSQL is canonical transactional storage

PostgreSQL stores canonical structured state, audit/provenance records and normalized analytics suitable for relational querying. Binary media is stored in object storage; database stores metadata/keys.

## ENG-DATA-002 — IDs

Use opaque UUID-compatible IDs for canonical entity identity. Human-readable keys/slugs are separate mutable/display fields and are never foreign keys or business-logic parsers.

## ENG-DATA-003 — Common timestamps

Canonical mutable entities normally include:

```text
createdAt timestamptz
updatedAt timestamptz
```

Domain-specific temporal facts (`publishedAt`, `recordedAt`, `releaseDate`, `observedAt`, `effectiveFrom`) remain explicit and are not inferred from `createdAt`.

## ENG-DATA-004 — Timezone policy

- Instants are stored as `timestamptz`/UTC semantics.
- Artist workspace stores IANA timezone string.
- Date-only release/planning concepts use explicit local-date semantics plus owning timezone when conversion is required.
- Never infer “day” from UTC for artist-facing calendar/release analytics.

## ENG-DATA-005 — Money

Money fields use exact decimal/minor-unit safe representation plus ISO currency code. Never use binary float.

```text
amount
currency
```

Converted/reporting values are derived and carry FX source/date; original amounts are immutable evidence.

## ENG-DATA-006 — Nullable means unknown/not-applicable

Missing metric/capability/value is `NULL`, not zero or false, unless the source explicitly reports zero/false.

## ENG-DATA-007 — Relational by default for identity/history/query boundaries

Use relational tables when data has independent identity, lifecycle/history, foreign-key references, uniqueness constraints or frequent filtering/aggregation.

Strong relational candidates include:

```text
Artist
Song
Campaign
ContentUnit
Asset
Publication
MetricSnapshot
Experiment
Learning
Decision
IdentityVersion
NarrativeTrack
ShootSession
OperationalAction (provisional)
Take (provisional)
Release (provisional)
```

## ENG-DATA-008 — JSONB is for bounded sparse configuration, not entity dumping

JSONB is appropriate for:

- provider-specific metadata;
- sparse visual/style configuration that is validated by schema;
- immutable structured AI output snapshots;
- flexible source payload preserved for provenance;
- low-query child configuration.

Forbidden: one giant `artistIdentity JSONB` containing the entire Identity domain.

## ENG-DATA-009 — JSONB requires version/schema marker when durable

Durable JSONB contracts include a schema/version discriminator where structure may evolve. Application parses through typed validation, never arbitrary property access.

## ENG-DATA-010 — Enums

Use database enum only for small, truly stable infrastructure values. Product/domain enums expected to evolve may use constrained text + application validation/migration-safe check constraints.

Do not freeze practitioner/platform taxonomies as DB enums if they can change externally.

## ENG-DATA-011 — Status transitions

Status is not merely a string. Every entity with meaningful lifecycle has a transition policy in domain/application code; invalid jumps are rejected. Audit is recorded for important transitions.

## ENG-DATA-012 — Immutable/versioned records

Use immutable revisions for artifacts whose historical meaning matters:

```text
IdentityVersion
published WebExperienceVersion
Offer terms revision
WeeklyReview artifact
AgentConfiguration
Prompt version
BrandBookVersion
```

Editing creates a new revision/version rather than rewriting historical references where product requirements depend on provenance.

## ENG-DATA-013 — Soft archive vs delete

User-visible/history-bearing records normally use archive/status transitions. Physical delete is reserved for explicit destructive/privacy operations and orphan cleanup under a documented policy.

## ENG-DATA-014 — External identifiers

Platform/provider IDs are stored with provider/platform namespace and account context where necessary. Never assume an external ID is globally unique across providers or accounts.

## ENG-DATA-015 — Provenance

Imported/generated/promoted records store sufficient provenance to answer:

```text
where did this come from?
when was it observed/generated?
which source/import/agent config produced it?
was it human-confirmed?
```

## ENG-DATA-016 — Confidence is not universal numeric truth

Where confidence exists, prefer domain-meaningful categorical states plus evidence metadata unless a calibrated numeric probability is genuinely available. Numeric model scores remain implementation evidence, not necessarily user-facing truth.

## ENG-DATA-017 — Evidence links are explicit

Insights, Learnings, Decisions and ResearchClaims reference evidence IDs rather than copying narrative summaries as the only provenance.

## ENG-DATA-018 — Derived/projection fields

If a field can be reliably derived from canonical state, avoid persisting it unless query/performance/history requires persistence. Persisted derived values must declare invalidation/recompute policy.

## ENG-DATA-019 — Import batches

CSV/API imports create an ImportBatch with source, file/provider reference, mapping version, started/completed timestamps, status and validation summary. Normalized rows reference the batch/import key for deduplication and audit.

## ENG-DATA-020 — Idempotency keys

External actions/jobs/imports that may retry accept deterministic idempotency keys. Unique constraints enforce duplicate protection where possible.

## ENG-DATA-021 — Artist scope

Tables whose semantics belong to an artist include `artistId` directly when it materially improves ownership/security/querying, even if an indirect parent path also exists. Avoid blindly adding artistId to pure child rows when it creates consistency risk without benefit.

## ENG-DATA-022 — Polymorphic references

Use polymorphic `entityType/entityId` only for genuinely cross-cutting concerns (AuditEvent, OperationalAction source, generic attachment/evidence) and protect them through application validation. Core domain relationships prefer real FKs.

## ENG-DATA-023 — Graph relationships

Use typed edge tables only when many-to-many/graph semantics are real (e.g. provisional AssetDerivation). Do not replace ordinary relational FKs with a universal entity graph.

## ENG-DATA-024 — Search/vector data

Embeddings are rebuildable indexes derived from source text/assets. They are not canonical knowledge. Every embedding/chunk references source entity/version and embedding model/version.

## ENG-DATA-025 — Raw AI output

Store raw/structured AI result only when required for debugging/provenance and under retention/privacy policy. Canonical domain state contains validated fields, not opaque LLM blobs.

## ENG-DATA-026 — Secrets never live in domain tables

OAuth refresh tokens/API secrets use encrypted integration credential storage with strict access boundaries. Domain/provider-profile rows reference credential handles, not plaintext secrets.

## ENG-DATA-027 — PII minimization

Fan audience data remains aggregated by default. Generic metadata/JSONB must not become an accidental dumping ground for person-level contact data.

## ENG-DATA-028 — Future provisional schema markers

ACP-001…ACP-006 are approved in MASTER v1.4 and must not carry provisional markers. For a **future unapproved ACP only**, logical/physical schema docs tag dependent tables/fields as:

```text
PROVISIONAL[ACP-xxx]
```

Migration filenames and code comments must not imply a future ACP is architecture-final before approval.

## Definition of Done for a table/entity design

A table/entity is not ready for implementation until its spec defines:

- owner domain;
- purpose/non-goals;
- primary key and artist scope;
- required/nullable fields;
- lifecycle/status transitions;
- relations/cardinality;
- uniqueness/idempotency;
- version/history behavior;
- deletion/archive/privacy behavior;
- indexes/query reasons;
- provenance/audit expectations;
- requirement/ACP traceability.
