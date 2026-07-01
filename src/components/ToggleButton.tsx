type ToggleButtonProps = {
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
};

export function ToggleButton({ label, enabled, onChange }: ToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`rounded border px-1.5 py-1.5 text-sm font-semibold transition-colors sm:px-3 ${
        enabled
          ? "border-zinc-100 bg-zinc-100 text-zinc-950"
          : "border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-zinc-400"
      }`}
    >
      {label} {enabled ? "オン" : "オフ"}
    </button>
  );
}
