import { Roboto, Anek_Kannada } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
})

const anekKannada = Anek_Kannada({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-anek-kannada',
})

export const metadata = {
  title: 'Bitzen Minería — Generador SEO',
  description: 'Demo de generación automática de artículos SEO',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${roboto.variable} ${anekKannada.variable}`}>
        <Header />
        <main className="mx-auto w-full max-w-6xl px-6 py-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
