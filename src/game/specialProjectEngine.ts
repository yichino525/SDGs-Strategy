import { specialProjects, type SpecialProject } from "../data/specialProjects";
import { clamp } from "./scoreEngine";
import type { Effects, GameState, GoalId, SpecialProjectRecord } from "./types";

const resolved = (state: GameState, id: string) => state.specialProjects?.some((item) => item.id === id);

export const projectRequirementsMet = (state: GameState, project: SpecialProject) =>
  state.turnIndex >= project.minTurn
  && Object.entries(project.requirements).every(([key, value]) => state.resources[key as keyof GameState["resources"]] >= (value ?? 0));

export const nextSpecialProject = (state: GameState) =>
  specialProjects.find((project) => !resolved(state, project.id) && projectRequirementsMet(state, project));

export const projectChance = (state: GameState, project: SpecialProject) => {
  const history = new Set(state.history.map((entry) => entry.actionId));
  const preparation = project.bonusActions.filter((item) => history.has(item.id)).length;
  const civicBonus = state.resources.trust >= 75 ? 5 : 0;
  const economicBonus = state.resources.economy >= 70 ? 4 : 0;
  return Math.min(88, project.baseChance + preparation * 12 + civicBonus + economicBonus);
};

const deterministicRoll = (state: GameState, project: SpecialProject) => {
  const seed = `${project.id}:${state.turnIndex}:${state.history.map((item) => item.actionId).join("|")}`;
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (Math.abs(hash) % 100) + 1;
};

const changeState = (state: GameState, effects: Effects) => {
  const goals = { ...state.goals };
  for (const [rawId, value] of Object.entries(effects.goals)) {
    const id = Number(rawId) as GoalId;
    goals[id] = clamp(goals[id] + (value ?? 0));
  }
  return {
    goals,
    resources: {
      budget: clamp(state.resources.budget + (effects.budget ?? 0)),
      economy: clamp(state.resources.economy + (effects.economy ?? 0)),
      trust: clamp(state.resources.trust + (effects.trust ?? 0)),
    },
  };
};

export const attemptSpecialProject = (state: GameState, project: SpecialProject): GameState => {
  if (resolved(state, project.id) || !projectRequirementsMet(state, project)) return state;
  const chance = projectChance(state, project);
  const roll = deterministicRoll(state, project);
  const success = roll <= chance;
  const outcome = success ? project.success : project.failure;
  const combined: Effects = {
    budget: (outcome.budget ?? 0) - project.cost.budget,
    economy: outcome.economy,
    trust: (outcome.trust ?? 0) - project.cost.trust,
    goals: { ...outcome.goals },
  };
  const changed = changeState(state, combined);
  const record: SpecialProjectRecord = { id: project.id, title: project.title, outcome: success ? "success" : "failure", turnIndex: state.turnIndex, chance, roll };
  return {
    ...state, ...changed,
    specialProjects: [...(state.specialProjects ?? []), record],
    specialProjectReport: { projectId: project.id, title: project.title, outcome: record.outcome as "success" | "failure", chance, roll, story: success ? project.successStory : project.failureStory, effects: combined },
  };
};

export const declineSpecialProject = (state: GameState, project: SpecialProject): GameState => ({
  ...state,
  specialProjects: [...(state.specialProjects ?? []), { id: project.id, title: project.title, outcome: "declined", turnIndex: state.turnIndex }],
});
