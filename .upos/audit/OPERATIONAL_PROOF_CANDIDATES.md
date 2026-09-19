# Artist OS — U-POS Operational Proof Candidates

**Status:** CANDIDATES ONLY — DO NOT EXECUTE IN THIS AUDIT

Candidate count: **3**

The first proof should exercise U-POS governance against real project value while staying bounded and reversible.

---

# Candidate 1 — Repository secret/private-file safety hardening

## Problem

ARTIST-SEC-001:
README creates a root `.env` and runtime defaults private storage to `.data/storage`, but current `.gitignore` protects neither.

## Candidate task

Add reviewed Git protection for secret/private local runtime files and an automated guard that fails if prohibited sensitive/local runtime paths are tracked.

## Why it is a strong first proof

- real P1 project value;
- bounded;
- low implementation complexity;
- non-destructive;
- security concern forces cross-module routing;
- clear before/after evidence;
- independent review is meaningful;
- rollback is trivial.

## Likely U-POS concerns exercised

```text
01 Documentation source/policy
02 Implementer / Reviewer separation
03 repository-security verification skill
04 Change Class + Security concern
05 Context Bundle from MASTER + finding + repo state
06 branch/commit/Integration Request
07 exact-target evidence / review
08 execution trace
10 Security review
11 GitHub/project command bindings
```

## Acceptance criteria

- `.env` and applicable env variants cannot be accidentally tracked by ordinary add;
- `.env.example` remains tracked;
- `.data/` or canonical private local storage is excluded;
- guard/check covers the intended prohibited paths;
- no existing secret is printed or copied;
- relevant tests/checks pass against exact head;
- independent reviewer confirms policy alignment.

## Risk

LOW, with security significance.

---

# Candidate 2 — Documentation authority metadata reconciliation

## Problem

CONFLICT-001/002/003 create local ambiguity:
- v1.3 says current;
- AR source says proposed;
- freeze decision says waiting for merge although merge occurred.

## Candidate task

Introduce/reconcile an authoritative document catalog/status overlay and minimal non-semantic status annotations where approved, without changing v1.3/v1.4 product semantics or requirement numbering.

## Why it is useful

- tests UPOS-01 on a real mature documentation corpus;
- forces canonical owner resolution;
- validates historical-vs-current semantics;
- directly improves future agent source resolution.

## Likely U-POS concerns exercised

```text
01 Documentation
02 Documentation Guardian / Reviewer
04 documentation work type + governance concern
05 authority-aware context
06 repository mechanics
07 criteria/evidence/review
08 audit trail
09 possible learning feedback
11 path/source bindings
```

## Acceptance criteria

- exactly one current MASTER is resolvable;
- AR-001…AR-062 current normativity is unambiguous;
- historical decision evidence remains intact;
- no product requirement semantics change;
- all references remain valid;
- independent reviewer verifies no silent architecture rewrite.

## Risk

LOW to MEDIUM because documentation authority affects future agents.

---

# Candidate 3 — Expand architecture-boundary verification

## Problem

ARTIST-ARCH-002:
current `arch:check` only rejects a small provider/runtime import list inside `packages/core`.

## Candidate task

Define a small, project-approved dependency-direction contract and extend automated architecture verification to detect at least:
- prohibited package direction;
- selected cross-layer imports;
- cycles or newly forbidden provider leakage where technically practical.

Do not redesign package architecture.

## Why it is useful

- concrete engineering improvement;
- observable pass/fail evidence;
- exercises architecture and quality governance;
- bounded enough for an independent PR;
- avoids touching product behavior.

## Likely U-POS concerns exercised

```text
01 canonical architecture source
02 Architecture/Implementer/Reviewer roles
03 architecture-conformance skill
04 Engineering work type + architecture concern
05 exact architecture context
06 branch/commit/IR mechanics
07 criterion/evidence/verdict
08 check telemetry
11 command/CI binding
```

## Acceptance criteria

- governed dependency rules are documented before code enforces them;
- current valid architecture passes;
- at least one fixture/test proves a prohibited relationship fails;
- the check does not invent domain ownership;
- CI includes the strengthened check;
- exact-head independent review evidence is captured.

## Risk

LOW to MEDIUM.

---

# Recommended proof ordering

This audit does **not** rank candidates as political/evaluative choices; for project execution dependency, the practical sequence is:

```text
repository safety prerequisite
→ documentation authority resolution
→ architecture-check expansion
```

The first two also clear adoption blockers B-01/B-02 and reduce ambiguity for every later U-POS run.

No candidate is executed in this pass.
