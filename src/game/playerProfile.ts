import type { Effects, GameState, GoalId } from "./types";

export type SkillId = "life" | "learning" | "work" | "community" | "planet";

export const sdgsSkills: { id: SkillId; label: string; icon: string; goalIds: GoalId[]; color: string }[] = [
  { id: "life", label: "くらし力", icon: "❤️", goalIds: [1, 2, 3, 5, 10], color: "#ff7a87" },
  { id: "learning", label: "まなび力", icon: "📚", goalIds: [4, 5, 9], color: "#7e9cff" },
  { id: "work", label: "しごと力", icon: "💼", goalIds: [8, 9, 12], color: "#ffba4b" },
  { id: "community", label: "つながり力", icon: "🤝", goalIds: [10, 11, 16, 17], color: "#a883ee" },
  { id: "planet", label: "地球力", icon: "🌏", goalIds: [6, 7, 13, 14, 15], color: "#5bd39b" },
];

export const skillScore = (goals: Record<GoalId, number>, goalIds: GoalId[]) =>
  Math.round(goalIds.reduce((total, id) => total + goals[id], 0) / goalIds.length);

export const playerSkills = (state: GameState) => sdgsSkills.map((skill) => ({
  ...skill,
  score: skillScore(state.goals, skill.goalIds),
}));

export const totalSdgsPoints = (state: GameState) =>
  playerSkills(state).reduce((total, skill) => total + skill.score, 0);

export const playerLevel = (state: GameState) => Math.max(1, Math.floor(totalSdgsPoints(state) / 45));

export const playerTitle = (state: GameState) => {
  const level = playerLevel(state);
  if (level >= 10) return "みらい市レジェンド";
  if (level >= 8) return "まちのストラテジスト";
  if (level >= 6) return "地域のチェンジメーカー";
  if (level >= 4) return "SDGsチャレンジャー";
  return "かけだし市長";
};

export const skillImpact = (effects: Effects) => sdgsSkills.map((skill) => ({
  ...skill,
  value: skill.goalIds.reduce((total, id) => total + (effects.goals[id] ?? 0), 0),
})).filter((skill) => skill.value !== 0);
