'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Toast from '../Toast'

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://iconifika.kitifica.com'

const commands = [
  {
    label: 'HTTP · recomendado',
    cmd: `claude mcp add iconifika --transport http ${BASE}/api/mcp`,
  },
  {
    label: 'stdio · con npx',
    cmd: 'claude mcp add iconifika --command npx -- -y iconifika-mcp',
  },
]

export default function McpSlide() {
  const [copied, setCopied] = useState<number | null>(null)
  const [toast, setToast] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.mcp-title', { y: 60, opacity: 0, duration: 0.8, ease: 'power3.out' })
      gsap.from('.mcp-code', { y: 40, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.3 })
      gsap.from('.mcp-hint', { opacity: 0, duration: 0.5, delay: 0.7 })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  function copy(idx: number, cmd: string) {
    navigator.clipboard.writeText(cmd)
    setCopied(idx)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div ref={containerRef} className="relative w-full h-full flex flex-col items-center justify-center px-12 gap-8">
      <div className="text-center">
        <p className="text-zinc-500 text-xs tracking-widest uppercase mb-2">Para flujos con IA</p>
        <h2 className="mcp-title text-[clamp(2rem,5vw,4rem)] font-black leading-none tracking-tighter uppercase mb-3">
          Listo para{' '}
          <span className="text-transparent" style={{ WebkitTextStroke: '2px white' }}>MCP</span>
        </h2>
        <p className="text-zinc-400 text-sm max-w-md">
          Un comando en tu terminal y Claude, Cursor o cualquier LLM tendrán acceso a +200k iconos SVG.
        </p>
      </div>

      <div className="mcp-code w-full max-w-2xl flex flex-col gap-3">
        {commands.map((c, i) => (
          <div key={i} className="relative">
            <p className="text-xs text-zinc-600 uppercase tracking-widest mb-1">{c.label}</p>
            <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4">
              <code className="flex-1 text-emerald-400 text-sm font-mono break-all">{c.cmd}</code>
              <button
                onClick={() => copy(i, c.cmd)}
                className="flex-shrink-0 text-xs text-zinc-500 hover:text-white transition-colors px-3 py-1 border border-zinc-700 rounded-lg"
              >
                {copied === i ? '✓' : 'Copiar'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <p className="mcp-hint text-zinc-600 text-sm text-center">
          Claude Code · Cursor · cualquier cliente MCP compatible
        </p>
        <button
          onClick={() => setToast(true)}
          className="flex-shrink-0 text-xs text-zinc-500 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded-full px-4 py-2 transition-colors"
        >
          ¿Cómo instalo?
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-600 text-sm tracking-widest uppercase">
        05 / 05
      </div>

      {toast && (
        <Toast
          message="HTTP (recomendado): copia el primer comando y pégalo en tu terminal. No instala nada, usa el servidor directamente. stdio: requiere Node.js instalado. Ambos dan acceso a get_icon, search_icons y list_sets desde Claude Code o Cursor."
          onClose={() => setToast(false)}
        />
      )}
    </div>
  )
}
