export type AttentionPriority = "CRITICAL" | "HIGH" | "NORMAL" | "LOW";
export type AttentionKind = "BLOCKER" | "NEXT_ACTION" | "REVIEW" | "MEMORY" | "FOUNDATION" | "MUSIC";

export interface AttentionEntityRef {
  type: string;
  id: string;
  version?: number;
}

export interface AttentionGuidanceRef {
  key: string;
  label: string;
  estimatedMinutes?: number;
}

export interface AttentionAction {
  label: string;
  href: string;
}

export interface AttentionItem {
  id: string;
  kind: AttentionKind;
  priority: AttentionPriority;
  title: string;
  whyThis: string[];
  basedOn: AttentionEntityRef[];
  uncertainty: string[];
  blockedBy: AttentionEntityRef[];
  expectedEffect?: string;
  whatWillBeLearned?: string;
  guidanceRef?: AttentionGuidanceRef;
  action: AttentionAction;
  objectiveAligned: boolean;
}

export interface PlanningObjectiveContext {
  id: string;
  title: string;
  statement: string;
  priority: "PRIMARY" | "SECONDARY";
  scope: "ARTIST" | "CAMPAIGN" | "RELEASE" | "EVERGREEN" | "CUSTOM";
  campaignId?: string;
  releaseId?: string;
}

export interface AttentionOperationalActionInput {
  id: string;
  sourceDomain: string;
  sourceEntityType: string;
  sourceEntityId: string;
  title: string;
  description?: string | null;
  status: "OPEN" | "IN_PROGRESS" | "BLOCKED" | "DONE" | "SKIPPED" | "EXPIRED";
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  dueAt?: Date | null;
  notBefore?: Date | null;
  externalUrl?: string | null;
  version: number;
}

export interface AttentionProjectionInput {
  computedAt: Date;
  activeObjective?: PlanningObjectiveContext | null;
  identity: { active: boolean; versionRef?: AttentionEntityRef };
  songsCount: number;
  pendingKnowledge: { count: number; refs?: AttentionEntityRef[] };
  reviewAngles: { count: number; refs?: AttentionEntityRef[] };
  approvedAnglesWithoutUnit: { count: number; refs?: AttentionEntityRef[] };
  unitsWithoutApprovedExecution: Array<{ id: string; title: string; version?: number }>;
  operationalActions: AttentionOperationalActionInput[];
}

export interface AttentionProjection {
  computedAt: Date;
  activeObjective: PlanningObjectiveContext | null;
  items: AttentionItem[];
}

const priorityScore: Record<AttentionPriority, number> = { CRITICAL: 400, HIGH: 300, NORMAL: 200, LOW: 100 };
const operationalPriorityScore: Record<AttentionOperationalActionInput["priority"], number> = { URGENT: 80, HIGH: 50, NORMAL: 20, LOW: 0 };

const objectiveMatches = (objective: PlanningObjectiveContext | null | undefined, sourceType: string, sourceId: string) => {
  if (!objective) return false;
  if (objective.scope === "RELEASE" && objective.releaseId) return sourceType.toLowerCase().includes("release") && sourceId === objective.releaseId;
  if (objective.scope === "CAMPAIGN" && objective.campaignId) return sourceType.toLowerCase().includes("campaign") && sourceId === objective.campaignId;
  return objective.scope === "ARTIST";
};

const dueStateScore = (action: AttentionOperationalActionInput, now: Date) => {
  if (!action.dueAt) return 0;
  const diff = action.dueAt.getTime() - now.getTime();
  if (diff <= 0) return 90;
  if (diff <= 24 * 60 * 60 * 1000) return 60;
  if (diff <= 72 * 60 * 60 * 1000) return 30;
  return 0;
};

const sortProjection = (items: Array<{ item: AttentionItem; score: number }>) => items
  .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
  .map(({ item }) => item);

export class AttentionProjectionService {
  project(input: AttentionProjectionInput): AttentionProjection {
    const objective = input.activeObjective ?? null;
    const scored: Array<{ item: AttentionItem; score: number }> = [];
    const push = (item: AttentionItem, extra = 0) => scored.push({ item, score: priorityScore[item.priority] + extra });

    if (!input.identity.active) {
      push({
        id: "foundation:identity",
        kind: "FOUNDATION",
        priority: "HIGH",
        title: "Activate your artist identity",
        whyThis: ["Future recommendations need one canonical active Identity Version."],
        basedOn: [], uncertainty: [], blockedBy: [],
        expectedEffect: "Gives future content and strategy work a canonical identity context.",
        action: { label: "Open Identity", href: "/identity" }, objectiveAligned: objective?.scope === "ARTIST"
      }, objective?.scope === "ARTIST" ? 25 : 0);
    }

    for (const unit of input.unitsWithoutApprovedExecution) {
      push({
        id: `content-unit:${unit.id}:execution`, kind: "BLOCKER", priority: "HIGH",
        title: `Finish execution · ${unit.title}`,
        whyThis: ["This Content Unit exists but has no approved execution revision."],
        basedOn: [{ type: "ContentUnit", id: unit.id, ...(unit.version ? { version: unit.version } : {}) }],
        uncertainty: [], blockedBy: [], expectedEffect: "Unlocks the unit's path toward execution readiness.",
        action: { label: "Continue execution", href: `/factory/units/${unit.id}` }, objectiveAligned: false
      }, 20);
    }

    if (input.approvedAnglesWithoutUnit.count > 0) {
      push({
        id: "content:approved-without-unit", kind: "NEXT_ACTION", priority: "NORMAL",
        title: `${input.approvedAnglesWithoutUnit.count} approved angle${input.approvedAnglesWithoutUnit.count === 1 ? "" : "s"} waiting for commitment`,
        whyThis: ["Approval does not create a Content Unit automatically."], basedOn: input.approvedAnglesWithoutUnit.refs ?? [],
        uncertainty: [], blockedBy: [], expectedEffect: "Lets you choose which approved idea should enter production.",
        action: { label: "Review approved angles", href: "/factory" }, objectiveAligned: false
      });
    }

    if (input.reviewAngles.count > 0) {
      push({
        id: "content:angle-review", kind: "REVIEW", priority: "NORMAL",
        title: `${input.reviewAngles.count} content angle${input.reviewAngles.count === 1 ? "" : "s"} need judgment`,
        whyThis: ["Draft and deferred ideas remain proposals until you explicitly review them."], basedOn: input.reviewAngles.refs ?? [],
        uncertainty: [], blockedBy: [], action: { label: "Review angles", href: "/factory" }, objectiveAligned: false
      });
    }

    if (input.pendingKnowledge.count > 0) {
      push({
        id: "knowledge:pending", kind: "MEMORY", priority: "NORMAL",
        title: `${input.pendingKnowledge.count} knowledge candidate${input.pendingKnowledge.count === 1 ? "" : "s"} waiting`,
        whyThis: ["Candidate knowledge stays outside permanent Artist Brain context until you review it."], basedOn: input.pendingKnowledge.refs ?? [],
        uncertainty: [], blockedBy: [], expectedEffect: "Keeps durable memory human-controlled.",
        action: { label: "Review Brain inbox", href: "/knowledge" }, objectiveAligned: false
      });
    }

    if (input.songsCount === 0) {
      push({
        id: "music:first-song", kind: "MUSIC", priority: "NORMAL", title: "Add your first song",
        whyThis: ["Song Brain gives future content and strategy decisions track-specific context."], basedOn: [], uncertainty: [], blockedBy: [],
        action: { label: "Add song", href: "/songs" }, objectiveAligned: false
      });
    }

    for (const action of input.operationalActions) {
      if (["DONE", "SKIPPED", "EXPIRED"].includes(action.status)) continue;
      if (action.notBefore && action.notBefore > input.computedAt) continue;
      const aligned = objectiveMatches(objective, action.sourceEntityType, action.sourceEntityId);
      const isBlocked = action.status === "BLOCKED";
      const priority: AttentionPriority = isBlocked || action.priority === "URGENT" ? "HIGH" : action.priority === "HIGH" ? "HIGH" : "NORMAL";
      const why = isBlocked
        ? [action.description ?? "This operational action is blocked and cannot progress without attention."]
        : [action.description ?? "This operational action is active and still requires completion."];
      if (aligned && objective) why.push(`It directly supports the current ${objective.priority.toLowerCase()} objective: ${objective.title}.`);
      push({
        id: `operational-action:${action.id}`,
        kind: isBlocked ? "BLOCKER" : "NEXT_ACTION",
        priority,
        title: action.title,
        whyThis: why,
        basedOn: [{ type: "OperationalAction", id: action.id, version: action.version }, { type: action.sourceEntityType, id: action.sourceEntityId }],
        uncertainty: [], blockedBy: isBlocked ? [{ type: action.sourceEntityType, id: action.sourceEntityId }] : [],
        expectedEffect: "Advances the linked workflow without changing source-domain truth by itself.",
        action: { label: action.externalUrl ? "Open action" : "View action", href: action.externalUrl ?? "/" },
        objectiveAligned: aligned
      }, operationalPriorityScore[action.priority] + dueStateScore(action, input.computedAt) + (aligned ? 25 : 0) + (isBlocked ? 20 : 0));
    }

    return { computedAt: input.computedAt, activeObjective: objective, items: sortProjection(scored) };
  }
}
