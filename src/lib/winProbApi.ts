import type { Tile, HandState, WindType, WinProbRequest, WinProbResponse } from "./types";

const toApiTile = (tile: Tile): string => `${tile.isRed ? "r" : ""}${tile.index + 1}${tile.suit}`;

export const createWinProbRequest = (
  handState: HandState,
  seatWind: WindType,
  roundWind: WindType,
  doraIndicators: Tile[],
  riichi: boolean,
  tMax: number,
  useRed: boolean,
  useExtra: boolean,
  threePlayer: boolean,
  numNukidora?: number,
): WinProbRequest => ({
  hand: handState.tiles.map(toApiTile),
  melds: handState.melds.map((meld) => ({
    meldType: meld.type,
    tiles: meld.tiles.map(toApiTile),
  })),
  seatWind,
  roundWind,
  doraIndicators: doraIndicators.map(toApiTile),
  riichi,
  tMax,
  useRed,
  useExtra,
  threePlayer,
  numNukidora,
});

export class WinProbApiError extends Error {
  public readonly status: number;

  constructor(status: number) {
    super(`win-prob API request failed: ${status}`);
    this.name = "WinProbApiError";
    this.status = status;
  }
}

export async function execWinProbApi(request: WinProbRequest, signal: AbortSignal): Promise<WinProbResponse> {
  const response = await fetch(import.meta.env.VITE_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    signal,
  });

  if (!response.ok) {
    throw new WinProbApiError(response.status);
  }

  return response.json() as Promise<WinProbResponse>;
}
