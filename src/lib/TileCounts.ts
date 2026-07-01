import type { NumberTile, Suit, Tile, Meld, HandState } from "./types";
import { isNormalFive } from "./utils";

export class TileCounts {
  readonly #normalCounts: Record<Suit, number[]>;
  readonly #pairiCounts: Record<Suit, number[]>;
  readonly #tileLimitCounts: Record<Suit, number[]>;
  readonly #redCounts: Record<NumberTile, number>;
  readonly #numMelds: number;
  readonly #enableRedDora: boolean;
  readonly #threePlayer: boolean;

  constructor({ tiles, melds }: HandState, enableRedDora: boolean, threePlayer: boolean) {
    this.#normalCounts = {
      m: new Array(9).fill(0),
      p: new Array(9).fill(0),
      s: new Array(9).fill(0),
      z: new Array(7).fill(0),
    };

    this.#pairiCounts = {
      m: new Array(9).fill(0),
      p: new Array(9).fill(0),
      s: new Array(9).fill(0),
      z: new Array(7).fill(0),
    };

    this.#tileLimitCounts = {
      m: threePlayer ? new Array(9).fill(4).fill(0, 1, 8) : new Array(9).fill(4),
      p: new Array(9).fill(4),
      s: new Array(9).fill(4),
      z: new Array(7).fill(4),
    };

    this.#redCounts = { m: 0, p: 0, s: 0 };
    this.#enableRedDora = enableRedDora;
    this.#threePlayer = threePlayer;
    this.#numMelds = Math.floor(tiles.length / 3);

    tiles.forEach(({ suit, index, isRed }) => {
      !isRed && this.#normalCounts[suit][index]++;
      isRed && this.#redCounts[suit]++;
      this.#pairiCounts[suit][index]++;
    });

    melds.forEach(({ tiles }) =>
      tiles.forEach(({ suit, index, isRed }) => {
        !isRed && this.#normalCounts[suit][index]++;
        isRed && this.#redCounts[suit]++;
        this.#tileLimitCounts[suit][index]--;
      }),
    );
  }

  #getCount({ suit, index, isRed }: Tile): number {
    return isRed ? this.#redCounts[suit] : this.#normalCounts[suit][index];
  }

  createPairiArray(): Uint8Array {
    return new Uint8Array([
      ...this.#pairiCounts.m,
      ...this.#pairiCounts.p,
      ...this.#pairiCounts.s,
      ...this.#pairiCounts.z,
    ]);
  }

  createTileLimits(): Uint8Array {
    return new Uint8Array([
      ...this.#tileLimitCounts.m,
      ...this.#tileLimitCounts.p,
      ...this.#tileLimitCounts.s,
      ...this.#tileLimitCounts.z,
      0,
    ]);
  }

  getNumMelds(): number {
    return this.#numMelds;
  }

  #isUnavailableTile({ suit, index, isRed }: Tile): boolean {
    return (this.#threePlayer && suit === "m" && index >= 1 && index < 8) || (!this.#enableRedDora && !!isRed);
  }

  #getMaxCount(tile: Tile): number {
    return this.#isUnavailableTile(tile) ? 0 : tile.isRed ? 1 : this.#enableRedDora && isNormalFive(tile) ? 3 : 4;
  }

  canAddTile(tile: Tile): boolean {
    return this.#getCount(tile) < this.#getMaxCount(tile);
  }

  #canAddTileN(tile: Tile, n: number): boolean {
    return this.#getCount(tile) + n <= this.#getMaxCount(tile);
  }

  canAddMeld(meld: Meld): boolean {
    switch (meld.type) {
      case "pon":
        return meld.tiles[0].isRed
          ? this.canAddTile(meld.tiles[0]) && this.#canAddTileN(meld.tiles[1], 2)
          : this.#canAddTileN(meld.tiles[0], 3);
      case "chi":
        return meld.tiles.every((tile) => this.canAddTile(tile));
      case "ankan":
      case "minkan":
        return meld.tiles[1].isRed
          ? this.canAddTile(meld.tiles[1]) && this.#canAddTileN(meld.tiles[0], 3)
          : this.#canAddTileN(meld.tiles[0], 4);
    }
  }
}
