'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Toast from '../Toast'
import BackgroundIcons from './BackgroundIcons'
import { STATS_ICON_IDS } from './icons'

const stats = [
  { value: '200K+', label: 'ICONOS' },
  { value: '150+', label: 'COLECCIONES' },
  { value: '0', label: 'AUTH REQUERIDA' },
  { value: '∞', label: 'GRATIS SIEMPRE' },
]

export default function StatsSlide() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [toast, setToast] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.stat-item', { y: 60, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.15, delay: 0.1 })
      gsap.from('.stat-label', { opacity: 0, duration: 0.5, stagger: 0.15, delay: 0.4 })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="relative w-full h-full flex flex-col items-center justify-center px-8">
      <BackgroundIcons icons={STATS_ICON_IDS} />
      <p className="text-zinc-500 text-sm tracking-widest uppercase mb-2">Por qué Iconifika</p>
      <p className="text-zinc-400 text-base text-center max-w-md mb-12">
        Los LLMs generan SVGs inline desperdiciando miles de tokens. Iconifika los entrega en una sola llamada.
      </p>

      <div className="grid grid-cols-2 gap-x-24 gap-y-16 text-center">
        {stats.map((s) => (
          <div key={s.label} className="stat-item">
            <div className="text-[clamp(3rem,8vw,7rem)] font-black leading-none tracking-tighter">
              {s.value}
            </div>
            <div className="stat-label mt-3 text-zinc-500 text-sm tracking-widest uppercase">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setToast(true)}
        className="mt-12 text-xs text-zinc-500 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded-full px-4 py-2 transition-colors"
      >
        ¿Por qué importa?
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-600 text-sm tracking-widest uppercase">
        02 / 04
      </div>

      {toast && (
        <Toast
          message="En lugar de que tu IA genere 200 líneas de SVG, Iconifika las entrega en una sola llamada MCP. Menos tokens, más velocidad, código más limpio."
          onClose={() => setToast(false)}
        />
      )}
    </div>
  )
}
