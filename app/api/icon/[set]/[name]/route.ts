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
