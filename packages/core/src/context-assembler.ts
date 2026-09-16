export type ContextMaturity = "COLD" | "WARM" | "MATURE";
export type ContextReadiness = "READY" | "PARTIAL" | "COLD_START" | "BUDGET_EXCEEDED";

export interface ContextBudget {
  maxChunks: number;
  maxTokens: number;
  maxExamples: number;
  maxLearnings: number;
}

export interface ContextSourceReference {
  priority: number;
  sourceType: string;
  entityType: string;
  entityId: string;
  version?: string;
  selectedBecause: string;
}

export interface ContentAngleContextRequest {
  artistId: string;
  explicitRequest: string;
  songId?: string;
  campaignId?: string;
  platformTargets?: string[];
  allowPrivateSources?: boolean;
  budget: ContextBudget;
}

export interface ContentAngleContextSourceData {
  identity: {
    identityId: string;
    activeVersionId: string;
    versionNumber: number;
    label: string | null;
    eraId: string | null;
    eraName: string | null;
  } | null;
  song: {
    id: string;
    title: string;
    genre: string | null;
    mood: string | null;
    language: string | null;
    story: string | null;
    meaning: string | null;
    statements: Array<{
      id: string;
      statementType: "FACT" | "ARTIST_INTERPRETATION" | "AUDIENCE_INTERPRETATION";
      statement: string;
      sourceLabel: string | null;
    }>;
    identityContext: {
      id: string;
      identityVersionId: string;
      eraIdentityId: string | null;
      songSpecificVisualNotes: string | null;
      songSpecificAnchors: string[];
      allowedOverrides: string[];
      version: number;
    } | null;
  } | null;
  approvedKnowledge: Array<{
    id: string;
    content: string;
    sourceType: string;
    sourceId: string;
  }>;
  toneExamples: Array<{
    id: string;
    textContent: string;
    label: "AUTHENTIC" | "GOOD" | "NEUTRAL" | "DO_NOT_COPY" | "OUTDATED";
    sourceType: string;
    language: string | null;
    isPrivate: boolean;
  }>;
  validatedLearnings: Array<{
    id: string;
    content: string;
    version: number;
  }>;
  campaign: {
    id: string;
    objective: string;
    version: number;
  } | null;
  platformConstraints: Array<{
    id: string;
    platform: string;
    content: string;
    freshness: "CURRENT" | "STALE" | "DEPRECATED";
    version: number;
  }>;
  productionCapability: {
    id: string;
    version: number;
    summary: string;
  } | null;
  recentAngles: Array<{
    id: string;
    title: string;
    pillar: string;
    status: string;
    idea: string;
  }>;
}

export interface ContentAngleContextPack {
  schemaVersion: 1;
  task: "GENERATE_CONTENT_ANGLES";
  artistId: string;
  explicitRequest: string;
  maturity: ContextMaturity;
  readiness: ContextReadiness;
  identity: ContentAngleContextSourceData["identity"];
  song: ContentAngleContextSourceData["song"];
  approvedKnowledge: ContentAngleContextSourceData["approvedKnowledge"];
  toneExamples: ContentAngleContextSourceData["toneExamples"];
  validatedLearnings: ContentAngleContextSourceData["validatedLearnings"];
  campaign: ContentAngleContextSourceData["campaign"];
  platformConstraints: ContentAngleContextSourceData["platformConstraints"];
  productionCapability: ContentAngleContextSourceData["productionCapability"];
  recentAngles: ContentAngleContextSourceData["recentAngles"];
  missingSources: string[];
  sourceReferences: ContextSourceReference[];
  conflicts: string[];
  budget: ContextBudget & {
    estimatedTokens: number;
    truncated: boolean;
  };
  contextVersion: string;
}

const estimateTokens = (value: unknown) => Math.ceil(JSON.stringify(value).length / 4);
const capText = (value: string | null, max = 1800) => value === null ? null : value.slice(0, max);
const stableRefs = (refs: ContextSourceReference[]) => [...refs].sort((a, b) => a.priority - b.priority || a.entityType.localeCompare(b.entityType) || a.entityId.localeCompare(b.entityId));

const normalizeSourceData = (source: ContentAngleContextSourceData, request: ContentAngleContextRequest) => {
  const positiveTone = source.toneExamples
    .filter((item) => item.label === "AUTHENTIC" || item.label === "GOOD")
    .filter((item) => request.allowPrivateSources === true || !item.isPrivate)
    .slice(0, request.budget.maxExamples)
    .map((item) => ({ ...item, textContent: capText(item.textContent, 1200) ?? "" }));
  const approvedKnowledge = source.approvedKnowledge
    .slice(0, request.budget.maxChunks)
    .map((item) => ({ ...item, content: capText(item.content, 1600) ?? "" }));
  const validatedLearnings = source.validatedLearnings
    .slice(0, request.budget.maxLearnings)
    .map((item) => ({ ...item, content: capText(item.content, 1400) ?? "" }));
  const song = source.song ? {
    ...source.song,
    story: capText(source.song.story),
    meaning: capText(source.song.meaning),
    statements: source.song.statements.slice(0, request.budget.maxChunks).map((item) => ({ ...item, statement: capText(item.statement, 1400) ?? "" }))
  } : null;
  const platformTargets = new Set(request.platformTargets ?? []);
  const platformConstraints = source.platformConstraints
    .filter((constraint) => constraint.freshness === "CURRENT")
    .filter((constraint) => platformTargets.size === 0 || platformTargets.has(constraint.platform))
    .slice(0, request.budget.maxChunks)
    .map((item) => ({ ...item, content: capText(item.content, 1000) ?? "" }));
  return {
    identity: source.identity,
    song,
    approvedKnowledge,
    toneExamples: positiveTone,
    validatedLearnings,
    campaign: source.campaign,
    platformConstraints,
    productionCapability: source.productionCapability ? { ...source.productionCapability, summary: capText(source.productionCapability.summary, 1200) ?? "" } : null,
    recentAngles: source.recentAngles.slice(0, request.budget.maxExamples).map((angle) => ({ ...angle, idea: capText(angle.idea, 800) ?? "" }))
  };
};

const maturityFrom = (data: ReturnType<typeof normalizeSourceData>): ContextMaturity => {
  if (data.validatedLearnings.length >= 5 && data.approvedKnowledge.length >= 5 && data.toneExamples.length >= 5) return "MATURE";
  const evidence = data.approvedKnowledge.length + data.toneExamples.length + data.validatedLearnings.length + (data.song?.statements.length ?? 0);
  return evidence >= 3 ? "WARM" : "COLD";
};

const referencesFrom = (data: ReturnType<typeof normalizeSourceData>): ContextSourceReference[] => {
  const refs: ContextSourceReference[] = [];
  if (data.identity) {
    refs.push({ priority: 3, sourceType: "CANONICAL", entityType: "ArtistIdentityVersion", entityId: data.identity.activeVersionId, version: String(data.identity.versionNumber), selectedBecause: "Active Identity Version constrains creative strategy." });
    if (data.identity.eraId) refs.push({ priority: 3, sourceType: "CANONICAL", entityType: "EraIdentity", entityId: data.identity.eraId, selectedBecause: "Active Era narrows current identity expression." });
  }
  data.toneExamples.forEach((item) => refs.push({ priority: 4, sourceType: item.sourceType, entityType: "ToneCorpusItem", entityId: item.id, selectedBecause: "Positive real-voice evidence for tone grounding." }));
  if (data.song) {
    refs.push({ priority: 5, sourceType: "CANONICAL", entityType: "Song", entityId: data.song.id, selectedBecause: "Explicit song scope strongly constrains content generation." });
    data.song.statements.forEach((item) => refs.push({ priority: 5, sourceType: item.sourceLabel ?? "SONG_BRAIN", entityType: `SongBrainStatement:${item.statementType}`, entityId: item.id, selectedBecause: "Song Brain statement grounds song-specific meaning without merging interpretations." }));
    if (data.song.identityContext) refs.push({ priority: 5, sourceType: "CANONICAL", entityType: "SongIdentityContext", entityId: data.song.identityContext.id, version: String(data.song.identityContext.version), selectedBecause: "Song-specific identity overrides and anchors constrain execution." });
  }
  data.validatedLearnings.forEach((item) => refs.push({ priority: 6, sourceType: "VALIDATED", entityType: "ValidatedLearning", entityId: item.id, version: String(item.version), selectedBecause: "Validated own evidence informs strategy after identity/song context." }));
  if (data.campaign) refs.push({ priority: 7, sourceType: "CANONICAL", entityType: "Campaign", entityId: data.campaign.id, version: String(data.campaign.version), selectedBecause: "Campaign objective scopes current content goal." });
  data.platformConstraints.forEach((item) => refs.push({ priority: 8, sourceType: "CURRENT_PLATFORM_KNOWLEDGE", entityType: "PlatformConstraint", entityId: item.id, version: String(item.version), selectedBecause: "Current platform constraint is relevant to requested target." }));
  data.recentAngles.forEach((item) => refs.push({ priority: 9, sourceType: "HISTORY", entityType: "ContentAngle", entityId: item.id, selectedBecause: "Recent content history reduces repetition; it never outranks identity or song truth." }));
  if (data.productionCapability) refs.push({ priority: 8, sourceType: "CANONICAL", entityType: "ProductionCapabilityProfile", entityId: data.productionCapability.id, version: String(data.productionCapability.version), selectedBecause: "Production capability constrains feasibility." });
  data.approvedKnowledge.forEach((item) => refs.push({ priority: 4, sourceType: item.sourceType, entityType: "ArtistBrainKnowledgeItem", entityId: item.id, selectedBecause: "Human-approved durable Artist Brain knowledge." }));
  return stableRefs(refs);
};

export class ContentAngleContextAssembler {
  assemble(request: ContentAngleContextRequest, source: ContentAngleContextSourceData): ContentAngleContextPack {
    const data = normalizeSourceData(source, request);
    const missingSources: string[] = [];
    if (!data.identity) missingSources.push("ACTIVE_IDENTITY");
    if (request.songId && !data.song) missingSources.push("SONG_BRAIN");
    if (data.validatedLearnings.length === 0) missingSources.push("VALIDATED_LEARNINGS");
    if (request.campaignId && !data.campaign) missingSources.push("CAMPAIGN");
    if (data.platformConstraints.length === 0 && (request.platformTargets?.length ?? 0) > 0) missingSources.push("PLATFORM_CONSTRAINTS");
    if (!data.productionCapability) missingSources.push("PRODUCTION_CAPABILITY_PROFILE");
    missingSources.push("HARD_RULES");

    const maturity = maturityFrom(data);
    const sourceReferences = referencesFrom(data);
    let truncated = false;
    const working = {
      approvedKnowledge: [...data.approvedKnowledge],
      toneExamples: [...data.toneExamples],
      validatedLearnings: [...data.validatedLearnings],
      platformConstraints: [...data.platformConstraints],
      recentAngles: [...data.recentAngles],
      songStatements: data.song ? [...data.song.statements] : []
    };

    const material = () => ({
      explicitRequest: request.explicitRequest,
      identity: data.identity,
      song: data.song ? { ...data.song, statements: working.songStatements } : null,
      approvedKnowledge: working.approvedKnowledge,
      toneExamples: working.toneExamples,
      validatedLearnings: working.validatedLearnings,
      campaign: data.campaign,
      platformConstraints: working.platformConstraints,
      productionCapability: data.productionCapability,
      recentAngles: working.recentAngles
    });

    const lowerPriorityBuckets: Array<Array<unknown>> = [
      working.recentAngles,
      working.platformConstraints,
      working.validatedLearnings,
      working.approvedKnowledge,
      working.toneExamples,
      working.songStatements
    ];
    while (estimateTokens(material()) > request.budget.maxTokens) {
      const bucket = lowerPriorityBuckets.find((items) => items.length > 0);
      if (!bucket) break;
      bucket.pop();
      truncated = true;
    }

    const estimatedTokens = estimateTokens(material());
    const budgetExceeded = estimatedTokens > request.budget.maxTokens;
    const readiness: ContextReadiness = budgetExceeded
      ? "BUDGET_EXCEEDED"
      : !data.identity
        ? "COLD_START"
        : missingSources.length > 2
          ? "PARTIAL"
          : "READY";
    const refs = referencesFrom({
      ...data,
      approvedKnowledge: working.approvedKnowledge,
      toneExamples: working.toneExamples,
      validatedLearnings: working.validatedLearnings,
      platformConstraints: working.platformConstraints,
      recentAngles: working.recentAngles,
      song: data.song ? { ...data.song, statements: working.songStatements } : null
    });
    const contextVersion = refs.map((ref) => `${ref.entityType}:${ref.entityId}:${ref.version ?? "0"}`).join("|") || "empty";

    return {
      schemaVersion: 1,
      task: "GENERATE_CONTENT_ANGLES",
      artistId: request.artistId,
      explicitRequest: request.explicitRequest,
      maturity,
      readiness,
      identity: data.identity,
      song: data.song ? { ...data.song, statements: working.songStatements } : null,
      approvedKnowledge: working.approvedKnowledge,
      toneExamples: working.toneExamples,
      validatedLearnings: working.validatedLearnings,
      campaign: data.campaign,
      platformConstraints: working.platformConstraints,
      productionCapability: data.productionCapability,
      recentAngles: working.recentAngles,
      missingSources: [...new Set(missingSources)].sort(),
      sourceReferences: refs,
      conflicts: [],
      budget: { ...request.budget, estimatedTokens, truncated },
      contextVersion
    };
  }
}
