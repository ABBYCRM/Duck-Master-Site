import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Search, ExternalLink, BookOpen, X, Menu,
  Bookmark, BookmarkCheck, Sparkles, Clock, LogOut, User,
  ChevronRight, Loader2, AlertCircle,
} from "lucide-react";
import { CATEGORIES, getToolName } from './data/tools';
import { useAuth } from '@workspace/replit-auth-web';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const queryClient = new QueryClient();

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Types ──────────────────────────────────────────────────────────────────

interface SearchResultItem {
  url: string;
  name: string;
  categoryId: string;
  categoryLabel: string;
  relevance: string | null;
}

interface SavedTool {
  id: number;
  toolUrl: string;
  toolName: string;
  categoryId: string;
  categoryLabel: string;
  savedAt: string;
}

interface SearchHistoryItem {
  id: number;
  query: string;
  resultCount: number;
  aiPowered: boolean;
  searchedAt: string;
}

// ── API helpers ────────────────────────────────────────────────────────────

const apiFetch = (path: string, init?: RequestInit) =>
  fetch(`/api${path}`, { credentials: 'include', ...init });

async function postSearch(query: string): Promise<{
  results: SearchResultItem[];
  aiPowered: boolean;
  query: string;
}> {
  const res = await apiFetch('/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  return res.json();
}

async function fetchSaved(): Promise<SavedTool[]> {
  const res = await apiFetch('/workspace/saved');
  if (!res.ok) throw new Error('Failed to load saved tools');
  const data = await res.json();
  return data.saved;
}

async function saveTool(tool: Omit<SavedTool, 'id' | 'savedAt'>): Promise<SavedTool> {
  const res = await apiFetch('/workspace/saved', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tool),
  });
  if (!res.ok) throw new Error('Failed to save tool');
  return res.json();
}

async function unsaveTool(id: number): Promise<void> {
  await apiFetch(`/workspace/saved/${id}`, { method: 'DELETE' });
}

async function fetchHistory(): Promise<SearchHistoryItem[]> {
  const res = await apiFetch('/workspace/history');
  if (!res.ok) throw new Error('Failed to load history');
  const data = await res.json();
  return data.history;
}

// ── Login screen ───────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="min-h-[100dvh] bg-background grid place-items-center grid-paper-bg">
      <div className="flex flex-col items-center gap-8 p-8 max-w-sm w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center shadow-sm">
          <BookOpen className="w-8 h-8 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Duck Master</h1>
          <p className="text-slate-500 text-base leading-relaxed">
            842 curated cybersecurity, OSINT, and AI resources across 25 modules.
          </p>
        </div>
        <div
          className="w-full p-6 rounded-2xl border border-slate-200 bg-white shadow-sm"
          style={{ boxShadow: '0 1px 2px rgb(15 23 42 / .06), 0 4px 16px rgb(15 23 42 / .06)' }}
        >
          <p className="text-slate-600 text-sm mb-5 leading-relaxed">
            Log in to access AI-powered search, save tools to your personal workspace, and keep your search history.
          </p>
          <button
            onClick={onLogin}
            className="btn-primary w-full text-base py-3"
          >
            Log in to continue
          </button>
        </div>
        <p className="text-xs text-slate-400">
          Your workspace is private and isolated from other users.
        </p>
      </div>
    </div>
  );
}

// ── Main app ───────────────────────────────────────────────────────────────

function Home() {
  const { user, login, logout } = useAuth();

  // UI state
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(CATEGORIES[0].id);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'modules' | 'saved' | 'history'>('modules');

  // AI search state
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResultItem[] | null>(null);
  const [searchAiPowered, setSearchAiPowered] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Per-user workspace state
  const [savedTools, setSavedTools] = useState<SavedTool[]>([]);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [savingUrls, setSavingUrls] = useState<Set<string>>(new Set());

  // Build enriched categories once
  const categoriesWithTools = useMemo(() => {
    return CATEGORIES.map((cat, idx) => ({
      ...cat,
      colorVar: `hsl(var(--cat-${(idx % 25) + 1}))`,
      tools: cat.links.map(url => ({ url, name: getToolName(url) })),
    }));
  }, []);

  const totalTools = useMemo(
    () => CATEGORIES.reduce((acc, c) => acc + c.links.length, 0),
    []
  );

  const savedSet = useMemo(
    () => new Map(savedTools.map(s => [s.toolUrl, s.id])),
    [savedTools]
  );

  // Load per-user workspace data on mount
  useEffect(() => {
    fetchSaved().then(setSavedTools).catch(() => {});
    fetchHistory().then(setHistory).catch(() => {});
  }, []);

  // AI search with debounce
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!search.trim()) {
      setSearchResults(null);
      setSearchError(null);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    searchTimeout.current = setTimeout(async () => {
      try {
        const data = await postSearch(search.trim());
        setSearchResults(data.results);
        setSearchAiPowered(data.aiPowered);
        setSearchError(null);
        // Refresh history after successful search
        fetchHistory().then(setHistory).catch(() => {});
      } catch {
        setSearchError('Search failed. Please try again.');
        setSearchResults(null);
      } finally {
        setIsSearching(false);
      }
    }, 420);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [search]);

  // Intersection observer for active sidebar module
  const localFilteredCategories = useMemo(() => {
    if (!search.trim() || searchResults !== null) return categoriesWithTools;
    const q = search.toLowerCase();
    return categoriesWithTools
      .map(cat => ({
        ...cat,
        tools: cat.tools.filter(t =>
          t.name.toLowerCase().includes(q) || t.url.toLowerCase().includes(q)
        ),
      }))
      .filter(c => c.tools.length > 0);
  }, [categoriesWithTools, search, searchResults]);

  useEffect(() => {
    if (searchResults !== null) return;
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          setActiveCategory(visible[0].target.id.replace('module-', ''));
        }
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );
    localFilteredCategories.forEach(cat => {
      const el = document.getElementById(`module-${cat.id}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [localFilteredCategories, searchResults]);

  const scrollTo = (id: string) => {
    setSearch('');
    setSearchResults(null);
    setTimeout(() => {
      const el = document.getElementById(`module-${id}`);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
        setActiveCategory(id);
      }
    }, 50);
    setIsMobileMenuOpen(false);
  };

  // Bookmark handlers
  const handleSave = useCallback(async (tool: { url: string; name: string }, cat: { id: string; label: string }) => {
    setSavingUrls(s => new Set(s).add(tool.url));
    try {
      if (savedSet.has(tool.url)) {
        const id = savedSet.get(tool.url)!;
        await unsaveTool(id);
        setSavedTools(prev => prev.filter(s => s.id !== id));
      } else {
        const saved = await saveTool({
          toolUrl: tool.url,
          toolName: tool.name,
          categoryId: cat.id,
          categoryLabel: cat.label,
        });
        setSavedTools(prev => [...prev, saved]);
      }
    } catch {
      /* silent */
    } finally {
      setSavingUrls(s => { const n = new Set(s); n.delete(tool.url); return n; });
    }
  }, [savedSet]);

  // ── Tool card ──────────────────────────────────────────────────────────

  const ToolCard = useCallback(({
    tool, colorVar, catId, catLabel, idx, relevance
  }: {
    tool: { url: string; name: string };
    colorVar: string;
    catId: string;
    catLabel: string;
    idx: number;
    relevance?: string | null;
  }) => {
    const isSaved = savedSet.has(tool.url);
    const isSaving = savingUrls.has(tool.url);
    const domain = tool.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

    return (
      <div
        className="tool-card group p-5 flex flex-col relative overflow-hidden"
        style={{ '--card-color': colorVar, '--card-i': idx } as React.CSSProperties}
      >
        {/* Badge + save button row */}
        <div className="flex items-start justify-between mb-3 gap-2">
          <span
            className="cat-badge px-2 py-0.5 text-[10px] font-bold rounded-full uppercase-tracking shrink-0 border bg-white"
            style={{ color: colorVar, borderColor: colorVar }}
          >
            {catId}.{String(idx + 1).padStart(2, '0')}
          </span>
          <button
            onClick={e => { e.preventDefault(); handleSave(tool, { id: catId, label: catLabel }); }}
            className={cn(
              "shrink-0 w-7 h-7 flex items-center justify-center rounded-full transition-all",
              isSaved
                ? "text-indigo-600 bg-indigo-50 opacity-100"
                : "text-slate-300 opacity-0 group-hover:opacity-100 hover:text-indigo-600 hover:bg-indigo-50",
            )}
            aria-label={isSaved ? 'Remove from saved' : 'Save tool'}
            disabled={isSaving}
          >
            {isSaving
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : isSaved
                ? <BookmarkCheck className="w-3.5 h-3.5" />
                : <Bookmark className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Name */}
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="tool-name-link font-bold text-slate-800 text-sm mb-1 pr-1 line-clamp-1 group-hover:text-indigo-700 transition-colors block"
          aria-label={`${tool.name} — ${tool.url}`}
        >
          {tool.name}
          <ExternalLink className="inline w-3 h-3 ml-1 opacity-0 group-hover:opacity-60 transition-opacity" aria-hidden />
        </a>

        {/* Domain */}
        <p className="text-[11px] font-mono text-slate-400 line-clamp-1 group-hover:text-slate-600 transition-colors mt-auto pt-2">
          {domain}
        </p>

        {/* AI relevance note (search results only) */}
        {relevance && (
          <p className="text-[10px] text-indigo-500 font-medium mt-2 leading-snug border-t border-indigo-50 pt-2">
            {relevance}
          </p>
        )}
      </div>
    );
  }, [savedSet, savingUrls, handleSave]);

  // ── Sidebar ────────────────────────────────────────────────────────────

  const SidebarContent = () => (
    <>
      {/* Logo + user */}
      <div className="p-4 border-b border-slate-100 bg-white shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-base font-extrabold tracking-tight flex items-center gap-2 text-slate-900">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            Duck Master
          </h1>
          <button
            className="lg:hidden p-1 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User strip */}
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg bg-slate-50 border border-slate-100">
          {user?.profileImageUrl ? (
            <img src={user.profileImageUrl} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              <User className="w-3.5 h-3.5 text-indigo-500" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">
              {user?.firstName ?? user?.email ?? 'Anonymous'}
            </p>
            <p className="text-[10px] text-slate-400">Personal workspace</p>
          </div>
          <button
            onClick={logout}
            className="shrink-0 p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Log out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 shrink-0 flex gap-4">
        <div>
          <div className="metric text-base font-extrabold text-slate-800">{totalTools}</div>
          <div className="uppercase-tracking text-slate-400">Tools</div>
        </div>
        <div className="w-px bg-slate-200" />
        <div>
          <div className="metric text-base font-extrabold text-slate-800">{CATEGORIES.length}</div>
          <div className="uppercase-tracking text-slate-400">Modules</div>
        </div>
        <div className="w-px bg-slate-200" />
        <div>
          <div className="metric text-base font-extrabold text-indigo-600">{savedTools.length}</div>
          <div className="uppercase-tracking text-slate-400">Saved</div>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex shrink-0 border-b border-slate-100 bg-white">
        {([
          ['modules', 'Modules'],
          ['saved', 'Saved'],
          ['history', 'History'],
        ] as const).map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setSidebarTab(tab)}
            className={cn(
              "flex-1 py-2 text-xs font-semibold transition-colors",
              sidebarTab === tab
                ? "text-indigo-600 border-b-2 border-indigo-500"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Modules tab */}
      {sidebarTab === 'modules' && (
        <nav
          className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5 mask-fade-bottom sidebar-scroll"
          aria-label="Module navigation"
        >
          {categoriesWithTools.map(cat => {
            const isActive = activeCategory === cat.id && !search;
            return (
              <button
                key={cat.id}
                onClick={() => scrollTo(cat.id)}
                data-state={isActive ? 'active' : 'idle'}
                className={cn(
                  "sidebar-btn w-full text-left px-3 py-2 text-xs font-medium transition-colors flex items-center justify-between group rounded-lg",
                  isActive ? "bg-indigo-50" : "hover:bg-slate-50 text-slate-600"
                )}
                style={{ color: isActive ? cat.colorVar : undefined, fontWeight: isActive ? 700 : 500 }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={cn("w-1 h-3.5 rounded-full shrink-0 transition-all",
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40")}
                    style={{ backgroundColor: cat.colorVar }}
                  />
                  <span className="truncate">{cat.id}. {cat.label}</span>
                </div>
                <span
                  className="cat-badge text-[10px] font-mono shrink-0 py-0.5 px-1.5 rounded-full font-bold ml-1"
                  style={isActive ? { backgroundColor: cat.colorVar, color: 'white' } : undefined}
                >
                  {cat.tools.length}
                </span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Saved tab */}
      {sidebarTab === 'saved' && (
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 sidebar-scroll">
          {savedTools.length === 0 ? (
            <div className="text-center py-10 px-4">
              <Bookmark className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-xs text-slate-400">No saved tools yet. Click the bookmark icon on any tool card to save it here.</p>
            </div>
          ) : (
            savedTools.map(s => (
              <div key={s.id} className="group flex items-start gap-2 px-2 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <a
                    href={s.toolUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-slate-800 hover:text-indigo-600 transition-colors truncate block"
                  >
                    {s.toolName}
                  </a>
                  <p className="text-[10px] text-slate-400 truncate">{s.categoryLabel}</p>
                </div>
                <button
                  onClick={() => handleSave({ url: s.toolUrl, name: s.toolName }, { id: s.categoryId, label: s.categoryLabel })}
                  className="shrink-0 p-1 rounded text-slate-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Remove"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* History tab */}
      {sidebarTab === 'history' && (
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 sidebar-scroll">
          {history.length === 0 ? (
            <div className="text-center py-10 px-4">
              <Clock className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-xs text-slate-400">No search history yet. Your searches will appear here.</p>
            </div>
          ) : (
            history.map(h => (
              <button
                key={h.id}
                onClick={() => setSearch(h.query)}
                className="w-full text-left px-2 py-2 rounded-lg hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  {h.aiPowered
                    ? <Sparkles className="w-3 h-3 text-indigo-400 shrink-0" />
                    : <Search className="w-3 h-3 text-slate-300 shrink-0" />}
                  <span className="text-xs font-medium text-slate-700 truncate flex-1">{h.query}</span>
                  <span className="text-[10px] text-slate-400 shrink-0">{h.resultCount}</span>
                  <ChevronRight className="w-3 h-3 text-slate-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[10px] text-slate-400 ml-5 mt-0.5">
                  {new Date(h.searchedAt).toLocaleDateString()}
                  {h.aiPowered && ' · AI'}
                </p>
              </button>
            ))
          )}
        </div>
      )}
    </>
  );

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <div className="flex h-[100dvh] w-full bg-background overflow-hidden font-sans text-foreground">
      {/* Pattern 112 — skip link */}
      <a href="#main-content" className="skip-link">Skip to content</a>

      {/* Pattern 090 — scroll-driven progress bar */}
      <div className="scroll-progress" aria-hidden="true" />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 h-full border-r border-slate-100 bg-white shrink-0 shadow-sm relative z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="relative w-[85%] max-w-sm h-full bg-white border-r border-slate-100 shadow-2xl flex flex-col animate-in slide-in-from-left">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main scroll area */}
      <main
        id="main-scroll"
        className="flex-1 flex flex-col h-full min-w-0 grid-paper-bg relative z-10 overflow-y-auto"
      >
        {/* Hero */}
        <div className="hero-gradient flex flex-col shrink-0 fluid-gutter pt-10 lg:pt-14 pb-8 relative shadow-lg z-10">
          <div className="lg:hidden flex items-center mb-5">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-white/80 hover:text-white rounded-md transition-colors"
              aria-label="Open navigation"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          <h1 className="fluid-heading font-extrabold tracking-tight mb-2" id="main-content">
            <span className="gradient-text">Duck Master</span>
          </h1>

          <p className="text-white/70 text-base mb-6 font-medium max-w-xl leading-relaxed">
            <span className="metric font-bold text-white">{totalTools}</span> curated resources
            {' · '}
            <span className="metric font-bold text-white">{CATEGORIES.length}</span> learning modules
            {' · '}
            <span className="metric font-bold text-indigo-300">{savedTools.length}</span> saved
          </p>

          {/* Category chip strip */}
          <div className="scroll-snap-x gap-2 pb-2" role="list" aria-label="Jump to module">
            {categoriesWithTools.map(cat => (
              <button
                key={`chip-${cat.id}`}
                role="listitem"
                onClick={() => scrollTo(cat.id)}
                className="chip shrink-0 py-1 px-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: cat.colorVar }} />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sticky glass search bar */}
        <div className="sticky top-0 z-30 glass-panel fluid-gutter py-3 border-b border-black/5">
          <div className="search-wrapper rounded-lg max-w-3xl flex items-center relative bg-white border border-slate-200 shadow-sm h-11">
            {isSearching
              ? <Loader2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 animate-spin pointer-events-none" />
              : <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />}
            <input
              type="search"
              placeholder={`Search ${totalTools} tools with AI… try "find email addresses" or "blockchain scanner"`}
              className="w-full h-full pl-10 pr-10 bg-transparent rounded-lg text-sm font-sans placeholder:text-slate-400 transition-colors"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search tools"
            />
            {search && (
              <button
                onClick={() => { setSearch(''); setSearchResults(null); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors rounded-sm"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* AI badge / status line */}
          {search && (
            <div className="max-w-3xl mt-1.5 flex items-center gap-2">
              {isSearching && (
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  AI is searching…
                </span>
              )}
              {!isSearching && searchResults !== null && (
                <span className={cn(
                  "text-xs flex items-center gap-1 font-medium",
                  searchAiPowered ? "text-indigo-500" : "text-slate-400"
                )}>
                  {searchAiPowered
                    ? <><Sparkles className="w-3 h-3" /> AI-powered · {searchResults.length} results</>
                    : <><Search className="w-3 h-3" /> {searchResults.length} results (AI key not configured)</>}
                </span>
              )}
              {searchError && (
                <span className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {searchError}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 fluid-gutter py-10 space-y-14 pb-32">

          {/* ── AI / local search results ── */}
          {search && searchResults !== null && (
            <section aria-label="Search results">
              <div className="flex items-center gap-3 mb-6">
                {searchAiPowered
                  ? <Sparkles className="w-5 h-5 text-indigo-500 shrink-0" />
                  : <Search className="w-5 h-5 text-slate-400 shrink-0" />}
                <h2 className="fluid-section-heading font-extrabold text-slate-800">
                  {searchAiPowered ? 'AI Results' : 'Search Results'}
                </h2>
                <span className="text-xs font-mono text-slate-400">{searchResults.length} tools</span>
              </div>

              {searchResults.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center max-w-sm mx-auto" role="status">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                    <Search className="w-6 h-6 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">No tools found</h3>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                    Try different keywords, a domain name, or a broader topic.
                  </p>
                  <button onClick={() => setSearch('')} className="btn-primary">Clear search</button>
                </div>
              ) : (
                <div className="tool-grid-container">
                  <div className="auto-fit-grid">
                    {searchResults.map((result, idx) => {
                      const cat = categoriesWithTools.find(c => c.id === result.categoryId)
                        ?? { colorVar: 'hsl(var(--primary))', id: result.categoryId, label: result.categoryLabel, tools: [] };
                      return (
                        <ToolCard
                          key={result.url}
                          tool={{ url: result.url, name: result.name }}
                          colorVar={cat.colorVar}
                          catId={result.categoryId}
                          catLabel={result.categoryLabel}
                          idx={idx}
                          relevance={result.relevance}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ── Module sections (shown when no active search results) ── */}
          {!search || searchResults === null ? (
            localFilteredCategories.map((cat) => (
              <section
                key={cat.id}
                id={`module-${cat.id}`}
                className="content-visibility-section scroll-mt-24"
              >
                <div className="flex items-center gap-3 mb-5 flex-wrap">
                  <div className="w-1.5 h-6 rounded-full shrink-0" style={{ backgroundColor: cat.colorVar }} />
                  <span
                    className="uppercase-tracking px-2.5 py-1 text-xs font-bold rounded-md shadow-sm"
                    style={{ backgroundColor: cat.colorVar, color: 'white' }}
                  >
                    Module {cat.id}
                  </span>
                  <h2 className="fluid-section-heading font-extrabold text-slate-800 tracking-tight">
                    {cat.label}
                  </h2>
                  <span className="tool-count text-xs font-mono text-slate-400">{cat.tools.length} tools</span>
                </div>

                <div className="tool-grid-container">
                  <div className="auto-fit-grid">
                    {cat.tools.map((tool, idx) => (
                      <ToolCard
                        key={tool.url}
                        tool={tool}
                        colorVar={cat.colorVar}
                        catId={cat.id}
                        catLabel={cat.label}
                        idx={idx}
                      />
                    ))}
                  </div>
                </div>
              </section>
            ))
          ) : null}

          {/* Empty local search */}
          {search && searchResults === null && !isSearching && localFilteredCategories.length === 0 && (
            <div className="text-center py-24 flex flex-col items-center max-w-sm mx-auto" role="status">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">No tools found</h3>
              <p className="text-slate-500 text-sm mb-6">No results for "{search}".</p>
              <button onClick={() => setSearch('')} className="btn-primary">Clear search</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ── App root ───────────────────────────────────────────────────────────────

function AuthGate() {
  const { isLoading, isAuthenticated, login } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-background grid place-items-center">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={login} />;
  }

  return <Home />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Switch>
          <Route path="/" component={AuthGate} />
        </Switch>
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
