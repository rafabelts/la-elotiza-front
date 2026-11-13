import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import "./globals.css";

const figtree = localFont({
  src: "./fonts/figtree-variable.ttf",
  variable: "--font-figtree",
  weight: "300 900",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: "La Elotiza | Punto de venta",
  description: "Punto de venta de La Elotiza.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-MX" className={figtree.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
