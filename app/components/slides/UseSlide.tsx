'use client'
import { useState, useRef } from 'react'
import BackgroundIcons from './BackgroundIcons'
import { USE_ICON_IDS } from './icons'

const NAV_ICONS = [
  {
    id: 'material-symbols:navigation',
    label: 'navigation',
    set: 'material-symbols',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m5 21l-1-1l8-18l8 18l-1 1l-7-3z"/></svg>',
  },
  {
    id: 'material-symbols:navigation-outline',
    label: 'navigation-outline',
    set: 'material-symbols',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m5 21l-1-1l8-18l8 18l-1 1l-7-3zm2.1-3.1l4.9-2.1l4.9 2.1l-4.9-11zm4.9-2.1"/></svg>',
  },
  {
    id: 'material-symbols:navigation-outline-rounded',
    label: 'navigation-outline-rounded',
    set: 'material-symbols',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m12 18l-6.45 2.75q-.325.125-.612.063t-.488-.263t-.262-.5t.062-.625L11.075 4.05q.125-.3.388-.45T12 3.45t.537.15t.388.45l6.825 15.375q.125.325.062.625t-.262.5t-.488.263t-.612-.063zm-4.9-.1l4.9-2.1l4.9 2.1l-4.9-11zm4.9-2.1"/></svg>',
  },
]

const SKILL_EXAMPLES = [
  {
    prompt: '/iconifika muéstrame opciones de íconos para el menú de navegación',
    what: null, // shows live demo instead
  },
  {
    prompt: '/iconifika sustituye todos los íconos de este componente por opciones mejores',
    what: 'Claude revisa el componente, busca alternativas más expresivas y las reemplaza directamente en el código.',
  },
  {
    prompt: '/iconifika agrega un ícono de casa en el breadcrumb de inicio',
    what: 'Claude busca, obtiene el SVG y lo inserta en tu código automáticamente.',
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
  const [iconColor, setIconColor] = useState('#ffffff')
  const [copied, setCopied] = useState<string | null>(null)

  function copyIcon(id: string, svg: string) {
    navigator.clipboard.writeText(svg).catch(() => {})
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

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

          {SKILL_EXAMPLES[activeExample].what === null ? (
            <div className="bg-zinc-950 border border-emerald-500/20 rounded-xl p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-medium">Claude →</span>
                <label className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                  Color
                  <input
                    type="color"
                    value={iconColor}
                    onChange={e => setIconColor(e.target.value)}
                    className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
                    style={{ appearance: 'none' }}
                  />
                </label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {NAV_ICONS.map(icon => (
                  <button
                    key={icon.id}
                    onClick={() => copyIcon(icon.id, icon.svg)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all duration-150 ${
                      copied === icon.id
                        ? 'border-emerald-500/60 bg-emerald-500/10'
                        : 'border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    <span
                      className="w-7 h-7 [&_svg]:w-full [&_svg]:h-full"
                      style={{ color: iconColor }}
                      dangerouslySetInnerHTML={{ __html: icon.svg }}
                    />
                    <span className="text-[9px] text-zinc-600 font-mono truncate w-full text-center">{icon.label}</span>
                    <span className={`text-[9px] ${copied === icon.id ? 'text-emerald-400' : 'text-zinc-600'}`}>
                      {copied === icon.id ? '✓ copiado' : 'copiar SVG'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3">
              <p className="text-zinc-400 text-sm">
                <span className="text-emerald-400 font-medium">Claude → </span>
                {SKILL_EXAMPLES[activeExample].what}
              </p>
            </div>
          )}
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
