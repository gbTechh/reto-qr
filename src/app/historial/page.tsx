// 2. Componente de la Página (Contenido visual)
export default async function HomePage() {
  return (
    <section className="container-wrapper py-10">
      <div className="text-center mt-32 flex flex-col items-center gap-8 justify-center">
        {/* Aquí mostramos el texto del Hero que no es parte del SEO */}
        <div className="w-full lg:w-1/2 block">
          <p>Historial</p>
        </div>
      </div>

      {/* Tu lógica de trabajos de Go iría aquí abajo */}
    </section>
  );
}
