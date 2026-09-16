# Traceability Model

## Requirement ID format

`<DOMAIN>-<FEATURE>-<NNN>`

Examples:
- `IDN-MOOD-001` — Identity / Moodboard
- `CNT-ANGLE-014` — Content / Angle Generation
- `PRD-ONSET-007` — Production / On-Set
- `ANL-INSIGHT-011` — Analytics / Insight generation

IDs are stable. If a rule is deleted, retire the ID; do not recycle it.

## Traceability chain

`MASTER v1.3 requirement → Product requirement → UX behavior → Domain/API implementation → Test → Decision/change history`

## Conflict rule

Detailed specs may clarify but must not silently override MASTER v1.3. Any conflict becomes an Architecture Change Proposal first.
