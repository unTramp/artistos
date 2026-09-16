# Context Assembler

- **Status:** REVIEW COMPLETE
- **MASTER references:** §120–126, §341–347
- **Domain:** 16_knowledge_research_context
- **Feature slug:** `context-assembler`
- **Requirement prefix:** `KNW-CTX`

## 2. Purpose
Build the minimal sufficient, ordered and provenance-rich context pack for each AI task instead of letting agents fetch an unbounded “whole Brain”.

## 3. User problem / job-to-be-done
Large indiscriminate context is expensive, contradictory and unsafe. AI needs the right hard rules, identity, song, campaign and learnings for the specific task.

## 4. Scope
### In scope
- Context Request
- IdentityContextCapsule
- Context Pack
- priority order
- budgets
- retrieval/filtering
- cold/warm/mature weighting
- cache/invalidation

### Out of scope / non-goals
- agent-controlled unlimited retrieval
- full Brand Book every call
- fine-tuning in MVP

## 5. Entry points
- all AI workflows
- debug viewer

## 6. Preconditions and dependencies
- Artist Brain
- Identity
- Song Brain
- Learnings
- Campaign
- Platform/Market knowledge
- Tone Corpus

## 7. Information architecture
Agent/workflow submits Context Request → Assembler resolves hard scope → applies priority and freshness → retrieves bounded relevant chunks/examples/learnings → builds Identity Capsule → enforces budgets → emits Context Pack + SourceReferences/metadata.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
MASTER Context Request/IdentityContextCapsule/Context Pack/priority/budgets. Context pack is runtime/application object, not domain source of truth.

## 10. Main happy-path workflow
1. inspect context debug
2. rerun with task parameters
3. open source
4. adjust permitted retrieval configuration in agent config

## 11. Alternative workflows
- song absent
- cold start
- conflicting learning
- stale platform knowledge
- explicit user request conflicts with preference but not hard rule

## 12. User actions
- assemble
- debug
- open source
- invalidate cache after source change

## 13. State model
Runtime result; caching/version metadata only.

## 14. Business rules
- `KNW-CTX-001` Agents MUST obtain task context through Context Assembler rather than loading all Brain data themselves.
- `KNW-CTX-002` Context priority MUST follow MASTER order: explicit request; safety/hard rules; identity constraints; artist identity/voice; song; validated own learning; campaign; fresh platform/market knowledge; historical examples.
- `KNW-CTX-003` Hard rules MUST not be displaced by lower-priority examples.
- `KNW-CTX-004` IdentityContextCapsule MUST remain compact and MUST NOT include full Brand Book by default.
- `KNW-CTX-005` Context budgets MUST enforce maxChunks/maxTokens/maxExamples/maxLearnings.
- `KNW-CTX-006` Explicit songId MUST strongly scope retrieval to that Song Brain unless comparison requested.
- `KNW-CTX-007` STALE/DEPRECATED learning/claims MUST be downweighted/excluded according to policy.
- `KNW-CTX-008` Cold start MUST not disguise generic best practice as personalized learning.
- `KNW-CTX-009` Warm/mature state SHOULD increasingly weight own validated evidence.
- `KNW-CTX-010` Authoritative current platform hard constraint may outrank artist historical tactic where genuinely required.
- `KNW-CTX-011` SourceReferences MUST accompany retrieved claims/examples sufficient for observability.
- `KNW-CTX-012` Context assembly MUST be deterministic enough to debug given source/index/config versions.
- `KNW-CTX-013` AI provider/model MUST not decide permanent retrieval policy ad hoc.
- `KNW-CTX-014` Cache invalidation MUST follow source/version changes.

## 15. AI behavior
Assembler itself may use embeddings/ranking models, but outputs structured context and provenance. Insufficient relevant context is valid.

## 16. Human approval
Users do not approve each retrieval, but sensitive permanent knowledge and provider actions are controlled upstream.

## 17. Validation
- request artistId valid
- budgets nonnegative
- source access permitted
- identity version resolvable

## 18. UI states
- cold start
- normal
- partial
- conflict
- stale knowledge
- budget truncated

## 19. Edge cases
- explicit request asks off-identity experiment
- no song
- multiple campaigns
- private source not allowed for external task

## 20. Cross-module effects
- All Agents
- Knowledge
- Identity
- Learning

## 21. Notifications and attention model
- context conflict/hard-rule violation
- stale platform constraint

## 22. Search / filtering / sorting / bulk actions
Debug filters by source/type/priority/token contribution.

## 23. Analytics and product telemetry
- context assembled
- source selected/excluded
- budget truncation
- cache hit

## 24. Learning feedback
Context quality feedback improves retrieval/evals, not domain truth.

## 25. Auditability / provenance
AgentRun stores source/chunk/rule/token metadata.

## 26. Desktop / mobile behavior
Desktop debug viewer; normal users see concise “Based on” explanations.

## 27. Accessibility / usability
Explain source/why-selected in debug; avoid overwhelming normal UI.

## 28. Security / privacy / rights
Access-control filters before retrieval; private Internal Canon excluded from external-facing workflow unless needed/approved.

## 29. Performance / async jobs
Embedding/retrieval/cached summaries may be async/precomputed; assembly target low latency.

## 30. Acceptance criteria
- `KNW-CTX-AC01` Agent cannot load entire Brain independently.
- `KNW-CTX-AC02` Hard rules outrank examples.
- `KNW-CTX-AC03` Token budgets enforced.
- `KNW-CTX-AC04` Cold start does not fake personalized learning.
- `KNW-CTX-AC05` Source references are inspectable.

## 31. Test matrix
- cold start
- conflict
- stale knowledge
- budget truncation
- explicit experiment

## 32. Open questions
- Retrieval ranking weights/chunking/index strategy belongs to engineering/eval calibration.

## 33. Traceability
MASTER §120–126, §341–347
