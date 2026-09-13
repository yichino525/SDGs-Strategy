import { goals } from "../data/goals";
import { chains, delayed } from "../data/strategy";
import type { Effects } from "./types";
import type { Action, GameState, GoalId } from "./types";

export const clamp = (value: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, value));

export const createInitialState = (): GameState => ({
  version: 1,
  turnIndex: 0,
  goals: Object.fromEntries(goals.map((goal) => [goal.id, 50])) as Record<GoalId, number>,
  resources: { budget: 32, economy: 50, trust: 50 },
  history: [],
  completed: false,
});

export const quarterlyRevenue = (economy: number) =>
  clamp(3 + Math.round((economy - 50) / 15), 2, 5);

// 体験期間が延びても、以前の最終地点から続きを遊べるようにする。
export const alignProgress = (state: GameState, totalTurns: number): GameState => ({
  ...state,
  completed: state.turnIndex >= totalTurns,
});

export const applyAction = (
  state: GameState,
  action: Action,
  turnLabel: string,
  totalTurns: number,
): GameState => {
  if (state.completed || state.resources.budget + (action.effects.budget ?? 0) < 0) return state;

  const effects: Effects = { ...action.effects, goals: { ...action.effects.goals } };
  const stories: string[] = action.resultStory ? [action.resultStory] : [];
  const merge = (extra: Effects) => {
    for (const key of ["budget", "economy", "trust"] as const) effects[key] = (effects[key] ?? 0) + (extra[key] ?? 0);
    for (const [id, value] of Object.entries(extra.goals)) effects.goals[Number(id)] = (effects.goals[Number(id)] ?? 0) + (value ?? 0);
  };
  const nextTurnIndex = state.turnIndex + 1;
  const pending = [...(state.pending ?? [])];
  for (const item of pending.filter(item => item.due <= nextTurnIndex)) {
    merge(item.effects);
    stories.push(`実を結んだ投資：${item.title}`);
  }
  for (const chain of chains.filter(item => item.action === action.id && state.history.some(entry => entry.actionId === item.requires))) {
    merge(chain.effects);
    stories.push(`政策の連鎖「${chain.title}」：${chain.text}`);
  }
  const future = delayed[action.id];
  if (future) pending.push({ ...future, due: nextTurnIndex + 2 });

  const economyAfterPolicy = clamp(state.resources.economy + (effects.economy ?? 0));
  const income = quarterlyRevenue(economyAfterPolicy);
  merge({ budget: income, goals: {} });

  const nextGoals = { ...state.goals };
  for (const [rawId, change] of Object.entries(effects.goals)) {
    const id = Number(rawId) as GoalId;
    nextGoals[id] = clamp((nextGoals[id] ?? 50) + (change ?? 0));
  }

  const resources = {
    budget: clamp(state.resources.budget + (effects.budget ?? 0)),
    economy: clamp(state.resources.economy + (effects.economy ?? 0)),
    trust: clamp(state.resources.trust + (effects.trust ?? 0)),
  };
  const actual: Effects = { goals: {} };
  for (const key of ["budget", "economy", "trust"] as const) actual[key] = resources[key] - state.resources[key];
  for (const goal of goals) actual.goals[goal.id] = nextGoals[goal.id] - state.goals[goal.id];
  return {
    ...state,
    pending: pending.filter(item => item.due > nextTurnIndex),
    report: { title: action.title, stories, effects: actual, income },
    turnIndex: nextTurnIndex,
    completed: nextTurnIndex >= totalTurns,
    goals: nextGoals,
    resources,
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
