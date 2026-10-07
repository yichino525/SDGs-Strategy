import { chains } from "../data/strategy";
import { playerSkills } from "./playerProfile";
import type { GameState } from "./types";

export type Achievement = {
  id: string;
  icon: string;
  title: string;
  description: string;
  hint: string;
  hidden?: boolean;
  unlocked: (state: GameState) => boolean;
};

const chosen = (state: GameState, id: string) => state.history.some((entry) => entry.actionId === id);
const chosenCount = (state: GameState, ids: string[]) => ids.filter((id) => chosen(state, id)).length;
const specialSuccesses = (state: GameState) => state.specialProjects?.filter((item) => item.outcome === "success").length ?? 0;

export const achievements: Achievement[] = [
  { id: "first-step", icon: "🌱", title: "未来への第一歩", description: "最初の政策を決断した証。", hint: "最初の年を進める", unlocked: (state) => state.history.length >= 1 },
  { id: "four-year-mayor", icon: "🗓️", title: "一期を走り抜けた市長", description: "4年間、選択を積み重ねました。", hint: "4ターン進める", unlocked: (state) => state.history.length >= 4 },
  { id: "trusted-mayor", icon: "🤝", title: "市民と歩む市長", description: "高い信頼を集めた市政です。", hint: "社会的信頼を75以上にする", unlocked: (state) => state.resources.trust >= 75 },
  { id: "economic-producer", icon: "🏪", title: "地域経済のプロデューサー", description: "仕事と地域経済を力強く育てました。", hint: "経済を70以上にする", unlocked: (state) => state.resources.economy >= 70 },
  { id: "careful-treasurer", icon: "🪙", title: "未来を残す財政家", description: "挑戦しながら十分な予算も残しました。", hint: "予算を45以上にする", unlocked: (state) => state.resources.budget >= 45 },
  { id: "five-star", icon: "⭐", title: "五つ星の未来市長", description: "5つの力をバランスよく育てました。", hint: "5つの力をすべて65以上にする", unlocked: (state) => Math.min(...playerSkills(state).map((skill) => skill.score)) >= 65 },
  { id: "leave-no-one", icon: "🌍", title: "誰も取り残さない設計者", description: "17ゴールの弱点を底上げしました。", hint: "17ゴールをすべて60以上にする", unlocked: (state) => Math.min(...Object.values(state.goals)) >= 60 },
  { id: "children-first", icon: "🌈", title: "子どもの未来応援団長", description: "学びと居場所を何度も選びました。", hint: "子ども・学びに関する政策を2つ選ぶ", unlocked: (state) => chosenCount(state, ["child-support", "learning-quest", "school-night-shift", "school-farm-league"]) >= 2 },
  { id: "green-architect", icon: "🌳", title: "緑の未来設計者", description: "自然とエネルギーの力を伸ばしました。", hint: "地球力を70以上にする", unlocked: (state) => playerSkills(state).find((skill) => skill.id === "planet")!.score >= 70 },
  { id: "big-dreamer", icon: "🏗️", title: "大計画を実現した市長", description: "大型プロジェクトを成功へ導きました。", hint: "大型プロジェクトを1つ成功させる", unlocked: (state) => specialSuccesses(state) >= 1 },
  { id: "policy-combo", icon: "🔗", title: "政策コンボの発見者", description: "別々の政策をつなぎ、新しい効果を生みました。", hint: "政策の連鎖を見つける", unlocked: (state) => chains.some((chain) => chosen(state, chain.requires) && chosen(state, chain.action)) },
  { id: "game-master", icon: "🎮", title: "遊びでまちを救う者", description: "ゲームの力で学びと防災を変えました。", hint: "？？？", hidden: true, unlocked: (state) => chosen(state, "learning-quest") && chosen(state, "disaster-escape-game") },
  { id: "midnight-mayor", icon: "🌙", title: "真夜中の市長", description: "眠らない学びと市役所を実現しました。", hint: "？？？", hidden: true, unlocked: (state) => chosen(state, "school-night-shift") && chosen(state, "robot-counter") },
  { id: "rain-whisperer", icon: "🦆", title: "雨と話すまちづくり名人", description: "広場と湿地に雨を受け止めてもらいました。", hint: "？？？", hidden: true, unlocked: (state) => chosen(state, "river-room") && chosen(state, "wetland-defense") },
  { id: "phoenix", icon: "🔥", title: "失敗から立つ不死鳥", description: "大計画の失敗を越えて、別の成功をつかみました。", hint: "？？？", hidden: true, unlocked: (state) => Boolean(state.specialProjects?.some((item) => item.outcome === "failure") && state.specialProjects?.some((item) => item.outcome === "success")) },
  { id: "triple-crown", icon: "👑", title: "三大プロジェクトの覇者", description: "3つの大型プロジェクトを成功させました。", hint: "？？？", hidden: true, unlocked: (state) => specialSuccesses(state) >= 3 },
  { id: "perfect-world", icon: "💎", title: "17色のレジェンド", description: "17ゴールすべてを80以上へ導きました。", hint: "？？？", hidden: true, unlocked: (state) => Math.min(...Object.values(state.goals)) >= 80 },
  { id: "last-coin", icon: "🪽", title: "最後の一枚まで未来へ", description: "ほぼ全予算を使い切って2030年へ到達しました。", hint: "？？？", hidden: true, unlocked: (state) => state.completed && !state.gameOver && state.resources.budget <= 2 },
];

export const achievementCollection = (state: GameState) => achievements.map((achievement) => ({
  ...achievement,
  earned: achievement.unlocked(state),
}));

export const featuredAchievement = (state: GameState) =>
  [...achievementCollection(state)].reverse().find((achievement) => achievement.earned);
