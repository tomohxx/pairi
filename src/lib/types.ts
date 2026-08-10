export type NumberTile = "m" | "p" | "s";
export type HonorTile = "z";
export type Suit = NumberTile | HonorTile;
export type MeldType = "pon" | "chi" | "ankan" | "minkan";
export type InputMode = MeldType | "hand" | "doraIndicator";

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

export type WindType = "east" | "south" | "west" | "north";

export type WinProbRequest = {
  hand: string[];
  melds: Array<{ meldType: MeldType; tiles: string[] }>;
  seatWind: WindType;
  roundWind: WindType;
  doraIndicators: string[];
  riichi: boolean;
  tMax: number;
  useRed: boolean;
  useExtra: boolean;
  threePlayer: boolean;
  numNukidora?: number;
};

export type WinProbResult = {
  tile: string;
  tenpaiProb: number[];
  winningProb: number[];
  expectedScore: number[];
};

export type WinProbResponse = {
  shanten: number;
  searched: number;
  elapsed: number;
  results: WinProbResult[];
};

export type HistoryEntry = {
  id: number;
  handState: HandState;
  seatWind: WindType;
  roundWind: WindType;
  doraIndicators: Tile[];
  riichi: boolean;
  tMax: number;
  useRed: boolean;
  useExtra: boolean;
  threePlayer: boolean;
  numNukidora?: number;
  createdAt: string;
} & (
  | {
      status: "pending";
    }
  | {
      status: "success";
      completedAt: string;
      result: WinProbResponse;
    }
  | {
      status: "error";
      completedAt: string;
    }
);
