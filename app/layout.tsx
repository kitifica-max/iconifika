import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'

const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Iconifika — +200K iconos SVG para tu IA',
  description: 'Dale acceso a tu IA a +200K iconos SVG reales. Instala como MCP o Skill para Claude, Cursor, Windsurf, Cline y Zed. Sin tokens desperdiciados generando SVGs.',
  icons: { icon: '/iconifica_w.svg' },
  openGraph: {
    title: 'Iconifika — +200K iconos SVG para tu IA',
    description: 'Dale acceso a tu IA a +200K iconos SVG reales. Instala como MCP o Skill para Claude, Cursor, Windsurf, Cline y Zed.',
    url: 'https://iconifika.kitifica.com',
    siteName: 'Iconifika',
    images: [{ url: 'https://iconifika.kitifica.com/og.png', width: 1200, height: 630, alt: 'Iconifika' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Iconifika — +200K iconos SVG para tu IA',
    description: 'Dale acceso a tu IA a +200K iconos SVG reales. Sin tokens desperdiciados.',
    images: ['https://iconifika.kitifica.com/og.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${grotesk.variable} font-sans bg-black text-white antialiased overflow-hidden`}>
        {children}
      </body>
    </html>
  )
}
