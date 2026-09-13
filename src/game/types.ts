export type GoalId = number;
export type PledgeId = "inclusive" | "innovative" | "resilient";

export type Goal = {
  id: GoalId;
  shortName: string;
  color: string;
  ink: "#ffffff" | "#102027";
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
  audience: string;
  timing: "すぐ" | "あとから";
  resultStory?: string;
  effects: Effects;
};

export type Turn = {
  id: string;
  label: string;
  chapter: string;
  decisionType: "政策" | "予算編成" | "危機への備え" | "地域との協働" | "議会との調整" | "章末判断";
  headline: string;
  context: string;
  scenarioKind: "historical-frame" | "fictional";
  source?: { title: string; url: string; checkedAt: string };
  actions: Action[];
};

export type HistoryEntry = {
  turnId: string;
  turnLabel: string;
  actionId: string;
  actionTitle: string;
};

export type GameState = {
  report?: { title: string; stories: string[]; effects: Effects; income?: number };
  pending?: { due: number; title: string; effects: Effects }[];
  version: 1;
  pledge?: PledgeId;
  turnIndex: number;
  goals: Record<GoalId, number>;
  resources: Resources;
  history: HistoryEntry[];
  completed: boolean;
};
