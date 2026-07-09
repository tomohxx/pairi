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
  const TileComponent = TileComponents[faceDown ? "back" : `${tile.suit}${tile.index + 1}${tile.isRed ? "r" : ""}`];
  const imageSizeClass = rotateLeft ? tileImageClassBySize.compact : tileImageClassBySize[size];
  const tileClassName = `block shrink-0 overflow-hidden rounded border border-stone-300/85 w-auto ${imageSizeClass} ${className ? className : "bg-paper-warm"}`;

  if (rotateLeft) {
    return (
      <div className={`relative shrink-0 ${compactRotatedTileClass.wrapper}`}>
        {createElement(TileComponent, {
          "aria-hidden": "true",
          focusable: "false",
          className: `absolute left-0 origin-top-left -rotate-90 ${compactRotatedTileClass.offset} ${tileClassName}`,
        })}
      </div>
    );
  }

  return createElement(TileComponent, {
    "aria-hidden": "true",
    focusable: "false",
    className: tileClassName,
  });
}
