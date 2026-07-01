export type NumberTile = "m" | "p" | "s";
export type HonorTile = "z";
export type Suit = NumberTile | HonorTile;
export type MeldType = "pon" | "chi" | "ankan" | "minkan";
export type InputMode = MeldType | "hand";

export type NormalFive = {
  suit: NumberTile;
  index: 4;
  isRed?: false;
};

export type RedFive = {
  suit: NumberTile;
  index: 4;
  isRed: true;
};

export type Tile =
  | {
      suit: Suit;
      index: number;
      isRed?: false;
    }
  | RedFive;

export type Meld = {
  type: MeldType;
  tiles: Tile[];
};

export type HandState = {
  tiles: Tile[];
  melds: Meld[];
};

export type Action =
  | { type: "addTile"; payload: Tile }
  | { type: "addMeld"; payload: Meld }
  | { type: "removeTile"; payload: Tile }
  | { type: "removeMeld"; payload: number }
  | { type: "clear" };
