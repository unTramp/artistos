export type AgentRunStatus = "QUEUED" | "RUNNING" | "SUCCEEDED" | "FAILED" | "CANCELLED" | "REJECTED_OUTPUT";

export interface AgentContextManifest {
  sourceReferences: Array<{ entityType: string; entityId: string }>;
  missingSources: string[];
  identityVersionId?: string;
  eraIdentityId?: string;
  promptVersion: string;
  tokenEstimate: number;
  budget: {
    maxChunks: number;
    maxTokens: number;
    maxExamples: number;
    maxLearnings: number;
  };
}

export interface AgentRunStartInput {
  id: string;
  artistId: string;
  workflow: string;
  agentType: string;
  configurationVersionId: string;
  contextManifest: AgentContextManifest;
  traceId: string;
  startedAt: Date;
}

export interface AgentRunCompletionInput {
  agentRunId: string;
  artistId: string;
  status: Extract<AgentRunStatus, "SUCCEEDED" | "REJECTED_OUTPUT" | "FAILED" | "CANCELLED">;
  finishedAt: Date;
  provider?: string;
  model?: string;
  inputTokenCount?: number;
  outputTokenCount?: number;
  cost?: number;
  latencyMs?: number;
  toolCallCount?: number;
  failureCode?: string;
  artifact?: {
    id: string;
    artifactType: string;
    schemaVersion: number;
    content: unknown;
  };
}

export interface AgentRunRecord {
  id: string;
  artistId: string;
  workflow: string;
  agentType: string;
  configurationVersionId: string;
  contextManifest: AgentContextManifest;
  status: AgentRunStatus;
  resultArtifactRef?: string;
  failureCode?: string;
}

export interface AgentRunWritePort {
  start(input: AgentRunStartInput): Promise<AgentRunRecord>;
  complete(input: AgentRunCompletionInput): Promise<AgentRunRecord>;
}
