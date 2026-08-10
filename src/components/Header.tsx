type HeaderProps = {
  title: string;
  onHistoryOpen: () => void;
};

export function Header({ title, onHistoryOpen }: HeaderProps) {
  return (
    <header className="bg-bg-primary border-border-primary sticky top-0 z-20 h-14 border-b">
      <div className="mx-auto flex h-full w-full max-w-380 items-center justify-between gap-4 px-4 lg:px-8">
        <h1 className="font-display text-text-primary text-2xl font-semibold">{title}</h1>
        <button
          type="button"
          onClick={onHistoryOpen}
          className="text-text-primary hover:text-text-primary hover:bg-bg-hover border-border-primary rounded border px-3 py-1.5 text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none"
        >
          履歴
        </button>
      </div>
    </header>
  );
}
