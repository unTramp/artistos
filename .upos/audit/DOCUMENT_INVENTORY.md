# Artist OS — Document Inventory

This inventory records important authority-bearing or implementation-bearing documentation. It is not a file-by-file catalog of all 181 feature specifications.

## Status vocabulary

Normativity: CANONICAL / NORMATIVE_COMPANION / DERIVED / SUPPORTING / TEMPORARY / HISTORICAL / CONFLICTING.
Disposition is a recommendation only; no file moves are performed in this pass.

| Path | Purpose | Owner | Normativity / lifetime | Alignment | Recommended disposition |
|---|---|---|---|---|---|
| README.md | repository/runtime entry point | project engineering/product | SUPPORTING / LIVING | strong current runtime summary | keep living; bind in manifest |
| docs/artist-os/README.md | documentation hierarchy/index | documentation governance | CANONICAL INDEX / LIVING | points to v1.4 and AR | keep; U-POS governance adapter should reference it |
| docs/artist-os/00_governance/MASTER_ARCHITECTURE_v1.4.md | product/domain architecture constitution | architecture governance | CANONICAL / STABLE | current repo and PR freeze evidence support it | preserve frozen |
| docs/artist-os/00_governance/MASTER_ARCHITECTURE_v1.3.md | previous architecture baseline | architecture governance | HISTORICAL by current repository policy, but self-header still says current | CONFLICTING metadata | preserve content; external catalog/status must make historical authority unambiguous |
| docs/artist-os/00_governance/MASTER_v1.4_FREEZE_DECISION.md | v1.4 freeze decision evidence | architecture governance | SUPPORTING/HISTORICAL | decision condition was satisfied by merged PR #4; header still says READY FOR HUMAN MERGE | retain as decision evidence; mark current disposition in catalog rather than rewrite history blindly |
| docs/artist-os/00_governance/ARCHITECTURE_RESOLUTION_PASS1.md | AR-001…AR-062 semantic contracts | architecture governance | NORMATIVE_COMPANION according to v1.4/docs README, but file header says PROPOSED and v1.3 authoritative | CONFLICTING metadata | reconcile status via owner-approved governance record/catalog |
| docs/artist-os/00_governance/DOCUMENTATION_STANDARD.md | product-spec structure | documentation governance | NORMATIVE project standard / LIVING | useful but predates U-POS metadata model | retain semantics; map to U-POS documentation governance |
| docs/artist-os/PRODUCT_PRINCIPLES.md | product prioritization/UX principles | product | CANONICAL GUIDANCE / LIVING | explicitly subordinate to v1.4 | preserve |
| docs/artist-os/UX_VISUAL_DIRECTION.md | presentation/interaction doctrine | UX/design | NORMATIVE UX / LIVING | aligned with current Today redesign | preserve; do not treat as domain truth |
| docs/artist-os/engineering/00_ENGINEERING_SPEC_INDEX.md | engineering contract index | engineering | DERIVED NORMATIVE / LIVING | states v1.4 consistency complete | preserve and bind |
| docs/artist-os/implementation/STAGE_0_COMPLETION_REPORT.md | Stage 0 implementation evidence | engineering | HISTORICAL EVIDENCE | detailed traceability; not a fresh Quality verdict | retain |
| docs/artist-os/implementation/PHASE_1_ARTIST_FOUNDATION_COMPLETION_REPORT.md | Phase 1 evidence | engineering | HISTORICAL EVIDENCE | useful phase evidence | retain |
| docs/artist-os/implementation/PHASE_2_5_PRODUCT_UX_ARCHITECTURE_AUDIT.md | prior reconciliation audit | architecture/product | HISTORICAL EVIDENCE | several defects later fixed by PR25; must not be read as current defect list | retain as historical |
| docs/artist-os/implementation/PHASE_2_5_DAILY_OS_PLAN.md | Phase 2.5 implementation/reconciliation plan | product/engineering | TEMPORARY/LIVING PLAN | later commits update it | move conceptually under plans in future architecture; do not make doctrine |
| docs/artist-os/implementation/PHASE_2_5_COVERAGE.md | Phase 2.5 runtime coverage | engineering/product | SUPPORTING EVIDENCE | current closure support | retain, classify as evidence |
| docs/artist-os/implementation/UI_REDESIGN_IMPLEMENTATION_PLAN.md | UI migration sequence | UX/engineering | TEMPORARY PLAN | current UI work follows it | retain as plan, not UX truth |
| Full Product Specs under docs/artist-os domain directories | feature behavior and requirement IDs | domain/product owners | NORMATIVE beneath MASTER/AR | broad detailed spec corpus | preserve; future catalog should expose ownership/lifetime/status |
| generated COMPILED_FULL_PRODUCT_SPEC.md | reading copy | generator | DERIVED | explicitly non-canonical and gitignored | keep generated-only |
| .github/workflows/ci.yml | executable CI mechanics | engineering | EXECUTABLE SUPPORT | broad quality pipeline | bind as engineering check implementation, never as Quality truth |

## Missing / weak documentation evidence

### Phase 2 Content Factory completion artifact
README declares Phase 2 complete, but direct checks found no:
- PHASE_2_CONTENT_FACTORY_COMPLETION_REPORT.md
- PHASE_2_COMPLETION_REPORT.md
- CONTENT_FACTORY_COMPLETION_REPORT.md

PR #9 also did not add an equivalent completion report. The implementation is substantial and tested, but phase-level closure/traceability is weaker than Stage 0 and Phase 1.

### U-POS project-side governance
Before this audit branch, .upos/ README, Project Manifest and Project Adapter did not exist. This pass creates candidates; they are not yet canonical project policy.

## Duplicate/conflict risks

1. v1.3 and v1.4 both contain self-descriptions that can be read as Current Master Source of Truth.
2. ARCHITECTURE_RESOLUTION_PASS1.md is consumed as normative companion by v1.4 while its own header still states PROPOSED and v1.3 authoritative.
3. implementation plans and historical audits contain point-in-time vocabulary; they must not outrank current MASTER/AR/current code.
4. completion reports are evidence snapshots, not executable/current truth.

## Inventory conclusion

Artist OS has unusually strong documentation depth and identifiable owners, but authority is encoded partly inside document prose rather than through a single machine-readable catalog. That makes stale self-metadata materially dangerous for both humans and agents and is the primary Documentation-System adoption target.
