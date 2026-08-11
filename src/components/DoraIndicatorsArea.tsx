import type { Tile } from "../lib/types";
import { TileButton } from "./TileButton";

type DoraIndicatorsAreaProps = {
  doraIndicators: Tile[];
  onRemoveDoraIndicator: (targetIndex: number) => void;
};

export function DoraIndicatorsArea({ doraIndicators, onRemoveDoraIndicator }: DoraIndicatorsAreaProps) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4 pb-3">
        <h2 className="font-display text-text-primary font-semibold">ドラ表示牌</h2>
      </div>

      <div className="min-h-8 sm:min-h-12">
        {doraIndicators.length > 0 ? (
          <div className="flex flex-nowrap gap-px">
            {doraIndicators.map((tile, index) => (
              <TileButton key={index} tile={tile} onClick={() => onRemoveDoraIndicator(index)} size="compact" />
            ))}
          </div>
        ) : (
          <div className="text-text-muted bg-bg-primary border-border-primary flex min-h-8 items-center justify-center rounded border border-dashed px-3 text-center text-sm leading-7 sm:min-h-12">
            ドラ表示牌モードから牌を選ぶと、ここに表示されます
          </div>
        )}
      </div>
    </div>
  );
}
