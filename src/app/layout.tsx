import { ThemeProvider } from "@/shared/components/theme-provider";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
