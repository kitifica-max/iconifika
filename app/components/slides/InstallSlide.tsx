'use client'
import { useState } from 'react'
import Toast from '../Toast'

const BASE_URL = 'https://iconifika.kitifica.com'

const METHODS = [
  {
    label: 'HTTP',
    tag: 'RECOMENDADO',
    command: `claude mcp add iconifika --transport http ${BASE_URL}/api/mcp`,
  },
  {
    label: 'NPX',
    tag: 'SIN INSTALAR NADA',
    command: 'claude mcp add iconifika --command npx -- -y iconifika-mcp',
  },
]

const CLIENTS = ['Claude Code', 'Cursor', 'Cline', 'Zed', 'Windsurf']

export default function InstallSlide() {
  const [copied, setCopied] = useState<number | null>(null)
  const [toast, setToast] = useState(false)

  function copy(i: number, text: string) {
    navigator.clipboard.writeText(text)
    setCopied(i)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-8 gap-8">

      <div className="text-center">
        <p className="text-zinc-500 text-xs tracking-widest uppercase mb-1">Un solo comando</p>
        <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-black leading-none tracking-tighter uppercase">
          Instálalo en tu IA
        </h2>
      </div>

      <div className="w-full max-w-xl flex flex-col gap-4">
        {METHODS.map((m, i) => (
          <div key={m.label} className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-400">{m.label}</span>
              <span className="text-[10px] text-zinc-600 border border-zinc-700 rounded px-1.5 py-0.5">{m.tag}</span>
            </div>
            <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3">
              <code className="flex-1 text-emerald-400 text-sm font-mono break-all">{m.command}</code>
              <button
                onClick={() => copy(i, m.command)}
                className="flex-shrink-0 text-xs text-zinc-500 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded-lg px-3 py-1.5 transition-colors"
              >
                {copied === i ? '✓' : 'Copiar'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-zinc-600 text-xs uppercase tracking-widest">Compatible con</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {CLIENTS.map(c => (
            <span key={c} className="text-xs text-zinc-400 border border-zinc-800 rounded-full px-3 py-1">{c}</span>
          ))}
        </div>
      </div>

      <button
        onClick={() => setToast(true)}
        className="text-xs text-zinc-500 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded-full px-4 py-2 transition-colors"
      >
        ¿Qué pasa después?
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-700 text-xs tracking-widest uppercase">
        03 / 04
      </div>

      {toast && (
        <Toast
          message="Después de ejecutar el comando, reinicia tu cliente (Claude Code, Cursor, etc.). Iconifika aparecerá como herramienta disponible. Tu IA podrá buscar y entregar SVGs directamente en tu código."
          onClose={() => setToast(false)}
        />
      )}
    </div>
  )
}
