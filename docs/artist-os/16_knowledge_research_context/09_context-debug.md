# Context Debug & Observability

- **Status:** REVIEW COMPLETE
- **MASTER references:** §126, §334, §391
- **Domain:** 16_knowledge_research_context
- **Feature slug:** `context-debug`
- **Requirement prefix:** `KNW-DBG`

## 2. Purpose
Make AI behavior diagnosable by showing which sources, rules and context chunks were used for a run without exposing hidden model chain-of-thought.

## 3. User problem / job-to-be-done
When AI output feels generic or wrong, product/engineering need to know whether bad context, stale knowledge, wrong identity version or prompt/config caused it.

## 4. Scope
### In scope
- AgentRun context metadata
- source/chunk/rule list
- token estimate
- priority/exclusion reason
- config/version links
- traceId/jobId correlation

### Out of scope / non-goals
- private model chain-of-thought
- raw secrets
- dumping full sensitive corpus by default

## 5. Entry points
- AgentRun detail
- failed output feedback
- developer/debug mode

## 6. Preconditions and dependencies
- Context Assembler metadata
- AgentConfiguration
- structured logs

## 7. Information architecture
Open AgentRun → inspect request/config → context summary → selected sources/chunks/rules/token allocation → excluded/stale warnings → tool/job timeline → output/eval result.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
Observability projection over AgentRun/Context Pack/trace logs.

## 10. Main happy-path workflow
1. open source
2. compare runs/configs
3. copy trace ID
4. flag wrong source/context

## 11. Alternative workflows
- source deleted after run
- private source redacted
- cache used
- run failed before generation

## 12. User actions
- inspect
- compare
- report issue

## 13. State model
Historical immutable-ish run record.

## 14. Business rules
- `KNW-DBG-001` Context debug MUST show sources/chunks/rules and assembled-context metadata sufficient to reproduce/debug selection.
- `KNW-DBG-002` It MUST NOT expose private chain-of-thought or hidden reasoning tokens.
- `KNW-DBG-003` Sensitive source content SHOULD be redacted according to access while retaining reference metadata.
- `KNW-DBG-004` AgentConfiguration/prompt/guard version MUST be linked.
- `KNW-DBG-005` Cache hits/invalidation version SHOULD be visible.
- `KNW-DBG-006` Budget truncation/excluded stale context SHOULD be observable.
- `KNW-DBG-007` TraceId/jobId/agentRunId SHOULD correlate across logs.
- `KNW-DBG-008` Secrets/tokens MUST never appear in debug UI/logs.

## 15. AI behavior
No creative AI behavior required; debug summaries may be generated but raw structured metadata is primary.

## 16. Human approval
Access to sensitive debug content follows user/role security; single artist can inspect own runs.

## 17. Validation
- run exists
- access allowed
- secret redaction applied

## 18. UI states
- complete
- failed
- partial context
- redacted source
- cache hit

## 19. Edge cases
- source deleted
- config retired
- job failed before context complete

## 20. Cross-module effects
- Agent Runs
- Logs
- Context Assembler
- Evals

## 21. Notifications and attention model
- repeated wrong-source retrieval
- high context truncation

## 22. Search / filtering / sorting / bulk actions
Filter agent/workflow/config/date/status/source.

## 23. Analytics and product telemetry
- debug opened
- source flagged
- runs compared

## 24. Learning feedback
Feedback becomes retrieval/eval improvement signal.

## 25. Auditability / provenance
Immutable run/version references.

## 26. Desktop / mobile behavior
Desktop-first; mobile minimal run summary.

## 27. Accessibility / usability
Readable source hierarchy and copyable IDs.

## 28. Security / privacy / rights
Strict secret/private-source redaction.

## 29. Performance / async jobs
Query structured logs/index; no model call required.

## 30. Acceptance criteria
- `KNW-DBG-AC01` No chain-of-thought exposed.
- `KNW-DBG-AC02` Sources/config versions visible.
- `KNW-DBG-AC03` Secrets redacted.
- `KNW-DBG-AC04` Budget truncation visible.

## 31. Test matrix
- deleted source
- failed run
- redaction
- cache hit

## 32. Open questions
- Retention policy for AgentRun/debug payloads needs security/cost decision.

## 33. Traceability
MASTER §126, §334, §391
