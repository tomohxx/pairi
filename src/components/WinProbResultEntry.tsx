import { ClipLoader } from "react-spinners";
import { useState } from "react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { HiChevronDown, HiChevronUp, HiChevronUpDown } from "react-icons/hi2";
import type { Tile, HistoryEntry, WindType, WinProbResult } from "../lib/types";
import { TileImage } from "./TileImage";

const windLabels: Record<WindType, string> = {
  east: "東",
  south: "南",
  west: "西",
  north: "北",
};

type SnapshotProps = {
  entry: HistoryEntry;
};

function Snapshot({ entry }: SnapshotProps) {
  const settings = [
    `赤ドラ: ${entry.useRed ? "有効" : "無効"}`,
    `三人麻雀: ${entry.threePlayer ? "有効" : "無効"}`,
    `向聴戻し・手変わり: ${entry.useExtra ? "有効" : "無効"}`,
    `立直: ${entry.riichi ? "有効" : "無効"}`,
    `${windLabels[entry.seatWind]}家`,
    `${windLabels[entry.roundWind]}場`,
  ].join("、");

  return (
    <div className="space-y-3">
      <div>
        <p className="text-text-muted mb-1 text-xs font-semibold">設定</p>
        <p className="text-text-primary text-sm">{settings}</p>
      </div>

      {entry.doraIndicators.length > 0 ? (
        <div>
          <p className="text-text-muted mb-1 text-xs font-semibold">ドラ表示牌</p>
          <div className="flex flex-nowrap gap-px">
            {entry.doraIndicators.map((tile, index) => (
              <TileImage key={index} tile={tile} size="compact" />
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <p className="text-text-muted mb-1 text-xs font-semibold">手牌</p>
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex flex-nowrap gap-px">
            {entry.handState.tiles.map((tile, index) => (
              <TileImage key={index} tile={tile} size="compact" />
            ))}
          </div>

          {entry.handState.melds.map((meld, meldIndex) => (
            <div key={meldIndex} className="flex shrink-0 items-end gap-px">
              {meld.tiles.map((tile, tileIndex) => (
                <TileImage
                  key={`${meldIndex}-${tileIndex}`}
                  tile={tile}
                  size="compact"
                  rotateLeft={meld.type !== "ankan" && tileIndex === 0}
                  faceDown={meld.type === "ankan" && (tileIndex === 0 || tileIndex === 3)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const fromApiTile = (tile: string): Tile => {
  return (
    tile[0] === "r"
      ? { suit: tile[2], index: 4, isRed: true }
      : { suit: tile[1], index: Number(tile[0]) - 1, isRed: false }
  ) as Tile;
};

const formatProb = (prob: number): string => (prob * 100).toFixed(1);
const formatScore = (score: number): string => score.toFixed(1);
const formatShanten = (shanten: number): string =>
  shanten === -1 ? "和了" : shanten === 0 ? "聴牌" : `${shanten}向聴`;
const formatElapsed = (microseconds: number): string => (microseconds / 1000).toFixed(1);

type SortColumn = "tile" | "tenpaiProb" | "winningProb" | "expectedScore";
type SortDirection = "ascending" | "descending";
type SortState = { column: SortColumn; direction: SortDirection } | null;

const suitOrder = { m: 0, p: 1, s: 2, z: 3 } as const;

const compareTiles = (left: string, right: string): number => {
  const leftTile = fromApiTile(left);
  const rightTile = fromApiTile(right);

  return (
    suitOrder[leftTile.suit] - suitOrder[rightTile.suit] ||
    leftTile.index - rightTile.index ||
    +!!leftTile.isRed - +!!rightTile.isRed
  );
};

const compareResults = (left: WinProbResult, right: WinProbResult, column: SortColumn, turn: number): number => {
  switch (column) {
    case "tile":
      return compareTiles(left.tile, right.tile);
    case "tenpaiProb":
      return left.tenpaiProb[turn] - right.tenpaiProb[turn];
    case "winningProb":
      return left.winningProb[turn] - right.winningProb[turn];
    case "expectedScore":
      return left.expectedScore[turn] - right.expectedScore[turn];
  }
};

type SortableHeaderProps = {
  column: SortColumn;
  label: string;
  numeric?: boolean;
  sortState: SortState;
  onSort: (column: SortColumn) => void;
};

function SortableHeader({ column, label, numeric = false, sortState, onSort }: SortableHeaderProps) {
  const direction = sortState?.column === column ? sortState.direction : null;
  const SortIcon =
    direction === "ascending" ? HiChevronUp : direction === "descending" ? HiChevronDown : HiChevronUpDown;

  return (
    <th className={`px-2 py-2 ${numeric ? "text-right" : "text-left"}`} aria-sort={direction ?? "none"}>
      <button
        type="button"
        onClick={() => onSort(column)}
        className={`hover:text-text-primary inline-flex items-center gap-1 rounded-sm focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none ${
          direction ? "text-teal-400" : "text-text-muted"
        }`}
      >
        <span>{label}</span>
        <SortIcon aria-hidden="true" className="size-4 shrink-0" />
      </button>
    </th>
  );
}

type ResultTableProps = {
  entry: Extract<HistoryEntry, { status: "success" }>;
  open: boolean;
};

function ResultTable({ entry, open }: ResultTableProps) {
  const [turn, setTurn] = useState(Math.min(1, entry.tMax));
  const [sortState, setSortState] = useState<SortState>(null);

  const handleSort = (column: SortColumn) => {
    setSortState((current) => ({
      column,
      direction: current?.column === column && current.direction === "ascending" ? "descending" : "ascending",
    }));
  };

  const sortedResults = sortState
    ? entry.result.results
        .map((result, index) => ({ result, index }))
        .sort((left, right) => {
          const comparison = compareResults(left.result, right.result, sortState.column, turn);
          return (sortState.direction === "ascending" ? comparison : -comparison) || left.index - right.index;
        })
        .map(({ result }) => result)
    : entry.result.results;

  return (
    <details open={open} className="group">
      <summary className="text-text-primary cursor-pointer text-sm font-semibold marker:text-teal-400 focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none">
        計算結果
      </summary>

      <div className="mt-3 space-y-3">
        <div className="text-text-primary flex items-center justify-between gap-3 text-sm">
          <span>向聴数</span>
          <span>{formatShanten(entry.result.shanten)}</span>
        </div>

        <div className="text-text-primary flex items-center justify-between gap-3 text-sm">
          <span>探索手牌数</span>
          <span>{entry.result.searched}</span>
        </div>

        <div className="text-text-primary flex items-center justify-between gap-3 text-sm">
          <span>処理時間</span>
          <span>{formatElapsed(entry.result.elapsed)} ms</span>
        </div>

        <div className="text-text-primary flex items-center justify-between gap-3 text-sm">
          <span>現在巡目/最終巡目</span>
          <div className="flex items-center gap-1">
            <Listbox value={turn} onChange={setTurn}>
              <div className="relative">
                <ListboxButton className="text-text-primary hover:text-text-primary bg-bg-primary hover:bg-bg-hover border-border-primary relative flex h-7 w-24 items-center justify-center rounded border px-2 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none">
                  <span>{turn}巡目</span>
                  <HiChevronUpDown aria-hidden="true" className="text-text-muted absolute right-1 size-4" />
                </ListboxButton>
                <ListboxOptions className="bg-bg-primary border-border-primary absolute right-0 z-20 mt-1 max-h-52 w-full overflow-y-auto rounded border py-1 shadow-xl focus:outline-none">
                  {Array.from({ length: entry.tMax + 1 }, (_, value) => (
                    <ListboxOption
                      key={value}
                      value={value}
                      className="text-text-primary hover:text-text-primary hover:bg-bg-hover cursor-pointer px-2 py-1 text-center text-sm font-semibold transition-colors focus:bg-teal-400 focus:text-zinc-950 focus:hover:bg-teal-400 focus:hover:text-zinc-950 data-selected:bg-teal-400 data-selected:text-zinc-950 data-selected:hover:bg-teal-400 data-selected:hover:text-zinc-950"
                    >
                      {value}巡目
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            </Listbox>
            <span>/{entry.tMax}巡目</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-130 text-sm">
          <thead className="text-text-muted border-border-primary border-b text-left text-xs font-medium">
            <tr>
              <SortableHeader column="tile" label="打牌候補" sortState={sortState} onSort={handleSort} />
              <SortableHeader
                column="tenpaiProb"
                label="聴牌率 (%)"
                numeric
                sortState={sortState}
                onSort={handleSort}
              />
              <SortableHeader
                column="winningProb"
                label="和了率 (%)"
                numeric
                sortState={sortState}
                onSort={handleSort}
              />
              <SortableHeader
                column="expectedScore"
                label="点数期待値 (点)"
                numeric
                sortState={sortState}
                onSort={handleSort}
              />
            </tr>
          </thead>
          <tbody>
            {sortedResults.map((result) => (
              <tr key={result.tile} className="text-text-primary border-border-muted border-b">
                <td className="px-2 py-2">
                  <TileImage tile={fromApiTile(result.tile)} size="compact" />
                </td>
                <td className="px-2 py-2 text-right tabular-nums">{formatProb(result.tenpaiProb[turn])}</td>
                <td className="px-2 py-2 text-right tabular-nums">{formatProb(result.winningProb[turn])}</td>
                <td className="px-2 py-2 text-right tabular-nums">{formatScore(result.expectedScore[turn])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

type WinProbResultEntryProps = {
  entry: HistoryEntry;
  isLatest: boolean;
};

export function WinProbResultEntry({ entry, isLatest }: WinProbResultEntryProps) {
  return (
    <article className="border-border-muted space-y-4 border-b pb-5 last:border-b-0 last:pb-0">
      <Snapshot entry={entry} />

      {entry.status === "pending" ? (
        <div className="text-text-primary flex min-h-36 flex-col items-center justify-center gap-3 text-sm">
          <ClipLoader color="#2dd4bf" size={28} />
          <p>計算中...</p>
        </div>
      ) : null}

      {entry.status === "error" ? (
        <p className="text-sm text-rose-300">{entry.errorType === "timeout" ? "タイムアウト" : "エラー"}</p>
      ) : null}

      {entry.status === "success" ? <ResultTable entry={entry} open={isLatest} /> : null}
    </article>
  );
}
