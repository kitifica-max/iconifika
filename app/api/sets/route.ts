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
