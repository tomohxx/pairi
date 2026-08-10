type HeaderProps = {
  title: string;
  onHistoryOpen: () => void;
};

export function Header({ title, onHistoryOpen }: HeaderProps) {
  return (
    <header className="bg-background sticky top-0 z-20 h-14 border-b border-zinc-700">
      <div className="mx-auto flex h-full w-full max-w-380 items-center justify-between gap-4 px-4 lg:px-8">
        <h1 className="font-display text-2xl font-semibold text-zinc-50">{title}</h1>
        <button
          type="button"
          onClick={onHistoryOpen}
          className="rounded border border-zinc-700 px-3 py-1.5 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800 hover:text-zinc-50 focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none"
        >
          履歴
        </button>
      </div>
    </header>
  );
}
