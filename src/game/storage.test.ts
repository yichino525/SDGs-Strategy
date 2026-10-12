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

  it("公約の種類が壊れたセーブデータを読み込まない", () => {
    const state = { ...createInitialState(), pledge: "unknown" };
    expect(parseGame(JSON.stringify(state))).toBeNull();
  });

  it("大型プロジェクトの記録を復元する", () => {
    const state = { ...createInitialState(), specialProjects: [{ id: "future-transit", title: "未来型公共交通計画", outcome: "success" as const, turnIndex: 8, chance: 54, roll: 31 }] };
    expect(parseGame(JSON.stringify(state))).toEqual(state);
  });
});
