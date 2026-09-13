import { chains, endingProfiles } from "../data/strategy";
import type { GameState, Goal } from "./types";

export const buildEnding = (state: GameState, goals: Goal[]) => {
  const chosen = new Set(state.history.map((entry) => entry.actionId));
  const profile = endingProfiles.reduce((best, candidate) => {
    const bestScore = best.actionIds.filter((id) => chosen.has(id)).length;
    const candidateScore = candidate.actionIds.filter((id) => chosen.has(id)).length;
    return candidateScore > bestScore ? candidate : best;
  });
  const rankedGoals = [...goals].sort((left, right) => state.goals[right.id] - state.goals[left.id]);
  const strongest = rankedGoals[0];
  const attention = rankedGoals.at(-1) ?? rankedGoals[0];
  const triggeredChains = chains.filter((chain) => chosen.has(chain.requires) && chosen.has(chain.action));

  return { profile, strongest, attention, triggeredChains };
};
