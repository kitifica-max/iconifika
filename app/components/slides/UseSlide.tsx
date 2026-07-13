'use client'
import { useState } from 'react'
import BackgroundIcons from './BackgroundIcons'
import { USE_ICON_IDS } from './icons'

const SKILL_EXAMPLES = [
  {
    prompt: '/iconifika sustituye todos los íconos de este componente por opciones mejores',
    what: 'Claude revisa el componente, busca alternativas más expresivas y las reemplaza directamente en el código.',
  },
  {
    prompt: '/iconifika agrega un ícono de casa en el breadcrumb de inicio',
    what: 'Claude busca, obtiene el SVG y lo inserta en tu código automáticamente.',
  },
  {
    prompt: '/iconifika busca opciones de íconos para redes sociales',
    what: 'Claude lista variantes y te pregunta cuál prefieres antes de insertar.',
  },
]

const MCP_EXAMPLES = [
  {
    tool: 'search_icons',
    desc: 'Busca entre +200K íconos por nombre o keyword',
    example: 'search_icons("home")',
  },
  {
    tool: 'get_icon',
    desc: 'Obtiene el SVG listo para insertar en tu código',
    example: 'get_icon("heroicons:home")',
  },
  {
    tool: 'list_sets',
    desc: 'Lista las colecciones disponibles (Heroicons, Lucide, etc.)',
    example: 'list_sets()',
  },
]

export default function UseSlide() {
  const [tab, setTab] = useState<'skill' | 'mcp'>('skill')
  const [activeExample, setActiveExample] = useState(0)

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-8 gap-6">
      <BackgroundIcons icons={USE_ICON_IDS} />

      <div className="text-center">
        <p className="text-zinc-500 text-xs tracking-widest uppercase mb-1">Una vez instalado</p>
        <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-black leading-none tracking-tighter uppercase">
          Pídele iconos a tu IA
        </h2>
      </div>

      {/* Main tabs */}
      <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-full p-1">
        <button
          onClick={() => setTab('skill')}
          className={`text-xs px-4 py-1.5 rounded-full transition-colors font-medium ${
            tab === 'skill' ? 'bg-emerald-500 text-black' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Skill
        </button>
        <button
          onClick={() => setTab('mcp')}
          className={`text-xs px-4 py-1.5 rounded-full transition-colors font-medium ${
            tab === 'mcp' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          MCP
        </button>
      </div>

      {tab === 'skill' && (
        <div className="w-full max-w-xl flex flex-col gap-4">
          <p className="text-center text-zinc-500 text-xs">Habla con Claude en lenguaje natural — no necesitas saber nada de APIs</p>

          <div className="flex flex-col gap-2">
            {SKILL_EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => setActiveExample(i)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
                  activeExample === i
                    ? 'border-emerald-500/50 text-white bg-emerald-500/5'
                    : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                }`}
              >
                {ex.prompt}
              </button>
            ))}
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3">
            <p className="text-zinc-400 text-sm">
              <span className="text-emerald-400 font-medium">Claude → </span>
              {SKILL_EXAMPLES[activeExample].what}
            </p>
          </div>
        </div>
      )}

      {tab === 'mcp' && (
        <div className="w-full max-w-xl flex flex-col gap-4">
          <p className="text-center text-zinc-500 text-xs">Tu IA tiene acceso a estas herramientas — las llama automáticamente</p>

          <div className="grid grid-cols-3 gap-2">
            {MCP_EXAMPLES.map(t => (
              <div key={t.tool} className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex flex-col gap-2">
                <code className="text-emerald-500 text-xs font-mono">{t.tool}</code>
                <p className="text-zinc-500 text-[11px] leading-tight">{t.desc}</p>
                <code className="text-zinc-600 text-[10px] font-mono mt-auto">{t.example}</code>
              </div>
            ))}
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3">
            <p className="text-zinc-500 text-xs leading-relaxed">
              Tu IA recibe estas herramientas vía MCP. Cuando le pides un ícono, llama a{' '}
              <code className="text-emerald-400">search_icons</code> para buscar,{' '}
              <code className="text-emerald-400">get_icon</code> para obtener el SVG, y lo pega directo en tu archivo.
            </p>
          </div>
        </div>
      )}

      <div className="hidden sm:block absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-700 text-xs tracking-widest uppercase">
        04 / 04
      </div>
    </div>
  )
}
