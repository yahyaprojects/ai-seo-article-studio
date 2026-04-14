import { Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sora",
});

export const metadata = {
  title: "Bitzen Minería — Generador SEO",
  description: "Demo de generación automática de artículos SEO",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={sora.variable}>{children}</body>
    </html>
  );
}
