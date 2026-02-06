export default function HistorialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* El Navbar es persistente en todas las rutas del portal */}
      <h1>hitorial layut</h1>
      {/* El contenido principal crece para empujar el footer al fondo */}
      <main className="flex-1 h-screen">{children}</main>

      {/* Footer simple como Organismo o directamente aquí */}
    </div>
  );
}
