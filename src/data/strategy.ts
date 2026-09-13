import type { Effects } from "../game/types";

// 数値と人物は体験版用の創作。現実の政策効果の予測ではない。
export const delayed: Record<string, { title: string; effects: Effects }> = {
  "child-support": { title: "放課後の居場所に、子どもたちが集まり始めた", effects: { trust: 2, goals: { 4: 3 } } },
  "clean-energy": { title: "公共施設の発電が軌道に。電気代の節約を地域へ", effects: { budget: 4, goals: { 7: 3 } } },
  "local-business": { title: "商店街に新しい求人。設備投資が実を結ぶ", effects: { economy: 3, goals: { 8: 2 } } },
};

export const chains = [
  { requires: "child-support", action: "community-bus", title: "居場所 × 移動手段", text: "バスが学習場所を結び、遠くの子どもも通えるようになりました。", effects: { trust: 3, goals: { 4: 4, 10: 3 } } },
  { requires: "clean-energy", action: "job-training", title: "発電 × 学び直し", text: "発電設備を保守できる人が育ち、地域の仕事につながりました。", effects: { economy: 4, goals: { 8: 4 } } },
  { requires: "local-business", action: "automation", title: "設備投資 × 自動化", text: "企業の生産性が向上。ただし技能の差も広がっています。", effects: { economy: 5, goals: { 9: 4, 10: -2 } } },
  { requires: "walking-city", action: "green-roofs", title: "歩くまち × 木陰", text: "歩道に木陰がつながり、夏にも歩きやすい通学路になりました。", effects: { trust: 3, goals: { 3: 4, 11: 3 } } },
];

export const advisers = [
  { name: "青木 はるか", role: "地域の教師", quote: "今日を乗り切る支援と、将来への投資。子どもたちには両方が必要です。" },
  { name: "森 健太", role: "商店主", quote: "道がつながれば、人もつながる。誰がどこへ行けるかを考えてみませんか。" },
  { name: "田中 美咲", role: "職業相談員", quote: "新しい技術の隣に、学ぶ機会も。これまでの投資を仕事につなげましょう。" },
  { name: "佐藤 凪", role: "地域の高校生", quote: "夏の通学路がもっと涼しかったら。今までの政策を生かせないかな。" },
];

export type ImplementationOption = {
  id: string;
  title: string;
  description: string;
  tradeoff: string;
  audience: string;
  timing: "すぐ" | "あとから";
  effects: Effects;
  resultStory: string;
};

type ImplementationPlan = {
  question: string;
  context: string;
  voices: { role: string; text: string }[];
  options: ImplementationOption[];
};

export const implementationPlans: Record<string, ImplementationPlan> = {
  "community-bus": {
    question: "地域バスを、どの形で始めますか？",
    context: "同じ政策でも、始め方によって届く人、費用、住民との関係が変わります。",
    voices: [
      { role: "高校生", text: "部活の後にも乗れる便がほしいです。" },
      { role: "高齢の住民", text: "病院まで乗り換えずに行きたいです。" },
      { role: "交通担当職員", text: "全市一斉なら早いですが、赤字路線を直しにくくなります。" },
    ],
    options: [
      {
        id: "full-service",
        title: "全市で一斉に運行する",
        description: "学校、病院、駅を結ぶ路線を最初から広く走らせます。",
        tradeoff: "多くの人へすぐ届きますが、最も大きな予算が必要です。",
        audience: "市内全域の住民",
        timing: "すぐ",
        effects: { budget: -12, trust: 4, goals: { 3: 4, 10: 5, 11: 8, 13: 2 } },
        resultStory: "市内各地で小型バスが走り始めました。一方、利用の少ない便をどう支えるかという議論も続いています。",
      },
      {
        id: "pilot-service",
        title: "2地区で試験運行する",
        description: "通院と通学に困る人が多い地区から、小さく始めます。",
        tradeoff: "失敗を直しやすい一方、まだ利用できない地区が残ります。",
        audience: "対象地区の学生・高齢者",
        timing: "すぐ",
        effects: { budget: -6, trust: 2, goals: { 3: 2, 10: 2, 11: 4, 13: 1 } },
        resultStory: "2地区で試験運行が始まりました。対象外の住民からは、次の地区を早く決めてほしいという声も届いています。",
      },
      {
        id: "co-designed-service",
        title: "住民と路線を共同設計する",
        description: "利用者、運転手、商店と話し合い、必要な時間と道を選びます。",
        tradeoff: "便数は少なめですが、納得して使える路線を作りやすくなります。",
        audience: "利用者・商店・運転手",
        timing: "あとから",
        effects: { budget: -8, trust: 6, goals: { 3: 2, 10: 4, 11: 5, 13: 1 } },
        resultStory: "住民会議で朝夕の便と病院ルートが決まりました。話し合いに時間はかかりましたが、地域で支える動きが生まれています。",
      },
    ],
  },
};

export const cityMemories: Record<string, { icon: string; label: string; detail: string; kind: "people" | "mobility" | "green" | "industry" }> = {
  "child-support": { icon: "灯", label: "放課後の居場所", detail: "教室に人の明かりが残るようになった", kind: "people" },
  "clean-energy": { icon: "光", label: "公共施設の発電", detail: "学校と市役所の屋根が電気をつくる", kind: "green" },
  "local-business": { icon: "店", label: "商店街の設備", detail: "工房と求人に新しい動きが生まれた", kind: "industry" },
  "community-bus": { icon: "BUS", label: "学校と病院のバス", detail: "移動できる時間と場所が増えた", kind: "mobility" },
  "road-investment": { icon: "道", label: "物流道路", detail: "配送が速くなり、交通量も増えた", kind: "mobility" },
  "walking-city": { icon: "歩", label: "歩ける駅前", detail: "歩道と自転車道に人が戻った", kind: "mobility" },
  "work-balance": { icon: "時", label: "家族と過ごす時間", detail: "夕方の家とまちに人が戻った", kind: "people" },
  "automation": { icon: "技", label: "自動化された工場", detail: "生産が速くなり、学び直しも必要になった", kind: "industry" },
  "job-training": { icon: "学", label: "夜の学習講座", detail: "働く世代が新しい技能を学び始めた", kind: "people" },
  "cool-shelters": { icon: "涼", label: "まちの休憩所", detail: "暑い日にも安心して休める場所が増えた", kind: "people" },
  "water-renewal": { icon: "水", label: "新しい水道管", detail: "見えない場所で安全な水を支えている", kind: "industry" },
  "green-roofs": { icon: "緑", label: "木陰と屋上庭園", detail: "通学路と屋根に緑が増えた", kind: "green" },
};

export const endingProfiles = [
  {
    id: "inclusive",
    title: "手を取り合う、やさしいまち",
    text: "人の暮らしに近い場所へ力を注いだあなた。便利さだけでなく、取り残される人がいない未来を選びました。",
    actionIds: ["child-support", "community-bus", "work-balance", "cool-shelters"],
  },
  {
    id: "innovative",
    title: "技術で未来をひらくまち",
    text: "新しい設備や技術へ思い切って投資したあなた。変化の速さと、その恩恵をどう分かち合うかが次の課題です。",
    actionIds: ["clean-energy", "road-investment", "automation", "water-renewal"],
  },
  {
    id: "resilient",
    title: "地域の力で育つまち",
    text: "地域の仕事、学び、歩ける環境を結んだあなた。小さな力が積み重なり、変化にしなやかなまちが生まれました。",
    actionIds: ["local-business", "walking-city", "job-training", "green-roofs"],
  },
] as const;

export const balancedEnding = {
  id: "balanced",
  title: "いくつもの道を結ぶまち",
  text: "一つの考えに決めつけず、暮らし、技術、地域の力を組み合わせたあなた。残された課題も、次の対話へつながっています。",
} as const;
