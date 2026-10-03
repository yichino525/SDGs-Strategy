import { playerSkills, totalSdgsPoints } from "./playerProfile";
import type { GameOver, GameState, Turn } from "./types";

const electionYears = new Set([2019, 2023, 2027]);
const disasterTurns = new Set(["2017-q4", "2023-q4", "2028-q4"]);
const highRiskActions = new Set(["reserve-fund", "mass-tourism", "visible-projects", "predictive-support", "decade-reserve", "robot-counter", "compact-city-bet", "water-token", "underground-lifeline", "green-industry-deal"]);

const yearOf = (turnId: string) => Number(turnId.slice(0, 4));
const resilience = (state: GameState) =>
  Math.min(100, Math.round(([3, 6, 11, 13] as const).reduce((sum, id) => sum + state.goals[id], 0) / 4)
    + (state.specialProjects?.some((item) => item.id === "mega-resilience" && item.outcome === "success") ? 20 : 0));

export const cityRank = (state: GameState) => {
  const points = totalSdgsPoints(state);
  const budgetSafety = Math.min(100, state.resources.budget * 3);
  const score = Math.round((points / 5) * .5 + state.resources.trust * .25 + state.resources.economy * .15 + budgetSafety * .1);
  if (score >= 80) return { grade: "S", label: "未来をひらく市政", score };
  if (score >= 70) return { grade: "A", label: "力強く育つ市政", score };
  if (score >= 60) return { grade: "B", label: "着実に進む市政", score };
  if (score >= 50) return { grade: "C", label: "課題と向き合う市政", score };
  return { grade: "D", label: "立て直しが必要な市政", score };
};

const earnedTitle = (state: GameState) => {
  const skills = playerSkills(state);
  const strongest = [...skills].sort((a, b) => b.score - a.score)[0];
  if (Math.min(...skills.map((skill) => skill.score)) >= 75) return "五つ星の未来市長";
  if (state.resources.trust >= 80) return "市民と歩む対話の市長";
  const titles = {
    life: "暮らしを守る市長",
    learning: "学びを育てる市長",
    work: "地域経済のプロデューサー",
    community: "つながりの名人",
    planet: "緑の未来設計者",
  } as const;
  return titles[strongest.id];
};

const annualTraits = (state: GameState) => {
  const skills = playerSkills(state);
  const scores = skills.map((skill) => skill.score);
  const spread = Math.max(...scores) - Math.min(...scores);
  const traits: string[] = [];
  if (state.resources.trust >= 70) traits.push("対話を大切にし、市民の信頼を集めた");
  if (state.resources.economy >= 65) traits.push("地域の仕事と経済を力強く育てた");
  if (state.resources.budget >= 20) traits.push("将来に使える予算を堅実に残した");
  if (spread <= 8) traits.push("五つの力をバランスよく伸ばした");
  if (spread >= 18) traits.push("得意分野が際立つ一方、弱点も残った");
  if (resilience(state) >= 65) traits.push("災害や危機への備えを積み重ねた");
  return traits.length ? traits.slice(0, 3) : ["限られた条件の中で、次の一手を探し続けた"];
};

export const evaluateGameOver = (state: GameState, turnId?: string): GameOver | undefined => {
  if (!turnId || state.turnIndex < 2) return undefined;
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
  const rank = cityRank(state);
  return {
    year,
    points: totalSdgsPoints(state),
    approval,
    rank,
    title: earnedTitle(state),
    traits: annualTraits(state),
    nextGoal: `${attention.label}を${Math.min(100, attention.score + 5)}まで伸ばす`,
    strongest,
    attention,
    choices: state.history.filter((entry) => entry.turnLabel.startsWith(`${year}年`)).map((entry) => entry.actionTitle).slice(-1),
    nextElection: electionYears.has(year) ? "今年は市長選の年です" : undefined,
  };
};
