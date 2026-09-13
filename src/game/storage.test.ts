import { describe, expect, it } from "vitest";
import { createInitialState } from "./scoreEngine";
import { parseGame } from "./storage";

describe("セーブデータ検証", () => {
  it("正しい状態を復元する", () => {
    const state = createInitialState();
    expect(parseGame(JSON.stringify(state))).toEqual(state);
  });

  it("壊れたJSONと範囲外の数値を読み込まない", () => {
    expect(parseGame("{broken")).toBeNull();
    const state = createInitialState();
    state.resources.budget = -1;
    expect(parseGame(JSON.stringify(state))).toBeNull();
  });

  it("17ゴールの欠けた保存データを読み込まない", () => {
    const state = createInitialState();
    delete state.goals[17];
    expect(parseGame(JSON.stringify(state))).toBeNull();
  });
});
