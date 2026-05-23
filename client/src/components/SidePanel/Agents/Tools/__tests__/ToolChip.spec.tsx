import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen } from '@testing-library/react';
import ToolChip from '../ToolChip';
import type { AgentItem } from '../items/types';

jest.mock('~/hooks', () => ({ useLocalize: () => (k: string) => k }));

const skill: AgentItem = {
  kind: 'skill',
  id: 's1',
  name: 'Reviewer',
  description: '',
  iconKey: 'skill',
  skill: { _id: 's1', name: 'Reviewer' } as never,
};

describe('ToolChip', () => {
  test('renders the item name', () => {
    render(<ToolChip item={skill} onClick={jest.fn()} onRemove={jest.fn()} />);
    expect(screen.getByText('Reviewer')).toBeInTheDocument();
  });

  test('clicking the chip calls onClick with the item', () => {
    const onClick = jest.fn();
    render(<ToolChip item={skill} onClick={onClick} onRemove={jest.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /Reviewer/ }));
    expect(onClick).toHaveBeenCalledWith(skill);
  });

  test('renders an MCP tool count suffix when applicable', () => {
    const mcp: AgentItem = {
      kind: 'mcp',
      id: 'srv',
      name: 'srv',
      description: '',
      iconKey: 'mcp',
      server: { serverName: 'srv', isConfigured: true, tools: [] } as never,
      toolCount: 14,
    };
    render(<ToolChip item={mcp} onClick={jest.fn()} onRemove={jest.fn()} />);
    expect(screen.getByText(/14/)).toBeInTheDocument();
  });

  test('renders an action endpoint suffix when applicable', () => {
    const action: AgentItem = {
      kind: 'action',
      id: 'a1',
      name: 'Linear',
      description: '',
      iconKey: 'action',
      action: { action_id: 'a1' } as never,
      endpointCount: 7,
    };
    render(<ToolChip item={action} onClick={jest.fn()} onRemove={jest.fn()} />);
    expect(screen.getByText(/7/)).toBeInTheDocument();
  });

  test('shows a state dot when status is needs_setup', () => {
    render(
      <ToolChip
        item={{ ...skill, status: 'needs_setup' }}
        onClick={jest.fn()}
        onRemove={jest.fn()}
      />,
    );
    expect(screen.getByLabelText('com_ui_tools_needs_setup')).toBeInTheDocument();
  });

  test('clicking the remove × calls onRemove with the item', () => {
    const onRemove = jest.fn();
    render(<ToolChip item={skill} onClick={jest.fn()} onRemove={onRemove} />);
    fireEvent.click(screen.getByLabelText('com_ui_tools_remove'));
    expect(onRemove).toHaveBeenCalledWith(skill);
  });
});
