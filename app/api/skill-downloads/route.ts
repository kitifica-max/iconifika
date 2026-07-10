import { getStore } from '@netlify/blobs'

export async function GET() {
  try {
    const store = getStore('iconifika')
    const raw = await store.get('skill-downloads', { type: 'text' })
    return Response.json({ downloads: raw ? parseInt(raw) : 0 })
  } catch {
    return Response.json({ downloads: 0 })
  }
}
