import { describe, expect, it } from "vitest";
import { goals } from "../data/goals";
import { turns } from "../data/turns";
import { applyAction, createInitialState } from "./scoreEngine";
import { buildEnding } from "./endingEngine";

describe("エンディング", () => {
  it("選択の傾向と発動した政策連鎖をまとめる", () => {
    let state = createInitialState();
    state = applyAction(state, turns[0].actions[0], turns[0].label, 4);
    state = applyAction(state, turns[1].actions[0], turns[1].label, 4);
    state = applyAction(state, turns[2].actions[0], turns[2].label, 4);
    state = applyAction(state, turns[3].actions[0], turns[3].label, 4);

    const ending = buildEnding(state, goals);
    expect(ending.profile.id).toBe("inclusive");
    expect(ending.triggeredChains.map((chain) => chain.title)).toContain("居場所 × 移動手段");
    expect(ending.strongest).toBeDefined();
    expect(ending.attention).toBeDefined();
  });
});
