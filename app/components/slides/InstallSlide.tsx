'use client'
import { useState } from 'react'

const MCP_URL = 'https://iconifika.kitifica.com/api/mcp'
const SKILL_URL = 'https://iconifika.kitifica.com/iconifika.skill'

type Client = {
  id: string
  label: string
  steps: { text: string; code?: string }[]
}

const CLIENTS: Client[] = [
  {
    id: 'claudecode',
    label: 'Claude Code',
    steps: [
      { text: 'Abre tu Terminal' },
      { text: 'Ejecuta:', code: `claude mcp add iconifika --transport http ${MCP_URL}` },
      { text: 'Reinicia Claude Code' },
    ],
  },
  {
    id: 'cursor',
    label: 'Cursor',
    steps: [
      { text: 'Ve a Settings → MCP' },
      { text: 'Agrega un nuevo servidor con la URL:', code: MCP_URL },
      { text: 'Guarda y reinicia Cursor' },
    ],
  },
  {
    id: 'windsurf',
    label: 'Windsurf',
    steps: [
      { text: 'Abre ~/.codeium/windsurf/mcp_config.json' },
      { text: 'Agrega la URL del servidor:', code: MCP_URL },
      { text: 'Reinicia Windsurf' },
    ],
  },
  {
    id: 'cline',
    label: 'Cline',
    steps: [
      { text: 'Abre la extensión Cline en VSCode' },
      { text: 'Ve a MCP Servers → Add Server → HTTP' },
      { text: 'Pega la URL:', code: MCP_URL },
    ],
  },
  {
    id: 'zed',
    label: 'Zed',
    steps: [
      { text: 'Abre settings.json en Zed' },
      { text: 'Agrega en context_servers la URL:', code: MCP_URL },
      { text: 'Guarda — Zed detecta el cambio automáticamente' },
    ],
  },
]

export default function InstallSlide() {
  const [tab, setTab] = useState<'skill' | 'mcp'>('skill')
  const [activeClient, setActiveClient] = useState('claudecode')
  const [copied, setCopied] = useState<string | null>(null)

  function copy(key: string, text: string) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const client = CLIENTS.find(c => c.id === activeClient)!

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-8 gap-6">

      <div className="text-center">
        <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-black leading-none tracking-tighter uppercase">
          Instálalo en tu IA
        </h2>
      </div>

      {/* Main tabs */}
      <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-full p-1">
        <button
          onClick={() => setTab('skill')}
          className={`text-xs px-4 py-1.5 rounded-full transition-colors font-medium ${
            tab === 'skill'
              ? 'bg-emerald-500 text-black'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Skill <span className="ml-1 text-[10px] opacity-70">RECOMENDADO</span>
        </button>
        <button
          onClick={() => setTab('mcp')}
          className={`text-xs px-4 py-1.5 rounded-full transition-colors font-medium ${
            tab === 'mcp'
              ? 'bg-zinc-700 text-white'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          MCP
        </button>
      </div>

      {tab === 'skill' && (
        <div className="w-full max-w-xl flex flex-col gap-4">
          <p className="text-center text-zinc-500 text-xs">Solo para Claude — un archivo, sin comandos ni configuración</p>

          <div className="flex flex-col gap-3">
            {[
              { text: 'Descarga el archivo de skill' },
              { text: 'Ábrelo — Claude Code lo instala automáticamente' },
              { text: 'Pídele a Claude que busque iconos con Iconifika' },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-500 flex-shrink-0 mt-0.5">{i + 1}</span>
                <span className="text-sm text-zinc-400">{step.text}</span>
              </div>
            ))}
          </div>

          <a
            href={SKILL_URL}
            download
            className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-semibold rounded-xl px-6 py-3 transition-colors"
          >
            Descargar iconifika-install.skill
          </a>
        </div>
      )}

      {tab === 'mcp' && (
        <div className="w-full max-w-xl flex flex-col gap-4">
          <p className="text-center text-zinc-500 text-xs">Compatible con cualquier cliente MCP</p>

          {/* Client tabs */}
          <div className="flex flex-wrap gap-2 justify-center">
            {CLIENTS.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveClient(c.id)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  activeClient === c.id
                    ? 'border-zinc-400 text-white'
                    : 'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-3">
            {client.steps.map((step, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-500 flex-shrink-0 mt-0.5">{i + 1}</span>
                  <span className="text-sm text-zinc-400">{step.text}</span>
                </div>
                {step.code && (
                  <div className="ml-8 flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5">
                    <code className="flex-1 text-emerald-400 text-sm font-mono break-all">{step.code}</code>
                    <button
                      onClick={() => copy(`${activeClient}-${i}`, step.code!)}
                      className="flex-shrink-0 text-xs text-zinc-500 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded-lg px-3 py-1.5 transition-colors"
                    >
                      {copied === `${activeClient}-${i}` ? '✓' : 'Copiar'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-700 text-xs tracking-widest uppercase">
        03 / 04
      </div>
    </div>
  )
}
