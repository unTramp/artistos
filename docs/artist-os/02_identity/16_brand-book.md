# Brand Book Compiler

## 1. Metadata
- **Spec ID:** `IDN-BBOOK`
- **Domain:** `02_identity`
- **Feature:** Brand Book Compiler
- **Status:** REVIEW
- **MASTER references:** 90–91, 212, 386, 389–390, 404
- **Depends on:** structured Identity Version, optional Era, Vertical Rules, Mystique, rights-safe references
- **Used by:** artist, external creators/collaborators, production preparation

## 2. Purpose
Compile approved structured Identity data into a readable, shareable Brand Book without turning the document itself into the source of truth.

## 3. User problem / job-to-be-done
**JTBD:** “Give me and collaborators a clear document explaining how my artist identity should be expressed, generated from the actual system so it stays consistent and versioned.”

## 4. Scope
Internal/external modes, web/PDF output, version linkage, section selection, Era-aware compilation, privacy/mystique filtering, regeneration/history.

Out: manual freeform Brand Book as separate truth; exposing protected internal canon; embedding unauthorized licensed assets/fonts.

## 5. Entry points
`/identity/brand-book`, Identity Home, Wizard completion, Era detail.

## 6. Preconditions and dependencies
Identity Version exists; draft preview may be allowed, but official/current Brand Book should identify status/version clearly.

## 7. Information architecture
```text
Brand Book
├─ Version / Identity / Era header
├─ Core identity
├─ Emotional territory
├─ Visual DNA
├─ Typography
├─ Narrative (filtered)
├─ Anchors
├─ Mystique/communication guidance
├─ Vertical specs
├─ Do / Avoid
└─ Source/version metadata
```
Internal mode may include deeper rationale/private rules; external creator mode is filtered/minimized.

## 8. User roles and permissions
Artist generates and chooses mode. External sharing mechanism is implementation/future scope; export itself must be mode-safe.

## 9. Core data model
MASTER `BrandBookVersion`:
```text
identityVersionId
eraIdentityId?
version
generatedAt
mode: INTERNAL | EXTERNAL_CREATOR
sections[]
exportFormat: WEB | PDF
```
Generated file/document references may be Assets if stored.

## 10. Main happy-path workflow
1. User selects active/draft Identity Version and optional Era.
2. Selects INTERNAL or EXTERNAL_CREATOR.
3. System determines allowed sections/data via Mystique/privacy/rights filters.
4. User previews compilation.
5. Generate job creates Web/PDF version.
6. BrandBookVersion records source versions.
7. When Identity/Era changes, old Brand Book remains historical and is marked outdated relative to current state.

## 11. Alternative workflows
Draft preview watermark/status; external creator subset; Era-specific Brand Book; regenerate same source after template improvements with distinct generated version metadata.

## 12. User actions
Preview, select mode/sections, generate, regenerate, download/export, view history, mark preferred/current representation where relevant.

## 13. State model
Generation: `NOT_GENERATED | QUEUED | GENERATING | READY | FAILED | OUTDATED` as projection. Source version remains authoritative.

## 14. Business rules
- **IDN-BBOOK-001** — Brand Book is generated from structured Identity data and MUST NOT become source of truth.
- **IDN-BBOOK-002** — Every Brand Book MUST identify source `identityVersionId` and optional `eraIdentityId`.
- **IDN-BBOOK-003** — INTERNAL and EXTERNAL_CREATOR modes MUST have distinct disclosure filtering.
- **IDN-BBOOK-004** — Protected facts/internal canon MUST be excluded from external mode unless explicitly allowed.
- **IDN-BBOOK-005** — Old Brand Books MUST remain historical and MUST be marked outdated when source Identity/Era changes materially.
- **IDN-BBOOK-006** — Regeneration MUST NOT alter the underlying Identity.
- **IDN-BBOOK-007** — PDF/Web generation failures MUST not affect source Identity state.
- **IDN-BBOOK-008** — Rights-unsafe/reference-only media MUST not be embedded into externally distributable Brand Book as if licensed unless policy permits limited reference use and is explicit.
- **IDN-BBOOK-009** — Font guidance MUST not bundle unauthorized font binaries.
- **IDN-BBOOK-010** — Brand Book can include examples/Do-Avoid, but examples are guidance, not immutable universal templates.
- **IDN-BBOOK-011** — External mode SHOULD minimize unnecessary private rationale while preserving actionable creator guidance.
- **IDN-BBOOK-012** — Era-specific overrides MUST be visually distinguished from base Identity guidance.
- **IDN-BBOOK-013** — Draft Identity Brand Book preview MUST clearly show draft status.
- **IDN-BBOOK-014** — Generated document version and source Identity semantic version are separate concepts and must not be conflated.
- **IDN-BBOOK-015** — Export format differences must not alter semantic guidance.
- **IDN-BBOOK-016** — Brand Book compilation must work without AI once structured Identity data exists; AI may improve prose but is optional.

## 15. AI behavior
Optional prose compiler can transform structured identity into readable guidance but cannot add facts/rules absent from sources. Must preserve privacy filtering. Deterministic templating is fallback.

## 16. Human approval
User chooses mode/sections and initiates export. No auto-sharing externally.

## 17. Validation
Source version valid; mode valid; protected fields filtered; referenced assets rights checked; generation version unique.

## 18. UI states
Never generated, draft preview, generating, ready, outdated, failed, privacy/rights warning.

## 19. Edge cases
Identity version archived: historical book still available. Protected fact removed after prior internal export: old internal book remains historical with access policy; new exports reflect current source.

## 20. Cross-module effects
Creates export artifact/history only; does not change Identity. External creator workflows may consume latest approved external book.

## 21. Notifications and attention model
Outdated Brand Book surfaces only when relevant to creator/export work; not necessarily global urgent.

## 22. Search / filtering / sorting / bulk actions
History filter by source version/era/mode/format/date. No bulk sharing.

## 23. Analytics and product telemetry
Generation/use, internal vs external, failures, outdated regeneration rate, section inclusion.

## 24. Learning feedback
No artist performance learning; usage informs product UX.

## 25. Auditability / provenance
Generation source IDs, mode, sections, compiler/template version, actor/time.

## 26. Desktop / mobile behavior
Desktop preview/export primary; mobile read/share/download where supported.

## 27. Accessibility / usability
Generated Web/PDF should use semantic headings, readable contrast and alt descriptions where possible.

## 28. Security / privacy / rights
Strict mode filtering; stored exports inherit access controls; no secrets/private canon in external mode; licensed materials respected.

## 29. Performance / async jobs
`GENERATE_BRAND_BOOK` JobService task, idempotent by source version + mode + template/config hash when appropriate.

## 30. Acceptance criteria
1. External export excludes protected canon.
2. Brand Book references exact Identity/Era.
3. Identity change marks prior book outdated rather than editing it.
4. Generation failure leaves Identity untouched.
5. No unauthorized font binaries exported.
6. Deterministic fallback can generate basic book without AI.

## 31. Test matrix
Unit: filtering/version. Integration: Asset rights/Job/Identity. Agent eval: no invented rule/privacy leakage. E2E: active identity→external PDF→new version→old marked outdated.

## 32. Open questions
Exact sharing/access-link feature is outside current spec; export is defined, collaboration permissions are deferred.

## 33. Traceability
`IDN-BBOOK-001–016` → MASTER 90–91, 212, 386, 389–390, 404.
