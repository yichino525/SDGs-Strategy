import { endingProfiles } from "../data/strategy";
import { recurringCast } from "../data/story";
import type { Effects, GameState } from "./types";

export const buildWitnessReaction = (effects: Effects, completedTurnIndex: number) => {
  const witness = recurringCast[completedTurnIndex % recurringCast.length];
  const hasGoalCost = Object.values(effects.goals).some((value) => (value ?? 0) < 0);
  const reaction = (effects.trust ?? 0) < 0
    ? witness.concern
    : hasGoalCost
      ? witness.tradeoff
      : (effects.trust ?? 0) >= 5
        ? witness.hope
        : witness.watch;

  return { ...witness, reaction };
};

export const pledgeProgress = (state: GameState) => {
  const profile = endingProfiles.find((candidate) => candidate.id === state.pledge);
  if (!profile) return { aligned: 0, total: state.history.length, percent: 0 };
  const aligned = state.history.filter((entry) => profile.actionIds.includes(entry.actionId as never)).length;
  const total = state.history.length;
  return { aligned, total, percent: total ? Math.round((aligned / total) * 100) : 0 };
};
