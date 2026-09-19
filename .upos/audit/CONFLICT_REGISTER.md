# Artist OS — Conflict Register

Active documentation conflicts: 3

## CONFLICT-001 — Current MASTER identity

claim / disputed fact:
Which MASTER architecture is currently canonical?

source A:
docs/artist-os/00_governance/MASTER_ARCHITECTURE_v1.3.md
- self-header: Current Master Source of Truth.

source B:
README.md, docs/artist-os/README.md, MASTER_ARCHITECTURE_v1.4.md, MASTER_v1.4_FREEZE_DECISION.md and merged PR #4
- v1.4 is current frozen normative architecture;
- v1.3 is previous/archival baseline.

implementation evidence:
Stage 0+, engineering specs and all current runtime reconciliation artifacts explicitly target MASTER v1.4.

canonical owner:
Architecture Governance

severity:
P2

recommended resolution:
Use v1.4 for current authority. Under Documentation Governance, make v1.3's historical status externally unambiguous through catalog/manifest and, if approved, a superseded banner. Do not alter historical requirement numbering/content.

status:
OPEN — audit resolves operationally to v1.4, metadata reconciliation pending.

---

## CONFLICT-002 — AR-001…AR-062 status

claim / disputed fact:
Are AR-001…AR-062 proposed or normative?

source A:
docs/artist-os/00_governance/ARCHITECTURE_RESOLUTION_PASS1.md
- header: PROPOSED CONTRACTS;
- MASTER v1.3 unchanged and authoritative.

source B:
MASTER_ARCHITECTURE_v1.4.md §5, docs/artist-os/README.md, MASTER_v1.4_FREEZE_DECISION.md
- AR-001…AR-062 are normative companion contracts under v1.4.

implementation evidence:
Current engineering and audits cite AR contracts as frozen/current.

canonical owner:
Architecture Governance

severity:
P2

recommended resolution:
Reconcile source-file status metadata or introduce authoritative catalog metadata showing APPROVED/NORMATIVE under v1.4 while preserving historical proposal chronology.

status:
OPEN — v1.4 freeze is treated as later/higher authority for this audit.

---

## CONFLICT-003 — Freeze decision operational status

claim / disputed fact:
Is the v1.4 freeze still awaiting human merge?

source A:
MASTER_v1.4_FREEZE_DECISION.md
- Status: READY FOR HUMAN MERGE;
- v1.4 becomes normative on merge.

source B:
Merged PR #4 and current repository README/docs README
- freeze condition has been satisfied;
- v1.4 is already current.

implementation evidence:
All implemented phases cite v1.4 as normative.

canonical owner:
Documentation Governance / Architecture Governance

severity:
P3

recommended resolution:
Record the artifact as HISTORICAL DECISION — CONDITION FULFILLED in the future document catalog. Prefer not to rewrite historical decision prose unless policy explicitly requires it.

status:
OPEN metadata reconciliation; substantive architecture outcome is resolved.
