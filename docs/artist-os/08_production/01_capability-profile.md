# Production Capability Profile

- **Status:** REVIEW COMPLETE
- **MASTER references:** §160–163, §341, §451–452
- **Domain:** 08_production
- **Feature slug:** `capability-profile`
- **Requirement prefix:** `PRD-CAP`

## 2. Purpose
Maintain a truthful model of what the artist can actually produce with current equipment, locations, software, skills and support so creative recommendations are feasible rather than aspirational fiction.

## 3. User problem / job-to-be-done
AI and generic content plans routinely recommend studios, lenses, crew, lighting or editing skills the artist does not have. The artist needs production ideas grounded in real constraints while still allowing deliberate upgrades or rentals.

## 4. Scope
MASTER `ProductionCapabilityProfile`, owned/available resources, limitations, locations, crew capabilities, software, confidence/freshness, temporary availability and production-intent compatibility.

## 5. Entry points
Production settings/home, onboarding, Factory execution package, Shoot Planner, Settings.

## 6. Preconditions and dependencies
Artist required. Equipment and locations can be added incrementally. Missing profile is valid cold-start and must not be replaced by invented assumptions.

## 7. Information architecture
Capability summary → Cameras/Phones/Lenses/Mics/Audio/Lights/Stands/Backgrounds/Software/Locations/Crew → strengths/limitations → availability → “used by recommendations” explanation.

## 8. User roles and permissions
Single-artist MVP owner can edit. AI may extract/suggest capabilities from user-provided information but requires confirmation.

## 9. Core data model
MASTER `ProductionCapabilityProfile` arrays plus EquipmentItem and location/crew capability references. Product needs distinction between owned, accessible/rentable and currently available; final normalized vs JSONB boundary is schema work.

## 10. Main happy-path workflow
User enters/accepts equipment/resources → adds strengths/limitations/availability → profile becomes usable → Factory/Production Agent receives relevant subset → suggestions identify which capabilities are used and fallback when unavailable.

## 11. Alternative workflows
No equipment profile; temporary rental; borrowed location; item broken/unavailable; software subscription expires; artist deliberately wants a concept beyond current capability and asks for acquisition plan.

## 12. User actions
Add/edit/archive resource, mark available/unavailable, add limitation/strength, attach note/photo/manual, set temporary availability, duplicate similar equipment, confirm AI-extracted metadata.

## 13. State model
Resource may be Active/Unavailable/Archived as product behavior; MASTER does not define status enum. `owned` and `available` remain distinct concepts.

## 14. Business rules
- `PRD-CAP-001` Production recommendations MUST treat known capabilities as factual constraints, not optional decorative metadata.
- `PRD-CAP-002` Missing capability data MUST remain unknown; AI MUST NOT assume professional gear/crew exists.
- `PRD-CAP-003` `owned` and `available` MUST be represented separately.
- `PRD-CAP-004` A non-owned resource MAY be available through rental/borrow/venue access if explicitly represented.
- `PRD-CAP-005` Strengths and limitations SHOULD be human-readable and may be structured where useful.
- `PRD-CAP-006` Temporary unavailability MUST not delete historical use of an item.
- `PRD-CAP-007` Capability Profile MUST support locations and crew capabilities, not only hardware.
- `PRD-CAP-008` Software/editing capability MUST be representable because execution feasibility includes post-production.
- `PRD-CAP-009` ProductionIntent MUST influence suitability without creating a universal quality hierarchy.
- `PRD-CAP-010` AI SHOULD prefer feasible concepts using available capabilities before suggesting acquisition.
- `PRD-CAP-011` When a concept exceeds capability, system SHOULD provide a feasible fallback and MAY provide explicit acquisition/rental requirement.
- `PRD-CAP-012` AI MUST NOT shame lower-cost/phone-based setups or equate expensive gear with artistic quality.
- `PRD-CAP-013` Capability changes MUST not rewrite historical Shoot/Asset metadata.
- `PRD-CAP-014` Capability data used in an AI recommendation SHOULD be inspectable in context provenance.
- `PRD-CAP-015` Profile MUST remain useful without AI.
- `PRD-CAP-016` Archived resources MUST remain resolvable from historical shoots.

## 15. AI behavior
Production Agent receives only relevant capabilities for the requested execution. It may suggest missing resource, alternative setup or reduced-complexity fallback. It must distinguish confirmed capability from inferred candidate.

## 16. Human approval
AI-extracted resources/limitations require confirmation before becoming canonical capability data. Purchases/rentals are never executed by this feature.

## 17. Validation
Unique/stable item references; availability dates valid; model/brand optional; archived item cannot be default-current; referenced location/crew exists.

## 18. UI states
Empty/cold start, partially complete, active resources, temporary unavailable, archived, AI candidate pending confirmation.

## 19. Edge cases
Same phone used as camera and audio recorder; borrowed equipment; generic unknown model; availability changes on shoot day; resource renamed.

## 20. Cross-module effects
Feeds Factory effort, Production Agent, Shoot Planner, On-Set setup context and Asset metadata expectations. Acquisition needs can feed planning but not Business accounting automatically.

## 21. Notifications and attention model
Only shoot-critical resource unavailable/conflicting near scheduled Shoot should surface. No alerts for incomplete optional gear metadata.

## 22. Search / filtering / sorting / bulk actions
Filter type/owned/available/archived/location. Bulk availability/archive may be supported conservatively.

## 23. Analytics and product telemetry
Profile completion, AI suggestion acceptance, fallback usage, capability-related production blocks, stale-resource corrections.

## 24. Learning feedback
Repeated production constraints may become operational observations; they do not become artistic Identity rules automatically.

## 25. Auditability / provenance
Track manual vs AI extracted, edit history, availability and source notes.

## 26. Desktop / mobile behavior
Desktop setup/maintenance; mobile quick availability updates and On-Set lookup.

## 27. Accessibility / usability
Use categories and plain language; no requirement for technical camera expertise to enter a phone/light.

## 28. Security / privacy / rights
Location details may be private; external export must not expose exact home/private locations unnecessarily.

## 29. Performance / async jobs
CRUD immediate. Optional device metadata extraction can run async.

## 30. Acceptance criteria
- `PRD-CAP-AC01` Recommendation can distinguish owned, available and unknown resources.
- `PRD-CAP-AC02` Missing gear is never fabricated.
- `PRD-CAP-AC03` Historical shoots still resolve archived items.
- `PRD-CAP-AC04` Unsupported concept can receive feasible fallback.
- `PRD-CAP-AC05` Capability profile works manually without AI.

## 31. Test matrix
Empty; phone-only; pro setup; borrowed item; unavailable item; archived historical item; AI extraction rejected; private location.

## 32. Open questions
Formal status/availability model and whether locations/crew require dedicated entities vs embedded profile objects.

## 33. Traceability
MASTER §160–163, §341, §451–452.
