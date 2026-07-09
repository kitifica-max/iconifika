'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { HERO_ICONS } from './icons'
import Toast from '../Toast'

const positions = [
  { top: '8%', left: '5%', size: 64, rotate: -15, color: '#a78bfa' },
  { top: '12%', right: '8%', size: 80, rotate: 20, color: '#34d399' },
  { top: '40%', left: '3%', size: 56, rotate: 10, color: '#f472b6' },
  { top: '60%', right: '5%', size: 72, rotate: -8, color: '#fbbf24' },
  { bottom: '15%', left: '8%', size: 60, rotate: 25, color: '#60a5fa' },
  { bottom: '10%', right: '12%', size: 48, rotate: -20, color: '#f87171' },
  { top: '25%', left: '18%', size: 40, rotate: 5, color: '#a3e635' },
  { top: '70%', right: '20%', size: 52, rotate: -12, color: '#e879f9' },
]

export default function HeroSlide() {
  const iconRefs = useRef<(HTMLDivElement | null)[]>([])
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const [toast, setToast] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, { y: 80, opacity: 0, duration: 1, ease: 'power4.out', delay: 0.1 })
      gsap.from(subRef.current, { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.5 })
      iconRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.from(el, { scale: 0, opacity: 0, rotation: positions[i].rotate * 2, duration: 0.6, ease: 'back.out(1.7)', delay: 0.2 + i * 0.08 })
        gsap.to(el, { y: `${Math.sin(i) > 0 ? '+' : '-'}=12`, duration: 2.5 + i * 0.3, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.2 })
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none">
      {HERO_ICONS.map((icon, i) => (
        <div
          key={icon.name}
          ref={el => { iconRefs.current[i] = el }}
          className="absolute pointer-events-none"
          style={{
            top: (positions[i] as { top?: string }).top,
            left: (positions[i] as { left?: string }).left,
            right: (positions[i] as { right?: string }).right,
            bottom: (positions[i] as { bottom?: string }).bottom,
            width: positions[i].size,
            height: positions[i].size,
            transform: `rotate(${positions[i].rotate}deg)`,
            color: positions[i].color,
            opacity: 0.85,
          }}
          dangerouslySetInnerHTML={{ __html: icon.svg }}
        />
      ))}

      <div className="text-center z-10 px-8">
        <h1 ref={titleRef} className="flex justify-center">
          <Image
            src="/iconifica_w.svg"
            alt="Iconifika"
            width={600}
            height={200}
            priority
            className="w-[clamp(160px,28vw,380px)] h-auto"
          />
        </h1>
        <p ref={subRef} className="mt-6 text-zinc-400 text-lg tracking-widest uppercase">
          API de SVG · +200k iconos · Gratis · Compatible con MCP
        </p>
        <p className="mt-3 text-zinc-600 text-sm max-w-md mx-auto">
          Entrega iconos SVG optimizados a tus agentes de IA en milisegundos. Sin autenticación, sin límites.
        </p>
        <button
          onClick={() => setToast(true)}
          className="mt-6 text-xs text-zinc-500 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded-full px-4 py-2 transition-colors"
        >
          ¿Cómo funciona?
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-600 text-sm tracking-widest uppercase">
        01 / 05
      </div>

      {toast && (
        <Toast
          message="Iconifika es una API pública que sirve iconos SVG listos para usar. Consúmela vía HTTP directo o instálala como herramienta MCP en Claude Code, Cursor u otro LLM. Navega con las flechas o las teclas ← → para ver todos los endpoints."
          onClose={() => setToast(false)}
        />
      )}
    </div>
  )
}
