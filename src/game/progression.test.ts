import { describe, expect, it } from "vitest";
import { applyAction, createInitialState } from "./scoreEngine";
import { buildAnnualReview, cityRank, evaluateGameOver, riskWarnings } from "./progression";
import { turns } from "../data/turns";

describe("年次進行とゲームオーバー", () => {
  it("第4四半期に一年の振り返りを作る", () => {
    const state = createInitialState();
    state.history = [{ turnId: "1", turnLabel: "2016年", actionId: "one", actionTitle: "一年の選択" }];
    const review = buildAnnualReview(state, "2016-q4");
    expect(review?.year).toBe(2016);
    expect(review?.choices).toHaveLength(1);
    expect(review?.rank.grade).toMatch(/[A-D]|S/);
    expect(review?.title).toBeTruthy();
    expect(review?.traits.length).toBeGreaterThan(0);
    expect(review?.nextGoal).toContain("まで伸ばす");
    expect(buildAnnualReview(state, "2016-q3")).toBeUndefined();
  });

  it("市政の状態から年次ランクを計算する", () => {
    const state = createInitialState();
    expect(cityRank(state).grade).toBe("C");
    state.resources.trust = 90;
    state.resources.economy = 80;
    state.resources.budget = 30;
    for (const id of Object.keys(state.goals)) state.goals[Number(id)] = 80;
    expect(cityRank(state).grade).toBe("S");
  });

  it("信頼を失ったまま選挙年を終えると落選する", () => {
    const state = createInitialState();
    state.turnIndex = 17;
    state.resources.trust = 44;
    expect(evaluateGameOver(state, "2019-q4")?.reason).toBe("election");
    expect(riskWarnings(state, turns.find((turn) => turn.id === "2019-q4"))).toHaveLength(1);
  });

  it("危機は事前に警告され、安全値なら続けられる", () => {
    const state = createInitialState();
    state.turnIndex = 5;
    for (const id of [3, 6, 11, 13]) state.goals[id] = 40;
    expect(evaluateGameOver(state, "2017-q4")?.reason).toBe("disaster");
    state.goals[11] = 100;
    expect(evaluateGameOver(state, "2017-q4")).toBeUndefined();
  });

  it("実際の選択肢だけで市長選の敗北ルートが存在する", () => {
    let state = createInitialState();
    const risky = new Set(["reserve-fund", "mass-tourism", "visible-projects", "predictive-support", "decade-reserve"]);
    for (const turn of turns.slice(0, 17)) {
      const affordable = turn.actions.filter((action) => state.resources.budget + (action.effects.budget ?? 0) >= 0);
      const action = affordable.find((candidate) => risky.has(candidate.id))
        ?? [...affordable].sort((a, b) => (b.effects.budget ?? 0) - (a.effects.budget ?? 0))[0];
      state = applyAction(state, action, turn.label, turns.length, turn.id);
      if (state.gameOver) break;
    }
    expect(state.gameOver?.reason).toBe("election");
  });
});
