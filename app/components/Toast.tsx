'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface ToastProps {
  message: string
  onClose: () => void
}

export default function Toast({ message, onClose }: ToastProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.from(ref.current, { y: 20, opacity: 0, duration: 0.3, ease: 'power3.out' })
    const t = setTimeout(() => {
      gsap.to(ref.current, {
        y: 20, opacity: 0, duration: 0.25, ease: 'power3.in',
        onComplete: onClose,
      })
    }, 4000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div
      ref={ref}
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] max-w-sm w-[90vw] bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-sm text-zinc-200 shadow-xl"
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-4 text-zinc-500 hover:text-white text-lg leading-none"
        aria-label="Cerrar"
      >×</button>
      <p className="pr-6 leading-relaxed">{message}</p>
    </div>
  )
}
