import { AgentCapabilities, ArtifactModes } from 'librechat-data-provider';
import type { AgentItem } from './types';

export type TogglePatch =
  | { type: 'builtin'; field: AgentCapabilities; value: boolean | string }
  | { type: 'tool-add'; id: string }
  | { type: 'tool-remove'; id: string }
  | { type: 'skill-add'; id: string }
  | { type: 'skill-remove'; id: string }
  | { type: 'mcp-add'; serverName: string }
  | { type: 'mcp-remove'; serverName: string }
  | { type: 'action-add'; actionId: string }
  | { type: 'action-remove'; actionId: string };

const BUILTIN_FIELD: Record<string, AgentCapabilities> = {
  execute_code: AgentCapabilities.execute_code,
  web_search: AgentCapabilities.web_search,
  file_search: AgentCapabilities.file_search,
  artifacts: AgentCapabilities.artifacts,
  context: AgentCapabilities.context,
};

function builtinTogglePatch(id: string, selected: boolean): TogglePatch {
  const field = BUILTIN_FIELD[id] ?? (id as AgentCapabilities);
  if (id === 'artifacts') {
    return { type: 'builtin', field, value: selected ? '' : ArtifactModes.DEFAULT };
  }
  return { type: 'builtin', field, value: !selected };
}

export function computeToggleAction(item: AgentItem, state: { selected: boolean }): TogglePatch {
  if (item.kind === 'builtin') {
    return builtinTogglePatch(item.id, state.selected);
  }
  if (item.kind === 'tool') {
    return state.selected
      ? { type: 'tool-remove', id: item.id }
      : { type: 'tool-add', id: item.id };
  }
  if (item.kind === 'skill') {
    return state.selected
      ? { type: 'skill-remove', id: item.id }
      : { type: 'skill-add', id: item.id };
  }
  if (item.kind === 'mcp') {
    return state.selected
      ? { type: 'mcp-remove', serverName: item.id }
      : { type: 'mcp-add', serverName: item.id };
  }
  return state.selected
    ? { type: 'action-remove', actionId: item.id }
    : { type: 'action-add', actionId: item.id };
}

export interface MutableForm {
  execute_code: boolean;
  web_search: boolean;
  file_search: boolean;
  artifacts: string;
  tools: string[];
  skills: string[];
}

export function applyTogglePatch(form: MutableForm, patch: TogglePatch): MutableForm {
  switch (patch.type) {
    case 'builtin':
      return { ...form, [patch.field]: patch.value } as MutableForm;
    case 'tool-add': {
      if (form.tools.includes(patch.id)) return form;
      return { ...form, tools: [...form.tools, patch.id] };
    }
    case 'tool-remove':
      return { ...form, tools: form.tools.filter((t) => t !== patch.id) };
    case 'skill-add': {
      if (form.skills.includes(patch.id)) return form;
      return { ...form, skills: [...form.skills, patch.id] };
    }
    case 'skill-remove':
      return { ...form, skills: form.skills.filter((s) => s !== patch.id) };
    default:
      return form;
  }
}
