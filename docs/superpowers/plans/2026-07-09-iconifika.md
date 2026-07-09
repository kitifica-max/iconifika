# Iconifika Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Desplegar una API pública y gratuita de iconos SVG (powered by Iconify) en Netlify, más un MCP Server para que los LLMs la consuman nativamente.

**Architecture:** Next.js 15 App Router desplegado en Netlify con route handlers como serverless functions. Los iconos viven en `@iconify/json` (bundled, ~70MB). El MCP Server es un script Node.js standalone que los usuarios instalan localmente y apunta al endpoint de Netlify.

**Tech Stack:** Next.js 15, TypeScript, @iconify/json, @iconify/utils, @modelcontextprotocol/sdk, Netlify, Tailwind CSS, shadcn/ui

## Global Constraints

- Node.js 20+
- TypeScript strict mode (`"strict": true`)
- Next.js 15 App Router únicamente (no Pages Router)
- Todos los route handlers deben retornar `Response` nativo (no `NextResponse`)
- Headers CORS abiertos en todos los endpoints (`Access-Control-Allow-Origin: *`)
- El MCP Server corre en stdio transport (estándar para Claude Code)
- Sin auth, sin rate limiting, sin base de datos — pura utilidad

---

## File Structure

```
iconifika/
├── app/
│   ├── api/
│   │   ├── icon/[set]/[name]/route.ts   # GET /api/icon/{set}/{name} → SVG
│   │   ├── search/route.ts              # GET /api/search?q=&set=&limit=
│   │   └── sets/route.ts               # GET /api/sets → lista de icon sets
│   ├── layout.tsx
│   └── page.tsx                         # Landing page con docs inline
├── lib/
│   └── iconify.ts                       # Helpers compartidos de Iconify
├── mcp/
│   └── server.ts                        # MCP Server standalone (stdio)
├── public/
├── package.json
├── next.config.ts
├── netlify.toml
└── tsconfig.json
```

---

### Task 1: Scaffolding del proyecto Next.js

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `netlify.toml`
- Create: `app/layout.tsx`

**Interfaces:**
- Produces: proyecto Next.js 15 funcional con TypeScript, listo para añadir routes

- [ ] **Step 1: Crear proyecto Next.js**

```bash
cd "/Users/daniel_elaniin/Documents/DP/Deploys - Kitifica/Iconifika"
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --no-eslint --import-alias "@/*" --yes
```

Esperado: archivos generados sin errores.

- [ ] **Step 2: Instalar dependencias de Iconify y MCP**

```bash
npm install @iconify/json @iconify/utils @modelcontextprotocol/sdk
```

`@iconify/json` es ~70MB — es intencional, contiene todos los iconos.

- [ ] **Step 3: Instalar shadcn/ui**

```bash
npx shadcn@latest init --defaults
npx shadcn@latest add badge button card input
```

- [ ] **Step 4: Configurar netlify.toml**

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

- [ ] **Step 5: Instalar plugin de Netlify para Next.js**

```bash
npm install -D @netlify/plugin-nextjs
```

- [ ] **Step 6: Verificar que el proyecto compila**

```bash
npm run build
```

Esperado: `✓ Compiled successfully` sin errores de TypeScript.

- [ ] **Step 7: Commit**

```bash
git init
git add .
git commit -m "chore: scaffold Next.js 15 project with Iconify and MCP deps"
```

---

### Task 2: Librería de utilidades de Iconify (`lib/iconify.ts`)

**Files:**
- Create: `lib/iconify.ts`

**Interfaces:**
- Produces:
  - `getIconSvg(set: string, name: string, color?: string): string | null`
  - `searchIcons(query: string, set?: string, limit?: number): IconResult[]`
  - `listSets(): SetInfo[]`
  - `type IconResult = { set: string; name: string; body: string }`
  - `type SetInfo = { id: string; name: string; total: number }`

- [ ] **Step 1: Escribir el test de la librería**

Crear `lib/iconify.test.ts`:

```typescript
import { getIconSvg, searchIcons, listSets } from './iconify'

describe('getIconSvg', () => {
  it('retorna SVG para icono existente', () => {
    const svg = getIconSvg('mdi', 'home')
    expect(svg).toContain('<svg')
    expect(svg).toContain('viewBox')
  })

  it('retorna null para icono inexistente', () => {
    const svg = getIconSvg('mdi', 'icono-que-no-existe-xyz')
    expect(svg).toBeNull()
  })

  it('inyecta color cuando se especifica', () => {
    const svg = getIconSvg('mdi', 'home', '#ff0000')
    expect(svg).toContain('#ff0000')
  })
})

describe('searchIcons', () => {
  it('retorna resultados para query válida', () => {
    const results = searchIcons('home')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0]).toHaveProperty('set')
    expect(results[0]).toHaveProperty('name')
    expect(results[0]).toHaveProperty('body')
  })

  it('filtra por set cuando se especifica', () => {
    const results = searchIcons('home', 'lucide')
    expect(results.every(r => r.set === 'lucide')).toBe(true)
  })

  it('respeta el límite', () => {
    const results = searchIcons('icon', undefined, 5)
    expect(results.length).toBeLessThanOrEqual(5)
  })
})

describe('listSets', () => {
  it('retorna lista de sets', () => {
    const sets = listSets()
    expect(sets.length).toBeGreaterThan(0)
    expect(sets[0]).toHaveProperty('id')
    expect(sets[0]).toHaveProperty('name')
    expect(sets[0]).toHaveProperty('total')
  })
})
```

- [ ] **Step 2: Instalar test runner**

```bash
npm install -D jest @types/jest ts-jest
```

Añadir a `package.json`:
```json
{
  "scripts": {
    "test": "jest"
  },
  "jest": {
    "preset": "ts-jest",
    "testEnvironment": "node",
    "testPathPattern": "\\.test\\.ts$"
  }
}
```

- [ ] **Step 3: Correr test para verificar que falla**

```bash
npm test -- lib/iconify.test.ts
```

Esperado: FAIL — `Cannot find module './iconify'`

- [ ] **Step 4: Implementar `lib/iconify.ts`**

```typescript
import { locate } from '@iconify/json'
import { getIconData, iconToSVG, replaceIDs } from '@iconify/utils'
import { readFileSync } from 'fs'

export type IconResult = { set: string; name: string; body: string }
export type SetInfo = { id: string; name: string; total: number }

function loadIconSet(set: string) {
  try {
    const filePath = locate(set)
    return JSON.parse(readFileSync(filePath, 'utf-8'))
  } catch {
    return null
  }
}

export function getIconSvg(set: string, name: string, color?: string): string | null {
  const iconSet = loadIconSet(set)
  if (!iconSet) return null

  const iconData = getIconData(iconSet, name)
  if (!iconData) return null

  const rendered = iconToSVG(iconData, { height: 'auto' })
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" ${
    Object.entries(rendered.attributes)
      .map(([k, v]) => `${k}="${v}"`)
      .join(' ')
  }>${replaceIDs(rendered.body)}</svg>`

  if (color) {
    svg = svg.replace(/currentColor/g, color)
  }

  return svg
}

export function searchIcons(query: string, set?: string, limit = 20): IconResult[] {
  const { collections } = require('@iconify/json')
  const setsToSearch = set ? [set] : Object.keys(collections).slice(0, 30)
  const results: IconResult[] = []
  const q = query.toLowerCase()

  for (const s of setsToSearch) {
    if (results.length >= limit) break
    const iconSet = loadIconSet(s)
    if (!iconSet?.icons) continue

    const matches = Object.keys(iconSet.icons).filter(n => n.includes(q))
    for (const n of matches) {
      if (results.length >= limit) break
      const iconData = getIconData(iconSet, n)
      if (iconData) {
        const rendered = iconToSVG(iconData, { height: 'auto' })
        results.push({ set: s, name: n, body: rendered.body })
      }
    }
  }

  return results
}

export function listSets(): SetInfo[] {
  const { collections } = require('@iconify/json')
  return Object.entries(collections).map(([id, meta]: [string, any]) => ({
    id,
    name: meta.name ?? id,
    total: meta.total ?? 0,
  }))
}
```

- [ ] **Step 5: Correr tests**

```bash
npm test -- lib/iconify.test.ts
```

Esperado: PASS (3 suites, ~7 tests).

- [ ] **Step 6: Commit**

```bash
git add lib/iconify.ts lib/iconify.test.ts package.json
git commit -m "feat: add iconify utility library with get, search, and list"
```

---

### Task 3: API Route — `GET /api/icon/[set]/[name]`

**Files:**
- Create: `app/api/icon/[set]/[name]/route.ts`

**Interfaces:**
- Consumes: `getIconSvg(set, name, color?)` de `lib/iconify.ts`
- Produces: endpoint `GET /api/icon/:set/:name?color=#hex`
  - 200: SVG como `image/svg+xml` o JSON `{ svg: string }` según `Accept` header
  - 404: `{ error: "Icon not found" }`

- [ ] **Step 1: Crear el route handler**

```typescript
// app/api/icon/[set]/[name]/route.ts
import { getIconSvg } from '@/lib/iconify'
import { NextRequest } from 'next/server'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ set: string; name: string }> }
) {
  const { set, name } = await params
  const color = request.nextUrl.searchParams.get('color') ?? undefined

  const svg = getIconSvg(set, name, color)

  if (!svg) {
    return Response.json(
      { error: 'Icon not found', set, name },
      { status: 404, headers: CORS }
    )
  }

  const accept = request.headers.get('accept') ?? ''
  if (accept.includes('application/json')) {
    return Response.json({ svg, set, name }, { headers: CORS })
  }

  return new Response(svg, {
    headers: { ...CORS, 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' },
  })
}
```

- [ ] **Step 2: Verificar manualmente en dev**

```bash
npm run dev
```

En otra terminal:
```bash
curl http://localhost:3000/api/icon/mdi/home
curl http://localhost:3000/api/icon/lucide/heart?color=%23ff0000
curl -H "Accept: application/json" http://localhost:3000/api/icon/mdi/home
curl http://localhost:3000/api/icon/mdi/icono-inexistente
```

Esperado:
- Primeros dos: SVG válido
- Tercero: JSON con campo `svg`
- Cuarto: `{"error":"Icon not found",...}` con status 404

- [ ] **Step 3: Commit**

```bash
git add app/api/icon/
git commit -m "feat: add GET /api/icon/[set]/[name] endpoint"
```

---

### Task 4: API Route — `GET /api/search`

**Files:**
- Create: `app/api/search/route.ts`

**Interfaces:**
- Consumes: `searchIcons(query, set?, limit?)` de `lib/iconify.ts`
- Produces: endpoint `GET /api/search?q=heart&set=lucide&limit=10`
  - 200: `{ results: IconResult[], total: number, query: string }`
  - 400: `{ error: "q parameter required" }`

- [ ] **Step 1: Crear el route handler**

```typescript
// app/api/search/route.ts
import { searchIcons } from '@/lib/iconify'
import { NextRequest } from 'next/server'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')
  const set = request.nextUrl.searchParams.get('set') ?? undefined
  const limit = Math.min(Number(request.nextUrl.searchParams.get('limit') ?? 20), 50)

  if (!q) {
    return Response.json({ error: 'q parameter required' }, { status: 400, headers: CORS })
  }

  const results = searchIcons(q, set, limit)

  return Response.json(
    { results, total: results.length, query: q },
    { headers: { ...CORS, 'Cache-Control': 'public, max-age=300' } }
  )
}
```

- [ ] **Step 2: Verificar en dev**

```bash
curl "http://localhost:3000/api/search?q=home&limit=5"
curl "http://localhost:3000/api/search?q=heart&set=lucide"
curl "http://localhost:3000/api/search"
```

Esperado:
- Primeros dos: JSON con array `results`
- Tercero: `{"error":"q parameter required"}` status 400

- [ ] **Step 3: Commit**

```bash
git add app/api/search/route.ts
git commit -m "feat: add GET /api/search endpoint"
```

---

### Task 5: API Route — `GET /api/sets`

**Files:**
- Create: `app/api/sets/route.ts`

**Interfaces:**
- Consumes: `listSets()` de `lib/iconify.ts`
- Produces: endpoint `GET /api/sets`
  - 200: `{ sets: SetInfo[], total: number }`

- [ ] **Step 1: Crear el route handler**

```typescript
// app/api/sets/route.ts
import { listSets } from '@/lib/iconify'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}

export async function GET() {
  const sets = listSets()
  return Response.json(
    { sets, total: sets.length },
    { headers: { ...CORS, 'Cache-Control': 'public, max-age=3600' } }
  )
}
```

- [ ] **Step 2: Verificar en dev**

```bash
curl http://localhost:3000/api/sets | head -c 500
```

Esperado: JSON con array `sets`, cada item con `id`, `name`, `total`.

- [ ] **Step 3: Commit**

```bash
git add app/api/sets/route.ts
git commit -m "feat: add GET /api/sets endpoint"
```

---

### Task 6: Landing page — GSAP Slideshow interactivo

**Diseño:** Fullscreen slideshow sin navbar. Navegación con flechas, teclado (←→) y swipe. Cada slide = sección cuadrada con tipografía bold masiva + iconos SVG flotantes animados. Estética editorial/técnica — fondo oscuro, texto blanco, acentos de color. GSAP maneja todas las transiciones.

**Slides:**
1. **Hero** — `ICONI\nFIKA` en tipografía gigante + grid de iconos famosos flotando
2. **Free & Open** — `200K+\nICONS` + contador animado + iconos dispersos
3. **Get Icon** — endpoint `/api/icon/[set]/[name]` con live demo interactiva
4. **Search** — endpoint `/api/search` con demo de búsqueda en vivo
5. **MCP / AI** — config snippet para Claude Code + iconos de LLMs

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Create: `app/components/Slideshow.tsx` — lógica de navegación GSAP
- Create: `app/components/slides/HeroSlide.tsx`
- Create: `app/components/slides/StatsSlide.tsx`
- Create: `app/components/slides/GetIconSlide.tsx`
- Create: `app/components/slides/SearchSlide.tsx`
- Create: `app/components/slides/McpSlide.tsx`

**Interfaces:**
- Consumes: `NEXT_PUBLIC_BASE_URL` para demos live
- Produces: SPA de una página con 5 slides navegables vía GSAP

- [ ] **Step 1: Instalar GSAP**

```bash
npm install gsap
npm install -D @types/gsap
```

- [ ] **Step 2: Actualizar layout.tsx**

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'

const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Iconifika — SVG API for LLMs',
  description: 'Free Iconify API. 200k+ icons. MCP-ready. Zero auth.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${grotesk.variable} font-sans bg-black text-white antialiased overflow-hidden`}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Crear los iconos famosos como constantes**

Los iconos se renderizan inline — no hacen fetch, están hardcodeados como strings SVG mínimos para el hero decorativo.

```tsx
// app/components/slides/icons.ts
export const HERO_ICONS = [
  // lucide: home, heart, star, zap, code, layers, globe, cpu
  { name: 'home', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>` },
  { name: 'heart', svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>` },
  { name: 'star', svg: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>` },
  { name: 'zap', svg: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>` },
  { name: 'code', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>` },
  { name: 'layers', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>` },
  { name: 'globe', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>` },
  { name: 'cpu', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>` },
]
```

- [ ] **Step 4: Crear HeroSlide**

```tsx
// app/components/slides/HeroSlide.tsx
'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { HERO_ICONS } from './icons'

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title entrance
      gsap.from(titleRef.current, {
        y: 80, opacity: 0, duration: 1, ease: 'power4.out', delay: 0.1,
      })
      gsap.from(subRef.current, {
        y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.5,
      })
      // Icons entrance + float loop
      iconRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.from(el, {
          scale: 0, opacity: 0, rotation: positions[i].rotate * 2,
          duration: 0.6, ease: 'back.out(1.7)', delay: 0.2 + i * 0.08,
        })
        gsap.to(el, {
          y: `${Math.sin(i) > 0 ? '+' : '-'}=12`,
          duration: 2.5 + i * 0.3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: i * 0.2,
        })
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none">
      {/* Floating icons */}
      {HERO_ICONS.map((icon, i) => (
        <div
          key={icon.name}
          ref={el => { iconRefs.current[i] = el }}
          className="absolute pointer-events-none"
          style={{
            ...positions[i],
            width: positions[i].size,
            height: positions[i].size,
            transform: `rotate(${positions[i].rotate}deg)`,
            color: positions[i].color,
            opacity: 0.85,
          }}
          dangerouslySetInnerHTML={{ __html: icon.svg }}
        />
      ))}

      {/* Title */}
      <div className="text-center z-10 px-8">
        <h1
          ref={titleRef}
          className="text-[clamp(5rem,18vw,14rem)] font-black leading-none tracking-tighter uppercase"
          style={{ fontVariationSettings: '"wght" 900' }}
        >
          ICONI<br />
          <span className="text-transparent" style={{ WebkitTextStroke: '3px white' }}>FIKA</span>
        </h1>
        <p
          ref={subRef}
          className="mt-6 text-zinc-400 text-xl tracking-widest uppercase"
        >
          SVG API · 200k+ Icons · Free · MCP Ready
        </p>
      </div>

      {/* Slide indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-600 text-sm tracking-widest uppercase">
        01 / 05
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Crear StatsSlide**

```tsx
// app/components/slides/StatsSlide.tsx
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
```

- [ ] **Step 6: Crear GetIconSlide**

```tsx
// app/components/slides/GetIconSlide.tsx
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
      {/* Left: info */}
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

      {/* Right: preview */}
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
```

- [ ] **Step 7: Crear SearchSlide**

```tsx
// app/components/slides/SearchSlide.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? ''

type Result = { set: string; name: string; body: string }

export default function SearchSlide() {
  const [query, setQuery] = useState('arrow')
  const [results, setResults] = useState<Result[]>([])
  const gridRef = useRef<HTMLDivElement>(null)

  async function search(q: string) {
    if (!q.trim()) return
    const res = await fetch(`${BASE}/api/search?q=${encodeURIComponent(q)}&limit=12`)
    if (!res.ok) return
    const { results: r } = await res.json()
    setResults(r)
    if (gridRef.current) {
      gsap.from(gridRef.current.children, {
        scale: 0, opacity: 0, duration: 0.3, stagger: 0.03, ease: 'back.out(1.5)',
      })
    }
  }

  useEffect(() => { search(query) }, [])

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-12 gap-10">
      <div className="text-center">
        <p className="text-zinc-500 text-xs tracking-widest uppercase mb-4">Endpoint 02</p>
        <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black leading-none tracking-tighter uppercase">
          SEARCH
        </h2>
      </div>

      <div className="w-full max-w-md">
        <input
          className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 text-xl text-white focus:outline-none focus:border-zinc-400 text-center tracking-wide"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search(query)}
          placeholder="Search icons..."
        />
        <p className="text-center text-zinc-600 text-xs mt-2">
          <code className="text-emerald-700">GET /api/search?q={query}&limit=12</code>
        </p>
      </div>

      <div ref={gridRef} className="grid grid-cols-6 gap-4">
        {results.map((r, i) => (
          <div
            key={`${r.set}-${r.name}-${i}`}
            title={`${r.set}:${r.name}`}
            className="w-12 h-12 text-white/70 hover:text-white transition-colors cursor-default"
            dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${r.body}</svg>` }}
          />
        ))}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-600 text-sm tracking-widest uppercase">
        04 / 05
      </div>
    </div>
  )
}
```

- [ ] **Step 8: Crear McpSlide**

```tsx
// app/components/slides/McpSlide.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://iconifika.netlify.app'

const config = `{
  "mcpServers": {
    "iconifika": {
      "command": "npx",
      "args": ["-y", "iconifika-mcp"],
      "env": {
        "ICONIFIKA_BASE_URL": "${BASE}"
      }
    }
  }
}`

export default function McpSlide() {
  const [copied, setCopied] = useState(false)
  const codeRef = useRef<HTMLPreElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.mcp-title', { y: 60, opacity: 0, duration: 0.8, ease: 'power3.out' })
      gsap.from('.mcp-code', { y: 40, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.3 })
      gsap.from('.mcp-hint', { opacity: 0, duration: 0.5, delay: 0.7 })
    })
    return () => ctx.revert()
  }, [])

  function copy() {
    navigator.clipboard.writeText(config)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-12 gap-10">
      <div className="text-center">
        <p className="text-zinc-500 text-xs tracking-widest uppercase mb-4">For AI Workflows</p>
        <h2 className="mcp-title text-[clamp(2.5rem,6vw,5rem)] font-black leading-none tracking-tighter uppercase">
          MCP<br />
          <span className="text-transparent" style={{ WebkitTextStroke: '2px white' }}>READY</span>
        </h2>
      </div>

      <div className="mcp-code w-full max-w-xl relative">
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">
          Add to <code className="text-zinc-400">~/.claude/settings.json</code>
        </p>
        <pre
          ref={codeRef}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-xs text-zinc-300 overflow-x-auto"
        >
          {config}
        </pre>
        <button
          onClick={copy}
          className="absolute top-10 right-4 text-xs text-zinc-500 hover:text-white transition-colors px-3 py-1 border border-zinc-700 rounded-lg"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <p className="mcp-hint text-zinc-600 text-sm text-center">
        Works with Claude Code · Cursor · any MCP-compatible LLM
      </p>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-600 text-sm tracking-widest uppercase">
        05 / 05
      </div>
    </div>
  )
}
```

- [ ] **Step 9: Crear Slideshow.tsx**

```tsx
// app/components/Slideshow.tsx
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
  const [animating, setAnimating] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])

  const goTo = useCallback((next: number) => {
    if (animating || next === current || next < 0 || next >= slides.length) return
    setAnimating(true)

    const dir = next > current ? 1 : -1
    const currentEl = slideRefs.current[current]
    const nextEl = slideRefs.current[next]
    if (!currentEl || !nextEl) return

    gsap.set(nextEl, { x: `${dir * 100}%`, opacity: 1 })

    const tl = gsap.timeline({
      onComplete: () => { setCurrent(next); setAnimating(false) },
    })
    tl.to(currentEl, { x: `${-dir * 100}%`, duration: 0.7, ease: 'power3.inOut' })
    tl.to(nextEl, { x: '0%', duration: 0.7, ease: 'power3.inOut' }, '<')
  }, [current, animating])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goTo(current + 1)
      if (e.key === 'ArrowLeft') goTo(current - 1)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [current, goTo])

  // Touch/swipe
  const touchStartX = useRef(0)
  function onTouchStart(e: React.TouchEvent) { touchStartX.current = e.touches[0].clientX }
  function onTouchEnd(e: React.TouchEvent) {
    const dx = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(dx) > 50) goTo(current + (dx > 0 ? 1 : -1))
  }

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {slides.map((Slide, i) => (
        <div
          key={i}
          ref={el => { slideRefs.current[i] = el }}
          className="absolute inset-0 w-full h-full"
          style={{ transform: `translateX(${i === 0 ? '0%' : '100%'})` }}
        >
          <Slide />
        </div>
      ))}

      {/* Nav arrows */}
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

      {/* Dots */}
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
```

- [ ] **Step 10: Actualizar page.tsx**

```tsx
// app/page.tsx
import Slideshow from '@/app/components/Slideshow'

export default function Page() {
  return <Slideshow />
}
```

- [ ] **Step 11: Crear `.env.local`**

```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

- [ ] **Step 12: Verificar en dev**

```bash
npm run dev
```

Abrir `http://localhost:3000`. Verificar:
- Slide 1 (Hero): tipografía gigante + iconos flotando con animación
- Flechas ← → navegan entre slides con transición horizontal GSAP
- Teclas ← → del teclado funcionan
- Slide 3 (GetIcon): cambiar `name` y `color`, click fuera del input → preview actualiza
- Slide 4 (Search): escribir query + Enter → grid de iconos anima entrada
- Slide 5 (MCP): botón Copy copia el JSON al clipboard

- [ ] **Step 13: Commit**

```bash
git add app/layout.tsx app/page.tsx app/components/ .env.local
git commit -m "feat: add GSAP interactive slideshow landing page"
```

---

### Task 7: MCP Server standalone

**Files:**
- Create: `mcp/server.ts`
- Create: `mcp/package.json`
- Create: `mcp/tsconfig.json`

**Interfaces:**
- Consumes: `ICONIFIKA_BASE_URL` env var (default `https://iconifika.netlify.app`)
- Produces: MCP server con herramientas:
  - `get_icon(set, name, color?)` → SVG string
  - `search_icons(query, set?, limit?)` → array de resultados
  - `list_sets()` → array de sets disponibles

- [ ] **Step 1: Crear package.json del MCP**

```json
{
  "name": "iconifika-mcp",
  "version": "1.0.0",
  "description": "MCP server for Iconifika SVG API",
  "main": "dist/server.js",
  "bin": {
    "iconifika-mcp": "dist/server.js"
  },
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0"
  }
}
```

- [ ] **Step 2: Crear tsconfig del MCP**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "outDir": "dist",
    "rootDir": ".",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["server.ts"]
}
```

- [ ] **Step 3: Implementar el MCP Server**

```typescript
// mcp/server.ts
#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

const BASE = process.env.ICONIFIKA_BASE_URL ?? 'https://iconifika.netlify.app'

const server = new McpServer({
  name: 'iconifika',
  version: '1.0.0',
})

server.tool(
  'get_icon',
  'Get an SVG icon by set and name. Returns the SVG string ready to embed.',
  {
    set: z.string().describe('Icon set id, e.g. "lucide", "mdi", "heroicons"'),
    name: z.string().describe('Icon name, e.g. "home", "heart", "user"'),
    color: z.string().optional().describe('Hex color to replace currentColor, e.g. "#3b82f6"'),
  },
  async ({ set, name, color }) => {
    const url = new URL(`${BASE}/api/icon/${set}/${name}`)
    if (color) url.searchParams.set('color', color)

    const res = await fetch(url.toString(), { headers: { Accept: 'application/json' } })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Not found' }))
      return { content: [{ type: 'text', text: `Error: ${err.error}` }], isError: true }
    }

    const { svg } = await res.json()
    return { content: [{ type: 'text', text: svg }] }
  }
)

server.tool(
  'search_icons',
  'Search for icons by name or keyword. Returns matching icons with their SVG body.',
  {
    query: z.string().describe('Search term, e.g. "arrow", "check", "home"'),
    set: z.string().optional().describe('Filter by icon set, e.g. "lucide"'),
    limit: z.number().min(1).max(50).optional().default(10).describe('Max results (default 10)'),
  },
  async ({ query, set, limit }) => {
    const url = new URL(`${BASE}/api/search`)
    url.searchParams.set('q', query)
    if (set) url.searchParams.set('set', set)
    url.searchParams.set('limit', String(limit))

    const res = await fetch(url.toString())
    if (!res.ok) return { content: [{ type: 'text', text: 'Search failed' }], isError: true }

    const { results } = await res.json()
    const text = results
      .map((r: { set: string; name: string }) => `${r.set}:${r.name}`)
      .join('\n')

    return { content: [{ type: 'text', text: text || 'No results found' }] }
  }
)

server.tool(
  'list_sets',
  'List all available icon sets with their names and icon count.',
  {},
  async () => {
    const res = await fetch(`${BASE}/api/sets`)
    if (!res.ok) return { content: [{ type: 'text', text: 'Failed to fetch sets' }], isError: true }

    const { sets } = await res.json()
    const text = sets
      .map((s: { id: string; name: string; total: number }) => `${s.id} — ${s.name} (${s.total} icons)`)
      .join('\n')

    return { content: [{ type: 'text', text }] }
  }
)

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  process.stderr.write('Iconifika MCP server running\n')
}

main().catch(console.error)
```

- [ ] **Step 4: Build e instalar MCP localmente para test**

```bash
cd mcp
npm install
npm run build
node dist/server.js
```

Esperado: `Iconifika MCP server running` en stderr. Ctrl+C para salir.

- [ ] **Step 5: Commit**

```bash
cd ..
git add mcp/
git commit -m "feat: add MCP server for Claude Code integration"
```

---

### Task 8: Deploy a Netlify

**Files:**
- Modify: `.env.local` → añadir variable para producción
- Create: `README.md`

**Interfaces:**
- Produce: URL pública de Netlify con la API funcionando

- [ ] **Step 1: Crear README con instrucciones**

```markdown
# Iconifika

Free SVG API powered by Iconify. Built for AI/LLM workflows.

## API

- `GET /api/icon/[set]/[name]?color=#hex` — Get SVG
- `GET /api/search?q=&set=&limit=` — Search icons  
- `GET /api/sets` — List all icon sets

## Use with Claude Code

Add to `~/.claude/settings.json`:

\`\`\`json
{
  "mcpServers": {
    "iconifika": {
      "command": "npx",
      "args": ["-y", "iconifika-mcp"],
      "env": {
        "ICONIFIKA_BASE_URL": "https://YOUR-SITE.netlify.app"
      }
    }
  }
}
\`\`\`

## Local dev

\`\`\`bash
npm install
npm run dev
\`\`\`
```

- [ ] **Step 2: Build final antes de deploy**

```bash
npm run build
```

Esperado: build exitoso sin errores.

- [ ] **Step 3: Deploy en Netlify**

Opción A — Netlify CLI:
```bash
npx netlify-cli deploy --prod --dir=.next
```

Opción B — GitHub + Netlify UI:
1. `git remote add origin <tu-repo>`
2. `git push -u origin main`
3. En netlify.com: "Add new site" → Import from Git → seleccionar repo
4. Build command: `npm run build`, publish dir: `.next`

- [ ] **Step 4: Actualizar NEXT_PUBLIC_BASE_URL en Netlify**

En Netlify UI → Site Settings → Environment Variables:
```
NEXT_PUBLIC_BASE_URL=https://TU-SITIO.netlify.app
```

Redeploy el sitio.

- [ ] **Step 5: Verificar endpoints en producción**

```bash
export BASE=https://TU-SITIO.netlify.app
curl "$BASE/api/icon/lucide/heart"
curl "$BASE/api/search?q=home&limit=3"
curl "$BASE/api/sets" | head -c 300
```

Esperado: SVGs y JSON válidos desde producción.

- [ ] **Step 6: Commit final**

```bash
git add README.md
git commit -m "docs: add README with API reference and MCP setup instructions"
git push
```

---

## Self-Review

**Spec coverage:**
- ✅ API self-hosted en Netlify
- ✅ `GET /api/icon/[set]/[name]` con inyección de color
- ✅ `GET /api/search` con filtro por set y límite
- ✅ `GET /api/sets`
- ✅ MCP Server para Claude Code
- ✅ CORS abierto en todos los endpoints
- ✅ Sin auth, sin rate limiting, sin DB
- ✅ Cache-Control headers para baja latencia
- ✅ Landing page con docs

**Placeholder scan:** ninguno encontrado — todos los pasos tienen código completo.

**Type consistency:**
- `IconResult` definido en Task 2, consumido en Task 4 ✅
- `SetInfo` definido en Task 2, consumido en Task 5 ✅
- `getIconSvg`, `searchIcons`, `listSets` definidos en Task 2, usados en Tasks 3-5 ✅
- MCP tools usan fetch HTTP, no importan lib directamente ✅
