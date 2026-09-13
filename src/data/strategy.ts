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
