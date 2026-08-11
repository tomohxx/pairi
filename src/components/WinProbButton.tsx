type WinProbButtonProps = {
  disabled: boolean;
  onClick: () => void;
};

export function WinProbButton({ disabled, onClick }: WinProbButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="disabled:text-text-muted focus-visible:ring-offset-bg-primary disabled:bg-bg-disabled rounded bg-teal-400 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-teal-300 focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed"
    >
      点数期待値を計算
    </button>
  );
}
