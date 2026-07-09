'use client'
import { useState } from 'react'
import Toast from '../Toast'

const PROMPTS = [
  '"Agrega un ícono de estrella amarilla al botón de favoritos"',
  '"Pon el ícono de check verde cuando el formulario se envíe"',
  '"Busca opciones de íconos para redes sociales"',
  '"Usa un ícono de casa en el breadcrumb de inicio"',
]

const TOOLS = [
  { name: 'get_icon', desc: 'Obtiene el SVG listo para insertar' },
  { name: 'search_icons', desc: 'Busca entre +200k íconos por nombre' },
  { name: 'list_sets', desc: 'Lista colecciones disponibles' },
]

export default function UseSlide() {
  const [toast, setToast] = useState(false)
  const [active, setActive] = useState(0)

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-8 gap-7">

      <div className="text-center">
        <p className="text-zinc-500 text-xs tracking-widest uppercase mb-1">Una vez instalado</p>
        <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-black leading-none tracking-tighter uppercase">
          Pídele iconos a tu IA
        </h2>
        <p className="text-zinc-500 text-sm mt-2 max-w-sm mx-auto">
          Di qué ícono necesitas. Tu IA lo busca, lo obtiene y lo inserta en tu código.
        </p>
      </div>

      {/* Example prompts */}
      <div className="w-full max-w-xl flex flex-col gap-2">
        {PROMPTS.map((p, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
              active === i
                ? 'border-zinc-500 text-white bg-zinc-900'
                : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Tools */}
      <div className="w-full max-w-xl">
        <p className="text-zinc-600 text-xs uppercase tracking-widest mb-3">Herramientas disponibles para tu IA</p>
        <div className="grid grid-cols-3 gap-2">
          {TOOLS.map(t => (
            <div key={t.name} className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex flex-col gap-1">
              <code className="text-emerald-500 text-xs">{t.name}</code>
              <p className="text-zinc-500 text-[11px] leading-tight">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setToast(true)}
        className="text-xs text-zinc-500 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded-full px-4 py-2 transition-colors"
      >
        ¿Cómo funciona por dentro?
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-700 text-xs tracking-widest uppercase">
        04 / 04
      </div>

      {toast && (
        <Toast
          message="Tu IA recibe las herramientas de Iconifika vía MCP. Cuando le pides un ícono, llama a search_icons para buscar, luego get_icon para obtener el SVG, y lo pega directo en tu archivo. Tú solo describes lo que quieres."
          onClose={() => setToast(false)}
        />
      )}
    </div>
  )
}
