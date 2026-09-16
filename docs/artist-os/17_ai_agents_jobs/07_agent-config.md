# Agent Configuration

- **Status:** REVIEW COMPLETE
- **MASTER references:** §331–333, §337–338
- **Domain:** 17_ai_agents_jobs
- **Feature slug:** `agent-config`
- **Requirement prefix:** `AI-CFG`

## 2. Purpose
Version model/prompt/guard/tool/retrieval/output settings and promote them through DRAFT→CANARY→STABLE→RETIRED with measurable rollback criteria.

## 3. User problem / job-to-be-done
Artist OS needs reliable AI assistance that is bounded, testable and observable. This feature prevents ad-hoc model behavior from becoming hidden product logic.

## 4. Scope
### In scope
- AgentConfiguration
- lifecycle
- canary/eval
- rollback
- budget settings

### Out of scope / non-goals
- autonomous audience-facing execution without approval
- provider-specific domain coupling
- hidden unbounded agent behavior

## 5. Entry points
- owning product workflow
- Agent Run/Agents admin
- background job when long-running

## 6. Preconditions and dependencies
- Context Assembler
- AgentConfiguration
- permissions/budgets
- domain repositories/tools allowed for this agent

## 7. Information architecture
Task input → context/config → allowed tools → structured execution → guard/quality checks → human/application handoff → AgentRun/eval telemetry.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
Uses MASTER agent/config/job entities and domain outputs; runtime details remain application/AI layer.

## 10. Main happy-path workflow
1. Receive explicit workflow task
2. Resolve stable/canary configuration
3. Assemble bounded context
4. Execute with allowed tools/budget
5. Validate structured output/guard result
6. Return draft/proposal/result to owning workflow
7. Persist AgentRun and telemetry

## 11. Alternative workflows
- AI provider unavailable
- context insufficient
- tool failure
- budget exceeded
- structured output invalid

## 12. User actions
- run
- cancel if job-safe
- retry where safe
- inspect sources/config
- provide feedback

## 13. State model
Operational run/config/job states follow relevant MASTER lifecycle; domain state changes remain in owning bounded context.

## 14. Business rules
- `AI-CFG-001` config status uses MASTER lifecycle
- `AI-CFG-002` stable promotion needs eval evidence
- `AI-CFG-003` automatic rollback allowed for structured/tool/latency/cost regression
- `AI-CFG-004` subjective creative regression needs human review
- `AI-CFG-005` config version immutable after run use
- `AI-CFG-006` tools/retrieval/schema explicit
- `AI-CFG-007` budget limits required

## 15. AI behavior
Behavior is restricted to the role described above. The agent receives only task-relevant context/tools and must return structured, explainable output or an explicit insufficient-evidence/failure result.

## 16. Human approval
Audience-facing publish/delete/spend and permanent identity/validated-knowledge changes require explicit application/human approval.

## 17. Validation
- configuration exists
- context access valid
- tool permissions valid
- structured output validates
- budget not exceeded

## 18. UI states
- ready
- running
- insufficient context
- provider/tool failure
- budget exceeded
- structured-output retry
- done

## 19. Edge cases
- provider changes model behavior
- stale context cache
- tool returns partial data
- user edits output after run

## 20. Cross-module effects
- Context Assembler
- Agent Runs
- Evals
- owning domain
- Jobs

## 21. Notifications and attention model
- repeated failure/regression
- budget/cost anomaly
- canary quality regression

## 22. Search / filtering / sorting / bulk actions
Filter by agent/workflow/config/status/date. Bulk rerun only for safe idempotent draft workflows; never bulk audience-facing actions.

## 23. Analytics and product telemetry
- run success/failure
- latency
- token/cost
- structured retry
- user acceptance/rejection
- guard override

## 24. Learning feedback
Feedback informs eval/config improvements; it does not silently change domain truth.

## 25. Auditability / provenance
Persist config/version/context metadata/tool outcomes/structured result references without secrets or private chain-of-thought.

## 26. Desktop / mobile behavior
Normal product flows are responsive; deep config/debug is desktop-first. Mobile supports job/result status where relevant.

## 27. Accessibility / usability
Clear run status, failure reason and whether result is draft vs executed fact.

## 28. Security / privacy / rights
Least-privilege tools, server-side secrets, sensitive-context minimization and audited side effects.

## 29. Performance / async jobs
Long-running operations use JobService with idempotency/retry policy; core page rendering is not blocked by AI.

## 30. Acceptance criteria
- `AI-CFG-AC01` The feature follows its MASTER role/permission boundary.
- `AI-CFG-AC02` Provider failure leaves a usable manual/deterministic product path where applicable.
- `AI-CFG-AC03` Every run is tied to configuration/context metadata.
- `AI-CFG-AC04` No publish/delete/spend occurs without explicit approval.

## 31. Test matrix
- provider unavailable
- tool failure
- insufficient context
- budget exceeded
- canary config

## 32. Open questions
- Detailed structured output schemas and provider-specific retry parameters belong to engineering/eval implementation.

## 33. Traceability
MASTER §331–333, §337–338
