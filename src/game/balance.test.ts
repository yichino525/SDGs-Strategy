import { describe, expect, it } from "vitest";
import { chains, delayed, implementationPlans } from "../data/strategy";
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

describe("全ルートのバランス", () => {
  it("到達できる全ルートが完走でき、予算が一部の判断を絞る", () => {
    const completed: GameState[] = [];
    let constrainedTurns = 0;

    const visit = (state: GameState, turnIndex: number) => {
      if (turnIndex === turns.length) {
        completed.push(state);
        return;
      }

      const variants = turns[turnIndex].actions.flatMap(variantsFor);
      const affordable = variants.filter(
        (action) => state.resources.budget + (action.effects.budget ?? 0) >= 0,
      );
      expect(affordable.length).toBeGreaterThan(0);
      if (affordable.length < variants.length) constrainedTurns += 1;

      for (const action of affordable) {
        visit(applyAction(state, action, turns[turnIndex].label, turns.length), turnIndex + 1);
      }
    };

    visit(createInitialState(), 0);

    expect(completed.length).toBeGreaterThan(0);
    expect(completed.every((state) => state.completed)).toBe(true);
    expect(constrainedTurns).toBeGreaterThan(0);
    expect(new Set(completed.map(averageGoalScore)).size).toBeGreaterThan(1);
    expect(completed.some((state) => Math.min(...Object.values(state.goals)) < 48)).toBe(true);
  });

  it("行動IDと政策連鎖の参照先が壊れていない", () => {
    const ids = turns.flatMap((turn) => turn.actions.map((action) => action.id));
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of Object.keys(implementationPlans)) expect(ids).toContain(id);
    for (const id of Object.keys(delayed)) expect(ids).toContain(id);
    for (const chain of chains) {
      expect(ids).toContain(chain.requires);
      expect(ids).toContain(chain.action);
    }
  });
});
