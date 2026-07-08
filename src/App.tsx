import { useState, useReducer } from "react";
import { InputTileArea } from "./components/InputTileArea";
import { DisplayArea } from "./components/DisplayArea";
import { CalculationOptions } from "./components/CalculationOptions";
import type { InputMode, Tile, Meld, HandState, Action } from "./lib/types";
import { InputModeArea } from "./components/InputModeArea";
import { ResultArea } from "./components/ResultArea";
import { TileCounts } from "./lib/TileCounts";

const removeTile = (tiles: Tile[], targetTile: Tile): Tile[] => {
  const targetIndex: number = tiles.findIndex(
    (tile) => tile.suit === targetTile.suit && tile.index === targetTile.index && tile.isRed === targetTile.isRed,
  );

  return targetIndex !== -1 ? tiles.toSpliced(targetIndex, 1) : [...tiles];
};

const removeMeld = (melds: Meld[], index: number): Meld[] => melds.toSpliced(index, 1);

const clear = (): HandState => ({ tiles: [], melds: [] });

const reducer = (handState: HandState, action: Action): HandState => {
  switch (action.type) {
    case "addTile":
      return { ...handState, tiles: [...handState.tiles, { ...action.payload }] };
    case "addMeld":
      return { ...handState, melds: [...handState.melds, { ...action.payload }] };
    case "removeTile":
      return {
        ...handState,
        tiles: removeTile(handState.tiles, action.payload),
      };
    case "removeMeld":
      return {
        ...handState,
        melds: removeMeld(handState.melds, action.payload),
      };
    case "clear":
      return clear();
  }
};

const MAX_TILE_COUNT = 14;
const MAX_MELD_COUNT = 4;

function App() {
  const [handState, dispatch] = useReducer(reducer, clear());
  const [inputMode, setInputMode] = useState<InputMode>("hand");
  const [pendingChi, setPendingChi] = useState<Tile | null>(null);
  const [enableRedDora, setenableRedDora] = useState<boolean>(true);
  const [threePlayer, setThreePlayer] = useState<boolean>(false);
  const [fourTileSevenPairs, setFourTileSevenPairs] = useState<boolean>(false);

  const tileCounts = new TileCounts(handState, enableRedDora, threePlayer);
  const tileSlot = Math.max(MAX_TILE_COUNT - handState.melds.length * 3 - handState.tiles.length, 0);
  const meldSlot = Math.max(MAX_MELD_COUNT - Math.floor(handState.tiles.length / 3) - handState.melds.length, 0);
  const canClear = handState.tiles.length > 0 || handState.melds.length > 0;
  const remainder = handState.tiles.length % 3;
  const pairiMode: null | 1 | 2 = remainder === 0 ? null : remainder === 1 ? 1 : 2;
  const showResultArea = pairiMode !== null;

  const clearHandState = (): void => {
    dispatch({ type: "clear" });
    setInputMode("hand");
    setPendingChi(null);
  };

  const changeInputMode = (newInputMode: InputMode): void => {
    setInputMode(newInputMode);
    setPendingChi(null);
  };

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-380 min-w-0 items-stretch px-4 py-6 lg:px-8">
      <section
        className={`grid min-h-0 w-full min-w-0 gap-6 lg:grid-cols-[max-content_minmax(24rem,1fr)] ${showResultArea ? "lg:h-[calc(100svh-3rem)]" : ""}`}
      >
        <div className={`flex min-h-0 min-w-0 flex-col gap-4 ${showResultArea ? "lg:h-full" : ""}`}>
          <DisplayArea
            handState={handState}
            onRemoveTile={(tile) => {
              dispatch({ type: "removeTile", payload: tile });
            }}
            onRemoveMeld={(targetIndex) => {
              dispatch({ type: "removeMeld", payload: targetIndex });
            }}
          />

          <CalculationOptions
            enableRedDora={enableRedDora}
            threePlayer={threePlayer}
            fourTileSevenPairs={fourTileSevenPairs}
            onRedDoraChange={() => {
              setenableRedDora(!enableRedDora);
              clearHandState();
            }}
            onThreePlayerChange={() => {
              setThreePlayer(!threePlayer);
              clearHandState();
            }}
            onFourTileSevenPairsChange={() => {
              setFourTileSevenPairs(!fourTileSevenPairs);
            }}
          />

          <div className="flex min-h-0 flex-col text-zinc-100">
            <div className="shrink-0 pb-3">
              <h2 className="font-display text-xl font-semibold text-zinc-50">入力</h2>
            </div>

            <InputModeArea
              currentInputMode={inputMode}
              threePlayer={threePlayer}
              hasTileSlot={tileSlot > 0}
              hasMeldSlot={meldSlot > 0}
              canClear={canClear}
              onInputModeChange={changeInputMode}
              onClear={clearHandState}
            />

            <InputTileArea
              currentInputMode={inputMode}
              pendingChi={pendingChi}
              enableRedDora={enableRedDora}
              canAddTile={(tile) => tile !== null && tileSlot > 0 && tileCounts.canAddTile(tile)}
              canAddMeld={(meld) => meldSlot > 0 && tileCounts.canAddMeld(meld)}
              onPendingChiChange={setPendingChi}
              onAddTile={(tile) => dispatch({ type: "addTile", payload: tile })}
              onAddMeld={(meld) => {
                dispatch({ type: "addMeld", payload: meld });
                setPendingChi(null);
                meldSlot <= 1 && setInputMode("hand");
              }}
            />
          </div>
        </div>

        {pairiMode ? (
          <ResultArea
            pairiArray={tileCounts.createPairiArray()}
            tileLimits={tileCounts.createTileLimits()}
            numMelds={tileCounts.getNumMelds()}
            fourTileSevenPairs={fourTileSevenPairs}
            pairiMode={pairiMode}
          />
        ) : null}
      </section>
    </main>
  );
}

export default App;
