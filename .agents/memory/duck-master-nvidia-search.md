---
name: Duck Master NVIDIA search
description: How the AI-powered search endpoint works and how to configure it.
---

## How it works

1. Frontend debounces input (420ms), POSTs to `POST /api/search` with `{ query: string }`.
2. Backend (artifacts/api-server/src/routes/search.ts):
   a. Local filter: scans all 842 tools, returns up to 60 candidates matching name/url/category.
   b. If `NVIDIA_API_KEY` env var is set: sends candidates to NVIDIA NIM chat completions API for ranking + relevance explanations.
   c. Re-ranked results are returned as `{ results, aiPowered: true, query }`.
   d. Search is logged to `search_history` table for the authenticated user.
3. If NVIDIA_API_KEY is absent: returns local filter results with `aiPowered: false`.
4. Frontend shows "AI-powered" badge when `aiPowered: true`; shows relevance text beneath each card.

## Configuration

- `NVIDIA_API_KEY` — set in Replit Secrets; never hard-code.
- `NVIDIA_MODEL` — optional env var; defaults to `meta/llama-3.3-70b-instruct`.
- Base URL: `https://integrate.api.nvidia.com/v1/chat/completions`

## Fallback behavior

If the NVIDIA call fails (network error, quota exceeded, etc.), the route catches the error, logs a warning, and falls back to local filter results. The client always gets a valid response.

**Why:** graceful degradation — the site remains fully functional without the API key; AI is a progressive enhancement.
