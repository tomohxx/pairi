type HeaderProps = {
  title: string;
};

export function Header({ title }: HeaderProps) {
  return (
    <header className="bg-table-felt-dark sticky top-0 z-20 h-14 border-b border-zinc-700">
      <div className="mx-auto flex h-full w-full max-w-380 items-center px-4 lg:px-8">
        <h1 className="font-display text-xl font-semibold text-zinc-50">{title}</h1>
      </div>
    </header>
  );
}
