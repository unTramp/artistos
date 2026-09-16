# Specification Workflow

## Pass 0 — Architecture freeze
MASTER v1.3 stays unchanged unless an explicit Architecture Change Proposal is approved.

## Pass 1 — Domain inventory
Confirm every MASTER capability has a destination feature spec. Identify overlaps and missing product surfaces.

## Pass 2 — Functional specification
Complete each feature using the documentation standard. Focus on product behavior, not implementation details.

## Pass 3 — Cross-domain workflow specification
Validate full loops such as:

- Identity → Song → Campaign → Angle → Production → Publication → Metrics → Learning → Decision
- Release → DSP readiness → launch → source-of-streams → post-launch learning
- Voice Note → Candidate Knowledge → Content Angle
- Asset → Rights → Derived Asset → Publication → Metrics

## Pass 4 — UX interaction pass
Specify local IA, screens, actions, empty/error/loading states, desktop/mobile behavior and attention model.

## Pass 5 — AI behavior pass
For each AI-assisted feature define context, schemas, permissions, grounding, failure modes and approval policy.

## Pass 6 — Acceptance / test pass
Turn product rules into stable requirement IDs and acceptance scenarios.

## Pass 7 — Engineering derivation
Only approved feature specs are converted to DB/API/component/job/agent implementation tasks for Codex.

## Pass 8 — Compile
Generate the single reading copy from approved modular specs. Never edit compiled output manually.
