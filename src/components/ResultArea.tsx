import { calcPairi } from "../../wasm/pkg/wasm";
import type { Tile } from "../lib/types";
import { TileImage } from "./TileImage";

type PairiCandidate = [number, number, number[]];
type PairiResult = [number, PairiCandidate[]];

type ResultAreaProps = {
  pairiArray: Uint8Array;
  tileLimits: Uint8Array;
  numMelds: number;
  fourTileSevenPairs: boolean;
};

const formatShanten = (shanten: number): string =>
  shanten === -1 ? "和了" : shanten === 0 ? "聴牌" : `${shanten}向聴`;

const getTileFromId = (tileId: number): Tile =>
  ({ suit: (["m", "p", "s", "z"] as const)[Math.floor(tileId / 9)], index: tileId % 9 }) as Tile;

export function ResultArea({ pairiArray, tileLimits, numMelds, fourTileSevenPairs }: ResultAreaProps) {
  try {
    const [shanten, candidates] = calcPairi(pairiArray, tileLimits, numMelds, fourTileSevenPairs, true) as PairiResult;

    return (
      <section className="flex w-full min-w-0 flex-col self-start text-zinc-100 lg:max-h-full lg:min-h-0 lg:overflow-y-auto">
        <div className="pb-3">
          <h2 className="font-display text-xl font-semibold text-zinc-50">{formatShanten(shanten)}</h2>
        </div>

        <div className="p-2">
          {candidates.length > 0 ? (
            <div className="space-y-2">
              {candidates.map(([discardTileId, waitTileCount, waitTileIds]) => {
                const discardTile = getTileFromId(discardTileId);

                return (
                  <div
                    key={discardTileId}
                    className="grid min-w-0 grid-cols-[auto_5rem_minmax(0,1fr)] items-center gap-2 p-2"
                  >
                    <div className="shrink-0">
                      <TileImage tile={discardTile} />
                    </div>

                    <div className="text-sm font-semibold whitespace-nowrap text-zinc-200">
                      {waitTileIds.length}種{waitTileCount}枚
                    </div>

                    <div className="min-w-0 overflow-hidden">
                      <div className="flex flex-wrap gap-x-px gap-y-1">
                        {waitTileIds.map((waitTileId) => (
                          <TileImage key={waitTileId} tile={getTileFromId(waitTileId)} size="compact" />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>
    );
  } catch {
    return (
      <section className="flex self-start text-zinc-100">
        <div className="flex flex-1 items-center justify-center rounded-md border border-zinc-700 bg-zinc-950 px-6 text-center text-sm text-zinc-300">
          エラーが発生しました
        </div>
      </section>
    );
  }
}
