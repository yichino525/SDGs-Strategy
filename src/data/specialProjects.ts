import type { Effects, GameState } from "../game/types";

export type SpecialProject = {
  id: string;
  icon: string;
  title: string;
  catchphrase: string;
  description: string;
  risk: string;
  minTurn: number;
  requirements: Partial<GameState["resources"]>;
  cost: { budget: number; trust: number };
  baseChance: number;
  bonusActions: { id: string; label: string }[];
  success: Effects;
  failure: Effects;
  successStory: string;
  failureStory: string;
};

// すべてゲーム用の仮想計画。効果値は現実の政策予測ではない。
export const specialProjects: SpecialProject[] = [
  {
    id: "future-transit", icon: "🚈", title: "未来型公共交通計画", catchphrase: "まち全体を、一本の移動網で結ぶ。",
    description: "鉄道、地域バス、自転車道を一体で整備する10年計画です。移動の格差を変える一方、失敗すれば大きな赤字が残ります。",
    risk: "利用者が伸びなければ、維持費と市民の不満が残る", minTurn: 6,
    requirements: { budget: 22, trust: 48 }, cost: { budget: 20, trust: 4 }, baseChance: 42,
    bonusActions: [{ id: "community-bus", label: "地域バスの経験" }, { id: "walking-city", label: "歩くまちづくり" }],
    success: { economy: 7, trust: 5, goals: { 3: 5, 8: 4, 9: 7, 10: 5, 11: 10, 13: 6 } },
    failure: { economy: -5, trust: -9, goals: { 9: 2, 11: -3 } },
    successStory: "新しい交通網が学校、病院、商店街を結び、人の流れがまちへ戻りました。",
    failureStory: "工事の遅れと利用予測のずれが重なり、市民から計画の立て直しを求められました。",
  },
  {
    id: "child-future-city", icon: "🌈", title: "子ども未来都市宣言", catchphrase: "育つ場所を、まちの真ん中につくる。",
    description: "給食、学び、遊び、子育て相談を一つの長期事業として充実させます。多くの家庭に届きますが、現場の人手不足が成否を分けます。",
    risk: "施設だけ先に増えると、支える人が足りなくなる", minTurn: 12,
    requirements: { budget: 18, trust: 58 }, cost: { budget: 16, trust: 7 }, baseChance: 45,
    bonusActions: [{ id: "child-support", label: "放課後支援" }, { id: "community-kitchen", label: "みんなの食堂" }, { id: "care-worker-pay", label: "支える人の待遇改善" }],
    success: { economy: 3, trust: 9, goals: { 1: 7, 2: 7, 3: 4, 4: 10, 5: 6, 10: 6 } },
    failure: { trust: -8, goals: { 4: 2, 5: -3 } },
    successStory: "学校と地域の居場所がつながり、子どもも大人も相談できる道が増えました。",
    failureStory: "場所はできましたが人材が定着せず、期待した家庭へ十分な支援を届けられませんでした。",
  },
  {
    id: "energy-revolution", icon: "⚡", title: "地域エネルギー革命", catchphrase: "使う電気を、地域の力に変える。",
    description: "公共施設、住宅、企業を地域電力網で結びます。成功すれば収入と脱炭素が進みますが、技術と資金の両方が必要です。",
    risk: "設備トラブルや価格変動で投資を回収できない", minTurn: 20,
    requirements: { budget: 24, economy: 55 }, cost: { budget: 22, trust: 3 }, baseChance: 40,
    bonusActions: [{ id: "clean-energy", label: "公共施設の発電" }, { id: "community-energy", label: "地域電力の運営" }, { id: "efficiency-retrofit", label: "省エネ改修" }],
    success: { budget: 10, economy: 9, trust: 4, goals: { 7: 12, 8: 6, 9: 6, 12: 7, 13: 10 } },
    failure: { budget: -3, economy: -6, trust: -5, goals: { 7: 2, 13: 2 } },
    successStory: "地域で作った電気と利益が地域へ戻り、新しい仕事と安定した収入が生まれました。",
    failureStory: "設備費と運営の難しさが予想を上回り、計画を小さく立て直すことになりました。",
  },
  {
    id: "citizen-budget", icon: "🗣️", title: "市民参加型予算", catchphrase: "一部の予算を、市民の手で決める。",
    description: "子どもを含む市民会議が、大型予算の使い道を提案して投票します。信頼を大きく育てますが、対立をまとめられない危険もあります。",
    risk: "声の大きい人だけが有利になると、分断が深まる", minTurn: 28,
    requirements: { budget: 16, trust: 65 }, cost: { budget: 12, trust: 10 }, baseChance: 48,
    bonusActions: [{ id: "citizen-assembly", label: "市民会議" }, { id: "open-city-data", label: "市の情報公開" }, { id: "privacy-audit", label: "情報ルールの点検" }],
    success: { trust: 14, goals: { 5: 4, 10: 6, 11: 5, 16: 12, 17: 8 } },
    failure: { trust: -13, goals: { 10: -3, 16: -5 } },
    successStory: "世代も立場も違う市民が予算を話し合い、決定への納得と参加が広がりました。",
    failureStory: "議論のルールが追いつかず、参加できなかった人から不公平だという声が強まりました。",
  },
  {
    id: "sdgs-expo", icon: "🎪", title: "国際SDGs博覧会", catchphrase: "2030年への挑戦を、世界へひらく。",
    description: "世界の都市や企業、学校を招く大型博覧会です。成功すれば経済と連携が伸びますが、一時的な祭りで終わる危険があります。",
    risk: "来場者が伸びなければ、大きな施設と借金だけが残る", minTurn: 38,
    requirements: { budget: 28, economy: 58, trust: 60 }, cost: { budget: 26, trust: 6 }, baseChance: 36,
    bonusActions: [{ id: "slow-tourism", label: "地域に残る観光" }, { id: "shared-workshop", label: "地域のものづくり" }, { id: "intercultural-neighborhood", label: "多文化のつながり" }],
    success: { budget: 8, economy: 12, trust: 7, goals: { 8: 9, 9: 8, 11: 5, 12: 5, 17: 12 } },
    failure: { budget: -5, economy: -8, trust: -10, goals: { 8: -3, 12: -2 } },
    successStory: "博覧会をきっかけに、地域の技術と文化が長く続く仕事や国際協力へつながりました。",
    failureStory: "来場者は目標に届かず、短期間のにぎわいと重い維持費が残りました。",
  },
  {
    id: "mega-resilience", icon: "🛡️", title: "巨大防災都市計画", catchphrase: "次の危機でも、暮らしを止めない。",
    description: "水道、避難所、医療、通信を一度に強くします。目立たない巨額投資ですが、成功すれば大災害への強い盾になります。",
    risk: "工事が集中すると、予算超過と生活への負担が起きる", minTurn: 46,
    requirements: { budget: 30, trust: 55 }, cost: { budget: 28, trust: 5 }, baseChance: 43,
    bonusActions: [{ id: "inclusive-evacuation", label: "誰も取り残さない避難" }, { id: "drainage-upgrade", label: "浸水対策" }, { id: "public-health-network", label: "地域医療の連携" }],
    success: { trust: 8, goals: { 3: 9, 6: 10, 9: 5, 10: 5, 11: 13, 13: 8 } },
    failure: { budget: -4, trust: -7, goals: { 6: 3, 11: 3 } },
    successStory: "水、医療、通信、避難の備えが一つにつながり、危機にも暮らしを守れるまちになりました。",
    failureStory: "同時に進めた工事が混乱し、最低限の改善を残して計画を縮小しました。",
  },
];
