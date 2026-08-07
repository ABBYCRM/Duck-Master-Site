import { Router, type IRouter, type Request, type Response } from "express";
import { db, searchHistoryTable, savedToolsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { CATEGORIES } from "../lib/tools-data";

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

  const res = await fetch(
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
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`NVIDIA API error ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  const content = data.choices?.[0]?.message?.content ?? "[]";

  // Strip markdown fences if present
  const clean = content.replace(/^```[a-z]*\n?/m, "").replace(/```$/m, "").trim();

  const ranked = JSON.parse(clean) as Array<{
    index: number;
    relevance: string;
  }>;

  return ranked
    .filter((r) => typeof r.index === "number" && candidates[r.index])
    .map((r) => ({
      ...candidates[r.index],
      relevance: r.relevance ?? null,
    }));
}

// ── Route: POST /search ───────────────────────────────────────────────────

router.post("/search", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const rawQuery =
    typeof req.body?.query === "string" ? req.body.query.trim() : "";
  if (!rawQuery || rawQuery.length > 500) {
    res.status(400).json({ error: "query must be 1–500 characters" });
    return;
  }

  const userId = req.user.id;
  const aiEnabled = Boolean(process.env.NVIDIA_API_KEY);

  try {
    // Step 1 — local candidate filter (fast)
    const candidates = localSearch(rawQuery, aiEnabled ? 60 : 150);

    // Step 2 — optionally re-rank with NVIDIA NIM
    let results: SearchResultItem[];
    let aiPowered = false;

    if (aiEnabled && candidates.length > 0) {
      try {
        results = await nvidiaSearch(rawQuery, candidates);
        aiPowered = true;
      } catch (err) {
        req.log.warn({ err }, "NVIDIA search failed, falling back to local");
        results = candidates.map((t) => ({ ...t, relevance: null }));
      }
    } else {
      results = candidates.map((t) => ({ ...t, relevance: null }));
    }

    // Step 3 — persist to per-user history (fire and forget)
    db.insert(searchHistoryTable)
      .values({
        userId,
        query: rawQuery,
        resultCount: results.length,
        aiPowered,
      })
      .catch((e) => req.log.error({ err: e }, "Failed to save search history"));

    res.json({ results, aiPowered, query: rawQuery });
  } catch (err) {
    req.log.error({ err }, "Search error");
    res.status(500).json({ error: "Search failed" });
  }
});

export default router;
