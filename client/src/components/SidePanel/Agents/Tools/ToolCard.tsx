import { Check } from 'lucide-react';
import type { AgentItem } from './items/types';
import type { TranslationKeys } from '~/hooks/useLocalize';
import { getIconForItem } from './items/icons';
import { useLocalize } from '~/hooks';
import { cn } from '~/utils';

interface ToolCardProps {
  item: AgentItem;
  selected: boolean;
  onToggle: (item: AgentItem) => void;
}

function useDisplayStrings(item: AgentItem): { name: string; description: string } {
  const localize = useLocalize();
  if (item.kind === 'builtin') {
    return {
      name: localize(item.name as TranslationKeys),
      description: item.description ? localize(item.description as TranslationKeys) : '',
    };
  }
  return { name: item.name, description: item.description ?? '' };
}

export default function ToolCard({ item, selected, onToggle }: ToolCardProps) {
  const localize = useLocalize();
  const { Icon, colorClass } = getIconForItem(item);
  const { name, description } = useDisplayStrings(item);
  const isOfficial = item.kind === 'builtin';
  const kindLabelKey =
    item.kind === 'tool'
      ? 'com_ui_tools_kind_tools'
      : item.kind === 'skill'
        ? 'com_ui_tools_kind_skills'
        : item.kind === 'mcp'
          ? 'com_ui_tools_kind_mcp'
          : item.kind === 'action'
            ? 'com_ui_tools_kind_actions'
            : null;

  return (
    <button
      type="button"
      onClick={() => onToggle(item)}
      onMouseDown={(e) => e.preventDefault()}
      aria-pressed={selected}
      className={cn(
        'group relative flex h-32 cursor-pointer flex-col rounded-xl border p-3.5 text-left transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring-primary',
        selected
          ? 'border-green-500/70 bg-green-500/[0.06]'
          : 'border-border-light hover:border-border-medium hover:bg-surface-tertiary',
        isOfficial && !selected && 'border-emerald-500/30 bg-emerald-500/[0.02]',
      )}
    >
      <div className="flex w-full items-start gap-2.5">
        <span
          className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', colorClass)}
          aria-hidden="true"
        >
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-text-primary">{name}</p>
          {!description && kindLabelKey && (
            <p className="truncate text-xs text-text-tertiary">{localize(kindLabelKey)}</p>
          )}
        </div>
      </div>
      {description && (
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-text-secondary">
          {description}
        </p>
      )}
      <div className="mt-auto flex w-full items-center gap-1.5 pt-2">
        {isOfficial && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
            {localize('com_ui_tools_official')}
          </span>
        )}
        {item.kind === 'mcp' && item.toolCount > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-surface-tertiary px-2 py-0.5 text-[10px] text-text-tertiary">
            {localize(item.toolCount === 1 ? 'com_ui_tools_count_one' : 'com_ui_tools_count', {
              count: item.toolCount,
            })}
          </span>
        )}
        <span
          className={cn(
            'ml-auto flex size-5 shrink-0 items-center justify-center rounded-full transition-all duration-200',
            selected ? 'scale-100 bg-green-500 text-white opacity-100' : 'scale-75 opacity-0',
          )}
          aria-hidden="true"
        >
          <Check className="size-3" strokeWidth={3} />
        </span>
      </div>
    </button>
  );
}
