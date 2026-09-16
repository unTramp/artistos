# Artist OS — Engineering Spec 13: Testing & Traceability

**Status:** DRAFT / Pass 1

## 1. Traceability

Canonical chain:

```text
MASTER §
→ Product Requirement ID
→ ACP/AR if applicable
→ ENG-* contract
→ implementation symbol/file
→ test ID
→ Codex task/commit
```

Maintain machine-readable requirement→test map for critical paths.

## 2. Test layers

### Unit
State machines, invariants, metrics formulas, confidence/freshness, rights composition, context selection, money/time utilities.

### Integration
Postgres repositories, outbox/jobs, storage, import normalization, adapter contracts, structured AI outputs.

### Contract
Provider/adapter fixture tests and API schemas without depending on live providers in normal CI.

### E2E
Core and Release loops from MASTER plus On-Set/offline and import flows.

### Eval
AI quality/grounding/identity/mystique/analytics behavior using versioned golden dataset.

## 3. Critical invariant tests

Must include:

```text
Identity cannot auto-activate from analytics
NULL metric != 0
Publication != ContentUnit
rights UNKNOWN not silently ALLOW
credit != license
one viral outlier not promoted as universal learning
Campaign does not own Release/Content/DSP state
Job retry does not duplicate external effect
Take selection history preserved [PROVISIONAL ACP-005]
Asset derivation graph is acyclic [PROVISIONAL ACP-006]
```

## 4. Migration tests
Every schema migration has forward test and, where rollback is claimed, rollback/restore test on representative fixture DB.

## 5. Property tests
Useful for money/currency, date-window overlap, derivation graph cycle prevention, pagination cursors and metric formulas.

## 6. Fixture strategy
Fixtures use synthetic artist/song/content data; no private real-user canon or credentials committed to repo.

## 7. Live-provider tests
Run only in controlled environment with dedicated test accounts/quotas; never required for every PR unless provider contract demands it.

## 8. Definition of Done gate

```text
typecheck
lint
unit tests
relevant integration/contract tests
manual smoke where UI/provider-specific
no console errors
no broken routes
traceability updated
```

## 9. Acceptance criteria

- every P0 product flow has E2E coverage plan;
- every architecture invariant has automated test;
- ACP-provisional tests are tagged;
- AI eval regression blocks configuration promotion according to policy.
