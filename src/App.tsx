import { useState, useReducer } from "react";
import { InputTileArea } from "./components/InputTileArea";
import { DisplayArea } from "./components/DisplayArea";
import { CalculationOptions } from "./components/CalculationOptions";
import type { InputMode, Tile, Meld, HandState, Action, HistoryEntry, WindType } from "./lib/types";
import { InputModeArea } from "./components/InputModeArea";
import { ResultArea } from "./components/ResultArea";
import { TileCounts } from "./lib/TileCounts";
import { Header } from "./components/Header";
import { WinProbButton } from "./components/WinProbButton";
import { Drawer } from "./components/Drawer";
import { WinProbResultEntry } from "./components/WinProbResultEntry";
import { DoraIndicatorsArea } from "./components/DoraIndicatorsArea";
import { createWinProbRequest, execWinProbApi } from "./lib/winProbApi";

const removeTile = (tiles: Tile[], targetTile: Tile): Tile[] => {
  const targetIndex: number = tiles.findIndex(
    (tile) => tile.suit === targetTile.suit && tile.index === targetTile.index && tile.isRed === targetTile.isRed,
  );

  return targetIndex !== -1 ? tiles.toSpliced(targetIndex, 1) : [...tiles];
};

const removeMeld = (melds: Meld[], index: number): Meld[] => melds.toSpliced(index, 1);

const clear = (): HandState => ({ tiles: [], melds: [] });

const suitOrder = { m: 0, p: 1, s: 2, z: 3 } as const;

const reducer = (handState: HandState, action: Action): HandState => {
  switch (action.type) {
    case "addTile":
      return {
        ...handState,
        tiles: [...handState.tiles, { ...action.payload }].sort(
          (a, b) => suitOrder[a.suit] - suitOrder[b.suit] || a.index - b.index || +!!a.isRed - +!!b.isRed,
        ),
      };
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
const MAX_DORA_INDICATOR_COUNT = 5;

function App() {
  const [handState, dispatch] = useReducer(reducer, clear());
  const [doraIndicators, setDoraIndicators] = useState<Tile[]>([]);
  const [inputMode, setInputMode] = useState<InputMode>("hand");
  const [pendingChi, setPendingChi] = useState<Tile | null>(null);
  const [useRed, setUseRed] = useState<boolean>(true);
  const [threePlayer, setThreePlayer] = useState<boolean>(false);
  const [fourTileSevenPairs, setFourTileSevenPairs] = useState<boolean>(false);
  const [useExtra, setUseExtra] = useState<boolean>(true);
  const [riichi, setRiichi] = useState<boolean>(false);
  const [seatWind, setSeatWind] = useState<WindType>("east");
  const [roundWind, setRoundWind] = useState<WindType>("east");
  const [tMax, setTMax] = useState<number>(18);
  const [numNukidora, setNumNukidora] = useState<number>(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [nextHistoryEntryId, setNextHistoryEntryId] = useState<number>(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const tileCounts = new TileCounts(handState, doraIndicators, useRed, threePlayer, numNukidora);
  const maxNumNukidora = 4 - tileCounts.getNumNorthTiles();
  const tileSlot = Math.max(MAX_TILE_COUNT - handState.melds.length * 3 - handState.tiles.length, 0);
  const meldSlot = Math.max(MAX_MELD_COUNT - Math.floor(handState.tiles.length / 3) - handState.melds.length, 0);
  const hasDoraIndicatorSlot = doraIndicators.length < MAX_DORA_INDICATOR_COUNT;
  const canClear = handState.tiles.length > 0 || handState.melds.length > 0 || doraIndicators.length > 0;
  const remainder = handState.tiles.length % 3;
  const pairiMode: null | 1 | 2 = remainder === 0 ? null : remainder === 1 ? 1 : 2;
  const hasPendingHistoryEntry = history.some((entry) => entry.status === "pending");
  const canCalcExpectation =
    handState.tiles.length + handState.melds.length * 3 === MAX_TILE_COUNT && !hasPendingHistoryEntry;

  const clearHandState = (): void => {
    dispatch({ type: "clear" });
    setDoraIndicators([]);
    setInputMode("hand");
    setPendingChi(null);
  };

  const changeInputMode = (newInputMode: InputMode): void => {
    setInputMode(newInputMode);
    setPendingChi(null);
  };

  const calcExpectation = (): void => {
    if (!canCalcExpectation) {
      return;
    }

    const request = createWinProbRequest(
      handState,
      seatWind,
      roundWind,
      doraIndicators,
      riichi,
      tMax,
      useRed,
      useExtra,
      threePlayer,
      threePlayer ? numNukidora : undefined,
    );
    const id = nextHistoryEntryId;
    const createdAt = new Date().toISOString();

    setNextHistoryEntryId((prev) => prev + 1);
    setHistory((prev) => [
      ...prev,
      {
        id,
        handState,
        seatWind: request.seatWind,
        roundWind: request.roundWind,
        doraIndicators: [...doraIndicators],
        riichi,
        tMax: request.tMax,
        useRed: request.useRed,
        useExtra: request.useExtra,
        threePlayer,
        numNukidora: request.numNukidora,
        status: "pending",
        createdAt,
      },
    ]);
    setIsDrawerOpen(true);

    void (async () => {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(
        () => {
          controller.abort();
        },
        Number(import.meta.env.VITE_REQUEST_TIMEOUT),
      );

      try {
        const result = await execWinProbApi(request, controller.signal);
        const completedAt = new Date().toISOString();

        setHistory((prev) =>
          prev.map((entry) => (entry.id === id ? { ...entry, status: "success", completedAt, result } : entry)),
        );
      } catch {
        const completedAt = new Date().toISOString();

        setHistory((prev) =>
          prev.map((entry) => (entry.id === id ? { ...entry, status: "error", completedAt } : entry)),
        );
      } finally {
        window.clearTimeout(timeoutId);
      }
    })();
  };

  return (
    <>
      <Header title="牌理・牌効率計算ツール" onHistoryOpen={() => setIsDrawerOpen(true)} />
      <main className="mx-auto flex min-h-[calc(100svh-3.5rem)] w-full max-w-380 min-w-0 items-stretch px-4 py-6 lg:px-8">
        <section className="grid min-h-0 w-full min-w-0 gap-6 lg:grid-cols-[max-content_minmax(24rem,1fr)]">
          <div className="flex min-h-0 min-w-0 flex-col gap-4">
            <CalculationOptions
              useRed={useRed}
              threePlayer={threePlayer}
              fourTileSevenPairs={fourTileSevenPairs}
              useExtra={useExtra}
              riichi={riichi}
              seatWind={seatWind}
              roundWind={roundWind}
              tMax={tMax}
              numNukidora={numNukidora}
              maxNumNukidora={maxNumNukidora}
              onRedDoraChange={() => {
                setUseRed(!useRed);
                clearHandState();
              }}
              onThreePlayerChange={(enabled) => {
                setThreePlayer(enabled);
                if (!enabled) {
                  setNumNukidora(0);
                }
                clearHandState();
              }}
              onFourTileSevenPairsChange={() => {
                setFourTileSevenPairs(!fourTileSevenPairs);
              }}
              onUseExtraChange={() => {
                setUseExtra(!useExtra);
              }}
              onRiichiChange={setRiichi}
              onSeatWindChange={setSeatWind}
              onRoundWindChange={setRoundWind}
              onTMaxChange={setTMax}
              onNumNukidoraChange={setNumNukidora}
            />

            <DoraIndicatorsArea
              doraIndicators={doraIndicators}
              onRemoveDoraIndicator={(targetIndex) => {
                setDoraIndicators((prev) => prev.toSpliced(targetIndex, 1));
              }}
            />

            <DisplayArea
              handState={handState}
              onRemoveTile={(tile) => {
                dispatch({ type: "removeTile", payload: tile });
              }}
              onRemoveMeld={(targetIndex) => {
                dispatch({ type: "removeMeld", payload: targetIndex });
              }}
            />

            <div className="text-text-primary flex min-h-0 flex-col">
              <div className="shrink-0 pb-3">
                <h2 className="font-display text-text-primary font-semibold">牌入力</h2>
              </div>

              <InputModeArea
                currentInputMode={inputMode}
                threePlayer={threePlayer}
                hasTileSlot={tileSlot > 0}
                hasDoraIndicatorSlot={hasDoraIndicatorSlot}
                hasMeldSlot={meldSlot > 0}
                canClear={canClear}
                onInputModeChange={changeInputMode}
                onClear={clearHandState}
              />

              <InputTileArea
                currentInputMode={inputMode}
                pendingChi={pendingChi}
                useRed={useRed}
                canAddTile={(tile) => tile !== null && tileSlot > 0 && tileCounts.canAddTile(tile)}
                canAddDoraIndicator={(tile) => hasDoraIndicatorSlot && tileCounts.canAddTile(tile)}
                canAddMeld={(meld) => meldSlot > 0 && tileCounts.canAddMeld(meld)}
                onPendingChiChange={setPendingChi}
                onAddTile={(tile) => dispatch({ type: "addTile", payload: tile })}
                onAddDoraIndicator={(tile) => {
                  if (!hasDoraIndicatorSlot || !tileCounts.canAddTile(tile)) {
                    return;
                  }

                  setDoraIndicators((prev) => [...prev, { ...tile }]);
                  doraIndicators.length + 1 >= MAX_DORA_INDICATOR_COUNT && setInputMode("hand");
                }}
                onAddMeld={(meld) => {
                  dispatch({ type: "addMeld", payload: meld });
                  setPendingChi(null);
                  meldSlot <= 1 && setInputMode("hand");
                }}
              />
            </div>

            <WinProbButton disabled={!canCalcExpectation} onClick={calcExpectation} />
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

      <Drawer open={isDrawerOpen} title="履歴" onClose={() => setIsDrawerOpen(false)}>
        <div className="flex flex-col-reverse gap-5">
          {history.length > 0 ? (
            history.map((entry, index) => (
              <WinProbResultEntry key={index} entry={entry} isLatest={index === history.length - 1} />
            ))
          ) : (
            <p className="text-text-muted py-8 text-center text-sm">履歴はありません</p>
          )}
        </div>
      </Drawer>
    </>
  );
}

export default App;
