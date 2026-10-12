import { describe, it, expect } from 'vitest';
import { legacyQuarterlyTurns as turns } from '../data/turns';
import { implementationPlans } from '../data/strategy';
import { applyAction, createInitialState } from './scoreEngine';

describe('政策の積み重ね', () => {
  it('投資は次のターンに一度だけ実を結ぶ', () => {
    let state = createInitialState();
    state = applyAction(state, turns[0].actions[0], turns[0].label, 4);
    expect(state.pending).toHaveLength(1);
    state = applyAction(state, turns[1].actions[1], turns[1].label, 4);
    expect(state.report?.stories.some((story) => story.includes('実を結んだ投資'))).toBe(true);
    expect(state.goals[4]).toBe(59);
    expect(state.pending).toHaveLength(0);
    state = applyAction(state, turns[2].actions[0], turns[2].label, 4);
    expect(state.goals[4]).toBe(59);
  });
  it('子ども支援とバスが連鎖する', () => {
    let state = applyAction(createInitialState(), turns[0].actions[0], turns[0].label, 4);
    state = applyAction(state, turns[1].actions[0], turns[1].label, 4);
    expect(state.goals[4]).toBe(63);
    expect(state.report?.stories.some((story) => story.includes('居場所 × 移動手段'))).toBe(true);
  });
  it('上限で切り詰めた実際の差分を報告する', () => {
    const state = createInitialState();
    state.goals[1] = 99;
    expect(applyAction(state, turns[0].actions[0], '', 4).report?.effects.goals[1]).toBe(1);
  });
  it('予算不足ならターンと状態を変更しない', () => {
    const state = createInitialState();
    state.resources.budget = 0;
    expect(applyAction(state, turns[0].actions[0], '', 4)).toBe(state);
  });
  it('保存から結果と未発生の投資を復元できる', () => {
    const state = applyAction(createInitialState(), turns[0].actions[0], '', 4);
    expect(JSON.parse(JSON.stringify(state))).toEqual(state);
  });
  it('実施方法を変えても元の政策IDと連鎖を引き継ぐ', () => {
    let state = applyAction(createInitialState(), turns[0].actions[0], turns[0].label, 4);
    const base = turns[1].actions[0];
    const option = implementationPlans[base.id].options[1];
    const implemented = {
      ...base,
      title: `${base.title}／${option.title}`,
      effects: option.effects,
      resultStory: option.resultStory,
    };
    state = applyAction(state, implemented, turns[1].label, 4);
    expect(state.history[1].actionId).toBe('community-bus');
    expect(state.report?.stories).toContain(option.resultStory);
    expect(state.report?.stories.some((story) => story.includes('居場所 × 移動手段'))).toBe(true);
  });
});
