'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import dynamic from 'next/dynamic'

const slides = [
  dynamic(() => import('./slides/HeroSlide')),
  dynamic(() => import('./slides/StatsSlide')),
  dynamic(() => import('./slides/GetIconSlide')),
  dynamic(() => import('./slides/SearchSlide')),
  dynamic(() => import('./slides/McpSlide')),
]

export default function Slideshow() {
  const [current, setCurrent] = useState(0)
  const animating = useRef(false)
  const currentRef = useRef(0)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])

  // Set initial positions via GSAP (not inline style) to avoid React re-render resets
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
      onComplete: () => {
        currentRef.current = next
        setCurrent(next)
        animating.current = false
      },
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
    <div
      className="relative w-screen h-screen overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {slides.map((Slide, i) => (
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
          className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors text-3xl z-50 select-none"
          aria-label="Previous"
        >
          ←
        </button>
      )}
      {current < slides.length - 1 && (
        <button
          onClick={() => goTo(current + 1)}
          className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors text-3xl z-50 select-none"
          aria-label="Next"
        >
          →
        </button>
      )}

      <div className="absolute bottom-8 right-8 flex gap-2 z-50">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-white w-4' : 'bg-zinc-600'}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
