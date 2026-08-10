type HeaderProps = {
  title: string;
  onHistoryOpen: () => void;
};

export function Header({ title, onHistoryOpen }: HeaderProps) {
  return (
    <header className="bg-background sticky top-0 z-20 h-14 border-b border-zinc-700">
      <div className="mx-auto flex h-full w-full max-w-380 items-center justify-between gap-4 px-4 lg:px-8">
        <h1 className="font-display text-text-primary text-2xl font-semibold">{title}</h1>
        <button
          type="button"
          onClick={onHistoryOpen}
          className="text-text-primary hover:text-text-primary rounded border border-zinc-700 px-3 py-1.5 text-sm font-semibold transition hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none"
        >
          履歴
        </button>
      </div>
    </header>
  );
}
