export type GoalId = number;

export type Goal = {
  id: GoalId;
  shortName: string;
  color: string;
};

export type Resources = {
  budget: number;
  economy: number;
  trust: number;
};

export type Effects = Partial<Resources> & {
  goals: Partial<Record<GoalId, number>>;
};

export type Action = {
  id: string;
  title: string;
  description: string;
  tradeoff: string;
  effects: Effects;
};

export type Turn = {
  id: string;
  label: string;
  headline: string;
  context: string;
  actions: Action[];
};

export type HistoryEntry = {
  turnId: string;
  turnLabel: string;
  actionId: string;
  actionTitle: string;
};

export type GameState = {
  version: 1;
  turnIndex: number;
  goals: Record<GoalId, number>;
  resources: Resources;
  history: HistoryEntry[];
  completed: boolean;
};
