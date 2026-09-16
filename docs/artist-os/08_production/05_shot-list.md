# Shot List

- **Status:** REVIEW COMPLETE
- **MASTER references:** §165–166, §169, §187
- **Domain:** 08_production
- **Feature slug:** `shot-list`
- **Requirement prefix:** `PRD-SHT`

## 2. Purpose
Translate a production plan into ordered, atomic on-set instructions tied to ContentUnit and intended audio/identity constraints.

## 3. User problem / job-to-be-done
On set, long briefs are unusable. The artist needs concise, ordered shots with exactly what to capture and what matters most.

## 4. Scope
MASTER Shot fields, ordering, shot status, shot-specific setup/framing/audio/identity requirements, instructions and optional take expectations.

## 5. Entry points
ShootSession, Production Agent output, ContentUnit detail, On-Set.

## 6. Preconditions and dependencies
ShootSession or standalone draft shot plan; ContentUnit for canonical shot linkage where planned content exists.

## 7. Information architecture
Ordered list → compact shot card → detail editor → On-Set current shot projection.

## 8. User roles and permissions
Single artist edits/reorders and marks on-set outcomes.

## 9. Core data model
MASTER `Shot {contentUnitId, plannedOrder, cameraSetup, framing, audioUsage, identityRequirements, instructions, status}` with stable id and ShootSession relation required in implementation.

## 10. Main happy-path workflow
Production plan creates draft shots → user edits/order → On-Set shows one current shot → takes recorded → shot marked SHOT/GOOD/SELECTED/SKIPPED as appropriate → Smart Ingest later associates media.

## 11. Alternative workflows
Shot uses existing audio playback; no Song; one continuous long take covers several derivative units; spontaneous shot inserted; shot skipped; shot repeated with setup variation.

## 12. User actions
Add/edit/duplicate/reorder, set status, attach AudioUsage, add critical constraints, insert spontaneous shot, skip with reason, open ContentUnit.

## 13. State model
MASTER statuses: NOT_STARTED, IN_PROGRESS, SHOT, GOOD, SELECTED, SKIPPED. Product transition validation should allow practical recovery/re-shoot.

## 14. Business rules
- `PRD-SHT-001` Every planned Shot MUST reference a ContentUnit when it exists for that output.
- `PRD-SHT-002` `plannedOrder` MUST be editable and preserve user order unless optimization explicitly permitted.
- `PRD-SHT-003` Shot status MUST use MASTER enum.
- `PRD-SHT-004` `SELECTED` indicates preferred capture outcome/context, not final edited Asset by itself.
- `PRD-SHT-005` `GOOD` MUST not imply selected/final.
- `PRD-SHT-006` `SKIPPED` SHOULD retain reason when meaningful.
- `PRD-SHT-007` Shot-specific setup MUST override session defaults only for that Shot.
- `PRD-SHT-008` AudioUsage SHOULD identify exact segment/playback intent when relevant.
- `PRD-SHT-009` Identity requirements shown On-Set SHOULD be reduced to critical actionable constraints.
- `PRD-SHT-010` Shot instructions SHOULD be concise enough for on-set use.
- `PRD-SHT-011` Spontaneous Shot MAY be added during session with lineage preserved.
- `PRD-SHT-012` Reordering after media recorded MUST not alter recorded timestamps or ingest evidence.
- `PRD-SHT-013` Agent-generated shots remain editable and require human acceptance.
- `PRD-SHT-014` Shot list MUST work without AI.

## 15. AI behavior
May draft shots from approved production plan and recommend order based on setup efficiency; order optimization only when user permits and must preserve artistic dependencies.

## 16. Human approval
User confirms shot plan and on-set status outcomes.

## 17. Validation
Valid ContentUnit/session refs, status enum, plannedOrder uniqueness within session, AudioUsage valid if linked.

## 18. UI states
Draft, ready, current/in-progress, shot, good, selected, skipped, ingest-unmatched.

## 19. Edge cases
One media file spans multiple shots; one shot generates multiple takes; selected take later rejected in edit; ContentUnit cancelled mid-session.

## 20. Cross-module effects
On-Set, Smart Ingest, Pipeline SHOT progression, Asset lineage.

## 21. Notifications and attention model
No per-shot notifications. Remaining required shots may surface while session active/partial.

## 22. Search / filtering / sorting / bulk actions
Order primarily manual; filters completed/remaining; bulk reset/status should be limited.

## 23. Analytics and product telemetry
Shots planned/completed/skipped, reorder frequency, spontaneous additions, take counts.

## 24. Learning feedback
Shot-level production patterns may later inform operational/creative analysis when enough evidence exists.

## 25. Auditability / provenance
Plan source, edits, status transitions, timestamps.

## 26. Desktop / mobile behavior
Desktop planning; mobile optimized execution cards.

## 27. Accessibility / usability
Large touch controls, minimal text, high contrast, no color-only status.

## 28. Security / privacy / rights
Unreleased shot details are private; audio rights warnings propagate.

## 29. Performance / async jobs
Immediate local/state updates; sync resilient. No AI blocking On-Set.

## 30. Acceptance criteria
- `PRD-SHT-AC01` Shot statuses match MASTER.
- `PRD-SHT-AC02` Session defaults can be overridden per shot.
- `PRD-SHT-AC03` On-Set sees concise critical instructions.
- `PRD-SHT-AC04` Spontaneous shot can be inserted with lineage.

## 31. Test matrix
Normal sequence; skip; selected; spontaneous; reorder; audio segment; session default override; AI unavailable.

## 32. Open questions
Whether `GOOD`/`SELECTED` should be Shot statuses or Take-level statuses once a formal Take entity is introduced; MASTER currently assigns statuses to Shot while On-Set includes take counter.

## 33. Traceability
MASTER §165–169, §187.
