'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const stats = [
  { value: '200K+', label: 'ICONS' },
  { value: '150+', label: 'ICON SETS' },
  { value: '0', label: 'AUTH REQUIRED' },
  { value: '∞', label: 'FREE FOREVER' },
]

export default function StatsSlide() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.stat-item', {
        y: 60, opacity: 0, duration: 0.7, ease: 'power3.out',
        stagger: 0.15, delay: 0.1,
      })
      gsap.from('.stat-label', {
        opacity: 0, duration: 0.5, stagger: 0.15, delay: 0.4,
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="relative w-full h-full flex flex-col items-center justify-center px-8">
      <p className="text-zinc-500 text-sm tracking-widest uppercase mb-16">Built for AI workflows</p>

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

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-600 text-sm tracking-widest uppercase">
        02 / 05
      </div>
    </div>
  )
}
