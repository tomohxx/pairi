import type { Tile, HandState } from "../lib/types";
import { TileImage } from "./TileImage";
import { TileButton } from "./TileButton";

const suitOrder = { m: 0, p: 1, s: 2, z: 3 } as const;

type DisplayAreaProps = {
  handState: HandState;
  onRemoveTile: (tile: Tile) => void;
  onRemoveMeld: (targetIndex: number) => void;
};

export function DisplayArea({ handState: { tiles, melds }, onRemoveTile, onRemoveMeld }: DisplayAreaProps) {
  const hasTiles = tiles.length > 0 || melds.length > 0;

  const sortedTiles = tiles.toSorted(
    (a, b) => suitOrder[a.suit] - suitOrder[b.suit] || a.index - b.index || +!!a.isRed - +!!b.isRed,
  );

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-xl font-semibold text-zinc-50">手牌</h2>
      </div>

      <div className="mt-4 min-h-[3.6rem]">
        {hasTiles ? (
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <div className="flex flex-nowrap gap-px">
              {sortedTiles.map((tile, index) => (
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
          <div className="flex min-h-[3.6rem] items-center justify-center rounded-md border border-dashed border-zinc-700 bg-zinc-900 px-6 text-center text-sm leading-7 text-zinc-400">
            入力エリアから牌を選ぶと、ここに理牌して表示されます
          </div>
        )}
      </div>
    </div>
  );
}
