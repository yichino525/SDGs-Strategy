import { describe, expect, it } from "vitest";
import { turns } from "../data/turns";
import { buildWitnessReaction, pledgeProgress } from "./storyEngine";
import { applyAction, createInitialState } from "./scoreEngine";
import type { GameState } from "./types";

describe("物語の積み重ね", () => {
  it("信頼が下がる選択には人物が懸念を示す", () => {
    const reaction = buildWitnessReaction({ trust: -2, goals: {} }, 1);
    expect(reaction.reaction).toContain("変化");
  });

  it("公約と一致する選択の割合を示す", () => {
    let state: GameState = { ...createInitialState(), pledge: "inclusive" };
    state = applyAction(state, turns[0].actions[0], turns[0].label, turns.length);
    expect(pledgeProgress(state)).toEqual({ aligned: 1, total: 1, percent: 100 });
  });
});
