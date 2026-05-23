import { useState } from 'react';
import type { ToolItem } from '../items/types';
import { useLocalize } from '~/hooks';
import PluginAuthPopout from '../popouts/PluginAuthPopout';

interface Props {
  item: ToolItem;
  onRemove: () => void;
}

export default function ToolDetail({ item, onRemove }: Props) {
  const localize = useLocalize();
  const [authOpen, setAuthOpen] = useState(false);
  const needsAuth =
    Array.isArray(item.plugin.authConfig) &&
    item.plugin.authConfig.length > 0 &&
    item.plugin.authenticated !== true;
  return (
    <div className="flex flex-col gap-4">
      {item.description && <p className="text-sm text-text-secondary">{item.description}</p>}
      {needsAuth && (
        <button
          type="button"
          onClick={() => setAuthOpen(true)}
          className="self-start rounded-lg border border-border-light px-3 py-1.5 text-sm text-text-primary transition-colors hover:bg-surface-secondary"
        >
          {localize('com_ui_configure')}
        </button>
      )}
      <button
        type="button"
        onClick={onRemove}
        className="self-start rounded-lg border border-red-500/40 px-3 py-1.5 text-sm text-red-500 transition-colors hover:bg-red-500/10"
      >
        {localize('com_ui_tools_remove')}
      </button>
      <PluginAuthPopout
        open={authOpen}
        onOpenChange={setAuthOpen}
        plugin={item.plugin}
        onSubmit={() => setAuthOpen(false)}
      />
    </div>
  );
}
