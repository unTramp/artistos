# Artist OS — Engineering Spec 08: AI Runtime

**Status:** DRAFT / Pass 1

## 1. Purpose

Implement AI as a controlled, observable proposal/evaluation subsystem over Artist OS data—not as an alternative persistence layer or autonomous source of truth.

## 2. Runtime components

```text
Orchestrator
ContextAssemblerService
AgentConfigurationRegistry
PromptRegistry
AIProvider adapters
ToolRegistry / PermissionGuard
StructuredOutputValidator
Guard / policy checks
AgentRun recorder
Eval harness
Cost/latency budget controller
```

## 3. AgentRun contract

### ENG-AI-001 — AgentRun

```text
AgentRun
id
artistId
workflow
agentType
configurationVersionId
contextManifestRef
status: QUEUED|RUNNING|SUCCEEDED|FAILED|CANCELLED|REJECTED_OUTPUT
startedAt?
finishedAt?
model/provider
inputTokenCount?
outputTokenCount?
cost?
latencyMs?
toolCallCount
resultArtifactRef?
failureCode?
```

No chain-of-thought field exists.

### ENG-AI-002 — Context manifest
Persist compact provenance:

```text
source entity/version IDs
knowledge chunk IDs
research claim IDs
rules/constraints IDs
identity version/era
prompt/config versions
token estimate
```

Full assembled prompt may be short-lived debug data under retention policy.

## 4. Configuration lifecycle

`DRAFT → CANARY → STABLE → RETIRED`.

Promotion requires eval evidence appropriate to agent role. Automatic rollback may occur on schema/tool/latency/cost regressions; subjective creative-quality rollback requires human review.

## 5. Structured outputs

### ENG-AI-003 — Schema-first
Every production workflow declares a machine-validated output schema. Free-form prose is permitted only inside bounded fields.

### ENG-AI-004 — Invalid output
Invalid schema/tool violation → retry within budget or `REJECTED_OUTPUT`; never partially persist malformed domain data.

## 6. Tool permissions

Default physical agents:

```text
Research Agent    read web/research/knowledge; create claims/drafts
Strategy Agent    read context/analytics; create proposals/drafts
Production Agent  read assets/capabilities; create plans/drafts
Analytics Agent   read structured metrics; create insight drafts
Brand/Identity Guard read target + identity/rules; create findings
Orchestrator      route tasks, not bypass specialist permissions
```

Forbidden without application approval:

```text
publish
spend
delete permanent data
activate identity
promote validated knowledge/learning
rights override
```

## 7. Context assembly

### ENG-AI-005 — No agent-owned retrieval strategy
Agent requests a task-specific ContextRequest; Context Assembler returns bounded ContextPack.

### ENG-AI-006 — Budget enforcement
Configuration defines:

```text
maxChunks
maxTokens
maxExamples
maxLearnings
maxToolCalls
maxTurns
timeout
costLimit
```

Exceeded budget ends or degrades workflow explicitly.

### ENG-AI-007 — Priority conflict
Hard rules/identity constraints outrank generic examples and external practitioner advice. Context manifest records conflicts rather than silently choosing lower-authority material.

## 8. Retrieval

Hybrid retrieval may combine:

```text
relational filters
keyword/full-text
pgvector similarity
recency/freshness
scope filters
source authority
```

Vector similarity is candidate retrieval, not truth ranking.

## 9. Model routing

High-reasoning models: research synthesis, weekly strategy, complex analytics.
Lower-cost/faster models: tagging, extraction, classification, metadata, guards where evals prove quality.

Routing config is versioned. Model name is infrastructure/config, not domain field.

## 10. Caching

Cache only stable/version-addressed outputs:

```text
IdentityContextCapsule
ArtistBrainSnapshot
platform playbook summaries
embeddings
schema-valid deterministic-ish extraction results
```

Cache key includes source/config/model version. Source mutation invalidates or supersedes; no stale hidden reuse.

## 11. Grounding rules

### ENG-AI-008 — Analytics grounding
Analytics Agent cannot infer missing metrics or convert NULL to zero.

### ENG-AI-009 — Research grounding
Research outputs carry Finding/Evidence/Source/Date/Authority/Confidence/Application. Unsupported platform claims remain heuristic/unverified.

### ENG-AI-010 — Identity grounding
Creative output references active Identity Version/Era and explicit deviations; performance data cannot auto-rewrite identity.

## 12. Human approval handoff

AI output persists first as proposal/draft/evidence artifact. Application command performs approval transition. Approval screen must show enough rationale/provenance to make human review meaningful.

## 13. Eval framework

Golden cases cover:

```text
artist-aligned vs generic ideas
tone/style compliance
mystique/privacy leakage
grounding/factuality
analytics overclaiming
novelty/repetition
actionability
production feasibility
rights warnings
structured-output validity
```

Store eval case version, expected rubric, config/model, result and reviewer where human-scored.

## 14. Safety/privacy

- Internal Canon only enters workflows that require it.
- Provider payload logging disabled/redacted for protected data where feasible.
- External integration tools never receive the whole Artist Brain by default.
- prompt injection from imported/web material is treated as untrusted content, not instructions.

## 15. Cost controls

Per workflow track:

```text
runs
accepted output rate
retry rate
tokens
cost
latency
manual edit/rejection rate
```

High cost with low acceptance is a product regression signal.

## 16. Acceptance criteria

- AI provider can be disabled without breaking deterministic product core.
- every production AI result is schema-validated;
- every AgentRun is traceable to configuration/context provenance;
- agents cannot self-grant tools/permissions;
- no chain-of-thought is stored or exposed;
- context budget and cost limit are enforced.
