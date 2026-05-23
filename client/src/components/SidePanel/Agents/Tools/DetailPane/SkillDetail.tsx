import type { SkillItem } from '../items/types';
import { useLocalize } from '~/hooks';

interface Props {
  item: SkillItem;
  onRemove: () => void;
}

export default function SkillDetail({ item, onRemove }: Props) {
  const localize = useLocalize();
  return (
    <div className="flex flex-col gap-4">
      {item.description && <p className="text-sm text-text-secondary">{item.description}</p>}
      <button
        type="button"
        onClick={onRemove}
        className="self-start rounded-lg border border-red-500/40 px-3 py-1.5 text-sm text-red-500 transition-colors hover:bg-red-500/10"
      >
        {localize('com_ui_tools_remove')}
      </button>
    </div>
  );
}
