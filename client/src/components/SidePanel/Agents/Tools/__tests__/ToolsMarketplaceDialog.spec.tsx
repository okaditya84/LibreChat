import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen } from '@testing-library/react';
import ToolsMarketplaceDialog from '../ToolsMarketplaceDialog';

const mockSetValue = jest.fn();
const mockGetValues = jest.fn(() => []);

jest.mock('react-hook-form', () => ({
  useFormContext: () => ({
    control: {},
    getValues: mockGetValues,
    setValue: mockSetValue,
  }),
  useWatch: ({ name }: { name: string }) => {
    const map: Record<string, unknown> = {
      tools: [],
      skills: [],
      execute_code: false,
      web_search: false,
      file_search: false,
      artifacts: '',
      context_files: [],
      knowledge_files: [],
      code_files: [],
    };
    return map[name];
  },
}));

jest.mock('~/Providers', () => ({
  useAgentPanelContext: () => ({
    agentsConfig: { capabilities: ['execute_code'] },
    regularTools: [{ pluginKey: 'dalle', name: 'DALL-E', description: 'Images' }],
    mcpServersMap: new Map(),
    actions: [],
  }),
}));

jest.mock('~/hooks', () => ({
  useLocalize: () => (key: string) => key,
  useHasAccess: () => true,
  useCategories: () => ({ categories: [] }),
}));

jest.mock('~/data-provider', () => ({
  useListSkillsQuery: () => ({ data: { skills: [] } }),
}));

jest.mock('@librechat/client', () => {
  const React = jest.requireActual('react');
  return {
    OGDialog: ({ children, open }: { children: React.ReactNode; open?: boolean }) =>
      open ? React.createElement('div', null, children) : null,
    OGDialogContent: ({ children }: { children: React.ReactNode }) =>
      React.createElement('div', null, children),
  };
});

jest.mock('../DetailPane/BuiltinDetail', () => ({
  __esModule: true,
  default: () => <div data-testid="builtin-detail" />,
}));
jest.mock('../DetailPane/SkillDetail', () => ({
  __esModule: true,
  default: () => <div data-testid="skill-detail" />,
}));
jest.mock('../DetailPane/ToolDetail', () => ({
  __esModule: true,
  default: () => <div data-testid="tool-detail" />,
}));
jest.mock('../DetailPane/McpDetail', () => ({
  __esModule: true,
  default: () => <div data-testid="mcp-detail" />,
}));
jest.mock('../DetailPane/ActionDetail', () => ({
  __esModule: true,
  default: () => <div data-testid="action-detail" />,
}));

describe('ToolsMarketplaceDialog', () => {
  beforeEach(() => {
    mockSetValue.mockClear();
    mockGetValues.mockClear();
    mockGetValues.mockReturnValue([]);
  });

  test('renders cards from catalog when open', () => {
    render(<ToolsMarketplaceDialog open onOpenChange={jest.fn()} agentId="a1" />);
    expect(screen.getByText('DALL-E')).toBeInTheDocument();
  });

  test('does not render anything when closed', () => {
    const { container } = render(
      <ToolsMarketplaceDialog open={false} onOpenChange={jest.fn()} agentId="a1" />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  test('clicking a tool card calls setValue on tools array with the id appended', () => {
    render(<ToolsMarketplaceDialog open onOpenChange={jest.fn()} agentId="a1" />);
    fireEvent.click(screen.getByRole('button', { name: /DALL-E/ }));
    expect(mockSetValue).toHaveBeenCalledWith(
      'tools',
      expect.arrayContaining(['dalle']),
      expect.objectContaining({ shouldDirty: true }),
    );
  });

  test('typing in search input filters the catalog', () => {
    render(<ToolsMarketplaceDialog open onOpenChange={jest.fn()} agentId="a1" />);
    const input = screen.getByPlaceholderText('com_ui_tools_marketplace_search');
    fireEvent.change(input, { target: { value: 'zzz' } });
    expect(screen.getByText('com_ui_tools_search_no_results')).toBeInTheDocument();
  });

  test('clicking the close button calls onOpenChange(false)', () => {
    const onOpenChange = jest.fn();
    render(<ToolsMarketplaceDialog open onOpenChange={onOpenChange} agentId="a1" />);
    fireEvent.click(screen.getAllByLabelText('com_ui_tools_close')[0]);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  test('clicking an unselected tool card opens the detail pane', () => {
    render(<ToolsMarketplaceDialog open onOpenChange={jest.fn()} agentId="a1" />);
    fireEvent.click(screen.getByRole('button', { name: /DALL-E/ }));
    expect(screen.getByTestId('tool-detail')).toBeInTheDocument();
  });
});
