import type { RedFive, NormalFive, Tile, Meld } from "./types";

export const isRedFive = (tile: Tile): tile is RedFive => !!tile.isRed;
export const isNormalFive = (tile: Tile): tile is NormalFive => tile.suit !== "z" && tile.index === 4 && !tile.isRed;

const getNormalTile = (tile: Tile): Tile => (tile.isRed ? { ...tile, isRed: false } : tile);
const getRedTile = (tile: Tile): Tile => (isNormalFive(tile) ? { ...tile, isRed: true } : tile);
const getTileVariant = (tile: Tile, useRed = false) => (useRed ? getRedTile(tile) : getNormalTile(tile));
const getNextTile = ({ suit, index }: Tile, count: 1 | 2): Tile => ({ suit, index: index + count });
export const getSameSuitNormalFive = ({ suit }: Tile): Tile | null =>
  suit === "z" ? null : { suit, index: 4, isRed: false };
export const getSameSuitRedFive = ({ suit }: Tile): Tile | null =>
  suit === "z" ? null : { suit, index: 4, isRed: true };

export const createPonMeld = (tile: Tile): Meld => ({
  type: "pon",
  tiles: [tile, getTileVariant(tile), getTileVariant(tile)],
});

export const canCreateChiMeld = ({ suit, index }: Tile): boolean => !(suit === "z" || index === 7 || index === 8);

export const createChiMeld = (tile: Tile, useRed = false): Meld => ({
  type: "chi",
  tiles: [tile, getTileVariant(getNextTile(tile, 1), useRed), getTileVariant(getNextTile(tile, 2), useRed)],
});

export const createAnkanMeld = (tile: Tile, enableRedDora: boolean): Meld => ({
  type: "ankan",
  tiles: [...Array(4).keys()].map((index) =>
    index === 1 ? getTileVariant(tile, enableRedDora) : getTileVariant(tile),
  ),
});

export const createMinkanMeld = (tile: Tile, enableRedDora: boolean): Meld => ({
  type: "minkan",
  tiles: [...Array(4).keys()].map((index) =>
    index === 1 ? getTileVariant(tile, enableRedDora) : getTileVariant(tile),
  ),
});
