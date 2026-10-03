import { describe, expect, it } from "vitest";
import { specialProjects } from "../data/specialProjects";
import { createInitialState } from "./scoreEngine";
import { attemptSpecialProject, declineSpecialProject, nextSpecialProject, projectChance } from "./specialProjectEngine";

const readyState = () => ({
  ...createInitialState(),
  turnIndex: 12,
  pledge: "inclusive" as const,
  resources: { budget: 80, economy: 75, trust: 80 },
});

describe("大型プロジェクト", () => {
  it("条件を満たした最初の未解決プロジェクトを提案する", () => {
    expect(nextSpecialProject(readyState())?.id).toBe("future-transit");
  });

  it("準備した政策によって成功率が上がる", () => {
    const project = specialProjects[0];
    const state = readyState();
    const prepared = { ...state, history: [{ turnId: "0", turnLabel: "test", actionId: "community-bus", actionTitle: "バス" }] };
    expect(projectChance(prepared, project)).toBe(projectChance(state, project) + 12);
  });

  it("挑戦では費用を使い、結果を保存して再挑戦を防ぐ", () => {
    const project = specialProjects[0];
    const result = attemptSpecialProject(readyState(), project);
    expect(result.resources.budget).toBeLessThan(80);
    expect(result.specialProjects?.[0].id).toBe(project.id);
    expect(result.specialProjectReport?.chance).toBe(projectChance(readyState(), project));
    expect(attemptSpecialProject(result, project)).toBe(result);
  });

  it("同じ状態なら判定が変わらず、見送りも記録する", () => {
    const project = specialProjects[0];
    const first = attemptSpecialProject(readyState(), project);
    const second = attemptSpecialProject(readyState(), project);
    expect(first.specialProjectReport?.roll).toBe(second.specialProjectReport?.roll);
    expect(declineSpecialProject(readyState(), project).specialProjects?.[0].outcome).toBe("declined");
  });

  it("古いセーブには大型プロジェクト項目がなくてもよい", () => {
    expect(createInitialState().specialProjects).toBeUndefined();
  });
});
