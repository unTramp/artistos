# Artist OS — Deferred Scope Register

**Purpose:** keep intentionally deferred work explicit so it is not rediscovered as an “architecture gap” during implementation.

| ID | Deferred capability | Why deferred | Future owner / trigger |
|---|---|---|---|
| DEF-001 | Brand Book sharing/access permissions | Collaboration/team permissions are outside single-artist MVP | Team/roles or external-collaboration phase |
| DEF-002 | Curator/journalist relationship CRM | Relationship ownership belongs to future Publicity/Outreach, not DSP playlist research | Publicity & PR Engine research/freeze |
| DEF-003 | Inventory/order-level commerce | v1.3 Business is strategy/unit economics, not ecommerce/order management | Explicit commerce/ecommerce integration scope |
| DEF-004 | Multi-user reviewer/authorization roles | Single-artist-first intentionally avoids org/role complexity | Multi-artist/team/SaaS phase |

## Guardrail

Deferred does not mean “implement ad hoc if convenient.” Any implementation that begins to create these capabilities must first define the bounded-context owner and privacy/security implications.
