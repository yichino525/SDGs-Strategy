import type { GameState } from "./types";

const SAVE_KEY = "sdgs-strategy-save-v1";

export const loadGame = (): GameState | null => {
  try {
    const value = localStorage.getItem(SAVE_KEY);
    if (!value) return null;
    const parsed = JSON.parse(value) as GameState;
    return parsed.version === 1 ? parsed : null;
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
