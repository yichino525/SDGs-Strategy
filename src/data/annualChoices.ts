import type { Action } from "../game/types";

// 2020年以降の各年を象徴する固有の3択。数値は現実の政策予測ではなくゲーム用の仮定。
export const annualChoices: Record<number, Action[]> = {
  2020: [
    { id: "mobile-clinic", title: "移動診療チームを走らせる", description: "医師と相談員が小型車で地域を巡ります。", tradeoff: "すぐ届きますが、少人数の現場に負担が集中します。", audience: "通院しにくい住民", timing: "すぐ", resultStory: "白い診療車が団地と山間部を巡り、孤立していた人が支援につながりました。", effects: { budget: -8, trust: 6, goals: { 3: 8, 10: 5, 11: 3 } } },
    { id: "digital-life-pass", title: "暮らしのオンラインパスを配る", description: "学習、相談、買い物を一つの端末から使えるようにします。", tradeoff: "便利ですが、機器に不慣れな人を置き去りにする危険があります。", audience: "家庭・学校・商店", timing: "すぐ", resultStory: "家から授業と相談につながれるようになり、商店の配達も始まりました。", effects: { budget: -12, economy: 3, goals: { 4: 7, 9: 6, 10: -2 } } },
    { id: "empty-hotel-shelter", title: "空いたホテルを生活拠点に変える", description: "客室を休養、避難、仕事の場所として借り上げます。", tradeoff: "新築より安い一方、観光回復が遅れる可能性があります。", audience: "住まいや仕事に困る人", timing: "すぐ", resultStory: "空室に明かりが戻り、休める場所と臨時の仕事が同時に生まれました。", effects: { budget: -4, economy: 2, trust: 5, goals: { 1: 6, 3: 4, 8: 3, 11: 4 } } },
  ],
  2021: [
    { id: "learning-quest", title: "まち全体を学びのクエストにする", description: "図書館、店、公園を巡る体験型の学習を始めます。", tradeoff: "参加は楽しい一方、付き添える家庭との差が出ます。", audience: "子ども・地域の達人", timing: "すぐ", resultStory: "子どもたちが地図を手にまちへ出て、店主や職人から課題を受け取りました。", effects: { budget: -4, trust: 5, goals: { 4: 8, 8: 2, 11: 4, 17: 3 } } },
    { id: "youth-paid-mission", title: "若者へ有給のまちミッションを託す", description: "地域課題を解く短期の仕事を若者に公募します。", tradeoff: "仕事と経験になりますが、選考の公平さが問われます。", audience: "学生・仕事を失った若者", timing: "すぐ", resultStory: "若者チームが店の配達や公園の再設計に取り組み、報酬を得ました。", effects: { budget: -9, economy: 4, trust: 3, goals: { 4: 5, 8: 7, 9: 4, 10: 3 } } },
    { id: "school-night-shift", title: "学校を夜の居場所として開放する", description: "空き教室を自習、食事、相談に使います。", tradeoff: "建物を活用できますが、教職員とは別の運営人材が必要です。", audience: "子ども・保護者", timing: "すぐ", resultStory: "夜の校舎に温かな食事と自習机が並び、世代を越えた居場所になりました。", effects: { budget: -3, trust: 6, goals: { 2: 4, 4: 6, 10: 5, 11: 2 } } },
  ],
  2022: [
    { id: "energy-coupon-lottery", title: "省エネ挑戦くじを始める", description: "使用量を減らした家庭が地域商品券を獲得します。", tradeoff: "楽しく参加できますが、元から使用量の少ない家庭への配慮が必要です。", audience: "家庭・地域商店", timing: "すぐ", resultStory: "電気メーターを見比べる家庭が増え、当選券が商店街で使われました。", effects: { budget: -3, economy: 3, trust: 2, goals: { 7: 5, 8: 3, 12: 5, 13: 4 } } },
    { id: "food-rescue-fridge", title: "まちかど救援冷蔵庫を置く", description: "余った食材を匿名で受け渡せる冷蔵庫を設置します。", tradeoff: "食料をすぐ回せますが、衛生管理を続ける必要があります。", audience: "家庭・飲食店", timing: "すぐ", resultStory: "閉店前のパンや野菜が冷蔵庫へ届き、必要な人の食卓へ渡りました。", effects: { budget: -2, trust: 6, goals: { 1: 5, 2: 7, 10: 4, 12: 6 } } },
    { id: "price-freeze-pact", title: "店と期間限定の価格協定を結ぶ", description: "市が仕入れを助け、生活必需品の価格を半年守ります。", tradeoff: "即効性は高い一方、終了後の反動と大きな費用があります。", audience: "全世帯・地域商店", timing: "すぐ", resultStory: "米や日用品の値札が据え置かれ、家計は一息つきました。", effects: { budget: -13, economy: 2, trust: 7, goals: { 1: 8, 2: 6, 8: 3, 10: 4 } } },
  ],
  2023: [
    { id: "cool-route", title: "日陰だけで歩ける避暑ルートを作る", description: "木陰、給水、休憩所を一本の道としてつなぎます。", tradeoff: "効果は見えやすい一方、対象外の地区が残ります。", audience: "通学者・高齢者・屋外労働者", timing: "すぐ", resultStory: "青い足跡をたどれば涼しい場所へ着ける道が、まちに現れました。", effects: { budget: -7, trust: 5, goals: { 3: 7, 11: 7, 13: 4, 15: 3 } } },
    { id: "river-room", title: "駐車場を雨をためる広場に変える", description: "普段は遊べて、大雨時は水を受け止める地形にします。", tradeoff: "防災と遊びを両立しますが、車の利用者には不便になります。", audience: "浸水地区・子ども", timing: "あとから", resultStory: "くぼみのある緑の広場が完成し、大雨の水を静かに受け止めました。", effects: { budget: -10, economy: -1, trust: 4, goals: { 6: 5, 11: 9, 13: 7, 15: 5 } } },
    { id: "heat-insurance", title: "暑さ休業を補償する保険を作る", description: "危険な日は仕事を止めても賃金の一部を守ります。", tradeoff: "命を守れますが、企業と市の負担が増えます。", audience: "屋外で働く人・小規模企業", timing: "すぐ", resultStory: "警戒日には工事が止まり、働く人が安心して休めるようになりました。", effects: { budget: -5, economy: -2, trust: 7, goals: { 3: 9, 8: 6, 10: 3, 13: 3 } } },
  ],
  2024: [
    { id: "ai-public-trial", title: "AI市役所を公開裁判にかける", description: "市民役の陪審員がAIの判断理由を点検します。", tradeoff: "透明性は高まりますが、導入は遅れます。", audience: "行政サービスを使う人", timing: "あとから", resultStory: "AIの間違いを市民が見抜き、使ってはいけない場面がルールになりました。", effects: { budget: -3, trust: 8, goals: { 4: 3, 9: 4, 16: 9, 17: 3 } } },
    { id: "robot-counter", title: "24時間ロボット窓口を開く", description: "定型手続きをいつでも自動で受け付けます。", tradeoff: "便利で安い一方、複雑な事情を誤る危険があります。", audience: "時間内に来庁できない人", timing: "すぐ", resultStory: "夜にも証明書を受け取れるようになりましたが、相談は人へ渡す仕組みが残りました。", effects: { budget: -8, economy: 5, trust: -2, goals: { 9: 8, 10: -2, 16: -3 } } },
    { id: "digital-helper-badge", title: "子どもをデジタル助っ人に任命する", description: "研修を受けた若者が地域で操作を手伝います。", tradeoff: "低予算で世代がつながりますが、個人情報を見せない工夫が必要です。", audience: "高齢者・若者", timing: "すぐ", resultStory: "助っ人バッジを付けた若者が、商店街でスマホの困りごとを解決しました。", effects: { budget: -2, trust: 6, goals: { 4: 5, 9: 3, 10: 6, 17: 4 } } },
  ],
  2025: [
    { id: "empty-house-auction", title: "空き家再生オークションを開く", description: "地域に役立つ使い方を競い、格安で貸し出します。", tradeoff: "発想が集まりますが、人気地区に提案が偏ります。", audience: "住まいを探す人・起業家", timing: "あとから", resultStory: "古い家が工房、共同住宅、小さな保育室へ生まれ変わりました。", effects: { budget: -4, economy: 5, trust: 3, goals: { 1: 4, 8: 5, 11: 8, 12: 5 } } },
    { id: "moving-library-bus", title: "バスを図書館兼相談室に改造する", description: "本と専門職を乗せ、集落を巡回します。", tradeoff: "一台で多くの役割を持てますが、運行日は限られます。", audience: "交通の少ない地区", timing: "すぐ", resultStory: "カラフルなバスから本棚と相談机が現れ、広場に人が集まりました。", effects: { budget: -6, trust: 7, goals: { 4: 6, 10: 6, 11: 6 } } },
    { id: "compact-city-bet", title: "中心街へ機能を大胆に集める", description: "病院、学校、住宅を駅周辺へ集中させます。", tradeoff: "効率は上がりますが、離れた地域を失う危険があります。", audience: "中心部の住民・事業者", timing: "あとから", resultStory: "駅前は便利になりましたが、郊外では故郷を残したい声が強まりました。", effects: { budget: -12, economy: 7, trust: -5, goals: { 3: 5, 9: 6, 11: 7, 10: -6 } } },
  ],
  2026: [
    { id: "care-time-bank", title: "助けた時間を貯める銀行を作る", description: "送迎や見守りの時間を記録し、将来自分も助けてもらえます。", tradeoff: "お金以外の交換ができますが、専門的ケアの代わりにはなりません。", audience: "ケアする人・高齢者", timing: "あとから", resultStory: "一時間の助けが通帳に記録され、地域を巡る新しい交換が始まりました。", effects: { budget: -2, trust: 8, goals: { 3: 5, 5: 3, 10: 7, 17: 5 } } },
    { id: "care-pro-pay", title: "ケア職の給与を一気に引き上げる", description: "市独自の手当で専門職を確保します。", tradeoff: "現場は安定しますが、毎年大きな固定費が必要です。", audience: "介護・福祉職と利用者", timing: "すぐ", resultStory: "退職を考えていた職員が現場に残り、新しい応募も届きました。", effects: { budget: -14, economy: 3, trust: 6, goals: { 3: 8, 5: 6, 8: 8, 10: 4 } } },
    { id: "care-robot-share", title: "ケアロボットを共同レンタルする", description: "高価な機器を施設と家庭で順番に使います。", tradeoff: "負担は減りますが、機械に合わせたケアになる心配があります。", audience: "介護施設・家庭", timing: "すぐ", resultStory: "共同倉庫から機器が届き、腰を痛めず移動を助けられるようになりました。", effects: { budget: -7, economy: 4, trust: 1, goals: { 3: 5, 8: 4, 9: 7, 16: -1 } } },
  ],
  2027: [
    { id: "school-farm-league", title: "学校対抗・未来の農業リーグを開く", description: "節水や収穫量を競う実験農園を作ります。", tradeoff: "学びは盛り上がりますが、競争だけでは農家の生活を守れません。", audience: "子ども・農家", timing: "あとから", resultStory: "校庭の畑でセンサーと知恵が競い合い、失敗も発表されました。", effects: { budget: -4, economy: 2, trust: 4, goals: { 2: 6, 4: 7, 6: 4, 9: 4, 15: 3 } } },
    { id: "water-token", title: "水を分ける地域トークンを導入する", description: "節水分を農家や自然保全へ譲れる仕組みです。", tradeoff: "柔軟に分配できますが、水をお金のように扱う反発があります。", audience: "家庭・農家・環境団体", timing: "すぐ", resultStory: "節水分が田畑と湿地へ渡りましたが、配分の公平さが議会で議論されました。", effects: { budget: -3, economy: 3, trust: -1, goals: { 2: 5, 6: 8, 12: 4, 15: 6, 16: -2 } } },
    { id: "food-security-warehouse", title: "巨大な地域食料庫を建てる", description: "穀物と種を備蓄し、価格高騰や不作に備えます。", tradeoff: "安心は増えますが、保管費と食品ロスが生じます。", audience: "全住民・農家", timing: "あとから", resultStory: "食料庫が完成し、備蓄を給食で循環させる仕組みも始まりました。", effects: { budget: -12, trust: 5, goals: { 1: 4, 2: 10, 11: 4, 12: -2 } } },
  ],
  2028: [
    { id: "disaster-escape-game", title: "まち全体を防災脱出ゲームにする", description: "停電や浸水の謎を解きながら避難方法を学びます。", tradeoff: "参加しやすい一方、遊びに見えるという反発もあります。", audience: "子ども・家族・地域", timing: "すぐ", resultStory: "サイレンと同時に謎解きが始まり、知らなかった避難路が記憶に残りました。", effects: { budget: -3, trust: 6, goals: { 3: 4, 4: 5, 11: 8, 13: 4, 16: 3 } } },
    { id: "underground-lifeline", title: "地下ライフラインを全面更新する", description: "水、電気、通信を災害に強い共同管へ移します。", tradeoff: "非常に強くなりますが、工事費と長期の交通規制が必要です。", audience: "全住民・企業", timing: "あとから", resultStory: "長い工事の末、停電と断水から素早く戻れる都市の背骨ができました。", effects: { budget: -16, economy: 3, trust: -2, goals: { 6: 8, 7: 6, 9: 9, 11: 10, 13: 5 } } },
    { id: "wetland-defense", title: "住宅予定地を湿地へ戻す", description: "自然に水をためる場所を復元します。", tradeoff: "防災と生態系に効きますが、開発収入を手放します。", audience: "浸水地域・生き物", timing: "あとから", resultStory: "水鳥が戻った湿地が大雨を受け止め、下流の水位を下げました。", effects: { budget: -6, economy: -3, trust: 4, goals: { 6: 6, 11: 7, 13: 8, 14: 4, 15: 9 } } },
  ],
  2029: [
    { id: "future-jury", title: "12歳以上の未来陪審を開く", description: "無作為に選ばれた若者が大型計画へ評決を出します。", tradeoff: "将来世代の声が入りますが、大人の責任逃れにしてはいけません。", audience: "若者・議会・市民", timing: "あとから", resultStory: "若者の評決が計画を修正し、議員は反対意見への回答を公開しました。", effects: { budget: -2, trust: 9, goals: { 4: 5, 10: 5, 16: 10, 17: 5 } } },
    { id: "citizen-veto-app", title: "市民が一度だけ止められるボタンを作る", description: "署名が集まれば大型計画を再審議します。", tradeoff: "暴走を防げますが、必要な決定まで遅れる危険があります。", audience: "全市民", timing: "すぐ", resultStory: "一つの開発が停止し、費用と環境への影響が公開の場で再検討されました。", effects: { budget: -3, economy: -2, trust: 8, goals: { 10: 4, 11: 2, 16: 9 } } },
    { id: "green-industry-deal", title: "企業と脱炭素の大取引を結ぶ", description: "設備支援と引き換えに雇用・排出目標を約束させます。", tradeoff: "経済と環境を伸ばせますが、企業優遇という批判が起きます。", audience: "企業・働く人・地域", timing: "あとから", resultStory: "新設備と雇用が動き出し、達成状況を市民が確認できる掲示板もできました。", effects: { budget: -11, economy: 8, trust: -2, goals: { 7: 6, 8: 8, 9: 7, 12: 6, 13: 7 } } },
  ],
  2030: [
    { id: "weakest-goal-sprint", title: "最も低いSDGsへ全力投球する", description: "遅れている分野を市民投票で一つ選び、最後の予算を集中します。", tradeoff: "弱点を直せますが、ほかの課題は一年待つことになります。", audience: "取り残されてきた人", timing: "すぐ", resultStory: "これまで目立たなかった課題が市の最優先になり、最後の一年が動きました。", effects: { budget: -12, trust: 5, goals: { 1: 7, 5: 7, 10: 7, 16: 4 } } },
    { id: "sdgs-festival", title: "まちの変化を巨大な文化祭で見せる", description: "成功も失敗も展示し、次の世代へ引き継ぎます。", tradeoff: "参加と経済は盛り上がりますが、課題解決そのものではありません。", audience: "市民・来訪者・子ども", timing: "すぐ", resultStory: "通りに16年分の選択が並び、市民が次の目標へ付箋を貼りました。", effects: { budget: -6, economy: 5, trust: 7, goals: { 4: 4, 8: 5, 11: 5, 17: 8 } } },
    { id: "next-generation-fund", title: "残った予算を次世代基金に封印する", description: "今は使わず、子どもが将来決められる資金にします。", tradeoff: "未来の選択肢は増えますが、今の困りごとは残ります。", audience: "2030年以降を生きる世代", timing: "あとから", resultStory: "基金の鍵が若者委員会へ渡され、使い道を決める新しい物語が始まりました。", effects: { budget: 4, trust: 3, goals: { 4: 5, 12: 4, 16: 5, 17: 7, 1: -2 } } },
  ],
};
