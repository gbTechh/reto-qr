import { Text } from "@/components/atoms/Text";

// 2. Componente de la Página (Contenido visual)
export default async function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center">
      <div className="text-center mt-32 flex flex-col items-center gap-8 justify-center">
        {/* Aquí mostramos el texto del Hero que no es parte del SEO */}
        <div className="w-full lg:w-1/2 block">
          <Text></Text>
        </div>
      </div>

      {/* Tu lógica de trabajos de Go iría aquí abajo */}
    </section>
  );
}
