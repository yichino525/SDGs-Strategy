import { describe, expect, it } from "vitest";
import { goals } from "../data/goals";
import { createInitialState } from "./scoreEngine";
import { buildEnding } from "./endingEngine";

describe("エンディング", () => {
  it("選択の傾向と発動した政策連鎖をまとめる", () => {
    const state = createInitialState();
    state.history = [
      { turnId: "0", turnLabel: "2015年", actionId: "child-support", actionTitle: "子ども支援" },
      { turnId: "1", turnLabel: "2016年", actionId: "community-bus", actionTitle: "地域バス" },
      { turnId: "2", turnLabel: "2017年", actionId: "inclusive-evacuation", actionTitle: "避難計画" },
      { turnId: "3", turnLabel: "2018年", actionId: "community-kitchen", actionTitle: "地域食堂" },
    ];

    const ending = buildEnding(state, goals);
    expect(ending.profile.id).toBe("inclusive");
    expect(ending.triggeredChains.map((chain) => chain.title)).toContain("居場所 × 移動手段");
    expect(ending.strongest).toBeDefined();
    expect(ending.attention).toBeDefined();
  });
  it("複数の傾向が同点なら順番で決めず複合型にする", () => {
    const state = createInitialState();
    state.history = [
      { turnId: "0", turnLabel: "", actionId: "child-support", actionTitle: "" },
      { turnId: "1", turnLabel: "", actionId: "road-investment", actionTitle: "" },
      { turnId: "2", turnLabel: "", actionId: "work-balance", actionTitle: "" },
      { turnId: "3", turnLabel: "", actionId: "water-renewal", actionTitle: "" },
    ];
    expect(buildEnding(state, goals).profile.id).toBe("balanced");
  });
});
