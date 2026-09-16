# Structured Logs & Trace Correlation

- **Status:** REVIEW COMPLETE
- **MASTER references:** §391, §334, §348–353
- **Domain:** 19_settings_security_portability
- **Feature slug:** `logs`
- **Requirement prefix:** `SEC-LOG`

## 2. Purpose
Provide structured operational logs with traceId/jobId/agentRunId correlation for debugging without leaking secrets or private payloads.

## 3. User problem / job-to-be-done
The product contains private creative, financial and integration data. Operational configuration must remain safe, auditable and portable without polluting domain models.

## 4. Scope
### In scope
- structured events
- correlation IDs
- error metadata
- retention/redaction

### Out of scope / non-goals
- full enterprise IAM in single-artist MVP
- legal/compliance certification claims
- storing secrets in client state

## 5. Entry points
- Settings
- contextual security/export action
- integration setup
- debug/admin surface

## 6. Preconditions and dependencies
- workspace/artist scope
- audit/log infrastructure
- storage/encryption
- domain permissions

## 7. Information architecture
Open relevant settings/security function → inspect current state → validate requested change/export → explicit confirmation where material → execute server-side → audit/result.

## 8. User roles and permissions
Single-artist MVP: the artist is the decision owner. AI/providers may suggest, import or prepare data, but any audience-facing publish/routing change, permanent identity change, destructive action or unsupported override remains human-controlled. Future team permissions are not introduced unless required by a specific rule.

## 9. Core data model
Cross-cutting application/security records; no new creative domain source of truth.

## 10. Main happy-path workflow
1. Open feature
2. Review current state and consequences
3. Make valid change/request
4. System validates/executes safely
5. Audit and show result/recovery

## 11. Alternative workflows
- provider unavailable
- export large
- secret revoked externally
- private data included
- operation partially fails

## 12. User actions
- edit safe preference
- connect/disconnect
- rotate/revoke where supported
- export
- inspect audit/log status

## 13. State model
Configuration/export/job states depend on feature; irreversible/destructive transitions require confirmation and preserved audit.

## 14. Business rules
- `SEC-LOG-001` trace/job/agentRun correlation supported
- `SEC-LOG-002` secrets and raw tokens never logged
- `SEC-LOG-003` PII/private payload minimized
- `SEC-LOG-004` log levels/retention configurable
- `SEC-LOG-005` user-facing errors reference safe correlation ID
- `SEC-LOG-006` provider responses redacted
- `SEC-LOG-007` logs not source of domain truth

## 15. AI behavior
AI is not authoritative for security/privacy decisions; it may explain configuration but cannot reveal secrets or bypass policy.

## 16. Human approval
Sensitive sharing/export/destructive/integration connection changes require explicit human approval.

## 17. Validation
- actor authorized
- input valid
- secret redaction
- scope explicit

## 18. UI states
- normal
- warning
- partial
- failed
- sensitive confirmation
- done

## 19. Edge cases
- lost provider access
- partial export
- redaction bug prevention
- old audit references deleted entity

## 20. Cross-module effects
- All domains
- Integrations
- Jobs
- Agent Runs

## 21. Notifications and attention model
- credential expiry
- security-sensitive failure
- export failure

## 22. Search / filtering / sorting / bulk actions
Search/filter audit/log/export history where applicable. No bulk destructive security changes.

## 23. Analytics and product telemetry
- setting changed
- secret connected/revoked
- export requested/completed
- audit viewed
- security error

## 24. Learning feedback
Security/product telemetry may improve workflows, never creative Learning.

## 25. Auditability / provenance
Every material action has actor/time/scope/result with sensitive values redacted.

## 26. Desktop / mobile behavior
Desktop configuration primary; mobile urgent reconnect/security status and safe export status.

## 27. Accessibility / usability
Dangerous actions use explicit labels/confirmation and accessible recovery instructions.

## 28. Security / privacy / rights
This feature is itself the privacy/security boundary; minimize data and use encryption/least privilege.

## 29. Performance / async jobs
Exports/log processing may be asynchronous and cancellable where safe.

## 30. Acceptance criteria
- `SEC-LOG-AC01` Sensitive material is not exposed by default.
- `SEC-LOG-AC02` Material actions are auditable.
- `SEC-LOG-AC03` Secrets are never returned in plaintext UI/logs.
- `SEC-LOG-AC04` Portability works without provider lock-in.

## 31. Test matrix
- secret rotation
- partial export
- provider revoked
- sensitive data
- deleted referenced entity

## 32. Open questions
- Retention/encryption-key/backup policies require Engineering/Security implementation specification.

## 33. Traceability
MASTER §391, §334, §348–353
