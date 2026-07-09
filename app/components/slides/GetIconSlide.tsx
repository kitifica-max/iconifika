'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? ''

export default function GetIconSlide() {
  const [svgContent, setSvgContent] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState({ set: 'lucide', name: 'heart', color: '#f472b6' })
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
    <div className="relative w-full h-full flex flex-col lg:flex-row items-center justify-center gap-16 px-12">
      <div className="flex-1 max-w-lg">
        <p className="text-zinc-500 text-xs tracking-widest uppercase mb-4">Endpoint 01</p>
        <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black leading-none tracking-tighter uppercase mb-8">
          GET<br />ICON
        </h2>
        <code className="block bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 text-emerald-400 text-sm mb-8 break-all">
          GET {endpoint}
        </code>

        <div className="flex flex-wrap gap-3">
          {[
            { field: 'set', placeholder: 'lucide', value: params.set },
            { field: 'name', placeholder: 'heart', value: params.name },
            { field: 'color', placeholder: '#f472b6', value: params.color },
          ].map(({ field, placeholder, value }) => (
            <div key={field} className="flex flex-col gap-1">
              <label className="text-xs text-zinc-500 uppercase tracking-widest">{field}</label>
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
      </div>

      <div className="flex-shrink-0 flex flex-col items-center gap-6">
        <div
          ref={previewRef}
          className="w-48 h-48 flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: loading ? '' : svgContent }}
        />
        {loading && <div className="text-zinc-600 text-sm">Loading...</div>}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-600 text-sm tracking-widest uppercase">
        03 / 05
      </div>
    </div>
  )
}
