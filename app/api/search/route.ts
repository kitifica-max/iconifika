import { NextRequest } from 'next/server'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}
const ICONIFY = 'https://api.iconify.design'

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

  const url = new URL(`${ICONIFY}/search`)
  url.searchParams.set('query', q)
  url.searchParams.set('limit', String(limit))
  if (set) url.searchParams.set('prefix', set)

  const upstream = await fetch(url.toString(), { next: { revalidate: 300 } })
  if (!upstream.ok) {
    return Response.json({ error: 'Search failed' }, { status: 502, headers: CORS })
  }

  const data = await upstream.json()
  // Iconify returns { icons: ["prefix:name", ...], total: N }
  const results = (data.icons ?? []).slice(0, limit).map((id: string) => {
    const [iconSet, ...rest] = id.split(':')
    return { set: iconSet, name: rest.join(':') }
  })

  return Response.json(
    { results, total: data.total ?? results.length, query: q },
    { headers: { ...CORS, 'Cache-Control': 'public, max-age=300' } }
  )
}
