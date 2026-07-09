import { locate } from '@iconify/json'
import { getIconData, iconToSVG, replaceIDs } from '@iconify/utils'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { createRequire } from 'module'

export type IconResult = { set: string; name: string; body: string }
export type SetInfo = { id: string; name: string; total: number }

const _require = createRequire(import.meta.url)

function getCollectionsPath(): string {
  const jsonPkg = _require.resolve('@iconify/json/package.json')
  return join(dirname(jsonPkg), 'collections.json')
}

function loadCollections(): Record<string, any> {
  try {
    return JSON.parse(readFileSync(getCollectionsPath(), 'utf-8'))
  } catch {
    return {}
  }
}

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
  const collections = loadCollections()
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
  const collections = loadCollections()
  return Object.entries(collections).map(([id, meta]: [string, any]) => ({
    id,
    name: meta.name ?? id,
    total: meta.total ?? 0,
  }))
}
