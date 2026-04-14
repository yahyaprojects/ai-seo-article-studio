import { Roboto, Sora } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sora",
});

export const metadata = {
  title: "Bitzen Minería — Generador SEO",
  description: "Demo de generación automática de artículos SEO",
  icons: {
    icon: "/assets/branding/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className={`${roboto.variable} ${sora.variable}`}>{children}</body>
    </html>
  );
}
