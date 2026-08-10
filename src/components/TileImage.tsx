import { createElement } from "react";
import type { Tile } from "../lib/types";

const svgModules = import.meta.glob<React.ComponentType<React.SVGProps<SVGSVGElement>>>("../assets/*.svg", {
  query: "?react",
  eager: true,
  import: "default",
});

const TileComponents = Object.fromEntries(
  Object.entries(svgModules).map(([path, Component]) => [path.split("/").at(-1)!.replace(".svg", ""), Component]),
) satisfies Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>>;

const tileImageClassBySize = {
  compact: "h-[2rem] sm:h-[3rem]",
  normal: "h-[2.8rem] sm:h-[4.2rem]",
};

const compactRotatedTileClass = {
  wrapper: "w-[2rem] h-[1.5rem] sm:w-[3rem] sm:h-[2.25rem]",
  offset: "top-[1.5rem] sm:top-[2.25rem]",
};

type TileImageProps = {
  tile: Tile;
  size?: keyof typeof tileImageClassBySize;
  className?: string;
  faceDown?: boolean;
  rotateLeft?: boolean;
};

export function TileImage({
  tile,
  size = "normal",
  className = "",
  faceDown = false,
  rotateLeft = false,
}: TileImageProps) {
  const imageSizeClass = rotateLeft ? tileImageClassBySize.compact : tileImageClassBySize[size];
  const backgroundClass = faceDown ? "" : "bg-zinc-200";
  const tileClassName = `block shrink-0 overflow-hidden rounded border border-zinc-200/85 w-auto ${imageSizeClass} ${className ? className : backgroundClass}`;
  const positionedTileClassName = rotateLeft
    ? `absolute left-0 origin-top-left -rotate-90 ${compactRotatedTileClass.offset} ${tileClassName}`
    : tileClassName;
  const tileElement = faceDown ? (
    <div className={`aspect-3/4 bg-zinc-950 ${positionedTileClassName}`} />
  ) : (
    createElement(TileComponents[`${tile.suit}${tile.index + 1}${tile.isRed ? "r" : ""}`], {
      focusable: "false",
      className: positionedTileClassName,
    })
  );

  if (rotateLeft) {
    return <div className={`relative shrink-0 ${compactRotatedTileClass.wrapper}`}>{tileElement}</div>;
  }

  return tileElement;
}
