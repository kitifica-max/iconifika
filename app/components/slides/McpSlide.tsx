'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://iconifika.netlify.app'

const config = `{
  "mcpServers": {
    "iconifika": {
      "command": "npx",
      "args": ["-y", "iconifika-mcp"],
      "env": {
        "ICONIFIKA_BASE_URL": "${BASE}"
      }
    }
  }
}`

export default function McpSlide() {
  const [copied, setCopied] = useState(false)
  const codeRef = useRef<HTMLPreElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.mcp-title', { y: 60, opacity: 0, duration: 0.8, ease: 'power3.out' })
      gsap.from('.mcp-code', { y: 40, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.3 })
      gsap.from('.mcp-hint', { opacity: 0, duration: 0.5, delay: 0.7 })
    })
    return () => ctx.revert()
  }, [])

  function copy() {
    navigator.clipboard.writeText(config)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-12 gap-10">
      <div className="text-center">
        <p className="text-zinc-500 text-xs tracking-widest uppercase mb-4">For AI Workflows</p>
        <h2 className="mcp-title text-[clamp(2.5rem,6vw,5rem)] font-black leading-none tracking-tighter uppercase">
          MCP<br />
          <span className="text-transparent" style={{ WebkitTextStroke: '2px white' }}>READY</span>
        </h2>
      </div>

      <div className="mcp-code w-full max-w-xl relative">
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">
          Add to <code className="text-zinc-400">~/.claude/settings.json</code>
        </p>
        <pre
          ref={codeRef}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-xs text-zinc-300 overflow-x-auto"
        >
          {config}
        </pre>
        <button
          onClick={copy}
          className="absolute top-10 right-4 text-xs text-zinc-500 hover:text-white transition-colors px-3 py-1 border border-zinc-700 rounded-lg"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <p className="mcp-hint text-zinc-600 text-sm text-center">
        Works with Claude Code · Cursor · any MCP-compatible LLM
      </p>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-600 text-sm tracking-widest uppercase">
        05 / 05
      </div>
    </div>
  )
}
