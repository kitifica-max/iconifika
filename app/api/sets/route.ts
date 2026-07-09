const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}
const ICONIFY = 'https://api.iconify.design'

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}

export async function GET() {
  const upstream = await fetch(`${ICONIFY}/collections`, { next: { revalidate: 3600 } })
  if (!upstream.ok) {
    return Response.json({ error: 'Failed to fetch collections' }, { status: 502, headers: CORS })
  }

  const data = await upstream.json()
  // data is { prefix: { name, total, ... }, ... }
  const sets = Object.entries(data).map(([prefix, info]: [string, any]) => ({
    prefix,
    name: info.name,
    total: info.total,
  }))

  return Response.json(
    { sets, total: sets.length },
    { headers: { ...CORS, 'Cache-Control': 'public, max-age=3600' } }
  )
}
