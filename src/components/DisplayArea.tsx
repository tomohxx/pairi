import type { Tile, HandState } from "../lib/types";
import { TileImage } from "./TileImage";
import { TileButton } from "./TileButton";

type DisplayAreaProps = {
  handState: HandState;
  onRemoveTile: (tile: Tile) => void;
  onRemoveMeld: (targetIndex: number) => void;
};

export function DisplayArea({ handState: { tiles, melds }, onRemoveTile, onRemoveMeld }: DisplayAreaProps) {
  const hasTiles = tiles.length > 0 || melds.length > 0;

  return (
    <div>
      <div className="flex items-center justify-between gap-4 pb-3">
        <h2 className="font-display text-text-primary font-semibold">手牌</h2>
      </div>

      <div className="min-h-[2rem] sm:min-h-[3rem]">
        {hasTiles ? (
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <div className="flex flex-nowrap gap-px">
              {tiles.map((tile, index) => (
                <TileButton key={index} tile={tile} onClick={onRemoveTile} size="compact" />
              ))}
            </div>

            {melds.map((meld, meldIndex) => (
              <button
                key={meldIndex}
                type="button"
                onClick={() => onRemoveMeld(meldIndex)}
                className="flex shrink-0 items-end gap-px focus-visible:ring-2 focus-visible:ring-teal-400/80 focus-visible:outline-none"
              >
                {meld.tiles.map((tile, tileIndex) => (
                  <TileImage
                    key={`${meldIndex}-${tileIndex}`}
                    tile={tile}
                    size="compact"
                    rotateLeft={meld.type !== "ankan" && tileIndex === 0}
                    faceDown={meld.type === "ankan" && (tileIndex === 0 || tileIndex === 3)}
                  />
                ))}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-text-muted bg-bg-primary border-border-primary flex min-h-[2rem] items-center justify-center rounded border border-dashed px-6 text-center text-sm leading-7 sm:min-h-[3rem]">
            手牌モードから牌を選ぶと、ここに理牌して表示されます
          </div>
        )}
      </div>
    </div>
  );
}
