#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod/v3'

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
