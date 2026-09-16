# Unified Release Readiness

- **Status:** REVIEW COMPLETE
- **MASTER references:** §192–206, §217–230, §364, §401, §406
- **Domain:** 05_campaigns_releases
- **Feature slug:** `release-readiness`
- **Requirement prefix:** `CMP-RDY`

## 2. Purpose
Answer, with evidence: **what must be ready for this release, what is ready, what is missing, what is optional, and what is stale/unknown?**

## 3. User problem / job-to-be-done
Release preparation spans master/metadata/artwork/profile/pitch/content/link routing/website/video and platform-specific requirements. Static checklists become wrong quickly and hide uncertainty.

## 4. Scope
Unified readiness projection across owning modules. It does not duplicate their canonical records and does not use a universal numeric readiness score.

## 5. Entry points
Release, Campaign, Overview, DSP.

## 6. Preconditions and dependencies
Release required. Capability registry and provider data improve precision but manual mode is first-class.

## 7. Information architecture
Summary by domain; Critical blockers; Required; Recommended; Optional; Unknown/Stale; Deadlines; Evidence/source/freshness.

## 8. User roles and permissions
User can resolve via owner module, manually attest when appropriate, or mark not applicable with reason.

## 9. Core data model
Readiness is preferably computed/projection from source entities + capability knowledge; manual attestations require provenance. Avoid copying every field into Release.

## 10. Main happy-path workflow
Open readiness → system resolves applicable checks from release/platform/capability → user sees blockers → opens owner module → resolves → readiness updates → launch proceeds with remaining explicit optional/unknown items.

## 11. Alternative workflows
No DSP integration; platform requirement unknown; historical release; capability stale; release has no website/merch by design.

## 12. User actions
Open source, mark not applicable, manual confirm with evidence/note, refresh, resolve conflict, acknowledge stale rule.

## 13. State model
Check status: `READY / NOT_READY / BLOCKED / UNKNOWN / STALE / NOT_APPLICABLE`; aggregate uses descriptive state, not percentage alone.

## 14. Business rules
- `CMP-RDY-001` Unified readiness MUST be a projection over canonical domain state.
- `CMP-RDY-002` Requiredness MUST depend on actual campaign/release/platform scope.
- `CMP-RDY-003` Optional work MUST NOT be shown as failure.
- `CMP-RDY-004` Unknown and stale MUST be distinct from not ready.
- `CMP-RDY-005` No metric/data MUST NOT be treated as zero/false automatically.
- `CMP-RDY-006` Platform-specific requirement MUST include source/freshness when derived from capability knowledge.
- `CMP-RDY-007` Stale capability MUST not be represented as current fact.
- `CMP-RDY-008` User can mark a check NOT_APPLICABLE only with explicit scope/reason when it was otherwise suggested.
- `CMP-RDY-009` Critical blocker definition MUST be explainable.
- `CMP-RDY-010` Readiness MUST include master/metadata/artwork/profile/pitch/content/link routing/website/video where applicable per MASTER.
- `CMP-RDY-011` Missing optional website/merch/creator work MUST not prevent release-ready state when not in scope.
- `CMP-RDY-012` Human/manual confirmation MUST retain provenance and timestamp.
- `CMP-RDY-013` AI may summarize readiness but MUST NOT fabricate ready state.
- `CMP-RDY-014` A release may proceed with acknowledged UNKNOWN item if user chooses; system records risk/decision rather than hard-blocking universally.
- `CMP-RDY-015` Release date change MUST recompute date-sensitive checks/deadlines.
- `CMP-RDY-016` Readiness should expose source module for every actionable missing item.
- `CMP-RDY-017` No fake `94% ready` should be primary representation; counts/categories may be secondary convenience if semantically safe.

## 15. AI behavior
Summarize blockers, propose next actions, explain stale/unknown. Cannot override source-of-truth state.

## 16. Human approval
Manual attestations, not-applicable decisions, proceed-with-risk decision and destructive provider actions require user confirmation.

## 17. Validation
Manual ready attestation requires note/evidence for checks normally provider-derived; stale source cannot silently become verified.

## 18. UI states
Fully ready, minimum ready, blockers, unknowns, stale rules, no integration, loading refresh, source error.

## 19. Edge cases
Platform removes feature; deadline passed; asset rights unknown; distributor delayed; release date moved; duplicate metadata source conflict.

## 20. Cross-module effects
Overview attention, Launch plan, Calendar and DSP plan consume readiness.

## 21. Notifications and attention model
Critical blockers/deadlines only; user can snooze non-critical recommendations.

## 22. Search / filtering / sorting / bulk actions
Filter checks by domain/severity/status/platform. Bulk not-applicable disallowed for critical checks.

## 23. Analytics and product telemetry
Time-to-ready, recurring blockers, manual attestation frequency, stale-rule incidents.

## 24. Learning feedback
Operational bottlenecks may form process insights, not artistic learnings by default.

## 25. Auditability / provenance
Every check exposes source entity/provider/manual/source claim and last verified timestamp.

## 26. Desktop / mobile behavior
Desktop full matrix; mobile blocker-first checklist.

## 27. Accessibility / usability
Every icon/status has text; blocker explanation in plain language.

## 28. Security / privacy / rights
Rights status may be sensitive but required internally; external export controlled.

## 29. Performance / async jobs
Refresh external capability/provider data async; readiness UI renders cached persisted state immediately.

## 30. Acceptance criteria
- `CMP-RDY-AC01` User can see required/recommended/optional/unknown separately.
- `CMP-RDY-AC02` Every blocker deep-links to owning module.
- `CMP-RDY-AC03` Stale platform rule is visibly stale.
- `CMP-RDY-AC04` Missing optional work does not block readiness.
- `CMP-RDY-AC05` Manual ready state records provenance.
- `CMP-RDY-AC06` Date change recomputes affected checks.
- `CMP-RDY-AC07` No primary fake readiness percentage is required to understand state.

## 31. Test matrix
No integrations, full integrations, stale capability, passed deadline, rights unknown, date move, manual attestation, optional feature omitted.

## 32. Open questions
Whether readiness checks are persisted snapshots, fully computed projections, or hybrid; likely hybrid with audit history.

## 33. Traceability
MASTER §230 Release Readiness, §217–222 Platform Capability Registry, §192–196 Profile Readiness.
