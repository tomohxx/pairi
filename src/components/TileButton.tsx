import type { Tile } from "../lib/types";
import { TileImage } from "./TileImage";

const tileButtonClass = {
  default: "",
  pending: "bg-teal-400/80",
  disabled: "border-slate-400/55 bg-slate-200/60 opacity-40 grayscale-[0.6]",
} as const;

type TileButtonProps = {
  tile: Tile;
  onClick: (tile: Tile) => void;
  appearance?: keyof typeof tileButtonClass;
  size?: "normal" | "compact";
  faceDown?: boolean;
};

export function TileButton({
  tile,
  onClick,
  appearance = "default",
  size = "normal",
  faceDown = false,
}: TileButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(tile)}
      disabled={appearance !== "default"}
      className="focus-visible:ring-offset-table-felt-dark rounded bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-teal-400/80 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed"
    >
      <TileImage tile={tile} size={size} className={tileButtonClass[appearance]} faceDown={faceDown} />
    </button>
  );
}
