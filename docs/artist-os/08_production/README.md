# 08 Production

**Status:** Detailed product-spec pass complete.

Production converts approved creative intent into a feasible real-world shoot while preserving identity, rights, resource truth and lineage. It intentionally does not assume expensive equipment, automatic “best take” scoring or AI availability on set.

## Features

1. [Production Capability Profile](01_capability-profile.md)
2. [Equipment Items](02_equipment.md)
3. [Capability-Aware Production Agent](03_production-agent.md)
4. [Shoot Sessions](04_shoot-sessions.md)
5. [Shot List](05_shot-list.md)
6. [On-Set Mobile Workflow](06_on-set.md)
7. [Takes and Selection Context](07_takes.md)
8. [Voice Note Capture and Pipeline](08_voice-notes.md)
9. [Production Economics](09_production-economics.md)

## Domain invariants

- Feasibility uses real capabilities; missing resources are never invented.
- Human artistic intent outranks production-efficiency optimization.
- AI prepares and suggests; it does not shoot, select, schedule or publish autonomously.
- On-Set must work with AI unavailable and should tolerate temporary connectivity loss.
- Original timestamps/evidence are preserved for Smart Ingest.
- Historical production lineage survives equipment/identity changes.
- Rights uncertainty is explicit.
- Formal `Take` and ProductionPlan/Economics entity boundaries remain open for schema audit because MASTER defines behavior but not all persistence entities.
