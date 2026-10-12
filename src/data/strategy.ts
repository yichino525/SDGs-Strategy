import type { Effects } from "../game/types";
import { turns } from "./turns";

// 数値と人物は体験版用の創作。現実の政策効果の予測ではない。
export const delayed: Record<string, { title: string; effects: Effects }> = {
  "child-support": { title: "放課後の居場所に、子どもたちが集まり始めた", effects: { trust: 2, goals: { 4: 3 } } },
  "clean-energy": { title: "公共施設の発電が軌道に。電気代の節約を地域へ", effects: { budget: 4, goals: { 7: 3 } } },
  "local-business": { title: "商店街に新しい求人。設備投資が実を結ぶ", effects: { economy: 3, goals: { 8: 2 } } },
  "innovation-fund": { title: "若者の実験から、小さな仕事が生まれた", effects: { economy: 2, trust: 1, goals: { 8: 2, 9: 2 } } },
  "reserve-fund": { title: "備えていた予備費が、防災準備を支えた", effects: { budget: 3, trust: 1, goals: { 11: 2 } } },
  "inclusive-evacuation": { title: "顔の見える避難訓練が地域に根づいた", effects: { trust: 2, goals: { 3: 2, 10: 2 } } },
  "shared-workshop": { title: "共同工房の試作品が地域の商品になった", effects: { economy: 3, goals: { 8: 2, 12: 2 } } },
  "care-worker-pay": { title: "保育の現場に、経験ある職員が残り始めた", effects: { trust: 2, goals: { 3: 2, 5: 2, 8: 2 } } },
  "container-deposit": { title: "返却された容器が、地域で再び使われた", effects: { economy: 1, goals: { 12: 3, 14: 2 } } },
  "cool-school-retrofit": { title: "校舎の改修が完成し、少ない電力で涼しくなった", effects: { budget: 2, goals: { 3: 2, 7: 2, 13: 2 } } },
  "open-city-data": { title: "公開データから、市民の新しい地図が生まれた", effects: { economy: 2, trust: 1, goals: { 9: 2, 17: 2 } } },
  "home-care-workforce": { title: "育った介護職が、地域の訪問を支え始めた", effects: { trust: 2, goals: { 3: 3, 8: 2 } } },
  "community-energy": { title: "地域発電の利益が、公共施設へ戻り始めた", effects: { budget: 3, economy: 2, goals: { 7: 2, 13: 2 } } },
  "efficiency-retrofit": { title: "省エネ改修で、公共施設の電気代が下がった", effects: { budget: 3, goals: { 7: 2, 12: 2 } } },
};

export const chains = [
  { requires: "child-support", action: "community-bus", title: "居場所 × 移動手段", text: "バスが学習場所を結び、遠くの子どもも通えるようになりました。", effects: { trust: 3, goals: { 4: 4, 10: 3 } } },
  { requires: "clean-energy", action: "job-training", title: "発電 × 学び直し", text: "発電設備を保守できる人が育ち、地域の仕事につながりました。", effects: { economy: 4, goals: { 8: 4 } } },
  { requires: "local-business", action: "automation", title: "設備投資 × 自動化", text: "企業の生産性が向上。ただし技能の差も広がっています。", effects: { economy: 5, goals: { 9: 4, 10: -2 } } },
  { requires: "walking-city", action: "green-roofs", title: "歩くまち × 木陰", text: "歩道に木陰がつながり、夏にも歩きやすい通学路になりました。", effects: { trust: 3, goals: { 3: 4, 11: 3 } } },
  { requires: "local-business", action: "shared-workshop", title: "地域企業 × 共同工房", text: "商店街の設備と職人の知恵が、若い作り手の仕事につながりました。", effects: { economy: 4, trust: 2, goals: { 8: 3, 9: 3 } } },
  { requires: "water-renewal", action: "drainage-upgrade", title: "水道更新 × 浸水対策", text: "地下設備の記録を生かし、工事の重なりと費用を抑えられました。", effects: { budget: 3, goals: { 6: 2, 11: 3 } } },
  { requires: "child-support", action: "community-kitchen", title: "子ども支援 × みんなの食堂", text: "支援につながった家庭が、安心して相談できる場所も見つけました。", effects: { trust: 3, goals: { 1: 3, 2: 2, 10: 2 } } },
  { requires: "green-roofs", action: "slow-tourism", title: "まちの緑 × 地域を巡る旅", text: "育てた緑が地域の魅力となり、環境を守る仕事が生まれました。", effects: { economy: 2, goals: { 8: 2, 15: 3 } } },
  { requires: "work-balance", action: "care-worker-pay", title: "働き方改善 × 保育の待遇", text: "先に働き方を見直した企業と保育施設が協力し、子育てと仕事を続けやすくなりました。", effects: { trust: 3, goals: { 5: 3, 8: 3 } } },
  { requires: "community-kitchen", action: "neighborhood-childcare", title: "みんなの食堂 × 預かり合い", text: "食堂で生まれた信頼が、安心できる子育ての助け合いにつながりました。", effects: { trust: 3, goals: { 3: 2, 10: 3 } } },
  { requires: "green-roofs", action: "cool-school-retrofit", title: "まちの緑 × 涼しい校舎", text: "木陰と校舎改修がつながり、通学路から教室まで暑さを避けられるようになりました。", effects: { goals: { 3: 3, 4: 2, 13: 3 } } },
  { requires: "automation", action: "predictive-support", title: "自動化 × 支援予測", text: "地域で育った技術人材が支援システムを改善しましたが、説明責任の課題も大きくなりました。", effects: { economy: 3, trust: -1, goals: { 9: 3, 16: -1 } } },
  { requires: "citizen-assembly", action: "privacy-audit", title: "市民会議 × 情報のルール", text: "市民会議の経験を生かし、専門家だけで決めない個人情報のルールが作られました。", effects: { trust: 4, goals: { 16: 4, 17: 2 } } },
  { requires: "clean-energy", action: "community-energy", title: "公共発電 × 地域エネルギー", text: "公共施設で得た経験が住民の発電会社へ引き継がれ、地域の仕事が増えました。", effects: { economy: 4, goals: { 7: 3, 8: 3, 13: 2 } } },
  { requires: "water-renewal", action: "efficiency-retrofit", title: "インフラ更新 × 省エネ改修", text: "地下と建物の工事記録を共有し、公共施設を効率よく改修できました。", effects: { budget: 2, economy: 2, goals: { 9: 3, 12: 2 } } },
  { requires: "inclusive-evacuation", action: "intercultural-neighborhood", title: "避難のつながり × 多文化の地域", text: "避難地図づくりで生まれた関係が、言葉の違いを越えた防災活動へ広がりました。", effects: { trust: 4, goals: { 10: 3, 11: 3, 16: 2 } } },
];

const baseAdvisers = [
  { name: "青木 はるか", role: "地域の教師", quote: "今日を乗り切る支援と、将来への投資。子どもたちには両方が必要です。" },
  { name: "森 健太", role: "商店主", quote: "道がつながれば、人もつながる。誰がどこへ行けるかを考えてみませんか。" },
  { name: "田中 美咲", role: "職業相談員", quote: "新しい技術の隣に、学ぶ機会も。これまでの投資を仕事につなげましょう。" },
  { name: "佐藤 凪", role: "地域の高校生", quote: "夏の通学路がもっと涼しかったら。今までの政策を生かせないかな。" },
  { name: "中村 亮", role: "財政担当職員", quote: "新しい事業だけが前進ではありません。守る費用と、もしもの備えも選択です。" },
  { name: "金城 ソフィア", role: "地域の防災リーダー", quote: "同じ案内を出すだけでは届かない人がいます。誰が誰を支えるかまで考えましょう。" },
  { name: "山本 つむぎ", role: "商店街の建築士", quote: "空いた建物は、終わりではなく余白です。誰が使い続けられる場所にしますか。" },
  { name: "伊藤 海", role: "地域案内人", quote: "人が来る数だけでなく、まちに何が残るのかを一緒に考えたいです。" },
  { name: "小林 さくら", role: "市民会議の参加者", quote: "早く決めることも大切。でも、決め方そのものが未来の信頼を作ると思います。" },
  { name: "松井 あかり", role: "保育施設の職員", quote: "建物だけでは保育は続きません。子どもを見る人が安心して働ける方法を考えてください。" },
  { name: "橋本 蓮", role: "小さな商店の店主", quote: "ごみを減らしたい気持ちは同じです。小さな店でも参加できる速さと費用にしてください。" },
  { name: "佐藤 凪", role: "地域の高校生", quote: "暑さを我慢することが勉強ではないはずです。今日の安全と未来の電気、両方を考えたいです。" },
  { name: "藤田 真理", role: "情報公開の委員", quote: "便利だから集める、では足りません。誰が何のために使うのか説明できる仕組みが必要です。" },
  { name: "鈴木 和夫", role: "家族の介護をする住民", quote: "助け合いはありがたい。でも、家族や近所の人だけが背負わない仕組みにしてほしいです。" },
  { name: "岡田 ひかる", role: "地域電力の技術者", quote: "電気を替えるだけか、仕事と利益も地域に残すか。時間と費用を比べて決めましょう。" },
  { name: "グエン ミン", role: "地域工場で働く住民", quote: "仕事の説明だけでなく、病院や学校、防災のことも分かれば、このまちで暮らしていけます。" },
  { name: "金城 ソフィア", role: "地域の防災リーダー", quote: "備えは使わない日には見えません。それでも、つながりと物資の両方を残す意味があります。" },
];

// 長編でも、特定の立場だけが繰り返し登場しないよう、既存の創作人物を順に巡回させる。
export const advisers = Array.from({ length: turns.length }, (_, index) => baseAdvisers[index % baseAdvisers.length]);

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
  "maintain-services": { icon: "守", label: "守られた公共施設", detail: "図書館と相談窓口の安心が続いている", kind: "people" },
  "innovation-fund": { icon: "創", label: "若者の実験拠点", detail: "空き店舗で新しい挑戦が始まった", kind: "industry" },
  "reserve-fund": { icon: "備", label: "危機への予備費", detail: "見えない備えが次の判断を支える", kind: "people" },
  "inclusive-evacuation": { icon: "助", label: "支え合う避難地図", detail: "助けが必要な人と地域がつながった", kind: "people" },
  "drainage-upgrade": { icon: "雨", label: "雨に備える排水路", detail: "浸水しやすい地区で地下工事が進んだ", kind: "industry" },
  "evacuation-app": { icon: "報", label: "新しい防災情報", detail: "避難所と川の状況が早く届く", kind: "industry" },
  "community-kitchen": { icon: "食", label: "みんなの食堂", detail: "食卓から相談とつながりが生まれた", kind: "people" },
  "shared-workshop": { icon: "工", label: "共同ものづくり工房", detail: "職人と若者が同じ道具を使っている", kind: "industry" },
  "temporary-market": { icon: "市", label: "週末の小さな市場", detail: "空き店舗の前に地域の商品が並ぶ", kind: "industry" },
  "mass-tourism": { icon: "客", label: "にぎわう大きな祭り", detail: "売上とともに混雑やごみも増えた", kind: "industry" },
  "slow-tourism": { icon: "旅", label: "地域を巡る小さな旅", detail: "暮らしと自然をゆっくり伝えている", kind: "green" },
  "resident-first": { icon: "整", label: "整えられた祭りの道", detail: "歩道とごみの回収場所が使いやすくなった", kind: "mobility" },
  "citizen-assembly": { icon: "話", label: "市民が囲む未来地図", detail: "異なる立場から次の計画を話し合った", kind: "people" },
  "visible-projects": { icon: "場", label: "駅前の新しい広場", detail: "目に見える変化と地域差が残った", kind: "industry" },
  "neighborhood-grants": { icon: "輪", label: "地区ごとの小さな挑戦", detail: "地域が自分たちで使い道を決めた", kind: "people" },
  "care-worker-pay": { icon: "育", label: "続けられる保育の仕事", detail: "休みと研修を支える人員が増えた", kind: "people" },
  "childcare-digital": { icon: "記", label: "軽くなった保育の記録", detail: "事務を減らし子どもと向き合う時間が増えた", kind: "industry" },
  "neighborhood-childcare": { icon: "抱", label: "地域の預かり合い", detail: "短い時間の子育てを地域で助けている", kind: "people" },
  "single-use-rule": { icon: "減", label: "減り始めた使い捨て容器", detail: "店頭に繰り返し使える選択肢が並んだ", kind: "green" },
  "container-deposit": { icon: "返", label: "容器の返却箱", detail: "使った容器が地域の資源として戻る", kind: "green" },
  "cleanup-days": { icon: "浜", label: "地域で守る海岸", detail: "清掃からごみの原因を考え始めた", kind: "green" },
  "school-air-conditioning": { icon: "冷", label: "涼しくなった教室", detail: "暑い日にも安全に学べるようになった", kind: "people" },
  "cool-school-retrofit": { icon: "窓", label: "暑さに強い校舎", detail: "日よけと断熱で使う電気も抑えている", kind: "green" },
  "summer-schedule": { icon: "朝", label: "夏の新しい時間割", detail: "暑い時間を避けた学び方が始まった", kind: "people" },
  "open-city-data": { icon: "図", label: "みんなで使える市の地図", detail: "公開データから地域の提案が生まれた", kind: "industry" },
  "predictive-support": { icon: "先", label: "先回りする支援案内", detail: "助けと監視の境目が議論されている", kind: "industry" },
  "privacy-audit": { icon: "鍵", label: "個人情報を守る約束", detail: "集める情報と使わない情報を決めた", kind: "people" },
  "home-care-workforce": { icon: "訪", label: "地域を回る介護チーム", detail: "専門職が家庭の暮らしを支えている", kind: "people" },
  "care-technology": { icon: "補", label: "介護を助ける道具", detail: "職員の身体の負担を軽くしている", kind: "industry" },
  "mutual-aid-visits": { icon: "声", label: "週一度の見守り", detail: "小さな変化を支援へつないでいる", kind: "people" },
  "community-energy": { icon: "電", label: "住民の地域発電会社", detail: "電気の利益と技術を地域へ戻している", kind: "green" },
  "renewable-purchase": { icon: "替", label: "再生可能電力の公共施設", detail: "契約を替えて早く環境負担を減らした", kind: "green" },
  "efficiency-retrofit": { icon: "省", label: "省エネになった公共施設", detail: "照明と空調を直し使う電気を減らした", kind: "green" },
  "multilingual-services": { icon: "言", label: "多言語の相談窓口", detail: "医療や学校の情報が伝わりやすくなった", kind: "people" },
  "worker-recruitment": { icon: "働", label: "地域へ来た新しい働き手", detail: "仕事とともに暮らしの条件も問われている", kind: "industry" },
  "intercultural-neighborhood": { icon: "隣", label: "言葉を越えた地域活動", detail: "料理と防災から隣人同士がつながった", kind: "people" },
  "emergency-stockpiles": { icon: "箱", label: "分散された備蓄棚", detail: "物資を地域で使いながら更新している", kind: "industry" },
  "public-health-network": { icon: "結", label: "健康を守る連絡網", detail: "医療・学校・福祉が同じ訓練をした", kind: "people" },
  "decade-reserve": { icon: "蓄", label: "次の10年への予備費", detail: "目に見えない危機へ使えるお金を残した", kind: "people" },
  ...Object.fromEntries(turns.flatMap((turn) => turn.actions)
    .filter((action) => action.id.startsWith("future-"))
    .map((action) => {
      const approach = action.id.endsWith("-listen") ? "people" : action.id.endsWith("-build") ? "industry" : "green";
      const icon = approach === "people" ? "話" : approach === "industry" ? "工" : "芽";
      return [action.id, { icon, label: action.title, detail: "2030年へ向けた地域の新しい取り組み", kind: approach }];
    })),
};

export const endingProfiles = [
  {
    id: "inclusive",
    title: "手を取り合う、やさしいまち",
    text: "人の暮らしに近い場所へ力を注いだあなた。便利さだけでなく、取り残される人がいない未来を選びました。",
    actionIds: ["child-support", "community-bus", "work-balance", "cool-shelters", "maintain-services", "inclusive-evacuation", "community-kitchen", "citizen-assembly", "neighborhood-grants", "care-worker-pay", "neighborhood-childcare", "school-air-conditioning", "home-care-workforce", "mutual-aid-visits", "multilingual-services", "intercultural-neighborhood", "public-health-network"],
  },
  {
    id: "innovative",
    title: "技術で未来をひらくまち",
    text: "新しい設備や技術へ思い切って投資したあなた。変化の速さと、その恩恵をどう分かち合うかが次の課題です。",
    actionIds: ["clean-energy", "road-investment", "automation", "water-renewal", "innovation-fund", "drainage-upgrade", "evacuation-app", "mass-tourism", "visible-projects", "childcare-digital", "predictive-support", "care-technology", "community-energy", "worker-recruitment"],
  },
  {
    id: "resilient",
    title: "地域の力で育つまち",
    text: "地域の仕事、学び、歩ける環境を結んだあなた。小さな力が積み重なり、変化にしなやかなまちが生まれました。",
    actionIds: ["local-business", "walking-city", "job-training", "green-roofs", "reserve-fund", "shared-workshop", "temporary-market", "slow-tourism", "resident-first", "single-use-rule", "container-deposit", "cleanup-days", "cool-school-retrofit", "summer-schedule", "open-city-data", "privacy-audit", "renewable-purchase", "efficiency-retrofit", "emergency-stockpiles", "decade-reserve"],
  },
] as const;

export const balancedEnding = {
  id: "balanced",
  title: "いくつもの道を結ぶまち",
  text: "一つの考えに決めつけず、暮らし、技術、地域の力を組み合わせたあなた。残された課題も、次の対話へつながっています。",
} as const;
