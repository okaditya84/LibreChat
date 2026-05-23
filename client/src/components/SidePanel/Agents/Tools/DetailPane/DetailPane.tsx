import { X } from 'lucide-react';
import type { AgentItem } from '../items/types';
import BuiltinDetail from './BuiltinDetail';
import SkillDetail from './SkillDetail';
import ToolDetail from './ToolDetail';
import McpDetail from './McpDetail';
import ActionDetail from './ActionDetail';
import { getIconForItem } from '../items/icons';
import { useLocalize } from '~/hooks';
import { cn } from '~/utils';

interface Props {
  item: AgentItem;
  agentId: string;
  onClose: () => void;
  onRemove: () => void;
}

interface BodyProps {
  item: AgentItem;
  agentId: string;
  onRemove: () => void;
}

function DetailBody({ item, agentId, onRemove }: BodyProps) {
  if (item.kind === 'builtin') {
    return <BuiltinDetail builtinId={item.id} agentId={agentId} onRemove={onRemove} />;
  }
  if (item.kind === 'skill') {
    return <SkillDetail item={item} onRemove={onRemove} />;
  }
  if (item.kind === 'tool') {
    return <ToolDetail item={item} onRemove={onRemove} />;
  }
  if (item.kind === 'mcp') {
    return <McpDetail item={item} onRemove={onRemove} />;
  }
  return <ActionDetail item={item} agentId={agentId} onRemove={onRemove} />;
}

export default function DetailPane({ item, agentId, onClose, onRemove }: Props) {
  const localize = useLocalize();
  const { Icon, colorClass } = getIconForItem(item);

  return (
    <aside
      className="flex w-[420px] shrink-0 flex-col border-l border-border-light bg-surface-primary p-6"
      aria-live="polite"
    >
      <header className="mb-4 flex items-start gap-3">
        <span
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
            colorClass,
          )}
          aria-hidden="true"
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-semibold text-text-primary">{item.name}</h2>
          <p className="text-xs uppercase tracking-wide text-text-tertiary">{item.kind}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex size-9 items-center justify-center rounded-xl border border-border-light text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary"
          aria-label={localize('com_ui_tools_close')}
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </header>
      <div className="flex-1 overflow-y-auto">
        <DetailBody item={item} agentId={agentId} onRemove={onRemove} />
      </div>
    </aside>
  );
}
