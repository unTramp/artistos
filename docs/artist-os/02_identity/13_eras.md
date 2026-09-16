# Era Identity

## 1. Metadata
- **Spec ID:** `IDN-ERA`
- **Domain:** `02_identity`
- **Feature:** Era Identity
- **Status:** REVIEW
- **MASTER references:** 78, 86, 89, 94, 106, 122, 132, 360, 404
- **Depends on:** Active Identity Version, Identity Narrative, Visual DNA, Anchors
- **Used by:** Song Identity Context, Narrative Tracks, Content Units, Production, Guard, Brand Book, Context Assembler

## 2. Purpose
Represent a time-bounded creative chapter that can evolve narrative, visuals and symbolic language without requiring a full rebrand of the base Artist Identity.

## 3. User problem / job-to-be-done
**JTBD:** “Let me enter a new album/release/chapter with its own visual and narrative emphasis while preserving the deeper identity that remains mine.”

## 4. Scope
Era create/edit, start/end dates, narrative chapter, visual/color overrides, new/retired anchors, status, activation/closure and historical linkage.

Out: automatically creating an Era for every single release; multiple unrelated brand identities; retroactive relabeling of old content.

## 5. Entry points
`/identity/eras`, Identity Home, Campaign/Release setup, Brand Book.

## 6. Preconditions and dependencies
Artist Identity exists. Era references a specific Identity Version.

## 7. Information architecture
Era list/timeline → active era card → detail → narrative chapter → overrides → anchor lifecycle → linked campaigns/songs/content → history.

## 8. User roles and permissions
Artist creates/activates/closes eras. AI may propose candidates only.

## 9. Core data model
MASTER `EraIdentity`:
```text
id
artistId
identityVersionId
name
startDate
endDate?
narrativeChapter
visualOverrides
newAnchors[]
retiredAnchors[]
colorOverrides
status
```
Suggested statuses: `DRAFT | ACTIVE | ENDED | ARCHIVED` as product elaboration.

## 10. Main happy-path workflow
1. User creates Era from active Identity.
2. Names chapter and sets optional timing.
3. Defines narrative chapter and selective visual/anchor overrides.
4. Reviews diff from base Identity.
5. Activates Era explicitly.
6. New content/campaigns can link to it.
7. When chapter ends, user closes Era; historical links remain.

## 11. Alternative workflows
No Era; draft future Era; open-ended Era with no end date; Era ends but remains active reference for catalog content; major change escalates to new Identity Version instead.

## 12. User actions
Create, edit, compare, activate, close/end, archive historical draft, add/retire anchor in Era, link/unlink eligible future campaign context.

## 13. State model
```text
DRAFT → ACTIVE → ENDED → ARCHIVED
DRAFT → ARCHIVED
```
Reactivating an ended Era should require explicit action and preserve history rather than rewriting dates silently.

## 14. Business rules
- **IDN-ERA-001** — Era MUST reference a specific Identity Version.
- **IDN-ERA-002** — Era overrides MUST be selective and MUST NOT duplicate/replace the entire base Identity by default.
- **IDN-ERA-003** — Activating an Era requires explicit human approval.
- **IDN-ERA-004** — Ending/archiving an Era MUST NOT rewrite Identity/Era links on historical Content Units, Campaigns or assets.
- **IDN-ERA-005** — New and retired anchors are Era-scoped lifecycle changes unless separately promoted to a new base Identity Version.
- **IDN-ERA-006** — An Era is optional; absence must fall back to base Identity.
- **IDN-ERA-007** — A single release MUST NOT automatically require a new Era.
- **IDN-ERA-008** — If an intended Era change alters core archetype/identity non-negotiables substantially, system SHOULD suggest creating a major Identity Version rather than hiding a rebrand inside overrides.
- **IDN-ERA-009** — Era start/end dates are descriptive/planning context and do not retroactively change publication history.
- **IDN-ERA-010** — Era-specific Brand Book/output MUST identify both base Identity Version and Era.
- **IDN-ERA-011** — Context Assembler MUST apply active/relevant Era after base Identity Capsule according to task context.
- **IDN-ERA-012** — SongIdentityContext MAY link to an Era explicitly; songs outside the Era are not automatically relabeled.
- **IDN-ERA-013** — Content Unit metadata MUST retain `eraIdentityId?` used at creation/execution.
- **IDN-ERA-014** — Analytics MAY compare Era periods/context but MUST not automatically decide that an Era “failed” from one metric.
- **IDN-ERA-015** — Multiple historical eras can coexist; v1.3 SHOULD have one primary active Era for current artist context unless future use proves parallel active eras necessary.
- **IDN-ERA-016** — Era visual overrides must respect rights/feasibility and can still be deviated from at Content Unit level with approval.

## 15. AI behavior
May suggest Era themes/overrides based on artist-provided project context and confirmed Identity. Must show diff and rationale. Cannot activate/end Era or decide rebrand automatically.

## 16. Human approval
Create can draft; activation, ending and core override confirmation are explicit.

## 17. Validation
IdentityVersion exists; dates coherent; anchor refs valid; no duplicate active-era ambiguity under v1 policy; override schema valid.

## 18. UI states
No era, draft future, active, ended, archived, compatibility warning.

## 19. Edge cases
Active Era references now-archived Identity Version: historical state valid, but creating new current content should prompt review. Overlapping dates: allowed historically if data imported, but primary-current resolution must be explicit.

## 20. Cross-module effects
Affects Context, Guard, Content/Production defaults, Narrative and Brand Book for linked context; no retroactive mutation.

## 21. Notifications and attention model
Upcoming start/end only if user set planning dates and action is relevant; no forced cycle reminders.

## 22. Search / filtering / sorting / bulk actions
Timeline sorted by dates/version; filter status. No bulk activation.

## 23. Analytics and product telemetry
Era creation/activation, overrides changed, content linked, Guard deviations, review frequency.

## 24. Learning feedback
Era response can create Identity hypotheses for future evolution, not direct base Identity mutation.

## 25. Auditability / provenance
Version, activation/closure actor/time, override diffs, anchor lifecycle.

## 26. Desktop / mobile behavior
Desktop diff/timeline; mobile status/review simple edits.

## 27. Accessibility / usability
Base vs Era override clearly labeled; timeline has text alternatives.

## 28. Security / privacy / rights
Era narrative may contain internal canon; external outputs filtered by Mystique.

## 29. Performance / async jobs
No AI required for base behavior; Brand Book regeneration/context cache invalidation can be jobs.

## 30. Acceptance criteria
1. Era can exist without replacing base identity.
2. Activation explicit.
3. Historical content retains Era link after closure.
4. New/retired anchors remain scoped.
5. Major rebrand-like override triggers review suggestion, not silent base mutation.
6. No Era falls back safely to base Identity.

## 31. Test matrix
Unit: lifecycle/date/override precedence. Integration: Context/Content/Brand Book. E2E: base identity→Era→content→end era→history preserved.

## 32. Open questions
Formal threshold for “too much override → major Identity Version” cannot be a magic score; initially use explainable rule/conflict review + human choice.

## 33. Traceability
`IDN-ERA-001–016` → MASTER 78, 86, 89, 106, 122, 132, 360, 404.
