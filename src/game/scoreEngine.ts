import { goals } from "../data/goals";
import type { Action, GameState, GoalId } from "./types";

export const clamp = (value: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, value));

export const createInitialState = (): GameState => ({
  version: 1,
  turnIndex: 0,
  goals: Object.fromEntries(goals.map((goal) => [goal.id, 50])) as Record<GoalId, number>,
  resources: { budget: 60, economy: 50, trust: 50 },
  history: [],
  completed: false,
});

export const applyAction = (
  state: GameState,
  action: Action,
  turnLabel: string,
  totalTurns: number,
): GameState => {
  if (state.completed) return state;

  const nextGoals = { ...state.goals };
  for (const [rawId, change] of Object.entries(action.effects.goals)) {
    const id = Number(rawId) as GoalId;
    nextGoals[id] = clamp((nextGoals[id] ?? 50) + (change ?? 0));
  }

  const nextTurnIndex = state.turnIndex + 1;
  return {
    ...state,
    turnIndex: nextTurnIndex,
    completed: nextTurnIndex >= totalTurns,
    goals: nextGoals,
    resources: {
      budget: clamp(state.resources.budget + (action.effects.budget ?? 0)),
      economy: clamp(state.resources.economy + (action.effects.economy ?? 0)),
      trust: clamp(state.resources.trust + (action.effects.trust ?? 0)),
    },
    history: [
      ...state.history,
      {
        turnId: `${state.turnIndex}`,
        turnLabel,
        actionId: action.id,
        actionTitle: action.title,
      },
    ],
  };
};

export const averageGoalScore = (state: GameState) => {
  const values = Object.values(state.goals);
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
};
