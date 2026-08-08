import { Router, type IRouter, type Request, type Response } from "express";
import { db, searchHistoryTable } from "@workspace/db";
import { CATEGORIES } from "../lib/tools-data";
import { searchLimiter } from "../lib/rate-limit";
import { sanitizeString, redactSecrets } from "../lib/sanitize";

const router: IRouter = Router();

// ── Types ──────────────────────────────────────────────────────────────────

interface ToolRecord {
  url: string;
  name: string;
  categoryId: string;
  categoryLabel: string;
}

interface SearchResultItem extends ToolRecord {
  relevance: string | null;
}

// ── Utility: build the flat tool index from static data ───────────────────

function buildToolIndex(): ToolRecord[] {
  const index: ToolRecord[] = [];
  for (const cat of CATEGORIES) {
    for (const url of cat.links) {
      index.push({
        url,
        name: getToolName(url),
        categoryId: cat.id,
        categoryLabel: cat.label,
      });
    }
  }
  return index;
}

function getToolName(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    const parts = hostname.split(".");
    const domain = parts.length >= 2 ? parts[parts.length - 2] : parts[0];
    return domain
      .split(/[-_]/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  } catch {
    return url;
  }
}

const TOOL_INDEX = buildToolIndex();

// ── Local fallback filter ─────────────────────────────────────────────────

function localSearch(query: string, limit = 60): ToolRecord[] {
  const q = query.toLowerCase();
  const exact: ToolRecord[] = [];
  const partial: ToolRecord[] = [];

  for (const tool of TOOL_INDEX) {
    const haystack = `${tool.name} ${tool.url} ${tool.categoryLabel}`.toLowerCase();
    if (tool.name.toLowerCase().startsWith(q)) exact.push(tool);
    else if (haystack.includes(q)) partial.push(tool);
  }

  return [...exact, ...partial].slice(0, limit);
}

// ── NVIDIA NIM AI search ──────────────────────────────────────────────────

async function nvidiaSearch(
  query: string,
  candidates: ToolRecord[],
): Promise<SearchResultItem[]> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) return candidates.map((t) => ({ ...t, relevance: null }));

  const toolList = candidates
    .map(
      (t, i) =>
        `[${i}] ${t.name} (${t.url.replace(/^https?:\/\/(www\.)?/, "")}) — category: ${t.categoryLabel}`,
    )
    .join("\n");

  const systemPrompt = `You are a precise tool-ranking assistant for a cybersecurity and OSINT reference directory.
Given a user query and a numbered list of tools, return a JSON array of objects with:
- "index": the tool's number from the list (integer)
- "relevance": one short sentence explaining why it matches (max 80 chars)

Return ONLY the JSON array, no markdown, no explanation. Include only the tools that genuinely match the query.
Rank most relevant first. Maximum 20 results.`;

  const userPrompt = `Query: "${query}"\n\nTools:\n${toolList}`;

  // Use a local name that does not clash with the Express `Response` import.
  let fetchRes: globalThis.Response;
  try {
    fetchRes = await fetch(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.NVIDIA_MODEL ?? "meta/llama-3.3-70b-instruct",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.1,
          max_tokens: 1024,
          stream: false,
        }),
        // 30-second timeout so a stalled NVIDIA call doesn't block the route
        signal: AbortSignal.timeout(30_000),
      },
    );
  } catch (err) {
    // Network / timeout errors — never include the API key in the message
    throw new Error(`NVIDIA request failed: ${redactSecrets(String(err))}`);
  }

  if (!fetchRes.ok) {
    // Read body but redact before throwing — status codes alone are safe to log
    const text = await fetchRes.text().catch(() => "");
    throw new Error(
      `NVIDIA API error ${fetchRes.status}: ${redactSecrets(text.slice(0, 120))}`,
    );
  }

  const data = (await fetchRes.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  const content = data.choices?.[0]?.message?.content ?? "[]";

  // Strip markdown fences if present
  const clean = content.replace(/^```[a-z]*\n?/m, "").replace(/```$/m, "").trim();

  let ranked: Array<{ index: number; relevance: string }>;
  try {
    ranked = JSON.parse(clean) as Array<{ index: number; relevance: string }>;
  } catch {
    throw new Error("NVIDIA response was not valid JSON");
  }

  return ranked
    .filter((r) => typeof r.index === "number" && candidates[r.index])
    .map((r) => ({
      ...candidates[r.index],
      // Sanitize model output before storing/returning it
      relevance: r.relevance ? sanitizeString(String(r.relevance), 120) : null,
    }));
}

// ── Route: POST /search ───────────────────────────────────────────────────

router.post("/search", searchLimiter, async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  // Validate and sanitize query
  const raw = typeof req.body?.query === "string" ? req.body.query : "";
  const query = sanitizeString(raw, 500);
  if (!query) {
    res.status(400).json({ error: "query must be 1–500 characters" });
    return;
  }

  const userId = req.user.id;
  const aiEnabled = Boolean(process.env.NVIDIA_API_KEY);

  try {
    const candidates = localSearch(query, aiEnabled ? 60 : 150);

    let results: SearchResultItem[];
    let aiPowered = false;

    if (aiEnabled && candidates.length > 0) {
      try {
        results = await nvidiaSearch(query, candidates);
        aiPowered = true;
      } catch (err) {
        // Log the error safely — redactSecrets is already applied inside nvidiaSearch
        req.log.warn({ errMsg: redactSecrets(String(err)) }, "NVIDIA search failed, falling back to local");
        results = candidates.map((t) => ({ ...t, relevance: null }));
      }
    } else {
      results = candidates.map((t) => ({ ...t, relevance: null }));
    }

    // Persist to per-user search history (fire-and-forget)
    db.insert(searchHistoryTable)
      .values({ userId, query, resultCount: results.length, aiPowered })
      .catch((e) =>
        req.log.error({ err: e }, "Failed to save search history"),
      );

    res.json({ results, aiPowered, query });
  } catch (err) {
    req.log.error({ errMsg: redactSecrets(String(err)) }, "Search error");
    res.status(500).json({ error: "Search failed" });
  }
});

export default router;
