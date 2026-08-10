import type { InputMode } from "../lib/types";

const inputModes: Array<{ id: InputMode; label: string }> = [
  { id: "hand", label: "手牌" },
  { id: "doraIndicator", label: "ドラ表示牌" },
  { id: "pon", label: "ポン" },
  { id: "chi", label: "チー" },
  { id: "ankan", label: "暗槓" },
  { id: "minkan", label: "明槓" },
];

type InputModeProps = {
  currentInputMode: InputMode;
  threePlayer: boolean;
  hasTileSlot: boolean;
  hasDoraIndicatorSlot: boolean;
  hasMeldSlot: boolean;
  canClear: boolean;
  onInputModeChange: (inputMode: InputMode) => void;
  onClear: () => void;
};

export function InputModeArea({
  currentInputMode,
  threePlayer,
  hasTileSlot,
  hasDoraIndicatorSlot,
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
          mode.id === "hand"
            ? !hasTileSlot
            : mode.id === "doraIndicator"
              ? !hasDoraIndicatorSlot
              : mode.id === "chi"
                ? threePlayer || !hasMeldSlot
                : !hasMeldSlot;

        return (
          <button
            key={mode.id}
            type="button"
            disabled={disabled}
            onClick={() => onInputModeChange(mode.id)}
            className={`rounded border px-1 py-1 text-sm font-semibold transition-colors sm:px-3 ${
              disabled
                ? "text-text-disabled border-border-muted cursor-not-allowed"
                : selected
                  ? "bg-bg-selected border-border-selected text-zinc-950"
                  : "text-text-primary hover:text-text-primary hover:bg-bg-hover border-border-primary"
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
        className={`rounded border px-1 py-1 text-sm font-semibold transition-colors sm:px-3 ${
          canClear
            ? "text-text-primary hover:text-text-primary hover:bg-bg-hover border-border-primary"
            : "text-text-disabled border-border-muted cursor-not-allowed"
        } `}
      >
        クリア
      </button>
    </div>
  );
}
