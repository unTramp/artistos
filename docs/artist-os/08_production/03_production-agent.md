# Capability-Aware Production Agent

- **Status:** REVIEW COMPLETE
- **MASTER references:** §162–163, §141, §327, §330, §337–338, §452
- **Domain:** 08_production
- **Feature slug:** `production-agent`
- **Requirement prefix:** `PRD-AGT`

## 2. Purpose
Turn an approved Content Angle into a concrete, shootable production plan that respects real equipment, location, skill, identity and rights constraints.

## 3. User problem / job-to-be-done
Creative ideas often fail at execution because the production brief is too vague or assumes resources the artist lacks. The artist needs actionable instructions and fallbacks, not cinematic fantasy.

## 4. Scope
Production plan generation, feasibility check, shot/setup suggestions, fallback options, identity/rights constraints, ProductionIntent and effort assumptions.

## 5. Entry points
Approved Angle, Execution Package, ContentUnit detail, Shoot Planner.

## 6. Preconditions and dependencies
Content intent required; Capability Profile optional but strongly preferred; Identity Capsule, Song/Segment/AudioUsage, available Assets and rights context used when relevant.

## 7. Information architecture
Input/context preview → production intent → proposed setup → shot plan → constraints → fallback → rationale → approve/edit/send to Shoot.

## 8. User roles and permissions
Single artist can run/edit/approve. Agent has read context/create plan permissions only; it cannot mark shots complete or publish.

## 9. Core data model
Uses AgentRun/Configuration, Context Pack, ExecutionPackage/ContentUnit, ProductionCapabilityProfile, ShootSession/Shot candidates, Asset requirements, Identity constraints and rights warnings. Whether production plan itself is versioned entity remains schema decision.

## 10. Main happy-path workflow
Approved concept → Context Assembler builds relevant pack → Production Agent checks feasibility → returns structured plan with required resources, setup, shots, audio, identity constraints and fallback → Guard checks → user edits/approves → ShootSession/Shot plan created.

## 11. Alternative workflows
No capability profile; user requests cinematic stretch concept; missing rights; existing source asset means no shoot; no crew; location unavailable; AI unavailable/manual production brief.

## 12. User actions
Set ProductionIntent, request plan, edit setup/shots, choose fallback, mark missing resource, approve/create Shoot, reject with reason, rerun bounded variant.

## 13. State model
Draft proposal → Reviewed/Edited → Approved → materialized into Shoot plan; rejected remains historical. AgentRun has own execution states.

## 14. Business rules
- `PRD-AGT-001` Production Agent MUST only generate plans from an approved or explicitly user-selected creative intent.
- `PRD-AGT-002` Plan MUST use known available capabilities and MUST NOT invent equipment/location/crew.
- `PRD-AGT-003` When required capability is missing, plan MUST flag it and SHOULD offer a feasible fallback.
- `PRD-AGT-004` Plan MUST identify ProductionIntent: AUTHENTIC, CASUAL, POLISHED, CINEMATIC or EXPERIMENTAL.
- `PRD-AGT-005` ProductionIntent MUST guide treatment, not imply a universal better/worse ranking.
- `PRD-AGT-006` Plan SHOULD reference exact SongSegment/AudioUsage where content concept requires it.
- `PRD-AGT-007` Plan MUST include critical Identity constraints and MUST NOT silently override them.
- `PRD-AGT-008` Intentional Identity deviation requires explicit deviation path/human approval.
- `PRD-AGT-009` Rights-uncertain external assets MUST be flagged before plan can be treated as publish-ready.
- `PRD-AGT-010` Agent MUST separate required resources from optional enhancements.
- `PRD-AGT-011` Agent SHOULD optimize for feasible production effort consistent with user goal, not maximum complexity.
- `PRD-AGT-012` Agent MUST NOT claim a setup will guarantee performance/reach.
- `PRD-AGT-013` If context is insufficient, agent MAY return a partial plan/questions/unknowns rather than fabricate details.
- `PRD-AGT-014` Agent MUST preserve explainability: why each major setup choice exists.
- `PRD-AGT-015` Variant/retry count MUST be bounded by Agent budgets.
- `PRD-AGT-016` Approved plan MUST remain editable by human before/on set.
- `PRD-AGT-017` Agent MUST NOT execute purchasing, scheduling, shooting, publishing or destructive actions.
- `PRD-AGT-018` Existing suitable Assets SHOULD be considered before requiring new production.

## 15. AI behavior
Uses Production Agent + Identity Guard with Context Request scoped to ContentUnit/Song/Campaign/Production. Structured output required: intent, setup, required/optional resources, shot instructions, audio, constraints, risks, fallback, rationale. Insufficient evidence is valid.

## 16. Human approval
All production plan commitment and any deviation/acquisition choice requires human approval.

## 17. Validation
Structured output schema; resource references; rights status; Identity constraints; valid SongSegment; no impossible/contradictory shot requirements.

## 18. UI states
Ready, missing context, generating, proposal, edited, blocked by rights/resource, fallback available, approved, failed, AI unavailable.

## 19. Edge cases
Capability changes after approval; user replaces camera on-set; same plan covers multiple platform crops; existing asset partially satisfies concept; agent suggests unsupported software function.

## 20. Cross-module effects
Creates/updates Shoot/Shot drafts, AssetAcquisitionPlan where appropriate, Pipeline next action and Guard warnings.

## 21. Notifications and attention model
Only approved shoot plan with unresolved critical missing resource/rights near shoot date should surface.

## 22. Search / filtering / sorting / bulk actions
Not primary. Historical agent plans filterable by ContentUnit/Shoot/status.

## 23. Analytics and product telemetry
Plan acceptance, edits, fallback chosen, missing-resource rate, agent retries/cost/latency, shoot completion conversion.

## 24. Learning feedback
User edits/rejections inform product/agent evals; repeated feasibility issues may inform capability/process observations, never automatic Identity change.

## 25. Auditability / provenance
AgentRun config, Context Pack sources, output version, user edits, Guard findings.

## 26. Desktop / mobile behavior
Desktop plan authoring; mobile read/edit critical instructions and choose fallback.

## 27. Accessibility / usability
Plain-language setup; avoid jargon unless item/skill context supports it; distinguish required vs optional visually and textually.

## 28. Security / privacy / rights
Private locations/internal story remain scoped; external asset rights warnings preserved.

## 29. Performance / async jobs
Agent run via JobService; page renders existing plan immediately. Cancellation/retry bounded/idempotent.

## 30. Acceptance criteria
- `PRD-AGT-AC01` Plan never assumes unconfirmed gear.
- `PRD-AGT-AC02` Missing capability produces warning/fallback.
- `PRD-AGT-AC03` Identity/rights constraints are present and traceable.
- `PRD-AGT-AC04` Human can edit plan before Shoot creation.
- `PRD-AGT-AC05` Agent can return insufficient context instead of hallucinating.

## 31. Test matrix
Full profile; no profile; missing light; rights blocked; existing asset; identity deviation; AI outage; invalid segment; capability change post-approval.

## 32. Open questions
Whether approved ProductionPlan needs dedicated versioned entity distinct from ExecutionPackage/ShootSession.

## 33. Traceability
MASTER §141, §162–163, §327, §330, §337–338, §452.
