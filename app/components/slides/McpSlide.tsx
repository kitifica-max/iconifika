'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Toast from '../Toast'

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://iconifika.kitifica.com'

const config = `{
  "mcpServers": {
    "iconifika": {
      "command": "npx",
      "args": ["-y", "iconifika-mcp"],
      "env": {
        "ICONIFIKA_BASE_URL": "${BASE}"
      }
    }
  }
}`

export default function McpSlide() {
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState(false)
  const codeRef = useRef<HTMLPreElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.mcp-title', { y: 60, opacity: 0, duration: 0.8, ease: 'power3.out' })
      gsap.from('.mcp-code', { y: 40, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.3 })
      gsap.from('.mcp-hint', { opacity: 0, duration: 0.5, delay: 0.7 })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  function copy() {
    navigator.clipboard.writeText(config)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
          Instala Iconifika como herramienta MCP en tu agente de IA. Claude, Cursor y cualquier LLM compatible podrán pedir iconos directamente.
        </p>
      </div>

      <div className="mcp-code w-full max-w-xl relative">
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">
          Agrega esto a <code className="text-zinc-400">~/.claude/settings.json</code>
        </p>
        <pre
          ref={codeRef}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-xs text-zinc-300 overflow-x-auto"
        >
          {config}
        </pre>
        <button
          onClick={copy}
          className="absolute top-10 right-4 text-xs text-zinc-500 hover:text-white transition-colors px-3 py-1 border border-zinc-700 rounded-lg"
        >
          {copied ? '¡Copiado!' : 'Copiar'}
        </button>
      </div>

      <div className="flex items-center gap-4">
        <p className="mcp-hint text-zinc-600 text-sm text-center">
          Funciona con Claude Code · Cursor · cualquier LLM compatible con MCP
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
          message="1. Copia el JSON de arriba. 2. Pégalo en ~/.claude/settings.json (Claude Code) o en la config MCP de tu editor. 3. Reinicia el agente. Desde ese momento puedes pedirle al LLM que use get_icon, search_icons o list_sets directamente."
          onClose={() => setToast(false)}
        />
      )}
    </div>
  )
}
