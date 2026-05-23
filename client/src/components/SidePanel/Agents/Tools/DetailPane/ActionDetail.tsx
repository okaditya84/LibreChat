import { useState } from 'react';
import type { ActionItem } from '../items/types';
import { useLocalize } from '~/hooks';
import ActionEditorPopout from '../popouts/ActionEditorPopout';

interface Props {
  item: ActionItem;
  agentId: string;
  onRemove: () => void;
}

export default function ActionDetail({ item, agentId, onRemove }: Props) {
  const localize = useLocalize();
  const [editorOpen, setEditorOpen] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-text-secondary">
        {localize(
          item.endpointCount === 1
            ? 'com_ui_tools_endpoint_count_one'
            : 'com_ui_tools_endpoint_count',
          { count: item.endpointCount },
        )}
      </p>
      <button
        type="button"
        onClick={() => setEditorOpen(true)}
        className="self-start rounded-lg border border-border-light px-3 py-1.5 text-sm text-text-primary transition-colors hover:bg-surface-secondary"
      >
        {localize('com_ui_edit')}
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="self-start rounded-lg border border-red-500/40 px-3 py-1.5 text-sm text-red-500 transition-colors hover:bg-red-500/10"
      >
        {localize('com_ui_tools_remove')}
      </button>
      <ActionEditorPopout open={editorOpen} onOpenChange={setEditorOpen} agentId={agentId} />
    </div>
  );
}
