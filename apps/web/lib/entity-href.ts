export const hrefForEntityReference = (entityType: string, entityId: string): string | null => {
  if (entityType === "ContentUnit") return `/factory/units/${entityId}`;
  if (entityType === "ContentAngle") return "/factory";
  if (entityType === "CandidateKnowledge") return "/knowledge";
  if (entityType === "ArtistIdentity" || entityType === "IdentityVersion") return "/identity";
  if (entityType === "Song") return `/songs/${entityId}`;
  if (entityType === "Decision") return `/decisions/${entityId}`;
  if (entityType === "Learning") return `/learnings#learning-${entityId}`;
  if (entityType === "WeeklyReview") return `/weekly-reviews/${entityId}`;
  if (entityType === "PlanningObjective") return "/#current-focus";
  if (entityType === "OperationalAction") return `/#action-${entityId}`;
  return null;
};

export const hrefForOperationalSource = (sourceEntityType: string, sourceEntityId: string) =>
  hrefForEntityReference(sourceEntityType, sourceEntityId) ?? "/";
