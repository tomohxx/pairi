import { ToggleButton } from "./ToggleButton";

type CalculationOptionsProps = {
  enableRedDora: boolean;
  threePlayer: boolean;
  fourTileSevenPairs: boolean;
  onRedDoraChange: (enabled: boolean) => void;
  onThreePlayerChange: (enabled: boolean) => void;
  onFourTileSevenPairsChange: (enabled: boolean) => void;
};

export function CalculationOptions({
  enableRedDora,
  threePlayer,
  fourTileSevenPairs,
  onRedDoraChange,
  onThreePlayerChange,
  onFourTileSevenPairsChange,
}: CalculationOptionsProps) {
  return (
    <div className="flex min-w-0 flex-col text-zinc-100">
      <div className="shrink-0 pb-3">
        <h2 className="font-display text-xl font-semibold text-zinc-50">設定</h2>
      </div>

      <div className="flex flex-wrap gap-1">
        <ToggleButton label="赤ドラ" enabled={enableRedDora} onChange={onRedDoraChange} />
        <ToggleButton label="三人麻雀" enabled={threePlayer} onChange={onThreePlayerChange} />
        <ToggleButton label="四枚使い七対子" enabled={fourTileSevenPairs} onChange={onFourTileSevenPairsChange} />
      </div>
    </div>
  );
}
