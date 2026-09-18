export const hrefForOperationalSource = (sourceEntityType: string, sourceEntityId: string) => {
  if (sourceEntityType === "ContentUnit") return `/factory/units/${sourceEntityId}`;
  if (sourceEntityType === "ContentAngle") return "/factory";
  if (sourceEntityType === "CandidateKnowledge") return "/knowledge";
  if (sourceEntityType === "ArtistIdentity" || sourceEntityType === "IdentityVersion") return "/identity";
  if (sourceEntityType === "Song") return `/songs/${sourceEntityId}`;
  if (sourceEntityType === "Decision") return `/decisions/${sourceEntityId}`;
  if (sourceEntityType === "Learning") return "/learnings";
  if (sourceEntityType === "WeeklyReview") return `/weekly-reviews/${sourceEntityId}`;
  return "/";
};
