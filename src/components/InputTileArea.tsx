import type { NumberTile, InputMode, Tile, Meld } from "../lib/types";
import { TileButton } from "./TileButton";
import {
  isRedFive,
  getSameSuitNormalFive,
  getSameSuitRedFive,
  createPonMeld,
  canCreateChiMeld,
  createChiMeld,
  createAnkanMeld,
  createMinkanMeld,
} from "../lib/utils";

const createSuitRow = (suit: NumberTile): Tile[] => [
  ...Array.from({ length: 9 }, (_, index): Tile => ({ suit, index })).toSpliced(5, 0, {
    suit,
    index: 4,
    isRed: true,
  }),
];

const createHonorRow = (): Tile[] => Array.from({ length: 7 }, (_, index) => ({ suit: "z", index }));

const inputTileRows = [createSuitRow("m"), createSuitRow("p"), createSuitRow("s"), createHonorRow()];

type InputTileAreaProps = {
  currentInputMode: InputMode;
  pendingChi: Tile | null;
  useRed: boolean;
  canAddTile: (tile: Tile | null) => boolean;
  canAddDoraIndicator: (tile: Tile) => boolean;
  canAddMeld: (meld: Meld) => boolean;
  onPendingChiChange: (tile: Tile | null) => void;
  onAddTile: (tile: Tile) => void;
  onAddDoraIndicator: (tile: Tile) => void;
  onAddMeld: (meld: Meld) => void;
};

export function InputTileArea({
  currentInputMode,
  pendingChi,
  useRed,
  canAddTile,
  canAddDoraIndicator,
  canAddMeld,
  onPendingChiChange,
  onAddTile,
  onAddDoraIndicator,
  onAddMeld,
}: InputTileAreaProps) {
  const createRedTileOption = (tile: Tile): boolean =>
    tile.suit !== "z" &&
    (tile.index === 2 || tile.index === 3) &&
    canAddTile(getSameSuitRedFive(tile)) &&
    canAddTile(getSameSuitNormalFive(tile));

  const isEnabled = (tile: Tile): boolean => {
    switch (currentInputMode) {
      case "hand":
        return canAddTile(tile);
      case "doraIndicator":
        return canAddDoraIndicator(tile);
      case "pon":
        return canAddMeld(createPonMeld(tile));
      case "chi": {
        if (pendingChi) {
          return canAddTile(tile) && tile.suit === pendingChi.suit && tile.index === 4;
        }

        if (!canCreateChiMeld(tile)) {
          return false;
        }

        if (createRedTileOption(tile) && canAddMeld(createChiMeld(tile, true))) {
          return true;
        }

        return canAddMeld(createChiMeld(tile)) || canAddMeld(createChiMeld(tile, true));
      }
      case "ankan":
        return canAddTile(tile) && canAddMeld(createAnkanMeld(tile, useRed));
      case "minkan":
        return canAddTile(tile) && canAddMeld(createMinkanMeld(tile, useRed));
    }
  };

  const onClick = (tile: Tile): void => {
    switch (currentInputMode) {
      case "hand":
        return onAddTile(tile);
      case "doraIndicator":
        return onAddDoraIndicator(tile);
      case "pon":
        return onAddMeld(createPonMeld(tile));
      case "chi": {
        if (pendingChi) {
          onAddMeld(createChiMeld(pendingChi, isRedFive(tile)));

          return onPendingChiChange(null);
        }

        if (createRedTileOption(tile)) {
          return onPendingChiChange(tile);
        }

        return onAddMeld(createChiMeld(tile, canAddTile(getSameSuitRedFive(tile))));
      }
      case "ankan":
        return onAddMeld(createAnkanMeld(tile, useRed));
      case "minkan":
        return onAddMeld(createMinkanMeld(tile, useRed));
    }
  };

  return (
    <div className="text-text-primary flex min-h-0 flex-col">
      <div className="mt-3 min-h-0 flex-1 rounded">
        <div className="space-y-0.5">
          {inputTileRows.map((row, index) => (
            <section key={index}>
              <div className="flex min-w-0 gap-0.5">
                {row.map((tile) => {
                  const isDisabled = !isEnabled(tile);
                  const isPendingChi =
                    tile.suit === pendingChi?.suit &&
                    tile.index === pendingChi?.index &&
                    tile.isRed === pendingChi?.isRed;

                  return (
                    <TileButton
                      key={`${tile.suit}${tile.index}${tile.isRed}`}
                      tile={tile}
                      onClick={onClick}
                      appearance={isPendingChi ? "pending" : isDisabled ? "disabled" : "default"}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
