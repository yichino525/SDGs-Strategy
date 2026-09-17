import { useEffect, useMemo, useState } from "react";
import { goals } from "./data/goals";
import { chapterBreaks, pledges, turnSignals } from "./data/story";
import { turns } from "./data/turns";
import { actionIcon, pledgeIcons } from "./data/visuals";
import { advisers, chains, cityMemories, delayed, implementationPlans } from "./data/strategy";
import type { ImplementationOption } from "./data/strategy";
import { buildEnding } from "./game/endingEngine";
import { alignProgress, applyAction, averageGoalScore, createInitialState } from "./game/scoreEngine";
import { clearSave, loadGame, saveGame } from "./game/storage";
import { buildWitnessReaction, pledgeProgress } from "./game/storyEngine";
import type { Action, Effects, GameState, PledgeId } from "./game/types";

const ResourceCard = ({ label, value, icon }: { label: string; value: number; icon: string }) => (
  <div className="resource-card">
    <span aria-hidden="true">{icon}</span>
    <div>
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  </div>
);

const goalPreview = (effects: Effects) => Object.entries(effects.goals)
  .sort(([, left], [, right]) => Math.abs(right ?? 0) - Math.abs(left ?? 0))
  .slice(0, 2)
  .map(([id, value]) => `${goals.find((goal) => goal.id === Number(id))?.shortName}${(value ?? 0) >= 0 ? "↑" : "↓"}`)
  .join("・");

function App() {
  const [state, setState] = useState<GameState>(() => {
    const saved = loadGame();
    return saved ? alignProgress(saved, turns.length) : createInitialState();
  });
  const [showPrologue, setShowPrologue] = useState(state.history.length === 0);
  const [pendingAction, setPendingAction] = useState<Action | null>(null);
  const lastAction = state.report;
  const lastActionIcon = actionIcon(state.history.at(-1)?.actionId ?? "");
  const [notice, setNotice] = useState("選択は自動的に保存されます");
  const currentTurn = turns[state.turnIndex];
  const activeTurn = state.report ? turns[Math.max(0, state.turnIndex - 1)] : (currentTurn ?? turns.at(-1));
  const activeChapterNumber = activeTurn?.chapter.split(" ")[0] ?? "章";
  const isChapterStart = Boolean(currentTurn && state.turnIndex > 0 && turns[state.turnIndex - 1]?.chapter !== currentTurn.chapter);
  const average = useMemo(() => averageGoalScore(state), [state]);
  const lowest = useMemo(() => Math.min(...Object.values(state.goals)), [state]);
  const ending = useMemo(() => buildEnding(state, goals), [state]);
  const promiseProgress = useMemo(() => pledgeProgress(state), [state]);
  const pledge = pledges.find((candidate) => candidate.id === state.pledge);
  const signal = currentTurn ? turnSignals[currentTurn.id] : undefined;
  const witness = lastAction ? buildWitnessReaction(lastAction.effects, Math.max(0, state.turnIndex - 1)) : undefined;
  const chapterBreak = lastAction ? chapterBreaks[state.turnIndex] : undefined;
  const implementationPlan = pendingAction ? implementationPlans[pendingAction.id] : undefined;
  const memories = useMemo(() => state.history.flatMap((entry) => cityMemories[entry.actionId] ? [cityMemories[entry.actionId]] : []), [state.history]);
  const sceneKinds = useMemo(() => new Set(memories.map((memory) => memory.kind)), [memories]);

  useEffect(() => {
    saveGame(state);
  }, [state]);

  const scrollToDecision = () => requestAnimationFrame(() =>
    document.querySelector(".scene-card")?.scrollIntoView({ behavior: "smooth", block: "start" }),
  );

  const commitAction = (action: Action) => {
    if (!currentTurn) return;
    setState((previous) => applyAction(previous, action, currentTurn.label, turns.length));
    setPendingAction(null);
    setNotice(`「${action.title}」を選びました`);
    scrollToDecision();
  };

  const chooseAction = (action: Action) => {
    if (implementationPlans[action.id]) {
      setPendingAction(action);
      setNotice("政策の始め方を選んでください");
      scrollToDecision();
      return;
    }
    commitAction(action);
  };

  const chooseImplementation = (option: ImplementationOption) => {
    if (!pendingAction) return;
    commitAction({
      ...pendingAction,
      title: `${pendingAction.title}／${option.title}`,
      description: option.description,
      tradeoff: option.tradeoff,
      audience: option.audience,
      timing: option.timing,
      effects: option.effects,
      resultStory: option.resultStory,
    });
  };

  const continueGame = () => {
    setState((previous) => ({ ...previous, report: undefined }));
    scrollToDecision();
  };

  const restart = () => {
    clearSave();
    setState(createInitialState());
    setPendingAction(null);
    setShowPrologue(true);
    setNotice("新しいゲームを始めました");
    requestAnimationFrame(() => window.scrollTo({ top: 0 }));
  };

  const choosePledge = (pledgeId: PledgeId) => {
    setState((previous) => ({ ...previous, pledge: pledgeId }));
    setNotice("市長の公約を記録しました");
    requestAnimationFrame(() => window.scrollTo({ top: 0 }));
  };

  const formatDelta = (value: number) => `${value > 0 ? "+" : ""}${value}`;

  if (showPrologue) {
    return (
      <main className="prologue-page">
        <section className="prologue">
          <div className="prologue-art" aria-hidden="true">
            <div className="prologue-sun" />
            <div className="prologue-window"><span /><span /></div>
            <div className="prologue-person" />
          </div>
          <div className="prologue-copy">
            <p className="chapter-label">PROLOGUE · 2015年 秋 · はじめの物語</p>
            <h1>世界が未来を約束した日、<br />あなたの物語が始まる。</h1>
            <div className="story-text">
              <p>窓の外には、いつもと同じ日本のまちが広がっています。</p>
              <p>けれど今日、世界は2030年までに達成したい17の目標――SDGsを掲げました。貧困、教育、働き方、気候。どれも大切ですが、使える予算と時間には限りがあります。</p>
              <p>あなたは、日本の架空都市「みらい市」の市長に就任します。市の予算と権限には限りがあります。議会や住民と向き合いながら、2030年までの道を選んでください。</p>
            </div>
            <blockquote>「2030年の窓から、どんな景色を見たい？」</blockquote>
            <button className="start-button" onClick={() => { setShowPrologue(false); requestAnimationFrame(() => window.scrollTo({ top: 0 })); }}>
              <span>えらんで、まちを変えよう</span><strong>物語を始める →</strong>
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (!state.pledge) {
    return (
      <main className="pledge-page">
        <section className="pledge-intro">
          <p className="chapter-label">YOUR PROMISE · 市長のやくそく</p>
          <h1>{state.history.length ? "これからの市政で、何を約束しますか？" : "最初に、市民へ一つ約束してください。"}</h1>
          <p>{state.history.length ? "これまでの選択はそのまま残ります。ここから先、どの価値を大切にするかを市民へ伝えます。" : "公約に絶対の正解はありません。何を優先し、どんな負担を引き受けるかが、あなたの物語になります。"}</p>
          <div className="pledge-options">
            {pledges.map((option, index) => <button key={option.id} className="pledge-card" onClick={() => choosePledge(option.id)}>
              <div className="pledge-card-heading"><span className="pledge-symbol" aria-hidden="true">{pledgeIcons[option.id]}</span><span>公約 {String.fromCharCode(65 + index)}</span></div>
              <strong>{option.title}</strong>
              <p>{option.statement}</p>
              <small>重視：{option.focus}</small>
              <em>向き合う負担：{option.cost}</em>
              <b>この公約を掲げる →</b>
            </button>)}
          </div>
          <p className="pledge-note">公約は能力アップではなく、章末に振り返る「市民との約束」です。</p>
        </section>
      </main>
    );
  }

  return (
    <main>
      <header className="hero">
        <div>
          <p className="eyebrow">SDGs STRATEGY · JAPAN 2015–2030</p>
          <h1>未来は、市長の選択から。</h1>
          <p className="lead">架空都市「みらい市」で、アイデアを選びながら17のゴールに向き合うゲームです。</p>
        </div>
        <div className="turn-badge" aria-label={`進行 ${Math.min(state.turnIndex + 1, turns.length)} / ${turns.length}`}>
          <span>{activeTurn?.chapter ?? "第1章"}</span>
          <strong>{Math.min(state.turnIndex + 1, turns.length)} / {turns.length}</strong>
        </div>
      </header>

      <section className="dashboard" aria-label="現在の状態">
        <ResourceCard label="予算" value={state.resources.budget} icon="🪙" />
        <ResourceCard label="経済" value={state.resources.economy} icon="🏪" />
        <ResourceCard label="社会的信頼" value={state.resources.trust} icon="🤝" />
        <ResourceCard label="SDGs平均" value={average} icon="🌍" />
      </section>

      <section className="promise-strip" aria-label="市長の公約">
        <div><span>YOUR PROMISE</span><strong>{pledge?.title}</strong></div>
        <p>{promiseProgress.total ? `${promiseProgress.aligned} / ${promiseProgress.total}回の選択が公約の方向と重なっています` : "最初の選択を、市民が見守っています"}</p>
        <div className="promise-meter" role="progressbar" aria-label="公約との一致" aria-valuemin={0} aria-valuemax={100} aria-valuenow={promiseProgress.percent}><span style={{ width: `${promiseProgress.percent}%` }} /></div>
      </section>

      <div className="game-layout">
        <section className="scene-card">
          <div className={`city-scene mood-${average >= 55 && lowest >= 48 ? "bright" : lowest < 48 ? "cloudy" : "calm"} ${[...sceneKinds].map((kind) => `has-${kind}`).join(" ")}`}>
            <div className="sky-orb" />
            <div className="city-line" aria-hidden="true">
              <span /><span /><span /><span /><span />
            </div>
            <div className="city-details" aria-hidden="true">
              <span className="scene-solar" />
              <span className="scene-bus">🚌</span>
              <span className="scene-tree" />
              <span className="scene-lights">✨</span>
            </div>
            <div className="scene-copy">
              <p>窓の向こうのまち</p>
              <strong>{average >= 55 && lowest >= 48 ? "希望の変化がまち全体へ広がっています" : lowest < 48 ? "取り残された課題に、不安の声が届いています" : "静かに未来が動き始めています"}</strong>
            </div>
          </div>

          {memories.length > 0 && <section className="city-memory" aria-label="街に残った変化">
            <div><p className="eyebrow">CITY MEMORY</p><h2>街に残った変化</h2></div>
            <div className="memory-list">{memories.map((memory) => <article key={memory.label}><span aria-hidden="true">{memory.icon}</span><div><strong>{memory.label}</strong><small>{memory.detail}</small></div></article>)}</div>
          </section>}

          {lastAction ? (
            <div className="decision-panel result-panel" aria-live="polite">
              <p className="result-kicker">YOUR DECISION</p>
              <h2>選択が、まちを動かしました。</h2>
              <div className="chosen-action">
                <span className="chosen-action-icon" aria-hidden="true">{lastActionIcon}</span>
                <div><span>今回の選択</span><strong>{lastAction.title}</strong></div>
                <p>今回の政策と、これまでの投資を合わせた実際の変化です。</p>
              </div>
              {lastAction.income && <div className="income-note"><span>この四半期の市税収</span><strong>+{lastAction.income}</strong><small>経済が育つと、次の政策に使える収入も変わります。</small></div>}
              <article className="newspaper">
                <p>まちの未来新聞 · 第{state.turnIndex}号 · 架空のニュース</p>
                <h3>{lastAction.stories.length ? "現場から、変化の声が届いた。" : "新しい方針、地域で動き出す"}</h3>
                {lastAction.stories.length ? lastAction.stories.map(story => <p key={story}>{story}</p>) : <p>「{lastAction.title}」が決まりました。住民たちは、これからの変化を見守っています。</p>}
              </article>
              {witness && <article className="witness-reaction">
                <div className="witness-mark" aria-hidden="true">{witness.name.slice(0, 1)}</div>
                <div><span>その夜、市長へ届いた声</span><strong>{witness.name} · {witness.role}</strong><blockquote>「{witness.reaction}」</blockquote></div>
              </article>}
              {chapterBreak && <article className="chapter-cliffhanger">
                <span>CHAPTER TURNING POINT</span><h3>{chapterBreak.title}</h3><p>{chapterBreak.text}</p><strong>{chapterBreak.next}</strong>
              </article>}
              <h3>変化したもの</h3>
              <div className="impact-grid">
                {(["budget", "economy", "trust"] as const).map((key) => {
                  const value = lastAction.effects[key];
                  if (!value) return null;
                  const labels = { budget: "予算", economy: "経済", trust: "社会的信頼" };
                  return <div className={`impact ${value > 0 ? "positive" : "negative"}`} key={key}><span>{labels[key]}</span><strong>{formatDelta(value)}</strong></div>;
                })}
                {Object.entries(lastAction.effects.goals).map(([id, value]) => {
                  if (!value) return null;
                  const goal = goals.find((item) => item.id === Number(id));
                  return <div className={`impact ${value > 0 ? "positive" : "negative"}`} key={id}><span>目標{id}・{goal?.shortName}</span><strong>{formatDelta(value)}</strong></div>;
                })}
              </div>
              <p className="result-note">良くなった数字だけでなく、負担や後回しになった課題も次の判断につながります。</p>
              <button className="primary-button wide" onClick={continueGame}>
                {state.completed ? `${activeChapterNumber}の結果を見る` : "次の四半期へ進む"} →
              </button>
            </div>
          ) : pendingAction && implementationPlan ? (
            <div className="decision-panel implementation-panel">
              <button className="back-button" onClick={() => setPendingAction(null)}>← 政策を選び直す</button>
              <p className="turn-label">実施方法を決める</p>
              <h2>{implementationPlan.question}</h2>
              <p>{implementationPlan.context}</p>
              <div className="voices" aria-label="住民と職員の声">
                {implementationPlan.voices.map((voice) => <blockquote key={voice.role}><strong>{voice.role}</strong><p>「{voice.text}」</p></blockquote>)}
              </div>
              <div className="actions">
                {implementationPlan.options.map((option) => {
                  const cost = Math.max(0, -(option.effects.budget ?? 0));
                  return (
                    <button className="action-card implementation-card" key={option.id} disabled={state.resources.budget < cost} onClick={() => chooseImplementation(option)}>
                      <div className="action-card-heading"><span className="action-symbol" aria-hidden="true">{actionIcon(pendingAction.id)}</span><span className="action-title">{option.title}</span></div>
                      <span>{option.description}</span>
                      <small>{option.tradeoff}</small>
                      <span className="action-preview"><span>届く人：{option.audience}</span><span>実感：{option.timing}</span><span>主な変化：{goalPreview(option.effects)}</span></span>
                      <span className="policy-hint">必要予算 {cost} ／ 現在 {state.resources.budget}</span>
                      <b>この方法で始める →</b>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : !state.completed && currentTurn ? (
            <div className="decision-panel">
              {isChapterStart && <div className="chapter-opening"><span>NEW CHAPTER</span><strong>{currentTurn.chapter}</strong><p>これまでの選択を引き継ぎ、次の時代へ進みます。</p></div>}
              <div className="turn-heading"><div><p className="turn-label">{currentTurn.label}</p><span className="decision-type">{currentTurn.decisionType}</span></div><span>選択 {state.turnIndex + 1} / {turns.length}</span></div>
              <p className="chapter-progress">{currentTurn.chapter}</p>
              <h2>{currentTurn.headline}</h2>
              <p>{currentTurn.context}</p>
              {signal && <div className={`turn-signal signal-${signal.level}`}><span>まちの気配 · {signal.label}</span><p>{signal.text}</p></div>}
              <div className="scenario-note">
                <strong>{currentTurn.scenarioKind === "historical-frame" ? "史実を背景にした仮想シナリオ" : "ゲーム用の仮想シナリオ"}</strong>
                <span>政策効果の数値は、現実の予測ではなくゲーム上の仮定です。</span>
                {currentTurn.source && <a href={currentTurn.source.url} target="_blank" rel="noreferrer">出典：{currentTurn.source.title}（確認日 {currentTurn.source.checkedAt}）</a>}
              </div>
              {(() => {
                const adviser = advisers[state.turnIndex % advisers.length];
                return <blockquote className="adviser"><strong>{adviser.name} · {adviser.role}</strong><p>「{adviser.quote}」</p><small>登場人物は創作です</small></blockquote>;
              })()}
              <div className="actions">
                {currentTurn.actions.map((action) => {
                  const plan = implementationPlans[action.id];
                  const costs = plan ? plan.options.map((option) => Math.max(0, -(option.effects.budget ?? 0))) : [Math.max(0, -(action.effects.budget ?? 0))];
                  const minimumCost = Math.min(...costs);
                  const costLabel = costs.length > 1 ? `${minimumCost}〜${Math.max(...costs)}` : `${minimumCost}`;
                  return <button className="action-card" key={action.id} disabled={state.resources.budget < minimumCost} onClick={() => chooseAction(action)}>
                    <div className="action-card-heading"><span className="action-symbol" aria-hidden="true">{actionIcon(action.id)}</span><div><span className="action-index">選択肢 {String.fromCharCode(65 + currentTurn.actions.indexOf(action))}</span><span className="action-title">{action.title}</span></div></div>
                    <span>{action.description}</span>
                    <small>{action.tradeoff}</small>
                    <span className="action-preview"><span>届く人：{action.audience}</span><span>実感：{action.timing}</span><span>主な変化：{goalPreview(action.effects)}</span></span>
                    <span className="policy-hint">必要予算 {costLabel} ／ 現在 {state.resources.budget}</span>
                    {delayed[action.id] && <span className="policy-hint">◷ 2四半期後にも効果：{delayed[action.id].title}</span>}
                    {chains.filter(chain => chain.action === action.id).map(chain => <span className="policy-hint" key={chain.requires}>{state.history.some(entry => entry.actionId === chain.requires) ? '✦ 連鎖が発動！' : '連鎖のヒント：'} {chain.title}</span>)}
                    <b>この方針を選ぶ →</b>
                  </button>;
                })}
              </div>
            </div>
          ) : (
            <div className="decision-panel ending">
              <p className="turn-label">{activeTurn?.chapter} 完了 · {activeTurn?.label}</p>
              <h2>{ending.profile.title}</h2>
              <p>{ending.profile.text}</p>
              <p>SDGs平均は <strong>{average}</strong>、残り予算は <strong>{state.resources.budget}</strong> です。どの選択にも、得られたものと後回しになったものがあります。</p>
              <div className="ending-summary">
                <div><span>最も伸びた目標</span><strong>{ending.strongest.id}・{ending.strongest.shortName}</strong><b>{state.goals[ending.strongest.id]}</b></div>
                <div><span>次に向き合う目標</span><strong>{ending.attention.id}・{ending.attention.shortName}</strong><b>{state.goals[ending.attention.id]}</b></div>
                <div><span>見つけた政策連鎖</span><strong>{ending.triggeredChains.length} / {chains.length}</strong><b>✦</b></div>
              </div>
              {ending.triggeredChains.length > 0 && <p className="ending-chains">発見：{ending.triggeredChains.map((chain) => chain.title).join("、")}</p>}
              <div className="promise-result"><span>市民との公約</span><strong>{pledge?.title}</strong><p>{promiseProgress.aligned} / {promiseProgress.total}回の選択が、公約の方向と重なりました。数字だけでなく、選ばなかった理由も市民への説明になります。</p></div>
              <button className="primary-button" onClick={restart}>もう一度プレイする</button>
            </div>
          )}
          <p className="notice" role="status">{notice}</p>
        </section>

        <aside className="goals-panel">
          {(state.pending ?? []).length > 0 && <section className="future-panel"><p className="eyebrow">育っている投資</p>{state.pending?.map(item => <p key={item.title}><strong>あと{item.due - state.turnIndex}四半期</strong><br />{item.title}</p>)}</section>}
          <div className="section-heading">
            <div>
              <p className="eyebrow">17 GOALS</p>
              <h2>SDGsの現在地</h2>
            </div>
            <span>0–100</span>
          </div>
          <div className="goal-grid">
            {goals.map((goal) => (
              <div className="goal" key={goal.id} style={{ "--goal-color": goal.color, "--goal-ink": goal.ink } as React.CSSProperties}>
                <span className="goal-number">{goal.id}</span>
                <div>
                  <small>{goal.shortName}</small>
                  <div className="meter" role="progressbar" aria-label={`目標${goal.id} ${goal.shortName}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={state.goals[goal.id]}><span style={{ width: `${state.goals[goal.id]}%` }} /></div>
                </div>
                <strong>{state.goals[goal.id]}</strong>
              </div>
            ))}
          </div>
          {state.history.length > 0 && (
            <div className="history">
              <h3>これまでの選択</h3>
              <ol>
                {state.history.map((entry) => (
                  <li key={`${entry.turnId}-${entry.actionId}`}><span>{entry.turnLabel}</span>{entry.actionTitle}</li>
                ))}
              </ol>
            </div>
          )}
          <details className="glossary">
            <summary>ことばの説明</summary>
            <dl>
              <div><dt>四半期</dt><dd>1年を3か月ずつ、4つに分けた期間。</dd></div>
              <div><dt>社会的信頼</dt><dd>住民が市役所や地域を信頼し、協力できる度合い。</dd></div>
              <div><dt>政策連鎖</dt><dd>前に選んだ政策と新しい政策がつながり、追加の変化が生まれること。</dd></div>
            </dl>
          </details>
        </aside>
      </div>
    </main>
  );
}

export default App;
