import { ButtonHistorial } from "@/components/atoms/ButtonHistorial";
import { Text } from "@/components/atoms/Text";
import { FlowField } from "@/components/molecules/FlowField";
import { ManualSearch } from "@/components/organism/ManualSearch";
import { ProductDetailSheet } from "@/components/organism/ProductDetailSheet";
import { QrCode } from "lucide-react";

// 2. Componente de la Página (Contenido visual)
export default function HomePage() {
  return (
    <>
      <section className="centralize flex-col gap-10 pt-14 relative flex-1">
        <div className="centralize w-full px-10">
          <ButtonHistorial />
        </div>
        <div className="centralize w-full centralize px-10">
          <div className="aspect-square w-full max-w-[220px]">
            <FlowField />
          </div>
        </div>
        <div className="centralize w-full centralize flex-col gap-4 px-10 text-center">
          <Text size={"big"} as="h1" variant={"title"}>
            Bienvenido
          </Text>
          <Text size={"md"} variant={"base"} as="p" color={"contrast"}>
            Explora tu historial de trabajos de Go y descubre tus patrones de
            uso.
          </Text>
        </div>
        <div>
          <ManualSearch />
          <ProductDetailSheet />
        </div>
      </section>
      {/* bottom busqueda */}
      <div className="w-full h-20 absolute bottom-0 left-0 flex items-end justify-center">
        <div className="h-full aspect-square  rounded-bl-none rounded-full round-left"></div>
        <div className="runded-t-full bg-white w-14 h-full rounded-t-full p-1 z-10">
          <button className="bg-cards hover:bg-cards/90 transition-colors glassomorphism shadow-2xl rounded-full w-full aspect-square centralize">
            <QrCode />
          </button>
        </div>
        <div className="h-full aspect-square  rounded-br-none rounded-full round-right"></div>
      </div>
    </>
  );
}
