import { describe, expect, it } from "vitest";
import { turns } from "../data/turns";
import { alignProgress, applyAction, averageGoalScore, clamp, createInitialState, quarterlyRevenue } from "./scoreEngine";

describe("score engine", () => {
  it("keeps values within 0 and 100", () => {
    expect(clamp(-5)).toBe(0);
    expect(clamp(105)).toBe(100);
  });

  it("applies resource and goal effects", () => {
    const state = createInitialState();
    const action = turns[0].actions[0];
    const next = applyAction(state, action, turns[0].label, turns.length);

    expect(next.resources.budget).toBe(28);
    expect(next.report?.income).toBe(8);
    expect(next.resources.trust).toBe(55);
    expect(next.goals[1]).toBe(56);
    expect(next.turnIndex).toBe(1);
    expect(next.history).toHaveLength(1);
  });

  it("2030年までの全16ターンを完走する", () => {
    let state = createInitialState();
    turns.forEach((turn) => {
      const action = turn.actions.find(
        (candidate) => state.resources.budget + (candidate.effects.budget ?? 0) >= 0,
      );
      expect(action).toBeDefined();
      state = applyAction(state, action!, turn.label, turns.length);
    });
    expect(state.completed).toBe(true);
    expect(state.turnIndex).toBe(16);
  });

  it("starts with an average SDGs score of 50", () => {
    expect(averageGoalScore(createInitialState())).toBe(50);
  });

  it("旧4ターン版の完了セーブを第5ターンから再開できる", () => {
    const saved = { ...createInitialState(), turnIndex: 4, completed: true };
    const resumed = alignProgress(saved, turns.length);

    expect(resumed.turnIndex).toBe(4);
    expect(resumed.completed).toBe(false);
  });

  it("lets the economy change quarterly city revenue", () => {
    expect(quarterlyRevenue(35)).toBe(7);
    expect(quarterlyRevenue(50)).toBe(8);
    expect(quarterlyRevenue(65)).toBe(10);
  });

  it("予算が少なくても毎年一つは選べる", () => {
    for (const turn of turns) {
      const minimumCost = Math.min(...turn.actions.map((action) => Math.max(0, -(action.effects.budget ?? 0))));
      expect(minimumCost).toBeLessThanOrEqual(8);
    }
  });

  it("旧61ターン版のセーブを年単位の進行へ移す", () => {
    const saved = { ...createInitialState(), turnIndex: 27, history: [{ turnId: "26", turnLabel: "2022年 第2四半期", actionId: "old", actionTitle: "以前の選択" }] };
    expect(alignProgress(saved, turns.length).turnIndex).toBe(8);
  });
});
