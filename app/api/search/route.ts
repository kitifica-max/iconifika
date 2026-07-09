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
