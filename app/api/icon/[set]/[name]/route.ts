import { NextRequest } from 'next/server'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}
const ICONIFY = 'https://api.iconify.design'

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ set: string; name: string }> }
) {
  const { set, name } = await params
  const color = request.nextUrl.searchParams.get('color') ?? undefined

  const url = new URL(`${ICONIFY}/${set}/${name}.svg`)
  if (color) url.searchParams.set('color', encodeURIComponent(color).replace('%23', '#'))

  const upstream = await fetch(url.toString(), { next: { revalidate: 86400 } })

  if (!upstream.ok || upstream.headers.get('content-type')?.includes('json')) {
    return Response.json({ error: 'Icon not found', set, name }, { status: 404, headers: CORS })
  }

  const svg = await upstream.text()

  if (!svg.trim().startsWith('<svg')) {
    return Response.json({ error: 'Icon not found', set, name }, { status: 404, headers: CORS })
  }

  const accept = request.headers.get('accept') ?? ''
  if (accept.includes('application/json')) {
    return Response.json({ set, name, svg }, { headers: CORS })
  }

  return new Response(svg, {
    headers: { ...CORS, 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' },
  })
}
