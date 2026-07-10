'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { HERO_ICON_IDS } from './icons'
import Toast from '../Toast'

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? ''

const positions = [
  // left column
  { top: '6%',   left: '4%',  size: 52, rotate: -15 },
  { top: '28%',  left: '2%',  size: 40, rotate: 10  },
  { top: '50%',  left: '5%',  size: 60, rotate: -8  },
  { top: '70%',  left: '3%',  size: 36, rotate: 20  },
  { bottom: '6%',left: '10%', size: 48, rotate: -25 },
  // right column
  { top: '5%',   right: '5%', size: 44, rotate: 18  },
  { top: '22%',  right: '3%', size: 64, rotate: -10 },
  { top: '45%',  right: '4%', size: 40, rotate: 12  },
  { top: '65%',  right: '2%', size: 56, rotate: -20 },
  { bottom: '8%',right: '8%', size: 36, rotate: 15  },
  // inner-left (slightly inset)
  { top: '15%',  left: '16%', size: 36, rotate: 8   },
  { top: '55%',  left: '14%', size: 44, rotate: -5  },
  { bottom: '18%',left: '20%',size: 32, rotate: 22  },
  // inner-right
  { top: '18%',  right: '16%',size: 40, rotate: -12 },
  { top: '60%',  right: '15%',size: 36, rotate: 6   },
  { bottom: '20%',right: '18%',size: 48, rotate: -18},
]

export default function HeroSlide() {
  const iconRefs = useRef<(HTMLDivElement | null)[]>([])
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const [icons, setIcons] = useState<{ name: string; svg: string }[]>([])
  const [toast, setToast] = useState(false)

  useEffect(() => {
    Promise.all(
      HERO_ICON_IDS.map(async ({ set, name }) => {
        const res = await fetch(`${BASE}/api/icon/${set}/${name}?color=%23ffffff`)
        if (!res.ok) return null
        const svg = await res.text()
        return { name: `${set}:${name}`, svg }
      })
    ).then(results => setIcons(results.filter(Boolean) as { name: string; svg: string }[]))
  }, [])

  useEffect(() => {
    if (icons.length === 0) return
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, { y: 80, opacity: 0, duration: 1, ease: 'power4.out', delay: 0.1 })
      gsap.from(subRef.current, { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.5 })
      iconRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.from(el, { scale: 0, opacity: 0, rotation: positions[i]?.rotate * 2, duration: 0.6, ease: 'back.out(1.7)', delay: 0.2 + i * 0.08 })
        gsap.to(el, { y: `${Math.sin(i) > 0 ? '+' : '-'}=12`, duration: 2.5 + i * 0.3, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.2 })
      })
    })
    return () => ctx.revert()
  }, [icons])

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none">
      {icons.map((icon, i) => (
        <div
          key={icon.name}
          ref={el => { iconRefs.current[i] = el }}
          className="absolute pointer-events-none [&_svg]:w-full [&_svg]:h-full"
          style={{
            top: (positions[i] as { top?: string }).top,
            left: (positions[i] as { left?: string }).left,
            right: (positions[i] as { right?: string }).right,
            bottom: (positions[i] as { bottom?: string }).bottom,
            width: positions[i].size,
            height: positions[i].size,
            transform: `rotate(${positions[i].rotate}deg)`,
            color: 'white',
            opacity: 0.18,
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
          +200k iconos · Gratis · Para tu IA
        </p>
        <p className="mt-3 text-zinc-600 text-sm max-w-md mx-auto">
          Instala Iconifika como herramienta MCP y tu IA podrá buscar e insertar iconos SVG en tu código sin esfuerzo.
        </p>
        <button
          onClick={() => setToast(true)}
          className="mt-6 text-xs text-zinc-500 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded-full px-4 py-2 transition-colors"
        >
          ¿Cómo funciona?
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-600 text-sm tracking-widest uppercase">
        01 / 04
      </div>

      {toast && (
        <Toast
          message="Iconifika es un MCP y Skill para Claude con acceso a +200K iconos SVG. Instálalo en Claude, Cursor, Windsurf, Cline, Zed u otro cliente MCP. Tu IA podrá buscar, previsualizar e insertar iconos directo en tu código — sin salir del editor. Navega con ← → para ver cómo."
          onClose={() => setToast(false)}
        />
      )}
    </div>
  )
}
