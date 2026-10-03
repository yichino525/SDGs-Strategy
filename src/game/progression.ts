import { playerSkills, totalSdgsPoints } from "./playerProfile";
import type { GameOver, GameState, Turn } from "./types";

const electionYears = new Set([2019, 2023, 2027]);
const disasterTurns = new Set(["2017-q1", "2023-q4", "2028-q1"]);
const highRiskActions = new Set(["reserve-fund", "mass-tourism", "visible-projects", "predictive-support", "decade-reserve"]);

const yearOf = (turnId: string) => Number(turnId.slice(0, 4));
const resilience = (state: GameState) =>
  Math.round(([3, 6, 11, 13] as const).reduce((sum, id) => sum + state.goals[id], 0) / 4);

export const evaluateGameOver = (state: GameState, turnId?: string): GameOver | undefined => {
  if (!turnId || state.turnIndex < 4) return undefined;
  const year = yearOf(turnId);
  const highRiskChoices = state.history.filter((entry) => highRiskActions.has(entry.actionId)).length;

  if (turnId.endsWith("q4") && electionYears.has(year)
    && (state.resources.trust < 45 || highRiskChoices >= 4 || (state.resources.trust < 65 && highRiskChoices >= 3))) {
    return {
      reason: "election",
      title: "市長選で、続投できませんでした",
      text: `社会的信頼は${state.resources.trust}。説明や合意が足りない大きな判断が重なり、市民から新しいリーダーを求める票が集まりました。`,
      advice: "負担の大きい政策を選ぶ時は、対話や支援で信頼を回復することも必要です。",
    };
  }

  if (disasterTurns.has(turnId) && resilience(state) < 42) {
    return {
      reason: "disaster",
      title: "複合災害に、まちの備えが追いつきませんでした",
      text: `健康・水・まち・気候の備えが平均${resilience(state)}となり、行政機能を維持できなくなりました。`,
      advice: "目立つ成果だけでなく、水道、防災、健康、気候への備えを少しずつ積み重ねてください。",
    };
  }

  if (state.resources.budget <= 1 && state.resources.economy < 30) {
    return {
      reason: "fiscal",
      title: "財政危機で、政策を続けられなくなりました",
      text: `予算${state.resources.budget}、経済${state.resources.economy}となり、市の基本サービスを維持できません。`,
      advice: "支出だけでなく、地域の仕事や将来の税収を育てる選択も組み合わせましょう。",
    };
  }

  return undefined;
};

export const riskWarnings = (state: GameState, turn?: Turn) => {
  if (!turn) return [];
  const warnings: { icon: string; title: string; text: string }[] = [];
  const year = yearOf(turn.id);
  const highRiskChoices = state.history.filter((entry) => highRiskActions.has(entry.actionId)).length;
  if (electionYears.has(year) && (state.resources.trust < 55 || highRiskChoices >= 2)) warnings.push({
    icon: "🗳️", title: "市長選が近づいています", text: `信頼${state.resources.trust}、大きな反発を招いた判断${highRiskChoices}回。信頼45未満、または反発が重なった状態で年末を迎えると落選の可能性があります。`,
  });
  if (state.resources.budget < 8 && state.resources.economy < 40) warnings.push({
    icon: "⚠️", title: "財政が危険水域です", text: "予算が1以下、経済が30未満になると政策を続けられません。",
  });
  if (disasterTurns.has(turn.id) && resilience(state) < 50) warnings.push({
    icon: "🌧️", title: "大きな災害の気配", text: `まちの備えは${resilience(state)}。42未満では危機を乗り越えられません。`,
  });
  return warnings;
};

export const buildAnnualReview = (state: GameState, turnId?: string) => {
  if (!turnId?.endsWith("q4")) return undefined;
  const skills = playerSkills(state);
  const strongest = [...skills].sort((a, b) => b.score - a.score)[0];
  const attention = [...skills].sort((a, b) => a.score - b.score)[0];
  const year = yearOf(turnId);
  const approval = state.resources.trust >= 65 ? "大きな期待" : state.resources.trust >= 45 ? "期待と注文" : "厳しい評価";
  return {
    year,
    points: totalSdgsPoints(state),
    approval,
    strongest,
    attention,
    choices: state.history.slice(-4).map((entry) => entry.actionTitle),
    nextElection: electionYears.has(year) ? "今年は市長選の年です" : undefined,
  };
};
