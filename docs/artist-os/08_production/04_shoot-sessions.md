# Shoot Sessions

- **Status:** REVIEW COMPLETE
- **MASTER references:** §164–169, §187, §428
- **Domain:** 08_production
- **Feature slug:** `shoot-sessions`
- **Requirement prefix:** `PRD-SHO`

## 2. Purpose
Group planned production into a real-world session with shared setup, wardrobe, lighting and content targets, reducing repeated setup work and preserving production lineage.

## 3. User problem / job-to-be-done
An artist often shoots several clips in one setup. Without a session model, instructions, takes and assets become disconnected, and later it is hard to know what was intended versus what was recorded.

## 4. Scope
ShootSession planning, linked ContentUnits/Songs, setup, wardrobe, lighting, camera, location, IdentityVersion, status, shot list, readiness and session-level changes.

## 5. Entry points
Production, Pipeline TO_SHOOT items, Calendar, approved Production plan, command palette Start Shoot.

## 6. Preconditions and dependencies
At least one intended production target or explicit freeform session. Capability/resource availability and Identity context recommended.

## 7. Information architecture
Shoot list → session detail → readiness/setup → shots → On-Set launch → resulting assets/summary.

## 8. User roles and permissions
Single artist creates/edits/runs session. Future crew roles deferred.

## 9. Core data model
MASTER `ShootSession {id,date,location,songs,setup,wardrobe,lighting,camera,identityVersionId,status}` plus relationships to ContentUnits/Shots and optional Era/capability references. Formal status enum not defined in MASTER.

## 10. Main happy-path workflow
Select TO_SHOOT work → create session → group compatible items → configure shared setup/resources → generate/order Shots → readiness check → start On-Set → record takes → finish session → Smart Ingest links files → Pipeline progresses.

## 11. Alternative workflows
Spontaneous shoot; one-shot session; multi-song batch; no Song; location changes; shoot partially completed; session rescheduled; existing footage means planned shot skipped.

## 12. User actions
Create/edit/reschedule, add/remove/reorder shots, group content, update setup, run readiness, start/finish, pause/cancel, duplicate setup for future session.

## 13. State model
Product behavior: Draft/Planned/Ready/In Progress/Completed/Partially Completed/Cancelled. MASTER leaves `status` open; implementation must freeze enum later.

## 14. Business rules
- `PRD-SHO-001` ShootSession MUST group real production work; it MUST NOT be required for content that needs no shoot.
- `PRD-SHO-002` Session MAY contain multiple Songs and ContentUnits.
- `PRD-SHO-003` Shared setup MUST not overwrite shot-specific overrides.
- `PRD-SHO-004` Session MUST preserve IdentityVersion used/planned at time of shoot.
- `PRD-SHO-005` Active Era SHOULD be captured where relevant without rewriting historical session after Era changes.
- `PRD-SHO-006` Resource availability conflicts SHOULD be detected before On-Set.
- `PRD-SHO-007` Removing a planned Shot from a session MUST not delete the underlying ContentUnit.
- `PRD-SHO-008` Completing session MUST NOT automatically mark every Shot GOOD/SELECTED.
- `PRD-SHO-009` Partially completed session MUST preserve completed vs remaining Shots.
- `PRD-SHO-010` Rescheduling MUST propagate planning context but not alter recorded asset timestamps/history.
- `PRD-SHO-011` Session setup edits during On-Set MUST be auditable when they materially affect shot instructions.
- `PRD-SHO-012` Session readiness SHOULD summarize missing critical resource, rights, audio or unresolved Identity deviation.
- `PRD-SHO-013` Readiness MUST distinguish unknown from failed requirement.
- `PRD-SHO-014` Batch efficiency MAY be suggested, but user order/artistic intent takes precedence.
- `PRD-SHO-015` Session can be created/run without AI.
- `PRD-SHO-016` Finished session remains immutable enough for historical lineage; corrections require explicit audit-safe edit.

## 15. AI behavior
Can suggest compatible grouping/order/setup and missing readiness items; cannot start/finish session or mark outcomes. Optimization only with user permission.

## 16. Human approval
Session creation can be manual; grouping/order suggestions approved by user. Starting/stopping and shot outcome are explicit human/on-set actions.

## 17. Validation
Date/location optional until planned; referenced resources exist/available; shots valid; audio/rights warnings surfaced; no impossible duplicate ordering.

## 18. UI states
Draft, ready, missing resource, planned, in progress, partial, completed, cancelled, past with ingest pending.

## 19. Edge cases
Shoot crosses midnight; device clocks wrong; content removed mid-session; identity changes before rescheduled shoot; item shot spontaneously not on list.

## 20. Cross-module effects
Calendar date, Pipeline states, On-Set, Asset/Smart Ingest, Content Lineage.

## 21. Notifications and attention model
Upcoming session missing critical readiness; ingest pending after completed shoot; reschedule conflict.

## 22. Search / filtering / sorting / bulk actions
Filter date/status/location/Song; bulk add TO_SHOOT units if compatible.

## 23. Analytics and product telemetry
Plan-to-complete, shots per session, partial completion, setup changes, time-to-ingest.

## 24. Learning feedback
Operational efficiency data can inform process hypotheses, not artistic quality.

## 25. Auditability / provenance
Session setup versions, status/time changes, shot membership, IdentityVersion, actual completion.

## 26. Desktop / mobile behavior
Desktop planning; mobile/PWA execution entry and quick edits.

## 27. Accessibility / usability
Large start controls on mobile; clear readiness labels; do not overload session page with analytics during shoot.

## 28. Security / privacy / rights
Private location handling; internal unreleased songs/assets remain protected.

## 29. Performance / async jobs
Session CRUD immediate; readiness computation cached; post-session Smart Ingest async.

## 30. Acceptance criteria
- `PRD-SHO-AC01` Multiple content units can share one session without losing individual lineage.
- `PRD-SHO-AC02` Shared setup supports shot overrides.
- `PRD-SHO-AC03` Partial completion preserves remaining work.
- `PRD-SHO-AC04` Completing session does not auto-select takes.
- `PRD-SHO-AC05` Session works without AI.

## 31. Test matrix
Single shot; batch multi-song; partial; cancel; reschedule; resource conflict; spontaneous extra shot; completed ingest pending.

## 32. Open questions
ShootSession status enum and normalized representation of setup/wardrobe/lighting/camera fields.

## 33. Traceability
MASTER §164–169, §187, §428.
