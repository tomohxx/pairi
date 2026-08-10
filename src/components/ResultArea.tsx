import type { ReactNode } from "react";
import { calcPairi1, calcPairi2 } from "../../wasm/pkg/wasm";
import type { Tile } from "../lib/types";
import { TileImage } from "./TileImage";

type PairiResult1 = [number, number, number[]];
type PairiResult2 = [number, [number, number, number[]][]];

type PairiRowProps = {
  discardTileId?: number;
  waitTileCount: number;
  waitTileIds: number[];
};

type ResultAreaProps = {
  pairiArray: Uint8Array;
  tileLimits: Uint8Array;
  numMelds: number;
  fourTileSevenPairs: boolean;
  pairiMode: 1 | 2;
};

const formatShanten = (shanten: number): string =>
  shanten === -1 ? "和了" : shanten === 0 ? "聴牌" : `${shanten}向聴`;

const getTileFromId = (tileId: number): Tile =>
  ({ suit: (["m", "p", "s", "z"] as const)[Math.floor(tileId / 9)], index: tileId % 9 }) as Tile;

function PairiRow({ discardTileId, waitTileCount, waitTileIds }: PairiRowProps) {
  return (
    <div
      className={
        discardTileId === undefined
          ? "grid min-w-0 grid-cols-[5rem_minmax(0,1fr)] items-center gap-2 p-2"
          : "grid min-w-0 grid-cols-[auto_5rem_minmax(0,1fr)] items-center gap-2 p-2"
      }
    >
      {discardTileId === undefined ? null : (
        <div className="shrink-0">
          <TileImage tile={getTileFromId(discardTileId)} />
        </div>
      )}

      <div className="text-text-primary text-sm font-semibold whitespace-nowrap">
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
}

export function ResultArea({ pairiArray, tileLimits, numMelds, fourTileSevenPairs, pairiMode }: ResultAreaProps) {
  let shanten: number;
  let rows: ReactNode;

  try {
    if (pairiMode === 1) {
      const result = calcPairi1(pairiArray, tileLimits, numMelds, fourTileSevenPairs, true) as PairiResult1;

      shanten = result[0];
      rows = <PairiRow waitTileCount={result[1]} waitTileIds={result[2]} />;
    } else {
      const result = calcPairi2(pairiArray, tileLimits, numMelds, fourTileSevenPairs, true) as PairiResult2;

      shanten = result[0];
      rows =
        result[1].length > 0 ? (
          <div className="space-y-2">
            {result[1].map(([discardTileId, waitTileCount, waitTileIds]) => (
              <PairiRow
                key={discardTileId}
                discardTileId={discardTileId}
                waitTileCount={waitTileCount}
                waitTileIds={waitTileIds}
              />
            ))}
          </div>
        ) : null;
    }
  } catch {
    return (
      <section className="text-text-primary flex self-start">
        <div className="text-text-primary border-border-primary flex flex-1 items-center justify-center rounded border bg-zinc-950 px-6 text-center text-sm">
          エラーが発生しました
        </div>
      </section>
    );
  }

  return (
    <section className="text-text-primary flex w-full min-w-0 flex-col self-start">
      <div className="pb-3">
        <h2 className="font-display text-text-primary font-semibold">{formatShanten(shanten)}</h2>
      </div>

      <div className="p-2">{rows}</div>
    </section>
  );
}
