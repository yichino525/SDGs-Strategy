import { useEffect, useMemo, useState } from "react";
import { goals } from "./data/goals";
import { turns } from "./data/turns";
import { applyAction, averageGoalScore, createInitialState } from "./game/scoreEngine";
import { clearSave, loadGame, saveGame } from "./game/storage";
import type { Action, GameState } from "./game/types";

const ResourceCard = ({ label, value, icon }: { label: string; value: number; icon: string }) => (
  <div className="resource-card">
    <span aria-hidden="true">{icon}</span>
    <div>
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  </div>
);

function App() {
  const [state, setState] = useState<GameState>(() => loadGame() ?? createInitialState());
  const [notice, setNotice] = useState("選択は自動的に保存されます");
  const currentTurn = turns[state.turnIndex];
  const average = useMemo(() => averageGoalScore(state), [state]);

  useEffect(() => {
    saveGame(state);
  }, [state]);

  const chooseAction = (action: Action) => {
    if (!currentTurn) return;
    setState((previous) => applyAction(previous, action, currentTurn.label, turns.length));
    setNotice(`「${action.title}」を選びました`);
  };

  const restart = () => {
    clearSave();
    setState(createInitialState());
    setNotice("新しいゲームを始めました");
  };

  return (
    <main>
      <header className="hero">
        <div>
          <p className="eyebrow">SDGs STRATEGY · JAPAN 2015–2030</p>
          <h1>未来は、ひとつの選択から。</h1>
          <p className="lead">限られた予算のなかで、日本の暮らしと17のゴールを育てるゲームです。</p>
        </div>
        <div className="turn-badge" aria-label={`進行 ${Math.min(state.turnIndex + 1, turns.length)} / ${turns.length}`}>
          <span>プロトタイプ</span>
          <strong>{Math.min(state.turnIndex + 1, turns.length)} / {turns.length}</strong>
        </div>
      </header>

      <section className="dashboard" aria-label="現在の状態">
        <ResourceCard label="予算" value={state.resources.budget} icon="¥" />
        <ResourceCard label="経済" value={state.resources.economy} icon="↗" />
        <ResourceCard label="社会的信頼" value={state.resources.trust} icon="◎" />
        <ResourceCard label="SDGs平均" value={average} icon="17" />
      </section>

      <div className="game-layout">
        <section className="scene-card">
          <div className={`city-scene mood-${average >= 55 ? "bright" : average < 48 ? "cloudy" : "calm"}`}>
            <div className="sky-orb" />
            <div className="city-line" aria-hidden="true">
              <span /><span /><span /><span /><span />
            </div>
            <div className="scene-copy">
              <p>窓の向こうのまち</p>
              <strong>{average >= 55 ? "希望の変化が見え始めています" : average < 48 ? "少し不安な空気が広がっています" : "静かに未来が動き始めています"}</strong>
            </div>
          </div>

          {!state.completed && currentTurn ? (
            <div className="decision-panel">
              <p className="turn-label">{currentTurn.label}</p>
              <h2>{currentTurn.headline}</h2>
              <p>{currentTurn.context}</p>
              <div className="actions">
                {currentTurn.actions.map((action) => (
                  <button className="action-card" key={action.id} onClick={() => chooseAction(action)}>
                    <span className="action-title">{action.title}</span>
                    <span>{action.description}</span>
                    <small>{action.tradeoff}</small>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="decision-panel ending">
              <p className="turn-label">4ターン体験版 完了</p>
              <h2>あなたが選んだ、日本のはじまり</h2>
              <p>SDGs平均は <strong>{average}</strong>、残り予算は <strong>{state.resources.budget}</strong> です。どの選択にも、得られたものと後回しになったものがあります。</p>
              <button className="primary-button" onClick={restart}>もう一度プレイする</button>
            </div>
          )}
          <p className="notice" role="status">{notice}</p>
        </section>

        <aside className="goals-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">17 GOALS</p>
              <h2>SDGsの現在地</h2>
            </div>
            <span>0–100</span>
          </div>
          <div className="goal-grid">
            {goals.map((goal) => (
              <div className="goal" key={goal.id} style={{ "--goal-color": goal.color } as React.CSSProperties}>
                <span className="goal-number">{goal.id}</span>
                <div>
                  <small>{goal.shortName}</small>
                  <div className="meter"><span style={{ width: `${state.goals[goal.id]}%` }} /></div>
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
        </aside>
      </div>
    </main>
  );
}

export default App;
