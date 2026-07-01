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

type TileImageProps = {
  tile: Tile;
  size?: keyof typeof tileImageClassBySize;
  className?: string;
  faceDown?: boolean;
};

export function TileImage({ tile, size = "normal", className = "", faceDown = false }: TileImageProps) {
  const TileComponent = TileComponents[faceDown ? "back" : `${tile.suit}${tile.index + 1}${tile.isRed ? "r" : ""}`];

  return createElement(TileComponent, {
    "aria-hidden": "true",
    focusable: "false",
    className: `block shrink-0 overflow-hidden rounded border border-stone-300/85 w-auto ${tileImageClassBySize[size]} ${className ? className : "bg-paper-warm"}`,
  });
}
