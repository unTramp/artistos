# Takes and Selection Context

- **Status:** REVIEW COMPLETE — ENTITY BOUNDARY OPEN
- **MASTER references:** §168, §170–176, §187; formal `Take` entity not defined
- **Domain:** 08_production
- **Feature slug:** `takes`
- **Requirement prefix:** `PRD-TAK`

## 2. Purpose
Preserve capture attempts and operator selections strongly enough for Smart Ingest/editing to reconstruct what happened on set, without prematurely requiring advanced video-analysis tooling.

## 3. User problem / job-to-be-done
A shot may be recorded many times. After import, the artist needs to know which files likely correspond to which attempt and which attempt was marked good/selected.

## 4. Scope
Take counters/events, GOOD/BAD/SELECT judgments, timestamps, notes, linkage suggestions to imported Assets, selection revisions.

## 5. Entry points
On-Set, Shoot detail, Smart Ingest review, Asset detail.

## 6. Preconditions and dependencies
Shoot/Shot strongly preferred. Historical imports may create inferred take groups without on-set events.

## 7. Information architecture
Shot → take sequence → timestamp/outcome/note → linked/suggested Assets → selected marker.

## 8. User roles and permissions
Single artist/operator controls judgments and final mapping.

## 9. Core data model
MASTER implies take counter and auto-group takes but does not define `Take`. Product requires stable representation of attempt index, shotId, timestamps/event evidence, outcome/selected, notes and linked asset candidates. Formal entity vs event-log+group projection must be decided in schema audit.

## 10. Main happy-path workflow
On-Set records take marker/judgment → media imported → Smart Ingest uses temporal/device/audio/visual signals → proposes asset↔take mapping → user confirms/changes → selected take becomes preferred source for edit without deleting alternatives.

## 11. Alternative workflows
No on-set markers; one file contains several attempts; camera starts/stops before marker; multiple cameras capture same take; imported historical shoot.

## 12. User actions
Review takes, change outcome, select/unselect, add note, confirm/change mapped asset, split/merge inferred groups where supported.

## 13. State model
Capture outcome (unknown/good/bad/selected) and mapping status (unmatched/suggested/confirmed) should remain separate dimensions.

## 14. Business rules
- `PRD-TAK-001` Take outcome and media mapping MUST be separate concepts.
- `PRD-TAK-002` A Take MAY exist before any Asset is imported.
- `PRD-TAK-003` An Asset MAY be imported without a known Take.
- `PRD-TAK-004` Smart Ingest suggestion MUST expose confidence and remain human-confirmed.
- `PRD-TAK-005` SELECT MUST be reversible and MUST NOT delete non-selected attempts.
- `PRD-TAK-006` Multiple camera Assets MAY map to the same take attempt/context.
- `PRD-TAK-007` One continuous Asset MAY contain multiple inferred takes and require manual split/annotation.
- `PRD-TAK-008` Timestamp evidence MUST preserve original file metadata; device offset is applied as matching context, not destructive metadata rewrite.
- `PRD-TAK-009` GOOD/BAD judgments MUST preserve provenance (on-set/manual later/system never silently).
- `PRD-TAK-010` AI/computer analysis MAY suggest best/matching take in future, but v1.3 MUST NOT replace human selection with opaque scoring.
- `PRD-TAK-011` Missing take markers MUST not block ingest.
- `PRD-TAK-012` Historical imports MAY build inferred take groups with lower confidence.
- `PRD-TAK-013` Formal persistence implementation MUST await schema boundary decision.

## 15. AI behavior
Current MVP uses matching signals rather than autonomous “best performance” judgment. Any future suggestion must provide factors and confidence.

## 16. Human approval
Mapping and selection remain human-confirmable; system can auto-group only as suggested state.

## 17. Validation
No impossible duplicate attempt index within shot context unless merged/import logic explains; asset link valid; selected state consistency.

## 18. UI states
No takes, unmatched, suggested mapping, confirmed, selected, conflicting evidence, historical inferred.

## 19. Edge cases
Multi-cam, one long recording, missing timestamps, wrong camera clock, file copied changing filesystem timestamps, selection changed after edit begins.

## 20. Cross-module effects
Smart Ingest, Asset lineage, Shot status, editing/select source, Pipeline.

## 21. Notifications and attention model
Unmatched selected take/critical ambiguity after ingest may surface inside Shoot/Assets, not global spam.

## 22. Search / filtering / sorting / bulk actions
By Shot/outcome/mapping status; bulk confirm only high-confidence suggestions with explicit review.

## 23. Analytics and product telemetry
Mapping acceptance/correction, confidence calibration, takes per shot, selection change rate.

## 24. Learning feedback
Used to improve Smart Ingest/evals; not artistic performance learning unless later connected to content outcome carefully.

## 25. Auditability / provenance
On-set event vs inferred group vs manual correction, original timestamps and device offset.

## 26. Desktop / mobile behavior
Mobile capture/selection; desktop ingest/reconciliation.

## 27. Accessibility / usability
Confidence shown textually; easy compare timestamps/thumbnail when media exists.

## 28. Security / privacy / rights
Unreleased media private; mappings do not alter rights status.

## 29. Performance / async jobs
Grouping/matching async; manual review responsive.

## 30. Acceptance criteria
- `PRD-TAK-AC01` Take can exist before Asset.
- `PRD-TAK-AC02` Mapping suggestions are reversible and confidence-aware.
- `PRD-TAK-AC03` Multi-camera mapping is possible.
- `PRD-TAK-AC04` Original timestamps are not destructively rewritten.
- `PRD-TAK-AC05` Missing markers do not block ingest.

## 31. Test matrix
Normal marked takes; no markers; multi-cam; long file; clock offset; historical import; changed selection.

## 32. Open questions
Critical: introduce formal `Take` entity vs derive from On-Set events + Smart Ingest groups. Also reconcile Shot statuses GOOD/SELECTED with take-level outcomes in MASTER.

## 33. Traceability
MASTER §168, §170–176, §187. Requires schema/possibly Architecture Change Proposal.
