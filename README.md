# Iconifika

Free SVG API powered by Iconify. Built for AI/LLM workflows.

## API

- `GET /api/icon/[set]/[name]?color=#hex` — Get SVG
- `GET /api/search?q=&set=&limit=` — Search icons  
- `GET /api/sets` — List all icon sets

## Use with Claude Code

Add to `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "iconifika": {
      "command": "npx",
      "args": ["-y", "iconifika-mcp"],
      "env": {
        "ICONIFIKA_BASE_URL": "https://YOUR-SITE.netlify.app"
      }
    }
  }
}
```

## Local dev

```bash
npm install
npm run dev
```

## Deploy to Netlify

### Option A — Netlify CLI

```bash
npx netlify-cli deploy --prod --dir=.next
```

### Option B — GitHub + Netlify UI

1. Push code to GitHub:
   ```bash
   git remote add origin <your-repo>
   git push -u origin main
   ```

2. In netlify.com:
   - Click "Add new site" → "Import from Git"
   - Select your repository
   - Build command: `npm run build`
   - Publish directory: `.next`

### Step 3: Set environment variable in Netlify

In Netlify UI → Site Settings → Environment Variables:
```
NEXT_PUBLIC_BASE_URL=https://YOUR-SITE.netlify.app
```

Redeploy the site.

### Step 4: Verify production endpoints

```bash
export BASE=https://YOUR-SITE.netlify.app
curl "$BASE/api/icon/lucide/heart"
curl "$BASE/api/search?q=home&limit=3"
curl "$BASE/api/sets" | head -c 300
```

Expect valid SVGs and JSON responses.
