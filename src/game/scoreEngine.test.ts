import { describe, expect, it } from "vitest";
import { turns } from "../data/turns";
import { applyAction, averageGoalScore, clamp, createInitialState, quarterlyRevenue } from "./scoreEngine";

describe("score engine", () => {
  it("keeps values within 0 and 100", () => {
    expect(clamp(-5)).toBe(0);
    expect(clamp(105)).toBe(100);
  });

  it("applies resource and goal effects", () => {
    const state = createInitialState();
    const action = turns[0].actions[0];
    const next = applyAction(state, action, turns[0].label, turns.length);

    expect(next.resources.budget).toBe(23);
    expect(next.report?.income).toBe(3);
    expect(next.resources.trust).toBe(55);
    expect(next.goals[1]).toBe(56);
    expect(next.turnIndex).toBe(1);
    expect(next.history).toHaveLength(1);
  });

  it("completes after the fourth turn", () => {
    let state = createInitialState();
    turns.forEach((turn) => {
      state = applyAction(state, turn.actions[0], turn.label, turns.length);
    });
    expect(state.completed).toBe(true);
    expect(state.turnIndex).toBe(4);
  });

  it("starts with an average SDGs score of 50", () => {
    expect(averageGoalScore(createInitialState())).toBe(50);
  });

  it("lets the economy change quarterly city revenue", () => {
    expect(quarterlyRevenue(35)).toBe(2);
    expect(quarterlyRevenue(50)).toBe(3);
    expect(quarterlyRevenue(65)).toBe(4);
  });

  it("makes the budget narrow later choices on an expensive route", () => {
    let state = createInitialState();
    state = applyAction(state, turns[0].actions[1], turns[0].label, turns.length);
    state = applyAction(state, turns[1].actions[1], turns[1].label, turns.length);
    state = applyAction(state, turns[2].actions[1], turns[2].label, turns.length);

    const affordable = turns[3].actions.filter(
      (action) => state.resources.budget + (action.effects.budget ?? 0) >= 0,
    );
    expect(affordable.length).toBeLessThan(turns[3].actions.length);
    expect(affordable.length).toBeGreaterThan(0);
  });
});
