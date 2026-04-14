# AI SEO Article Studio

Demo web app to generate SEO-ready Spanish articles (Bitcoin mining niche) with Claude, review them in a client-friendly flow, and publish them with filesystem persistence.

## What this project does

- Generates full structured article JSON with:
  - SEO metadata
  - article sections (H1/H2/H3 + FAQ)
  - schema markup
  - image options and featured image
- Streams raw model output live in the admin UI while generating.
- Shows approval preview before publish (no forced regeneration).
- Lets user:
  - upload a custom image, or
  - choose from model-proposed image options
- Prevents duplicate published titles.
- Saves drafts/published articles as JSON files on disk.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS v4 (CSS-first)
- Zustand (client state)
- Anthropic SDK (`claude-sonnet-4-20250514`)
- React Icons

## Main workflow

1. Open `/admin`
2. Fill title/meta/observations (+ optional image upload)
3. Click generate
4. Watch streaming JSON panel
5. Review article preview below form
6. If needed:
   - choose one of up to 4 image options returned by Claude, or
   - upload image and apply it to preview
7. Approve and publish
8. Open `/preview` or `/preview/[slug]`

## Project structure (important files)

```txt
src/
  app/
    page.tsx
    admin/page.tsx
    preview/page.tsx
    preview/[slug]/page.tsx
    api/generate-article/route.ts
    api/save-article/route.ts
    api/article-exists/route.ts
    api/search-image/route.ts
    api/image-proxy/route.ts
  components/
    admin/ArticleForm.tsx
    admin/StreamingPreview.tsx
    blog/ArticleContent.tsx
    blog/ArticleCard.tsx
    blog/FaqSection.tsx
    blog/SeoHeadSync.tsx
    ui/*
  lib/
    constants.ts
    prompts.ts
    types.ts
    utils.ts
    server/articleStorage.ts
  stores/useArticleStore.ts
```

## Environment variables

Create `.env.local`:

```env
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CLIENT_DOMAIN=bitzenmineria.com
FREEPIK_API_KEY=...
```

Notes:
- `ANTHROPIC_API_KEY` is required for article generation.
- `FREEPIK_API_KEY` is currently used by the optional image search endpoint.
- Main image flow is model-driven (Claude returns image options in JSON).

## Install and run

```bash
npm install
npm run dev
```

Open:
- `http://localhost:3000` home
- `http://localhost:3000/admin` generation panel

## Build

```bash
npm run build
npm run start
```

## Filesystem persistence

Published/draft records are saved in:

- `generated-articles/<slug>.json`

Each saved record includes:
- `status` (`draft` or `published`)
- `article` (full structured data)
- `updatedAt`

Storage logic lives in:
- `src/lib/server/articleStorage.ts`

## API routes

- `POST /api/generate-article`
  - Calls Claude with streaming
  - Returns streamed raw text response
- `POST /api/save-article`
  - Saves article to disk as draft/published
- `POST /api/article-exists`
  - Checks duplicate title against published articles
- `POST /api/search-image`
  - Optional Freepik image lookup endpoint
- `GET /api/image-proxy`
  - Optional image proxy endpoint

## UX details implemented

- Streaming preview panel fills available space and scrolls internally on overflow.
- FAQ uses arrow icons with open/close rotation.
- Approval toast appears bottom-right after publish.
- Global pointer cursor on buttons.

## Troubleshooting

If Next dev cache gets corrupted (missing chunk/module errors):

```bash
pkill -f "next dev" || true
rm -rf .next
npm run dev
```

## License

Private demo/proof-of-concept project.
