'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? ''

type IconDef = { set: string; name: string }

// 5 left + 5 right positions
const POSITIONS = [
  { top: '8%',   left: '3%',  size: 44, rotate: -14 },
  { top: '26%',  left: '2%',  size: 36, rotate: 8   },
  { top: '48%',  left: '4%',  size: 52, rotate: -6  },
  { top: '67%',  left: '3%',  size: 38, rotate: 18  },
  { bottom: '8%',left: '7%',  size: 44, rotate: -22 },
  { top: '10%',  right: '3%', size: 40, rotate: 16  },
  { top: '30%',  right: '2%', size: 56, rotate: -10 },
  { top: '52%',  right: '4%', size: 36, rotate: 8   },
  { top: '70%',  right: '3%', size: 48, rotate: -16 },
  { bottom: '9%',right: '7%', size: 40, rotate: 20  },
]

export default function BackgroundIcons({ icons: iconDefs }: { icons: IconDef[] }) {
  const refs = useRef<(HTMLDivElement | null)[]>([])
  const [icons, setIcons] = useState<{ svg: string }[]>([])

  useEffect(() => {
    Promise.all(
      iconDefs.map(async ({ set, name }) => {
        const res = await fetch(`${BASE}/api/icon/${set}/${name}?color=%23ffffff`)
        if (!res.ok) return null
        return { svg: await res.text() }
      })
    ).then(r => setIcons(r.filter(Boolean) as { svg: string }[]))
  }, [])

  useEffect(() => {
    if (!icons.length) return
    const ctx = gsap.context(() => {
      refs.current.forEach((el, i) => {
        if (!el) return
        gsap.from(el, { scale: 0, opacity: 0, rotation: (POSITIONS[i]?.rotate ?? 0) * 2, duration: 0.6, ease: 'back.out(1.7)', delay: 0.1 + i * 0.07 })
        gsap.to(el, { y: `${Math.sin(i) >= 0 ? '+' : '-'}=10`, duration: 2.5 + i * 0.3, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.15 })
      })
    })
    return () => ctx.revert()
  }, [icons])

  return (
    <>
      {icons.map((icon, i) => {
        const pos = POSITIONS[i]
        if (!pos) return null
        return (
          <div
            key={i}
            ref={el => { refs.current[i] = el }}
            className="absolute pointer-events-none [&_svg]:w-full [&_svg]:h-full"
            style={{
              top: (pos as { top?: string }).top,
              left: (pos as { left?: string }).left,
              right: (pos as { right?: string }).right,
              bottom: (pos as { bottom?: string }).bottom,
              width: pos.size,
              height: pos.size,
              transform: `rotate(${pos.rotate}deg)`,
              color: 'white',
              opacity: 0.12,
            }}
            dangerouslySetInnerHTML={{ __html: icon.svg }}
          />
        )
      })}
    </>
  )
}
