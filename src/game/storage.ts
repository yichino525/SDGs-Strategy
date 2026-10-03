import type { GameState } from "./types";

const SAVE_KEY = "sdgs-strategy-save-v1";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isScore = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100;

const isEffects = (value: unknown) => {
  if (!isRecord(value) || !isRecord(value.goals)) return false;
  const deltas = [value.budget, value.economy, value.trust].filter((item) => item !== undefined);
  return deltas.every((item) => typeof item === "number" && Number.isFinite(item))
    && Object.values(value.goals).every((item) => typeof item === "number" && Number.isFinite(item));
};

const hasValidCoreState = (value: unknown): value is GameState => {
  if (!isRecord(value) || value.version !== 1 || !Number.isInteger(value.turnIndex)) return false;
  if ((value.turnIndex as number) < 0 || (value.turnIndex as number) > 61) return false;
  if (typeof value.completed !== "boolean" || !Array.isArray(value.history)) return false;
  if (value.pledge !== undefined && !["inclusive", "innovative", "resilient"].includes(value.pledge as string)) return false;
  if (!value.history.every((entry) => isRecord(entry) && typeof entry.turnId === "string" && typeof entry.actionId === "string" && typeof entry.actionTitle === "string" && typeof entry.turnLabel === "string")) return false;
  if (!isRecord(value.resources) || ![value.resources.budget, value.resources.economy, value.resources.trust].every(isScore)) return false;
  if (!isRecord(value.goals)) return false;
  const savedGoals = value.goals;
  if (!Array.from({ length: 17 }, (_, index) => index + 1).every((id) => isScore(savedGoals[id]))) return false;
  if (value.report !== undefined && (!isRecord(value.report) || typeof value.report.title !== "string" || !Array.isArray(value.report.stories) || !value.report.stories.every((story) => typeof story === "string") || !isEffects(value.report.effects))) return false;
  if (value.pending !== undefined && (!Array.isArray(value.pending) || !value.pending.every((item) => isRecord(item) && typeof item.due === "number" && typeof item.title === "string" && isEffects(item.effects)))) return false;
  if (value.gameOver !== undefined && (!isRecord(value.gameOver)
    || !["election", "disaster", "fiscal"].includes(value.gameOver.reason as string)
    || ![value.gameOver.title, value.gameOver.text, value.gameOver.advice].every((item) => typeof item === "string"))) return false;
  return true;
};

export const parseGame = (value: string): GameState | null => {
  try {
    const parsed: unknown = JSON.parse(value);
    return hasValidCoreState(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const loadGame = (): GameState | null => {
  try {
    const value = localStorage.getItem(SAVE_KEY);
    if (!value) return null;
    return parseGame(value);
  } catch {
    return null;
  }
};

export const saveGame = (state: GameState) => {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
};

export const clearSave = () => {
  localStorage.removeItem(SAVE_KEY);
};
