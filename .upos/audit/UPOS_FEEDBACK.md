# Artist OS — U-POS Dogfooding Feedback

**Pilot:** first major Artist OS adoption pass  
**U-POS baseline:** frozen v1.0.0  
**Rule:** observations here do not modify U-POS.

Summary:
- OBSERVATION: 2
- FRICTION: 1
- POSSIBLE_GAP: 1
- FRAMEWORK_CHANGE_CANDIDATE: 1
- Possible framework issues counted for final audit status: **2**  
  (`POSSIBLE_GAP` + `FRAMEWORK_CHANGE_CANDIDATE`)

---

## UPOS-FB-001 — Semantic namespace collision in an AI-native governed product

classification: FRAMEWORK_CHANGE_CANDIDATE

observation:
Artist OS, as a product, already owns first-class concepts named:
- AgentRun;
- AgentConfiguration;
- Context Pack / Context Assembler;
- Learning;
- Decision;
- AuditEvent;
- OperationalAction.

U-POS independently owns concepts with overlapping vocabulary:
- Agent Run;
- Context Bundle;
- organizational Learning Candidate/Outcome;
- governance/owner decisions;
- Observability Event/Audit projections;
- Workflow/Engineering action semantics.

evidence:
- Artist OS `packages/core/src/agent-run.ts`, context assembler, learning/decision/action modules and MASTER v1.4.
- U-POS Modules 02, 05, 08, 09.

friction:
A naive Project Adapter may map entities by lexical similarity, creating invalid ownership and identity reuse.

why this may be a framework issue:
UPOS-011 correctly prohibits domain-semantic ownership, but the frozen baseline does not make a first-class **semantic namespace collision protocol** obvious enough for products that themselves implement AI/agent/governance-like concepts.

possible future U-POS consideration:
A reviewed future version could add explicit adapter guidance such as:
- namespace-qualified semantic identities;
- "homonym does not imply mapping" invariant;
- collision register in Project Adapter;
- required semantic-owner comparison before entity mapping.

No v1.0.0 change is proposed or performed here.

---

## UPOS-FB-002 — Historical immutable document with stale internal authority metadata

classification: POSSIBLE_GAP

observation:
Artist OS correctly preserves MASTER v1.3 and freeze/decision history. But v1.3 still internally says "Current Master Source of Truth" while the later merged v1.4 freeze makes that statement historically stale.

A second example:
ARCHITECTURE_RESOLUTION_PASS1.md internally says PROPOSED/v1.3 authoritative, while v1.4 freeze promotes AR-001…AR-062 to normative companion contracts.

friction:
Two desirable principles can conflict:
1. preserve historical artifacts accurately;
2. make current authority resolvable without ambiguity.

why this may be a framework issue:
UPOS-01 has strong status/lifetime concepts, but real adoption benefits from an explicit rule for when an external/current **authority catalog overlay** may supersede stale internal lifecycle metadata without rewriting the historical artifact.

possible future U-POS consideration:
Clarify precedence among:
- historical artifact self-metadata;
- current authoritative document catalog;
- successor/freeze decision;
- immutable historical evidence.

This is especially important for source-resolution agents.

---

## UPOS-FB-003 — Strong project verification exists before U-POS Quality semantics

classification: OBSERVATION

observation:
Artist OS already has a broad CI chain, acceptance reports and phase-specific tests.

U-POS correctly states:
`CI_GREEN != QUALITY_PASS`.

dogfooding result:
This boundary applies cleanly. Adoption should wrap existing check executions as Evidence Records rather than replace the project CI system.

framework impact:
No gap identified. The U-POS separation reduced the temptation to overclaim current-baseline quality when exact workflow-run evidence was unavailable.

---

## UPOS-FB-004 — Project-specific "Learning" demonstrates why owner boundaries matter

classification: OBSERVATION

observation:
Artist OS Learning is a product feature about artist/content evidence.
U-POS Learning is organizational system/process improvement.

dogfooding result:
The U-POS owner model prevents a dangerous collapse of two unrelated learning loops.

framework impact:
No change requested; this is positive validation of the ownership model.

---

## UPOS-FB-005 — Project Adapter completeness pressure

classification: FRICTION

observation:
The Project Manifest standard has broad top-level binding areas, while an early-stage project legitimately has no production deployment, production secret store, live AI provider, U-POS permission runtime or Control Plane.

dogfooding result:
Using explicit `UNRESOLVED`/unbound values works, but reviewers may be tempted to fill blanks to make a manifest look complete.

recommendation for adoption practice:
Treat honest unresolved bindings as valid when the relevant capability is outside the current adoption phase. REQUIRED capabilities for a selected execution must still fail closed.

framework impact:
No semantic change requested in this pass.

---

# Feedback route

```text
this file
→ independent adoption review
→ U-POS-009 / governance intake later
→ evidence / root-cause review
→ Improvement Proposal if warranted
→ canonical U-POS owner review
→ possible future version
```

Frozen U-POS v1.0.0 remains unchanged.
