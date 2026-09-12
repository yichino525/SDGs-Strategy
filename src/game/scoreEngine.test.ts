import { describe, expect, it } from "vitest";
import { turns } from "../data/turns";
import { applyAction, averageGoalScore, clamp, createInitialState } from "./scoreEngine";

describe("score engine", () => {
  it("keeps values within 0 and 100", () => {
    expect(clamp(-5)).toBe(0);
    expect(clamp(105)).toBe(100);
  });

  it("applies resource and goal effects", () => {
    const state = createInitialState();
    const action = turns[0].actions[0];
    const next = applyAction(state, action, turns[0].label, turns.length);

    expect(next.resources.budget).toBe(48);
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
});
