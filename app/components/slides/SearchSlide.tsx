'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Toast from '../Toast'

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? ''

type Result = { set: string; name: string; body: string }

export default function SearchSlide() {
  const [query, setQuery] = useState('arrow')
  const [results, setResults] = useState<Result[]>([])
  const [toast, setToast] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  async function search(q: string) {
    if (!q.trim()) return
    const res = await fetch(`${BASE}/api/search?q=${encodeURIComponent(q)}&limit=12`)
    if (!res.ok) return
    const { results: r } = await res.json()
    setResults(r)
    if (gridRef.current) {
      gsap.from(gridRef.current.children, { scale: 0, opacity: 0, duration: 0.3, stagger: 0.03, ease: 'back.out(1.5)' })
    }
  }

  useEffect(() => { search(query) }, [])

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-12 gap-8">
      <div className="text-center">
        <p className="text-zinc-500 text-xs tracking-widest uppercase mb-2">Endpoint 02</p>
        <h2 className="text-[clamp(2rem,5vw,4rem)] font-black leading-none tracking-tighter uppercase mb-3">
          Buscar iconos
        </h2>
        <p className="text-zinc-400 text-sm max-w-md">
          Busca por nombre o palabra clave entre más de 200k iconos. Filtra por colección para resultados más precisos.
        </p>
      </div>

      <div className="w-full max-w-md">
        <input
          className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 text-xl text-white focus:outline-none focus:border-zinc-400 text-center tracking-wide"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search(query)}
          placeholder="Busca un icono..."
        />
        <p className="text-center text-zinc-600 text-xs mt-2">
          <code className="text-emerald-700">GET /api/search?q={query}&limit=12</code>
        </p>
      </div>

      <div ref={gridRef} className="grid grid-cols-6 gap-4">
        {results.map((r, i) => (
          <div
            key={`${r.set}-${r.name}-${i}`}
            title={`${r.set}:${r.name}`}
            className="w-12 h-12 text-white/70 hover:text-white transition-colors cursor-default"
            dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 24 24" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">${r.body}</svg>` }}
          />
        ))}
      </div>

      <button
        onClick={() => setToast(true)}
        className="text-xs text-zinc-500 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded-full px-4 py-2 transition-colors"
      >
        ¿Cómo funciona la búsqueda?
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-600 text-sm tracking-widest uppercase">
        04 / 05
      </div>

      {toast && (
        <Toast
          message="Envía GET /api/search?q=TÉRMINO&set=COLECCIÓN&limit=20. El parámetro set es opcional. Devuelve un array con el nombre, colección y cuerpo SVG de cada icono encontrado. Presiona Enter para buscar."
          onClose={() => setToast(false)}
        />
      )}
    </div>
  )
}
