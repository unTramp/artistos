# Artist OS — Engineering Spec 12: Observability

**Status:** DRAFT / Pass 1

## 1. Correlation model

Every request/workflow may carry:

```text
traceId
requestId
commandId?
eventId?
jobId?
agentRunId?
importBatchId?
```

Propagation crosses web → application → outbox/job → provider adapter.

## 2. Structured logs

Required fields:

```text
timestamp
level
service/process
environment
traceId
operation
safe message
entity refs (non-sensitive)
durationMs?
errorCode?
```

No free-form secret-bearing dumps.

## 3. Technical metrics

Track at minimum:

```text
HTTP latency/error rate
DB query latency/pool saturation
job queue depth/age/failure/dead-letter
worker throughput
provider latency/error/rate-limit
storage upload/processing failures
AI token/cost/latency/retry/schema-failure
import validation failure
```

## 4. Product telemetry separation

ProductTelemetryEvent is separate from operational logs and from artist performance analytics. It measures OS usage (time to content unit, AI acceptance, manual corrections, etc.).

## 5. AI observability

Agent dashboard can aggregate configuration/model/workflow cost and acceptance without exposing hidden reasoning/private prompt content.

## 6. SLO candidates

Initial operational targets are calibration, not MASTER constants. Define after real hosting baseline for:

```text
web availability
p95 deterministic page latency
job queue age
upload success
critical import success
```

## 7. Alerts

Alert on actionable failures: sustained web errors, stuck queue, dead-letter growth, DB/storage health, credential refresh failures, provider outage affecting active workflow. Avoid alerting on ordinary user validation errors.

## 8. Health endpoints

```text
/live   process alive
/ready  required DB/runtime dependencies usable
```

External providers should not make core `/ready` fail if product can degrade gracefully.

## 9. Acceptance criteria

- one trace can follow request into job/agent/provider;
- AI cost/latency attributable to workflow/config;
- logs are structured/redacted;
- degraded optional provider does not mark whole app unavailable.
