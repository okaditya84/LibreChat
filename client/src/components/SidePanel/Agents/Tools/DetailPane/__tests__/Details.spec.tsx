import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';
import SkillDetail from '../SkillDetail';
import ToolDetail from '../ToolDetail';
import McpDetail from '../McpDetail';
import ActionDetail from '../ActionDetail';
import type { SkillItem, ToolItem, McpItem, ActionItem } from '../../items/types';

jest.mock('~/hooks', () => ({ useLocalize: () => (k: string) => k }));
jest.mock('../../popouts/PluginAuthPopout', () => ({
  __esModule: true,
  default: ({ open }: { open: boolean }) =>
    open ? <div data-testid="plugin-auth-popout" /> : null,
}));
jest.mock('../../popouts/McpVarsPopout', () => ({
  __esModule: true,
  default: ({ open }: { open: boolean }) => (open ? <div data-testid="mcp-vars-popout" /> : null),
}));
jest.mock('../../popouts/ActionEditorPopout', () => ({
  __esModule: true,
  default: ({ open }: { open: boolean }) =>
    open ? <div data-testid="action-editor-popout" /> : null,
}));

const skillItem: SkillItem = {
  kind: 'skill',
  id: 'x',
  name: 'Test',
  description: 'Desc',
  iconKey: 'skill',
  skill: { _id: 'x', name: 'Test' } as never,
};

const toolItemNeedingAuth: ToolItem = {
  kind: 'tool',
  id: 'x',
  name: 'Test',
  description: 'Desc',
  iconKey: 'tool',
  plugin: { pluginKey: 'x', authConfig: [{}], authenticated: false } as never,
};

const toolItemNoAuth: ToolItem = {
  kind: 'tool',
  id: 'x',
  name: 'Test',
  description: 'Desc',
  iconKey: 'tool',
  plugin: { pluginKey: 'x' } as never,
};

const mcpItemUnconfigured: McpItem = {
  kind: 'mcp',
  id: 'x',
  name: 'Test',
  description: 'Desc',
  iconKey: 'mcp',
  server: { serverName: 'x', isConfigured: false } as never,
  toolCount: 0,
};

const actionItem: ActionItem = {
  kind: 'action',
  id: 'x',
  name: 'Test',
  description: 'Desc',
  iconKey: 'action',
  action: { action_id: 'x', agent_id: 'a' } as never,
  endpointCount: 3,
};

describe('Detail pane bodies', () => {
  test('SkillDetail renders description and remove button', () => {
    const onRemove = jest.fn();
    render(<SkillDetail item={skillItem} onRemove={onRemove} />);
    expect(screen.getByText('Desc')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /com_ui_tools_remove/ }));
    expect(onRemove).toHaveBeenCalled();
  });

  test('ToolDetail offers Configure button when plugin needs auth', () => {
    render(<ToolDetail item={toolItemNeedingAuth} onRemove={jest.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /Configure/i }));
    expect(screen.getByTestId('plugin-auth-popout')).toBeInTheDocument();
  });

  test('ToolDetail does NOT show Configure when no auth required', () => {
    render(<ToolDetail item={toolItemNoAuth} onRemove={jest.fn()} />);
    expect(screen.queryByRole('button', { name: /Configure/i })).not.toBeInTheDocument();
  });

  test('McpDetail offers Configure variables when server is unconfigured', () => {
    render(<McpDetail item={mcpItemUnconfigured} onRemove={jest.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /Configure/i }));
    expect(screen.getByTestId('mcp-vars-popout')).toBeInTheDocument();
  });

  test('ActionDetail offers Edit action button', () => {
    render(<ActionDetail item={actionItem} agentId="a" onRemove={jest.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /Edit/i }));
    expect(screen.getByTestId('action-editor-popout')).toBeInTheDocument();
  });
});
