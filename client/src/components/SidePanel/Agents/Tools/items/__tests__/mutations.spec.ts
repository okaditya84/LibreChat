import { AgentCapabilities, ArtifactModes } from 'librechat-data-provider';
import { computeToggleAction, applyTogglePatch } from '../mutations';
import type { AgentItem } from '../types';

const builtinCode: AgentItem = {
  kind: 'builtin',
  id: 'execute_code',
  name: 'Code',
  description: '',
  iconKey: 'execute_code',
};

const builtinArtifacts: AgentItem = {
  kind: 'builtin',
  id: 'artifacts',
  name: 'Art',
  description: '',
  iconKey: 'artifacts',
};

const tool: AgentItem = {
  kind: 'tool',
  id: 'dalle',
  name: 'DALL-E',
  description: '',
  iconKey: 'tool',
  plugin: { pluginKey: 'dalle' } as never,
};

const skill: AgentItem = {
  kind: 'skill',
  id: 's1',
  name: 'Skill',
  description: '',
  iconKey: 'skill',
  skill: { _id: 's1' } as never,
};

describe('computeToggleAction', () => {
  test('toggling execute_code on writes the boolean flag', () => {
    expect(computeToggleAction(builtinCode, { selected: false })).toEqual({
      type: 'builtin',
      field: AgentCapabilities.execute_code,
      value: true,
    });
  });

  test('toggling execute_code off writes false', () => {
    expect(computeToggleAction(builtinCode, { selected: true })).toEqual({
      type: 'builtin',
      field: AgentCapabilities.execute_code,
      value: false,
    });
  });

  test('toggling artifacts on writes the default mode', () => {
    expect(computeToggleAction(builtinArtifacts, { selected: false })).toEqual({
      type: 'builtin',
      field: AgentCapabilities.artifacts,
      value: ArtifactModes.DEFAULT,
    });
  });

  test('toggling artifacts off writes empty string', () => {
    expect(computeToggleAction(builtinArtifacts, { selected: true })).toEqual({
      type: 'builtin',
      field: AgentCapabilities.artifacts,
      value: '',
    });
  });

  test('toggling a tool emits a tools-array patch', () => {
    expect(computeToggleAction(tool, { selected: false })).toEqual({
      type: 'tool-add',
      id: 'dalle',
    });
    expect(computeToggleAction(tool, { selected: true })).toEqual({
      type: 'tool-remove',
      id: 'dalle',
    });
  });

  test('toggling a skill emits a skills-array patch', () => {
    expect(computeToggleAction(skill, { selected: false })).toEqual({
      type: 'skill-add',
      id: 's1',
    });
  });
});

describe('applyTogglePatch', () => {
  const baseForm = {
    execute_code: false,
    web_search: false,
    file_search: false,
    artifacts: '',
    tools: [] as string[],
    skills: [] as string[],
  };

  test('builtin patch updates the matching field', () => {
    const next = applyTogglePatch(baseForm, {
      type: 'builtin',
      field: AgentCapabilities.execute_code,
      value: true,
    });
    expect(next.execute_code).toBe(true);
  });

  test('tool-add appends without duplicates', () => {
    const next = applyTogglePatch({ ...baseForm, tools: ['x'] }, { type: 'tool-add', id: 'y' });
    expect(next.tools).toEqual(['x', 'y']);

    const noop = applyTogglePatch(next, { type: 'tool-add', id: 'y' });
    expect(noop.tools).toEqual(['x', 'y']);
  });

  test('tool-remove removes the id', () => {
    const next = applyTogglePatch(
      { ...baseForm, tools: ['x', 'y'] },
      { type: 'tool-remove', id: 'x' },
    );
    expect(next.tools).toEqual(['y']);
  });
});
