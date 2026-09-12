import type { Turn } from "../game/types";

export const turns: Turn[] = [
  {
    id: "2015-q4",
    label: "2015年 第4四半期",
    headline: "未来への最初の一歩",
    context: "世界でSDGsが始まりました。限られた予算を、どの分野から使いますか？",
    actions: [
      {
        id: "child-support",
        title: "子どもの生活と学びを支える",
        description: "給食支援と放課後の学習場所を増やします。",
        tradeoff: "すぐに予算が必要ですが、将来の格差を小さくできます。",
        effects: { budget: -12, trust: 5, goals: { 1: 6, 2: 4, 4: 6, 10: 3 } },
      },
      {
        id: "clean-energy",
        title: "地域の再生可能エネルギーを増やす",
        description: "公共施設へ太陽光発電と蓄電池を導入します。",
        tradeoff: "初期費用は高い一方、将来のエネルギー負担を減らせます。",
        effects: { budget: -15, economy: 2, goals: { 7: 7, 9: 3, 13: 6 } },
      },
      {
        id: "local-business",
        title: "地域の小さな会社を応援する",
        description: "設備更新や新しい雇用への支援を行います。",
        tradeoff: "経済は伸びやすいですが、環境対策は後回しになります。",
        effects: { budget: -8, economy: 6, trust: 1, goals: { 8: 6, 9: 5, 12: -2, 13: -2 } },
      },
    ],
  },
  {
    id: "2016-q1",
    label: "2016年 第1四半期",
    headline: "暮らしを支える交通",
    context: "高齢者や学生から、移動しにくいという声が届いています。",
    actions: [
      {
        id: "community-bus",
        title: "地域バスを増やす",
        description: "病院や学校を結ぶ小型バスを運行します。",
        tradeoff: "運営費が続きますが、移動できる人が増えます。",
        effects: { budget: -10, trust: 5, goals: { 3: 4, 10: 4, 11: 7, 13: 2 } },
      },
      {
        id: "road-investment",
        title: "道路を広げて物流を速くする",
        description: "幹線道路を整備し、車で移動しやすくします。",
        tradeoff: "物流には有利ですが、車への依存が高まります。",
        effects: { budget: -12, economy: 5, goals: { 8: 2, 9: 6, 11: 1, 13: -4 } },
      },
      {
        id: "walking-city",
        title: "歩いて暮らせるまちを作る",
        description: "歩道、自転車道、駅前の商店を整備します。",
        tradeoff: "効果が出るまで時間はかかりますが、健康と地域商業に役立ちます。",
        effects: { budget: -9, economy: 2, trust: 3, goals: { 3: 4, 8: 2, 11: 6, 13: 4 } },
      },
    ],
  },
  {
    id: "2016-q2",
    label: "2016年 第2四半期",
    headline: "働き方をどう変える？",
    context: "長時間労働と人手不足が同時に問題になっています。",
    actions: [
      {
        id: "work-balance",
        title: "休みやすい働き方を広げる",
        description: "中小企業の働き方改善と育児支援を助けます。",
        tradeoff: "短期の生産量は下がる可能性がありますが、安心して働けます。",
        effects: { budget: -8, economy: -1, trust: 5, goals: { 3: 4, 5: 6, 8: 6, 10: 2 } },
      },
      {
        id: "automation",
        title: "仕事の自動化を支援する",
        description: "工場や事務作業へ新しい技術を導入します。",
        tradeoff: "生産性は上がりますが、学び直しがないと格差が広がります。",
        effects: { budget: -10, economy: 7, goals: { 8: 2, 9: 7, 10: -4 } },
      },
      {
        id: "job-training",
        title: "学び直しの機会を増やす",
        description: "働く人が新しい技能を学べる講座を開きます。",
        tradeoff: "効果はゆっくりですが、変化に強い社会を作れます。",
        effects: { budget: -7, economy: 3, trust: 3, goals: { 4: 5, 8: 5, 9: 3, 10: 3 } },
      },
    ],
  },
  {
    id: "2016-q3",
    label: "2016年 第3四半期",
    headline: "暑い夏と水の未来",
    context: "厳しい暑さが続き、水と電気の使い方が注目されています。",
    actions: [
      {
        id: "cool-shelters",
        title: "まちに涼める場所を増やす",
        description: "公民館や商店を誰でも休める場所にします。",
        tradeoff: "電気を使いますが、暑さから命を守れます。",
        effects: { budget: -6, trust: 5, goals: { 3: 7, 10: 3, 11: 4, 13: -1 } },
      },
      {
        id: "water-renewal",
        title: "水道設備を更新する",
        description: "古い水道管を直し、水漏れを減らします。",
        tradeoff: "目立ちにくい事業ですが、長く安全な水を守れます。",
        effects: { budget: -12, trust: 3, goals: { 3: 2, 6: 8, 9: 3, 11: 4 } },
      },
      {
        id: "green-roofs",
        title: "屋上と道路に緑を増やす",
        description: "建物の屋上や通学路に木陰を作ります。",
        tradeoff: "手入れが必要ですが、暑さと生き物の環境を同時に改善します。",
        effects: { budget: -9, economy: 1, trust: 4, goals: { 11: 5, 13: 5, 15: 6 } },
      },
    ],
  },
];
