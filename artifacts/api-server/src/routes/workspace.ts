import { Router, type IRouter, type Request, type Response } from "express";
import { db, savedToolsTable, searchHistoryTable } from "@workspace/db";
import { and, desc, eq } from "drizzle-orm";

const router: IRouter = Router();

// ── GET /workspace/saved — list saved tools for this user only ─────────────

router.get("/workspace/saved", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const saved = await db
    .select()
    .from(savedToolsTable)
    .where(eq(savedToolsTable.userId, req.user.id))
    .orderBy(desc(savedToolsTable.savedAt));

  res.json({
    saved: saved.map((row) => ({
      id: row.id,
      toolUrl: row.toolUrl,
      toolName: row.toolName,
      categoryId: row.categoryId,
      categoryLabel: row.categoryLabel,
      savedAt: row.savedAt.toISOString(),
    })),
  });
});

// ── POST /workspace/saved — save a tool (idempotent) ─────────────────────

router.post("/workspace/saved", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { toolUrl, toolName, categoryId, categoryLabel } = req.body ?? {};
  if (!toolUrl || !toolName || !categoryId || !categoryLabel) {
    res.status(400).json({ error: "toolUrl, toolName, categoryId, categoryLabel required" });
    return;
  }

  const [row] = await db
    .insert(savedToolsTable)
    .values({
      userId: req.user.id,
      toolUrl: String(toolUrl).slice(0, 2048),
      toolName: String(toolName).slice(0, 512),
      categoryId: String(categoryId).slice(0, 64),
      categoryLabel: String(categoryLabel).slice(0, 256),
    })
    .onConflictDoUpdate({
      target: [savedToolsTable.userId, savedToolsTable.toolUrl],
      set: { toolName: String(toolName).slice(0, 512) },
    })
    .returning();

  res.json({
    id: row.id,
    toolUrl: row.toolUrl,
    toolName: row.toolName,
    categoryId: row.categoryId,
    categoryLabel: row.categoryLabel,
    savedAt: row.savedAt.toISOString(),
  });
});

// ── DELETE /workspace/saved/:toolId — remove a saved tool for this user ───

router.delete("/workspace/saved/:toolId", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const toolId = Number(req.params.toolId);
  if (!Number.isInteger(toolId) || toolId <= 0) {
    res.status(400).json({ error: "Invalid toolId" });
    return;
  }

  // The AND ensures a user can only delete their own rows
  await db
    .delete(savedToolsTable)
    .where(
      and(
        eq(savedToolsTable.id, toolId),
        eq(savedToolsTable.userId, req.user.id),
      ),
    );

  res.json({ success: true });
});

// ── GET /workspace/history — search history for this user only ────────────

router.get("/workspace/history", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const history = await db
    .select()
    .from(searchHistoryTable)
    .where(eq(searchHistoryTable.userId, req.user.id))
    .orderBy(desc(searchHistoryTable.searchedAt))
    .limit(50);

  res.json({
    history: history.map((row) => ({
      id: row.id,
      query: row.query,
      resultCount: row.resultCount,
      aiPowered: row.aiPowered,
      searchedAt: row.searchedAt.toISOString(),
    })),
  });
});

export default router;
