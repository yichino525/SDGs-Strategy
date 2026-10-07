import { describe, expect, it } from "vitest";
import { achievementCollection, featuredAchievement } from "./achievements";
import { createInitialState } from "./scoreEngine";

describe("称号コレクション", () => {
  it("最初は称号が未獲得で、選択後に第一歩を獲得する", () => {
    const state = createInitialState();
    expect(achievementCollection(state).filter((item) => item.earned)).toHaveLength(0);
    state.history.push({ turnId: "0", turnLabel: "2015年", actionId: "child-support", actionTitle: "子ども支援" });
    expect(achievementCollection(state).find((item) => item.id === "first-step")?.earned).toBe(true);
  });

  it("隠し称号は特別な組み合わせで解除される", () => {
    const state = createInitialState();
    state.history = [
      { turnId: "1", turnLabel: "2021年", actionId: "learning-quest", actionTitle: "学び" },
      { turnId: "2", turnLabel: "2028年", actionId: "disaster-escape-game", actionTitle: "防災" },
    ];
    const title = achievementCollection(state).find((item) => item.id === "game-master");
    expect(title?.hidden).toBe(true);
    expect(title?.earned).toBe(true);
  });

  it("大型プロジェクトの失敗と成功で不死鳥を解除する", () => {
    const state = createInitialState();
    state.specialProjects = [
      { id: "one", title: "失敗", outcome: "failure", turnIndex: 3 },
      { id: "two", title: "成功", outcome: "success", turnIndex: 5 },
    ];
    expect(achievementCollection(state).find((item) => item.id === "phoenix")?.earned).toBe(true);
    expect(featuredAchievement(state)?.title).toBe("失敗から立つ不死鳥");
  });
});
