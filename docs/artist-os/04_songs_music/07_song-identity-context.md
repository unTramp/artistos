# Song Identity Context

## 1. Metadata
- **Spec ID:** `SNG-IDCTX`
- **Domain:** `04_songs_music`
- **Feature:** Song Identity Context
- **Status:** REVIEW
- **MASTER references:** 57, 83–89, 103–106, 122–124, 138–145, 225, 329, 406, 450–452
- **Depends on:** Song, Identity Version; optional Era, Anchors, Interpretation Policy
- **Used by:** Factory, Production, Brand/Identity Guard, Context Assembler, DSP/Owned Media

## 2. Purpose
Define how one song should inherit and, when appropriate, intentionally refine the active artist identity without copying or forking the whole Identity system.

## 3. User problem / job-to-be-done
**JTBD:** “Let this song have its own visual/emotional nuances and symbols while still feeling recognizably like me.”

## 4. Scope
Identity Version/Era linkage, song-specific visual notes, song-specific anchors, allowed overrides and review of conflicts with identity constraints.

Out: independent per-song rebrand, duplicating VisualIdentitySystem, autonomous identity change.

## 5. Entry points
Song Brain → Identity Context, Identity → song usages, Factory/Guard conflict links, Campaign setup.

## 6. Preconditions and dependencies
Song exists. Identity Version required by MASTER `SongIdentityContext`. Era optional.

## 7. Information architecture
- Base Identity Version.
- Optional Era.
- Song visual notes.
- Song-specific Anchors.
- Allowed overrides.
- Inherited non-negotiables.
- Guard preview/conflicts.
- Historical versions/context.

## 8. User roles and permissions
Artist approves base Identity/Era and overrides. AI/Strategy may suggest context based on song material but cannot activate identity changes.

## 9. Core data model
MASTER `SongIdentityContext`:
```text
songId
identityVersionId
eraIdentityId?
songSpecificVisualNotes
songSpecificAnchors[]
allowedOverrides[]
```

## 10. Main happy-path workflow
1. User opens Song Identity Context.
2. System proposes current active Identity Version as base, without silently changing historical context.
3. User confirms or intentionally selects another relevant Identity Version/Era.
4. Adds song-specific visual/emotional notes.
5. Links compatible song-specific Anchors.
6. Defines explicit allowed overrides where the Song needs variation.
7. Guard previews conflicts with Identity Constraints/Mystique/Vertical rules.
8. User resolves conflicts or records approved deviation where appropriate.
9. Context becomes available to Factory/Production/Guard.

## 11. Alternative workflows
No song-specific notes; song belongs to previous Era; cover intentionally interpreted within current Identity; experimental song with approved larger deviation.

## 12. User actions
Select base Identity/Era, add/edit notes, link anchors, add/remove overrides, run Guard, create approved IdentityDeviation when execution-specific.

## 13. State model
View readiness: `NOT_CONFIGURED | INHERITED_ONLY | CUSTOMIZED | REVIEW_REQUIRED`. Historical linkage is immutable enough to reconstruct prior work.

## 14. Business rules
- **SNG-IDCTX-001** — Every SongIdentityContext MUST reference one Song and one Identity Version.
- **SNG-IDCTX-002** — Era linkage MUST remain optional.
- **SNG-IDCTX-003** — Song Identity Context MUST inherit Identity rather than duplicate the whole Identity model.
- **SNG-IDCTX-004** — Song-specific notes MAY refine visual/emotional direction but MUST NOT silently override NON_NEGOTIABLE Identity constraints.
- **SNG-IDCTX-005** — Allowed overrides MUST be explicit.
- **SNG-IDCTX-006** — Any override conflicting with a non-negotiable rule requires an approved IdentityDeviation or Identity update, not silent precedence.
- **SNG-IDCTX-007** — Song-specific Anchors MUST remain linked to canonical Anchor definitions or clearly scoped song-specific candidates.
- **SNG-IDCTX-008** — Adding a Song-specific Anchor MUST NOT automatically promote it to identity-wide SymbolicAnchor.
- **SNG-IDCTX-009** — Historical Content MUST retain the Song Identity Context/Identity Version used when created.
- **SNG-IDCTX-010** — Switching current active Identity MUST NOT retroactively relink old Song executions.
- **SNG-IDCTX-011** — Context Assembler SHOULD include a compact Song Identity Context, not full Brand Book.
- **SNG-IDCTX-012** — Guard MUST evaluate both base Identity constraints and approved song-specific overrides.
- **SNG-IDCTX-013** — Song-specific overrides MUST have narrower scope than identity-wide rules unless explicitly promoted through Identity workflow.
- **SNG-IDCTX-014** — Performance data MUST NOT create/modify overrides automatically.
- **SNG-IDCTX-015** — A successful deviation may create Identity Hypothesis, not auto-promotion.
- **SNG-IDCTX-016** — Cover songs MUST be allowed a personal Identity treatment without implying ownership of original creator identity/meaning.
- **SNG-IDCTX-017** — Song-specific visual notes MUST distinguish recommendation/description from hard constraint where UI supports it.
- **SNG-IDCTX-018** — Protected meanings/disclosures from Song Story must be filtered according to Mystique/Interpretation policy.
- **SNG-IDCTX-019** — If referenced Identity Version is archived, new work MUST surface review context but historical work remains valid.
- **SNG-IDCTX-020** — Era overrides and Song overrides MUST have explicit precedence rules in Context Assembler/Guard.
- **SNG-IDCTX-021** — The system MUST avoid double-counting the same rule inherited through Identity, Era and Song context.
- **SNG-IDCTX-022** — Song Identity Context MUST remain exportable/inspectable enough to explain why an execution received a Guard result.

## 15. AI behavior
AI may suggest visual notes/anchors/overrides from song meaning, lyrics, mood and active Identity. Suggestions cite sources and flag conflicts. It cannot create protected meaning, auto-override constraints or activate a new Identity.

## 16. Human approval
Required for base version change, Era link, durable overrides and any conflict resolution that weakens existing constraints.

## 17. Validation
Song/Identity ownership, Era belongs to artist and compatible context, anchor references valid, override scope/priority conflict checks.

## 18. UI states
Inherited-only, customized, archived base Identity, conflict/review required, no active Identity, Guard unavailable.

## 19. Edge cases
Song recorded in prior Era but promoted now; current campaign intentionally revives old visual language; song has opposite color/lighting mood from core Identity.

## 20. Cross-module effects
Direct input to Context Assembler, Factory, Production, Guard, DSP profile/release visuals and Website story.

## 21. Notifications and attention model
Identity/Era archival conflict; non-negotiable override conflict; unresolved Guard issue before production/publish.

## 22. Search / filtering / sorting / bulk actions
Mostly per-song editor; Identity can list Songs by version/Era. No bulk override changes by default.

## 23. Analytics and product telemetry
Override usage, Guard conflicts, suggestion acceptance, deviation creation.

## 24. Learning feedback
Repeated successful deviations can create Identity hypotheses under higher threshold; context itself is not auto-learned.

## 25. Auditability / provenance
Base version/Era/override/anchor edits with actor/source and historical references.

## 26. Desktop / mobile behavior
Desktop full editor; mobile read + critical override/Guard summary.

## 27. Accessibility / usability
Inheritance/override precedence explained textually; conflicts not color-only.

## 28. Security / privacy / rights
Protected Song meaning and internal Identity rationale filtered from external modes.

## 29. Performance / async jobs
Guard may run async; base structured context loads immediately.

## 30. Acceptance criteria
1. Song inherits Identity without copying it.
2. Overrides are explicit and scoped.
3. Non-negotiable conflict cannot silently pass.
4. Historical executions keep original Identity context.
5. Performance cannot auto-create overrides.
6. Guard can explain inherited vs overridden rules.

## 31. Test matrix
Unit: precedence/conflicts. Integration: Context/Guard. Agent eval: grounded override suggestions. E2E: Song context→Factory→Guard→Content lineage.

## 32. Open questions
1. Exact precedence ordering among Identity → Era → Song override → Content-specific IdentityDeviation should be centralized and frozen in Context/Guard spec.
2. Final entity boundary for song-specific Interpretation Policy remains unresolved from Identity pass.

## 33. Traceability
`SNG-IDCTX-001–022` → MASTER 57, 83–89, 103–106, 122–124, 138–145, 225, 329, 406, 450–452.
