import { describe, expect, it } from "vitest";
import { advisers, chains, cityMemories, delayed, implementationPlans } from "../data/strategy";
import { turns } from "../data/turns";
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
  it("代表的な経路が完走でき、予算が一部の判断を絞る", () => {
    const completed: GameState[] = [];
    let constrainedTurns = 0;
    const frontierLimit = 4000;

    let frontier = [createInitialState()];
    turns.forEach((turn, turnIndex) => {
      const next = new Map<string, GameState>();
      for (const state of frontier) {
        const variants = turn.actions.flatMap(variantsFor);
        const affordable = variants.filter(
          (action) => state.resources.budget + (action.effects.budget ?? 0) >= 0,
        );
        expect(affordable.length, `${turn.id}: 予算${state.resources.budget}で選べる政策がありません`).toBeGreaterThan(0);
        if (affordable.length < variants.length) constrainedTurns += 1;
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
    expect(constrainedTurns).toBeGreaterThan(0);
    expect(new Set(completed.map(averageGoalScore)).size).toBeGreaterThan(1);
    expect(completed.some((state) => Math.min(...Object.values(state.goals)) < 48)).toBe(true);
  });

  it("行動IDと政策連鎖の参照先が壊れていない", () => {
    const ids = turns.flatMap((turn) => turn.actions.map((action) => action.id));
    expect(new Set(ids).size).toBe(ids.length);
    for (const action of turns.flatMap((turn) => turn.actions)) {
      expect(action.resultStory).toBeTruthy();
      expect(cityMemories[action.id]).toBeDefined();
    }
    for (const id of Object.keys(implementationPlans)) expect(ids).toContain(id);
    for (const id of Object.keys(delayed)) expect(ids).toContain(id);
    for (const chain of chains) {
      expect(ids).toContain(chain.requires);
      expect(ids).toContain(chain.action);
    }
    expect(advisers).toHaveLength(turns.length);
    expect(new Set(turns.map((turn) => turn.decisionType)).size).toBeGreaterThanOrEqual(4);
    expect(turns.at(-1)?.id).toBe("2019-q4");
    for (const turn of turns.slice(9)) {
      const minimumCost = Math.min(...turn.actions.flatMap(variantsFor).map((action) => Math.max(0, -(action.effects.budget ?? 0))));
      expect(minimumCost, `${turn.id}には低予算でも選べる案が必要です`).toBeLessThanOrEqual(2);
    }
  });
});
