import { getStore } from '@netlify/blobs'
import { redirect } from 'next/navigation'

export async function GET() {
  try {
    const store = getStore('iconifika')
    const raw = await store.get('skill-downloads')
    const count = raw ? parseInt(raw) + 1 : 1
    await store.set('skill-downloads', String(count))
  } catch {
    // silently fail — don't block the download
  }

  redirect('/iconifika.skill')
}
