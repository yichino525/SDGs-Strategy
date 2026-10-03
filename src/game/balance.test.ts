import { describe, expect, it } from "vitest";
import { advisers, chains, delayed, implementationPlans } from "../data/strategy";
import { chapterBreaks, pledges, turnSignals } from "../data/story";
import { legacyQuarterlyTurns, turns } from "../data/turns";
import { applyAction, averageGoalScore, createInitialState } from "./scoreEngine";
import type { Action, GameState } from "./types";

const variantsFor = (action: Action): Action[] => {
  const plan = implementationPlans[action.id];
  if (!plan) return [action];
  return plan.options.map((option) => ({
    ...action,
    title: `${action.title}／${option.title}`,
    audience: option.audience,
    timing: option.timing,
    effects: option.effects,
    resultStory: option.resultStory,
  }));
};

describe("長編ルートのバランス", () => {
  it("代表的な経路が完走でき、費用の違う作戦を選べる", () => {
    const completed: GameState[] = [];
    // 組み合わせが急増するため、代表経路を間引いて短時間で検証する。
    const frontierLimit = 600;

    let frontier = [createInitialState()];
    turns.forEach((turn, turnIndex) => {
      const next = new Map<string, GameState>();
      for (const state of frontier) {
        const variants = turn.actions.flatMap(variantsFor);
        const affordable = variants.filter(
          (action) => state.resources.budget + (action.effects.budget ?? 0) >= 0,
        );
        expect(affordable.length, `${turn.id}: 予算${state.resources.budget}で選べる政策がありません`).toBeGreaterThan(0);
        for (const action of affordable) {
          const result = applyAction(state, action, turn.label, turns.length);
          const signature = [result.resources.budget, result.resources.economy, result.resources.trust, ...Object.values(result.goals)].join(":");
          next.set(signature, result);
        }
      }
      const states = [...next.values()].sort((left, right) => {
        const leftKey = `${left.resources.budget.toString().padStart(3, "0")}:${averageGoalScore(left).toString().padStart(3, "0")}:${left.history.map((entry) => entry.actionId).join(":")}`;
        const rightKey = `${right.resources.budget.toString().padStart(3, "0")}:${averageGoalScore(right).toString().padStart(3, "0")}:${right.history.map((entry) => entry.actionId).join(":")}`;
        return leftKey.localeCompare(rightKey);
      });
      frontier = states.length <= frontierLimit
        ? states
        : Array.from({ length: frontierLimit }, (_, index) => states[Math.floor(index * (states.length - 1) / (frontierLimit - 1))]);
      if (turnIndex === turns.length - 1) completed.push(...frontier);
    });

    expect(completed.length).toBe(frontierLimit);
    expect(completed.every((state) => state.completed)).toBe(true);
    expect(turns.every((turn) => new Set(turn.actions.map((action) => action.effects.budget ?? 0)).size > 1)).toBe(true);
    expect(new Set(completed.map(averageGoalScore)).size).toBeGreaterThan(1);
    expect(completed.every((state) => Object.values(state.goals).every((value) => value >= 0 && value <= 100))).toBe(true);
  });

  it("行動IDと政策連鎖の参照先が壊れていない", () => {
    const ids = turns.flatMap((turn) => turn.actions.map((action) => action.id));
    expect(new Set(ids).size).toBe(ids.length);
    for (const action of turns.flatMap((turn) => turn.actions)) {
      expect(action.resultStory).toBeTruthy();
    }
    const legacyIds = legacyQuarterlyTurns.flatMap((turn) => turn.actions.map((action) => action.id));
    for (const id of Object.keys(implementationPlans)) expect(legacyIds).toContain(id);
    for (const id of Object.keys(delayed)) expect(legacyIds).toContain(id);
    for (const chain of chains) {
      expect(legacyIds).toContain(chain.requires);
      expect(legacyIds).toContain(chain.action);
    }
    expect(advisers).toHaveLength(turns.length);
    expect(Object.keys(turnSignals)).toHaveLength(turns.length);
    for (const turn of turns) expect(turnSignals[turn.id]).toBeDefined();
    expect(pledges.map((pledge) => pledge.id)).toEqual(["inclusive", "innovative", "resilient"]);
    expect(Object.keys(chapterBreaks).map(Number)).toEqual([3, 5]);
    expect(new Set(turns.map((turn) => turn.decisionType)).size).toBeGreaterThanOrEqual(4);
    expect(turns.at(-1)?.id).toBe("2030-q4");
    for (const turn of turns) {
      const minimumCost = Math.min(...turn.actions.flatMap(variantsFor).map((action) => Math.max(0, -(action.effects.budget ?? 0))));
      expect(minimumCost, `${turn.id}には低予算でも選べる案が必要です`).toBeLessThanOrEqual(8);
    }
  });
});
