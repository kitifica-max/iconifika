import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'

const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Iconifika — API de SVG para IAs',
  description: 'API gratuita de iconos SVG con más de 200k iconos. Compatible con MCP, Claude Code y cualquier LLM. Sin auth, sin límites.',
  icons: { icon: '/iconifica_w.svg' },
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
