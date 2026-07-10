'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import dynamic from 'next/dynamic'

const slides = [
  { component: dynamic(() => import('./slides/HeroSlide')), label: 'Inicio' },
  { component: dynamic(() => import('./slides/StatsSlide')), label: 'Por qué' },
  { component: dynamic(() => import('./slides/InstallSlide')), label: 'Instalar' },
  { component: dynamic(() => import('./slides/UseSlide')), label: 'Usar' },
]

export default function Slideshow() {
  const [current, setCurrent] = useState(0)
  const animating = useRef(false)
  const currentRef = useRef(0)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    slideRefs.current.forEach((el, i) => {
      if (el) gsap.set(el, { x: i === 0 ? '0%' : '100%' })
    })
  }, [])

  const goTo = useCallback((next: number) => {
    if (animating.current || next === currentRef.current || next < 0 || next >= slides.length) return
    animating.current = true
    const from = currentRef.current
    const dir = next > from ? 1 : -1
    const currentEl = slideRefs.current[from]
    const nextEl = slideRefs.current[next]
    if (!currentEl || !nextEl) { animating.current = false; return }
    gsap.set(nextEl, { x: `${dir * 100}%` })
    const tl = gsap.timeline({
      onComplete: () => { currentRef.current = next; setCurrent(next); animating.current = false },
    })
    tl.to(currentEl, { x: `${-dir * 100}%`, duration: 0.7, ease: 'power3.inOut' })
    tl.to(nextEl, { x: '0%', duration: 0.7, ease: 'power3.inOut' }, '<')
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goTo(currentRef.current + 1)
      if (e.key === 'ArrowLeft') goTo(currentRef.current - 1)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goTo])

  const touchStartX = useRef(0)
  function onTouchStart(e: React.TouchEvent) { touchStartX.current = e.touches[0].clientX }
  function onTouchEnd(e: React.TouchEvent) {
    const dx = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(dx) > 50) goTo(currentRef.current + (dx > 0 ? 1 : -1))
  }

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden">
      {/* Header nav */}
      <header className="flex-shrink-0 flex items-center justify-between px-6 py-4 z-50 border-b border-zinc-900">
        <button onClick={() => goTo(0)} className="flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity">
          <Image src="/iconifica_w.svg" alt="Iconifika" width={120} height={40} className="h-7 w-auto" />
        </button>
        <nav className="hidden sm:flex items-center gap-1">
          {slides.map((s, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`px-3 py-1.5 rounded-lg text-xs tracking-wide transition-colors ${
                current === i ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'
              }`}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Slides */}
      <div
        className="relative flex-1 overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {slides.map(({ component: Slide }, i) => (
          <div
            key={i}
            ref={el => { slideRefs.current[i] = el }}
            className="absolute inset-0 w-full h-full"
          >
            <Slide />
          </div>
        ))}

        {current > 0 && (
          <button
            onClick={() => goTo(current - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors text-2xl z-50 select-none"
            aria-label="Anterior"
          >←</button>
        )}
        {current < slides.length - 1 && (
          <button
            onClick={() => goTo(current + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors text-2xl z-50 select-none"
            aria-label="Siguiente"
          >→</button>
        )}

        <div className="absolute bottom-4 right-6 flex gap-2 z-50">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'bg-white w-4' : 'bg-zinc-600 w-1.5'}`}
              aria-label={`Ir a ${slides[i].label}`}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-t border-zinc-900 z-50">
        <p className="text-zinc-600 text-xs">
          Potenciado por{' '}
          <a href="https://iconify.design" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">
            Iconify
          </a>
          {' '}· Gratis y de código abierto
        </p>
        <p className="text-zinc-600 text-xs flex items-center gap-3">
          Un proyecto de{' '}
          <a href="https://kitifica.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity inline-flex items-center">
            <img src="/logo_kitifica_2.svg" alt="Kitifica" className="h-4" />
          </a>
          <span>·</span>
          <a href="/terms" className="hover:text-zinc-400 transition-colors">Términos de uso</a>
        </p>
      </footer>
    </div>
  )
}
