export default function HistorialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-full flex-col">
      <main className="flex-1 h-dvh relative">{children}</main>
    </div>
  );
}
