import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'

const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Iconifika — SVG API for LLMs',
  description: 'Free Iconify API. 200k+ icons. MCP-ready. Zero auth.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${grotesk.variable} font-sans bg-black text-white antialiased overflow-hidden`}>
        {children}
      </body>
    </html>
  )
}
