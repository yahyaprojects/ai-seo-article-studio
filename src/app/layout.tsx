import { Sora } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const sora = Sora({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sora',
})

export const metadata = {
  title: 'Bitzen Minería — Generador SEO',
  description: 'Demo de generación automática de artículos SEO',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={sora.variable}>
        <Header />
        <main className="mx-auto w-full max-w-6xl px-6 py-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
