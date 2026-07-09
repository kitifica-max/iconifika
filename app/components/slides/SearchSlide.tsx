'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Toast from '../Toast'

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? ''

type Result = { set: string; name: string }

const SUGGESTIONS = ['home', 'user', 'settings', 'bell', 'search', 'arrow']

export default function SearchSlide() {
  const [query, setQuery] = useState('home')
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function search(q: string) {
    if (!q.trim()) return
    setLoading(true)
    setResults([])
    try {
      const res = await fetch(`${BASE}/api/search?q=${encodeURIComponent(q)}&limit=8`)
      if (!res.ok) return
      const { results: r } = await res.json()
      setResults(r)
      if (gridRef.current && r.length > 0) {
        gsap.fromTo(
          gridRef.current.children,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, stagger: 0.03, ease: 'back.out(1.5)' }
        )
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { search(query) }, [])

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-8 gap-5">

      {/* Header */}
      <div className="text-center">
        <p className="text-zinc-500 text-xs tracking-widest uppercase mb-1">+200k iconos disponibles</p>
        <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-black leading-none tracking-tighter uppercase">
          Busca un icono
        </h2>
      </div>

      {/* Search bar */}
      <div className="w-full max-w-lg flex gap-2">
        <input
          ref={inputRef}
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-3 text-base text-white focus:outline-none focus:border-zinc-500 placeholder:text-zinc-600"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search(query)}
          placeholder="Escribe un nombre de icono…"
        />
        <button
          onClick={() => search(query)}
          className="bg-white text-black font-semibold text-sm rounded-xl px-5 hover:bg-zinc-200 transition-colors"
        >
          Buscar
        </button>
      </div>

      {/* Suggestions */}
      <div className="flex gap-2 flex-wrap justify-center">
        {SUGGESTIONS.map(s => (
          <button
            key={s}
            onClick={() => { setQuery(s); search(s) }}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${query === s ? 'border-zinc-400 text-white' : 'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Results grid */}
      {loading ? (
        <p className="text-zinc-600 text-sm">Buscando…</p>
      ) : results.length === 0 ? (
        <p className="text-zinc-600 text-sm">Sin resultados para "{query}"</p>
      ) : (
        <div ref={gridRef} className="grid grid-cols-4 gap-2 w-full max-w-lg" style={{ maxHeight: '172px', overflow: 'hidden' }}>
          {results.map((r, i) => (
            <div
              key={`${r.set}-${r.name}-${i}`}
              title={`${r.set}:${r.name}`}
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors cursor-default group"
            >
              <img
                src={`${BASE}/api/icon/${r.set}/${r.name}?color=ffffff`}
                alt={r.name}
                className="w-8 h-8 opacity-70 group-hover:opacity-100 transition-opacity"
              />
              <span className="text-zinc-600 text-[10px] truncate w-full text-center group-hover:text-zinc-400">{r.name}</span>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setToast(true)}
        className="text-xs text-zinc-500 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded-full px-4 py-2 transition-colors"
      >
        ¿Cómo uso estos iconos?
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-700 text-xs tracking-widest uppercase">
        04 / 05
      </div>

      {toast && (
        <Toast
          message="Busca por nombre (ej: 'home', 'arrow', 'user'). Cada resultado muestra el set y nombre. Para usarlo: GET /api/icon/{set}/{nombre}. Hover sobre cualquier icono para ver su identificador completo."
          onClose={() => setToast(false)}
        />
      )}
    </div>
  )
}
