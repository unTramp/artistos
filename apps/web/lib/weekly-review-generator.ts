import type { CreateWeeklyReviewCommand, WeeklyReviewItemInput, WeeklyReviewSectionInput } from "@artist-os/core";
import {
  PgDecisionReader,
  PgOperationalActionReader,
  PgPlanningObjectiveReader,
  listLearnings,
  type Stage0Database
} from "@artist-os/db";

export interface WeeklyReviewPeriodInput {
  periodStart: Date;
  periodEnd: Date;
  generatedAt?: Date;
}

const inPeriod = (value: Date, start: Date, end: Date) => value >= start && value <= end;
const ref = (refType: string, refId: string) => ({ refType, refId });
const limit = (items: WeeklyReviewItemInput[], count = 12) => items.slice(0, count);

const section = (kind: WeeklyReviewSectionInput["kind"], label: string, items: WeeklyReviewItemInput[]): WeeklyReviewSectionInput => ({
  kind,
  label,
  items: limit(items)
});

export async function buildDeterministicWeeklyReview(
  db: Stage0Database,
  artistId: string,
  input: WeeklyReviewPeriodInput
): Promise<CreateWeeklyReviewCommand> {
  const generatedAt = input.generatedAt ?? new Date();
  const objectiveDate = input.periodEnd.toISOString().slice(0, 10);
  const decisionReader = new PgDecisionReader(db);
  const actionReader = new PgOperationalActionReader(db);
  const objectiveReader = new PgPlanningObjectiveReader(db);

  const [decisions, actions, learnings, currentObjective] = await Promise.all([
    decisionReader.listDecisions(artistId, { limit: 100 }),
    actionReader.listActions(artistId, { limit: 100 }),
    listLearnings(db, artistId, { limit: 100 }),
    objectiveReader.getCurrentPrimary(artistId, objectiveDate)
  ]);

  const completedActions = actions.filter((action) => action.completedAt && inPeriod(action.completedAt, input.periodStart, input.periodEnd));
  const decisionsCreated = decisions.filter((decision) => inPeriod(decision.createdAt, input.periodStart, input.periodEnd));
  const learningsCreated = learnings.filter((learning) => inPeriod(learning.createdAt, input.periodStart, input.periodEnd));

  const whatHappened: WeeklyReviewItemInput[] = [
    ...completedActions.map((action) => ({ text: `Completed action: ${action.title}`, references: [ref("OperationalAction", action.id)] })),
    ...decisionsCreated.map((decision) => ({ text: `Decision recorded: ${decision.title}`, references: [ref("Decision", decision.id)] })),
    ...learningsCreated.map((learning) => ({ text: `Learning captured: ${learning.statement}`, references: [ref("Learning", learning.id)] }))
  ];

  const whatChanged: WeeklyReviewItemInput[] = [
    ...learnings
      .filter((learning) => inPeriod(learning.updatedAt, input.periodStart, input.periodEnd) && learning.updatedAt.getTime() !== learning.createdAt.getTime())
      .map((learning) => ({ text: `Learning is now ${learning.status}: ${learning.statement}`, references: [ref("Learning", learning.id)] })),
    ...decisions
      .filter((decision) => inPeriod(decision.updatedAt, input.periodStart, input.periodEnd) && decision.updatedAt.getTime() !== decision.createdAt.getTime())
      .map((decision) => ({ text: `Decision is now ${decision.status}: ${decision.title}`, references: [ref("Decision", decision.id)] })),
    ...actions
      .filter((action) => inPeriod(action.updatedAt, input.periodStart, input.periodEnd) && action.updatedAt.getTime() !== action.createdAt.getTime() && action.status === "BLOCKED")
      .map((action) => ({ text: `Action became blocked: ${action.title}${action.stateReason ? ` — ${action.stateReason}` : ""}`, references: [ref("OperationalAction", action.id)] }))
  ];

  const validatedLearnings = learnings.filter((learning) => learning.status === "VALIDATED");
  const learnedThisPeriod = validatedLearnings.filter((learning) => inPeriod(learning.updatedAt, input.periodStart, input.periodEnd));
  const whatWasLearned = learnedThisPeriod.map((learning) => ({
    text: `${learning.statement} (${learning.scope} · ${learning.confidence})`,
    references: [ref("Learning", learning.id)]
  }));

  const uncertainties: WeeklyReviewItemInput[] = [
    ...learnings
      .filter((learning) => learning.status === "CANDIDATE" || learning.status === "TESTING")
      .map((learning) => ({ text: `${learning.status === "TESTING" ? "Still testing" : "Still unvalidated"}: ${learning.statement}`, references: [ref("Learning", learning.id)] })),
    ...decisions
      .filter((decision) => decision.status === "UNDER_REVIEW")
      .map((decision) => ({ text: `Decision under review: ${decision.title}`, references: [ref("Decision", decision.id)] }))
  ];

  const activeActions = actions.filter((action) => ["OPEN", "IN_PROGRESS", "BLOCKED"].includes(action.status));
  const dueOrBlockedActions = activeActions.filter((action) => action.status === "BLOCKED" || (action.dueAt !== null && action.dueAt <= generatedAt));
  const signals = dueOrBlockedActions.map((action) => ({
    text: `${action.status === "BLOCKED" ? "Blocked" : "Due"}: ${action.title}`,
    references: [ref("OperationalAction", action.id)]
  }));

  const learningIdsAlreadyUsedInDecisions = new Set(
    decisions.flatMap((decision) => decision.references
      .filter((reference) => reference.relation === "BASED_ON" && reference.refType.toLowerCase() === "learning")
      .map((reference) => reference.refId))
  );
  const decisionCandidates = validatedLearnings
    .filter((learning) => !learningIdsAlreadyUsedInDecisions.has(learning.id))
    .map((learning) => ({
      text: `Decide how to apply validated learning: ${learning.statement}`,
      references: [ref("Learning", learning.id)]
    }));

  const recommendedFocus: WeeklyReviewItemInput[] = currentObjective
    ? [{
        text: `Continue current focus: ${currentObjective.title} — ${currentObjective.statement}`,
        references: [ref("PlanningObjective", currentObjective.id)]
      }]
    : activeActions[0]
      ? [{
          text: `Consider establishing a primary focus around the highest-priority active action: ${activeActions[0].title}`,
          references: [ref("OperationalAction", activeActions[0].id)]
        }]
      : [];

  const nextActions = activeActions.slice(0, 8).map((action) => ({
    text: `${action.status === "BLOCKED" ? "Resolve" : "Continue"}: ${action.title}`,
    references: [ref("OperationalAction", action.id)]
  }));

  return {
    periodStart: input.periodStart.toISOString(),
    periodEnd: input.periodEnd.toISOString(),
    generatedAt: generatedAt.toISOString(),
    configurationVersion: "weekly-review-deterministic-v1",
    sections: [
      section("WHAT_HAPPENED", "What happened", whatHappened),
      section("WHAT_CHANGED", "What changed", whatChanged),
      section("WHAT_WAS_LEARNED", "What was learned", whatWasLearned),
      section("UNCERTAINTIES", "What remains uncertain", uncertainties),
      section("SIGNALS", "Signals requiring attention", signals),
      section("DECISIONS_TO_MAKE", "Decisions to make", decisionCandidates),
      section("RECOMMENDED_NEXT_FOCUS", "Recommended next focus", recommendedFocus),
      section("NEXT_ACTIONS", "Next OperationalActions", nextActions)
    ]
  };
}
