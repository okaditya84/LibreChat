import { X } from 'lucide-react';
import { OGDialog, OGDialogContent } from '@librechat/client';
import type { AgentItem } from '../items/types';
import type { TranslationKeys } from '~/hooks/useLocalize';
import BuiltinDetail from './BuiltinDetail';
import SkillDetail from './SkillDetail';
import ToolDetail from './ToolDetail';
import McpDetail from './McpDetail';
import ActionDetail from './ActionDetail';
import { getIconForItem } from '../items/icons';
import { useLocalize } from '~/hooks';
import { cn } from '~/utils';

interface Props {
  item: AgentItem | null;
  agentId: string;
  onClose: () => void;
  onRemove: (item: AgentItem) => void;
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

const KIND_LABEL_KEYS: Record<AgentItem['kind'], TranslationKeys> = {
  builtin: 'com_ui_tools_kind_official',
  tool: 'com_ui_tools_kind_tools',
  skill: 'com_ui_tools_kind_skills',
  mcp: 'com_ui_tools_kind_mcp',
  action: 'com_ui_tools_kind_actions',
};

export default function DetailPane({ item, agentId, onClose, onRemove }: Props) {
  const localize = useLocalize();
  const open = item !== null;
  const Icon = item ? getIconForItem(item).Icon : null;
  const colorClass = item ? getIconForItem(item).colorClass : '';
  const displayName = item
    ? item.kind === 'builtin'
      ? localize(item.name as TranslationKeys)
      : item.name
    : '';

  return (
    <OGDialog open={open} onOpenChange={(next) => !next && onClose()}>
      <OGDialogContent
        className="w-11/12 max-w-[520px] overflow-hidden rounded-2xl border-border-medium p-0 shadow-xl md:max-h-[85vh]"
        showCloseButton={false}
      >
        {item && (
          <div className="flex max-h-[80vh] flex-col">
            <header className="flex items-start gap-3 border-b border-border-light px-6 py-4">
              {Icon && (
                <span
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                    colorClass,
                  )}
                  aria-hidden="true"
                >
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-base font-semibold text-text-primary">
                  {displayName}
                </h2>
                <p className="text-xs uppercase tracking-wide text-text-tertiary">
                  {localize(KIND_LABEL_KEYS[item.kind])}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border-light text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary"
                aria-label={localize('com_ui_tools_close')}
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto px-6 py-5" aria-live="polite">
              <DetailBody item={item} agentId={agentId} onRemove={() => onRemove(item)} />
            </div>
          </div>
        )}
      </OGDialogContent>
    </OGDialog>
  );
}
