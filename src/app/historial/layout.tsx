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
      <main className="flex-1 container-wrapper-full">{children}</main>

      {/* Footer simple como Organismo o directamente aquí */}
      <footer className="border-t py-6 md:py-0 bg-muted/50">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with Next.js 15 & Go. The source code is on GitHub.
          </p>
        </div>
      </footer>
    </div>
  );
}
