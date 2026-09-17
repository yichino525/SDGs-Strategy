import type { PledgeId } from "../game/types";
import { turns } from "./turns";

export const pledges: { id: PledgeId; title: string; statement: string; focus: string; cost: string }[] = [
  {
    id: "inclusive",
    title: "誰も取り残さない暮らし",
    statement: "困っている人へ、最初に手を伸ばす市政を約束します。",
    focus: "福祉・教育・移動・参加",
    cost: "成果が数字に出るまで時間がかかることがあります。",
  },
  {
    id: "innovative",
    title: "技術と仕事で未来をひらく",
    statement: "新しい技術と地域の仕事へ投資し、変化に強いまちを目指します。",
    focus: "産業・雇用・インフラ・デジタル",
    cost: "成長の恩恵が届かない人を生む可能性があります。",
  },
  {
    id: "resilient",
    title: "地域と自然を次の世代へ",
    statement: "住民のつながりと環境を守り、長く続けられるまちを目指します。",
    focus: "地域・環境・備え・循環",
    cost: "短期的な収入や速い開発を選びにくくなります。",
  },
];

export const recurringCast = [
  {
    name: "青木 はるか",
    role: "地域の教師",
    hope: "子どもたちが、まちの変化を自分の未来として話し始めています。",
    concern: "声を上げにくい家庭ほど、変化から遠くなっていないか確かめたいです。",
    tradeoff: "良くなった場所のとなりで、後回しになった人がいないか見てください。",
    watch: "教室では、今回の決定が誰に届くのか話し合っています。",
  },
  {
    name: "森 健太",
    role: "商店主",
    hope: "通りに人の声が戻りました。この流れを小さな店にもつなげたいです。",
    concern: "速い変化についていけない店もあります。置いていかない方法が必要です。",
    tradeoff: "売上だけでなく、暮らしやすさに何が残るのかも見ておきたいです。",
    watch: "商店街では期待と心配の両方が聞こえています。",
  },
  {
    name: "佐藤 凪",
    role: "地域の高校生",
    hope: "私たちの意見が、飾りではなく本当の変化につながった気がします。",
    concern: "大人だけで決めた未来を、私たちが引き受けることにならないか不安です。",
    tradeoff: "便利になったけれど、その代わりに失ったものも話してほしいです。",
    watch: "友達と、2030年にこの景色がどうなるか話しました。",
  },
  {
    name: "中村 亮",
    role: "財政担当職員",
    hope: "今回の投資は、次の選択肢を広げる土台になりそうです。",
    concern: "支持を失えば、良い政策でも続けられません。説明する時間を確保しましょう。",
    tradeoff: "効果と負担が別の場所に現れています。次の予算で調整が必要です。",
    watch: "数字は動きましたが、本当の評価は数四半期後に現れます。",
  },
  {
    name: "金城 ソフィア",
    role: "地域の防災リーダー",
    hope: "顔の見えるつながりが増えれば、危機の時にも助け合えます。",
    concern: "信頼が揺らぐと、緊急時の情報まで届きにくくなります。",
    tradeoff: "一つの危険を減らした一方で、別の弱さが残っていないか確認しましょう。",
    watch: "何も起きていない今こそ、この決定が誰を守るか考えています。",
  },
] as const;

const baseTurnSignals: Record<string, { label: string; text: string; level: "quiet" | "rising" | "urgent" }> = {
  "2015-q4": { label: "世界から届いた約束", text: "17の目標が掲げられ、市民は最初の一歩を見ています。", level: "quiet" },
  "2016-q1": { label: "駅から遠い地区の声", text: "通院や通学を諦める人が、少しずつ増えています。", level: "rising" },
  "2016-q2": { label: "職場の疲れ", text: "人手不足と長い労働時間が、同じ現場で重なっています。", level: "rising" },
  "2016-q3": { label: "暑さの記録", text: "救急相談が増え、学校からも対策を求める声が届きました。", level: "urgent" },
  "2016-q4": { label: "年度末の残高", text: "新しい事業を求める声と、今ある施設を守る声がぶつかっています。", level: "rising" },
  "2017-q1": { label: "川沿いの不安", text: "避難計画に、自力では移動できない人の名前がありません。", level: "urgent" },
  "2017-q2": { label: "消えた店の明かり", text: "閉まった店舗の前で、住民が新しい使い道を話し始めました。", level: "quiet" },
  "2017-q3": { label: "祭りへの期待", text: "来訪者が増える一方、ごみと混雑を心配する声も届いています。", level: "rising" },
  "2017-q4": { label: "二つに割れる市議会", text: "成果を急ぐ議員と、住民対話を求める議員が譲りません。", level: "urgent" },
  "2018-q1": { label: "保育室の空いた席", text: "建物はあっても、働く人が足りず受け入れを増やせません。", level: "urgent" },
  "2018-q2": { label: "海岸に残る便利さ", text: "祭りの後に流れ着いた容器が、地域の暮らし方を問いかけています。", level: "rising" },
  "2018-q3": { label: "止まった部活動", text: "暑さで活動を中止する日が増え、学びにも影響が出ています。", level: "urgent" },
  "2018-q4": { label: "見えすぎる市役所", text: "支援を速くするデータ利用に、期待と監視への不安が集まっています。", level: "rising" },
  "2019-q1": { label: "介護する家族の欠勤", text: "仕事と介護を両立できず、現場を離れる人が増えています。", level: "urgent" },
  "2019-q2": { label: "上がる公共施設の電気代", text: "環境への責任と地域の負担を、同時に減らす案が必要です。", level: "rising" },
  "2019-q3": { label: "伝わらない避難案内", text: "同じ地域で暮らしていても、必要な情報が届かない人がいます。", level: "urgent" },
  "2019-q4": { label: "静かな警告", text: "病院、学校、福祉の担当者が、未知の危機への連携不足を心配しています。", level: "urgent" },
};

export const turnSignals: Record<string, { label: string; text: string; level: "quiet" | "rising" | "urgent" }> = Object.fromEntries(
  turns.map((turn) => [turn.id, baseTurnSignals[turn.id] ?? {
    label: "2030年へ続く選択",
    text: "この判断が、次の四半期のまちの景色と市民の声につながります。",
    level: "rising" as const,
  }]),
);

export const chapterBreaks: Record<number, { title: string; text: string; next: string }> = {
  9: {
    title: "まちは成長した。けれど、同じ速さでは歩けない人がいる。",
    text: "新しい仕事と施設が増えるほど、支える人の不足や見えにくい格差も表面に出てきました。",
    next: "第2章「成長のひずみ」へ",
  },
  17: {
    title: "備えは、間に合ったのだろうか。",
    text: "2019年の冬。みらい市の日常は続いています。しかし、病院や学校の連絡網には小さな緊張が走っています。",
    next: "次章「危機の時代」へ続く",
  },
};
