export default function HistorialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1 h-screen relative">{children}</main>
    </div>
  );
}
