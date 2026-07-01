import type { InputMode } from "../lib/types";

const inputModes: Array<{ id: InputMode; label: string }> = [
  { id: "hand", label: "手牌" },
  { id: "pon", label: "ポン" },
  { id: "chi", label: "チー" },
  { id: "ankan", label: "暗槓" },
  { id: "minkan", label: "明槓" },
];

type InputModeProps = {
  currentInputMode: InputMode;
  threePlayer: boolean;
  hasTileSlot: boolean;
  hasMeldSlot: boolean;
  canClear: boolean;
  onInputModeChange: (inputMode: InputMode) => void;
  onClear: () => void;
};

export function InputModeArea({
  currentInputMode,
  threePlayer,
  hasTileSlot,
  hasMeldSlot,
  canClear,
  onInputModeChange,
  onClear,
}: InputModeProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {inputModes.map((mode) => {
        const selected = mode.id === currentInputMode;
        const disabled =
          mode.id === "hand" ? !hasTileSlot : mode.id === "chi" ? threePlayer || !hasMeldSlot : !hasMeldSlot;

        return (
          <button
            key={mode.id}
            type="button"
            disabled={disabled}
            onClick={() => onInputModeChange(mode.id)}
            className={`rounded border px-1.5 py-1.5 text-sm font-semibold transition-colors sm:px-3 ${
              disabled
                ? "cursor-not-allowed border-zinc-800 bg-zinc-950 text-zinc-600"
                : selected
                  ? "border-zinc-100 bg-zinc-100 text-zinc-950"
                  : "border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-zinc-400"
            }`}
          >
            {mode.label}
          </button>
        );
      })}

      <button
        type="button"
        disabled={!canClear}
        onClick={onClear}
        className={`rounded border px-1.5 py-1.5 text-sm font-semibold transition-colors sm:px-3 ${
          canClear
            ? "border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-zinc-400"
            : "cursor-not-allowed border-zinc-800 bg-zinc-950 text-zinc-600"
        } `}
      >
        クリア
      </button>
    </div>
  );
}
