'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Toast from '../Toast'

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? ''

export default function GetIconSlide() {
  const [svgContent, setSvgContent] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState({ set: 'lucide', name: 'heart', color: '#f472b6' })
  const [toast, setToast] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  async function fetchIcon() {
    setLoading(true)
    try {
      const url = `${BASE}/api/icon/${params.set}/${params.name}?color=${encodeURIComponent(params.color)}`
      const res = await fetch(url)
      if (res.ok) {
        const svg = await res.text()
        setSvgContent(svg)
        if (previewRef.current) {
          gsap.from(previewRef.current, { scale: 0.5, opacity: 0, duration: 0.4, ease: 'back.out(2)' })
        }
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchIcon() }, [])

  const endpoint = `/api/icon/${params.set}/${params.name}?color=${params.color}`

  return (
    <div className="relative w-full h-full flex flex-col lg:flex-row items-center justify-center gap-12 px-12">
      <div className="flex-1 max-w-lg">
        <p className="text-zinc-500 text-xs tracking-widest uppercase mb-2">Endpoint 01</p>
        <h2 className="text-[clamp(2rem,5vw,4rem)] font-black leading-none tracking-tighter uppercase mb-3">
          Obtener icono
        </h2>
        <p className="text-zinc-400 text-sm mb-6">
          Solicita cualquier icono por colección y nombre. Recibe el SVG listo para insertar, con el color que necesitas.
        </p>
        <code className="block bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 text-emerald-400 text-sm mb-6 break-all">
          GET {endpoint}
        </code>

        <div className="flex flex-wrap gap-3 mb-4">
          {[
            { field: 'set', placeholder: 'lucide', value: params.set, label: 'Colección' },
            { field: 'name', placeholder: 'heart', value: params.name, label: 'Nombre' },
            { field: 'color', placeholder: '#f472b6', value: params.color, label: 'Color' },
          ].map(({ field, placeholder, value, label }) => (
            <div key={field} className="flex flex-col gap-1">
              <label className="text-xs text-zinc-500 uppercase tracking-widest">{label}</label>
              <input
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white w-32 focus:outline-none focus:border-zinc-400"
                value={value}
                placeholder={placeholder}
                onChange={e => setParams(p => ({ ...p, [field]: e.target.value }))}
                onBlur={fetchIcon}
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => setToast(true)}
          className="text-xs text-zinc-500 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded-full px-4 py-2 transition-colors"
        >
          ¿Cómo lo uso?
        </button>
      </div>

      <div className="flex-shrink-0 flex flex-col items-center gap-4">
        <p className="text-zinc-600 text-xs uppercase tracking-widest">Vista previa</p>
        <div
          ref={previewRef}
          className="w-40 h-40 flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: loading ? '' : svgContent }}
        />
        {loading && <div className="text-zinc-600 text-sm">Cargando...</div>}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-600 text-sm tracking-widest uppercase">
        03 / 05
      </div>

      {toast && (
        <Toast
          message='Haz una petición GET a /api/icon/{colección}/{nombre}. Agrega ?color=%23ff0000 para cambiar el color. Devuelve SVG puro o JSON si envías Accept: application/json. Pruébalo: modifica los campos y haz clic fuera.'
          onClose={() => setToast(false)}
        />
      )}
    </div>
  )
}
