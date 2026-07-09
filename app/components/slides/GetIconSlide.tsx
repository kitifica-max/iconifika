'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import Toast from '../Toast'

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? ''

const PRESETS = [
  { set: 'lucide', name: 'heart', color: '#f472b6' },
  { set: 'lucide', name: 'home', color: '#60a5fa' },
  { set: 'lucide', name: 'star', color: '#fbbf24' },
  { set: 'mdi', name: 'rocket', color: '#a78bfa' },
  { set: 'heroicons', name: 'bell', color: '#34d399' },
]

type Suggestion = { set: string; name: string }

export default function GetIconSlide() {
  const [svgContent, setSvgContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [set, setSet] = useState('lucide')
  const [name, setName] = useState('heart')
  const [color, setColor] = useState('#f472b6')
  const [error, setError] = useState(false)
  const [toast, setToast] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSug, setShowSug] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  async function fetchIcon(s = set, n = name, c = color) {
    if (!s.trim() || !n.trim()) return
    setLoading(true)
    setError(false)
    try {
      const url = `${BASE}/api/icon/${encodeURIComponent(s)}/${encodeURIComponent(n)}?color=${encodeURIComponent(c)}`
      const res = await fetch(url)
      if (res.ok) {
        const svg = await res.text()
        if (svg.trim().startsWith('<svg')) {
          setSvgContent(svg)
          setError(false)
          if (previewRef.current) {
            gsap.fromTo(previewRef.current, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)' })
          }
        } else {
          setSvgContent(''); setError(true)
        }
      } else {
        setSvgContent(''); setError(true)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchIcon() }, [])

  function applyPreset(p: typeof PRESETS[0]) {
    setSet(p.set); setName(p.name); setColor(p.color)
    setSuggestions([]); setShowSug(false)
    fetchIcon(p.set, p.name, p.color)
  }

  function applySuggestion(s: Suggestion) {
    setSet(s.set); setName(s.name)
    setSuggestions([]); setShowSug(false)
    fetchIcon(s.set, s.name, color)
  }

  const searchSuggestions = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!q.trim() || q.length < 2) { setSuggestions([]); setShowSug(false); return }
    debounceRef.current = setTimeout(async () => {
      const res = await fetch(`${BASE}/api/search?q=${encodeURIComponent(q)}&limit=6`)
      if (!res.ok) return
      const { results } = await res.json()
      setSuggestions(results ?? [])
      setShowSug(true)
    }, 250)
  }, [])

  const endpoint = `GET /api/icon/${set}/${name}?color=${color}`

  return (
    <div ref={containerRef} className="relative w-full h-full flex flex-col items-center justify-center gap-6 px-8">

      {/* Header */}
      <div className="text-center">
        <p className="text-zinc-500 text-xs tracking-widest uppercase mb-1">Obtener un icono SVG</p>
        <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-black leading-none tracking-tighter uppercase">
          Pruébalo ahora
        </h2>
      </div>

      {/* Main area: preview + controls */}
      <div className="w-full max-w-2xl flex flex-col sm:flex-row gap-6 items-center">

        {/* Icon preview */}
        <div className="flex-shrink-0 flex flex-col items-center gap-2">
          <div
            ref={previewRef}
            className="w-36 h-36 flex items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950 [&_svg]:w-full [&_svg]:h-full"
            dangerouslySetInnerHTML={{ __html: loading ? '' : svgContent }}
          />
          {loading && <p className="text-zinc-600 text-xs">Cargando…</p>}
          {!loading && error && (
            <p className="text-red-500/70 text-xs text-center max-w-[9rem]">No encontrado. Escribe en el campo Nombre para buscar.</p>
          )}
          <code className="text-zinc-600 text-xs">{set}:{name}</code>
        </div>

        {/* Controls */}
        <div className="flex-1 flex flex-col gap-4 w-full">
          {/* Presets */}
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={`${p.set}:${p.name}`}
                onClick={() => applyPreset(p)}
                style={{ borderColor: set === p.set && name === p.name ? p.color : undefined, color: set === p.set && name === p.name ? p.color : undefined }}
                className="text-xs px-3 py-1.5 rounded-full border border-zinc-700 text-zinc-400 hover:border-zinc-400 transition-colors"
              >
                {p.set}:{p.name}
              </button>
            ))}
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-3 gap-2">
            {/* Colección */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-600 uppercase tracking-widest">Colección</label>
              <input
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500 w-full"
                value={set}
                placeholder="lucide"
                onChange={e => setSet(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchIcon()}
              />
            </div>

            {/* Nombre — con autocomplete */}
            <div className="flex flex-col gap-1 relative">
              <label className="text-xs text-zinc-600 uppercase tracking-widest">Nombre</label>
              <input
                ref={nameInputRef}
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500 w-full"
                value={name}
                placeholder="Escribe para buscar…"
                onChange={e => { setName(e.target.value); searchSuggestions(e.target.value) }}
                onKeyDown={e => { if (e.key === 'Enter') { setShowSug(false); fetchIcon() } if (e.key === 'Escape') setShowSug(false) }}
                onFocus={() => suggestions.length > 0 && setShowSug(true)}
                onBlur={() => setTimeout(() => setShowSug(false), 150)}
              />
              {showSug && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden z-50 shadow-xl">
                  {suggestions.map((s, i) => (
                    <button
                      key={`${s.set}:${s.name}-${i}`}
                      onMouseDown={() => applySuggestion(s)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-zinc-800 transition-colors"
                    >
                      <img
                        src={`${BASE}/api/icon/${s.set}/${s.name}?color=ffffff`}
                        alt={s.name}
                        className="w-4 h-4 opacity-60 flex-shrink-0"
                      />
                      <span className="text-xs text-zinc-300 truncate">{s.name}</span>
                      <span className="text-xs text-zinc-600 ml-auto flex-shrink-0">{s.set}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Color */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-600 uppercase tracking-widest">Color</label>
              <input
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500 w-full"
                value={color}
                placeholder="#f472b6"
                onChange={e => setColor(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchIcon()}
              />
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchIcon()}
              className="flex-1 bg-white text-black text-sm font-semibold rounded-xl py-2.5 hover:bg-zinc-200 transition-colors"
            >
              Obtener icono →
            </button>
            <button
              onClick={() => setToast(true)}
              className="text-xs text-zinc-500 hover:text-white border border-zinc-700 rounded-xl px-3 py-2.5 transition-colors"
            >
              ¿Cómo funciona?
            </button>
          </div>

          {/* Endpoint */}
          <code className="text-emerald-700 text-xs break-all">{endpoint}</code>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-700 text-xs tracking-widest uppercase">
        03 / 05
      </div>

      {toast && (
        <Toast
          message='Escribe en el campo Nombre para buscar iconos — aparecerán sugerencias. Elige una o escribe el nombre exacto. Ajusta el color HEX y haz clic en "Obtener icono".'
          onClose={() => setToast(false)}
        />
      )}
    </div>
  )
}
