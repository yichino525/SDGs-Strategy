import { describe, expect, it } from "vitest";
import { createInitialState } from "./scoreEngine";
import { playerLevel, playerSkills, playerTitle, skillImpact, totalSdgsPoints } from "./playerProfile";

describe("SDGsプレイヤー育成", () => {
  it("最初は5つの能力を50で表示する", () => {
    const skills = playerSkills(createInitialState());
    expect(skills).toHaveLength(5);
    expect(skills.every((skill) => skill.score === 50)).toBe(true);
    expect(totalSdgsPoints(createInitialState())).toBe(250);
    expect(playerLevel(createInitialState())).toBe(5);
  });

  it("選択肢のゴール変動を能力ごとにまとめる", () => {
    const impact = skillImpact({ goals: { 1: 2, 3: 3, 13: -2 } });
    expect(impact.find((skill) => skill.id === "life")?.value).toBe(5);
    expect(impact.find((skill) => skill.id === "planet")?.value).toBe(-2);
    expect(playerTitle(createInitialState())).toBe("SDGsチャレンジャー");
  });
});
