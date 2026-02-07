import { ThemeProvider } from "@/shared/components/theme-provider";
import { Inter, Raleway, Plus_Jakarta_Sans } from "next/font/google";
import type { Metadata } from "next";
import "@/app/globals.css";
import { cn } from "@/shared/utils";
import QueryProvider from "@/components/QueryProvider";

export const metadata: Metadata = {
  title: {
    default: "Qr Product Reader",
    template: "%s | Qr Product Reader",
  },
  description:
    "Encuentra los productos que buscas con nuestro lector de códigos QR. Escanea, descubre y accede a ofertas exclusivas en segundos. ¡Tu experiencia de compra nunca ha sido tan rápida y fácil!",
  openGraph: {
    title: "Qr Product Reader",
    description:
      "Encuentra los productos que buscas con nuestro lector de códigos QR. Escanea, descubre y accede a ofertas exclusivas en segundos. ¡Tu experiencia de compra nunca ha sido tan rápida y fácil!",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
  },
};

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={cn(plusJakartaSans.variable, raleway.variable, inter.variable)}
    >
      <body className={"min-h-screen bg-background antialiased shadow-inner"}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
