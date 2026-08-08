import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { FaqPage } from './pages/FaqPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { ModulesPage } from './pages/ModulesPage';
import { SitemapPage } from './pages/SitemapPage';
import { ModulePage } from './pages/ModulePage';
import { GuidePage } from './pages/GuidePage';
import {
  Search, ExternalLink, BookOpen, X, Menu,
  Bookmark, BookmarkCheck, Sparkles, Clock, LogOut, User,
  ChevronRight, Loader2, AlertCircle, LayoutGrid, Lock,
} from "lucide-react";
import { CATEGORIES, getToolName } from './data/tools';
import { useAuth } from '@workspace/replit-auth-web';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TopicPicker } from './components/TopicPicker';
import { LoginModal, type LoginReason } from './components/LoginModal';
import { CcpaConsent } from './components/CcpaConsent';

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

// ── Client-side search (guests — no API call) ──────────────────────────────
// Mirrors the server's localSearch so guests still get useful results instantly.
function clientSearch(query: string): SearchResultItem[] {
  const q = query.toLowerCase();
  const exact: SearchResultItem[] = [];
  const partial: SearchResultItem[] = [];

  for (const cat of CATEGORIES) {
    for (const url of cat.links) {
      const name = getToolName(url);
      const haystack = `${name} ${url} ${cat.label}`.toLowerCase();
      const item: SearchResultItem = { url, name, categoryId: cat.id, categoryLabel: cat.label, relevance: null };
      if (name.toLowerCase().startsWith(q)) exact.push(item);
      else if (haystack.includes(q)) partial.push(item);
    }
  }

  return [...exact, ...partial].slice(0, 80);
}

// ── API helpers (authenticated users only) ────────────────────────────────

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
  const res = await apiFetch(`/workspace/saved/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to unsave tool: ${res.status}`);
}

async function fetchHistory(): Promise<SearchHistoryItem[]> {
  const res = await apiFetch('/workspace/history');
  if (!res.ok) throw new Error('Failed to load history');
  const data = await res.json();
  return data.history;
}

// ── Main app ───────────────────────────────────────────────────────────────

function Home() {
  const { user, isAuthenticated, login, logout } = useAuth();

  // View: topics picker carousel vs full directory
  const [view, setView] = useState<'topics' | 'directory'>('topics');

  // Login modal
  const [loginModal, setLoginModal] = useState<{ show: boolean; reason: LoginReason }>({
    show: false,
    reason: 'generic',
  });
  const openLogin = useCallback((reason: LoginReason, toolUrl?: string) => {
    if (toolUrl) sessionStorage.setItem('gdy_pending_tool', toolUrl);
    setLoginModal({ show: true, reason });
  }, []);
  const closeLogin = useCallback(() => {
    // If the user dismisses without signing in, discard any pending tool URL so
    // a later unrelated sign-in does not unexpectedly navigate to it.
    sessionStorage.removeItem('gdy_pending_tool');
    setLoginModal(m => ({ ...m, show: false }));
  }, []);

  // UI state
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(CATEGORIES[0].id);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'modules' | 'saved' | 'history'>('modules');

  // Search state
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResultItem[] | null>(null);
  const [searchAiPowered, setSearchAiPowered] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Per-user workspace state (only populated when authenticated)
  const [savedTools, setSavedTools] = useState<SavedTool[]>([]);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [savingUrls, setSavingUrls] = useState<Set<string>>(new Set());

  // Enriched categories
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

  // Load workspace data — only when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setSavedTools([]);
      setHistory([]);
      return;
    }
    fetchSaved().then(setSavedTools).catch(() => {});
    fetchHistory().then(setHistory).catch(() => {});
  }, [isAuthenticated]);

  // After sign-in: navigate to any tool the user clicked before the OAuth redirect.
  // window.location.assign is a trusted top-level navigation — never blocked by
  // popup blockers (unlike window.open, which has no user-gesture after a redirect).
  useEffect(() => {
    if (!isAuthenticated) return;
    const pending = sessionStorage.getItem('gdy_pending_tool');
    if (!pending) return;
    sessionStorage.removeItem('gdy_pending_tool');
    window.location.assign(pending);
  }, [isAuthenticated]);

  // Search — guests: instant client-side filter; authenticated: AI via backend
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!search.trim()) {
      setSearchResults(null);
      setSearchError(null);
      setIsSearching(false);
      return;
    }

    if (!isAuthenticated) {
      // Guest: instant client-side keyword filter, no AI
      setSearchResults(clientSearch(search.trim()));
      setSearchAiPowered(false);
      setIsSearching(false);
      return;
    }

    // Authenticated: debounce then call backend (NVIDIA NIM)
    setIsSearching(true);
    searchTimeout.current = setTimeout(async () => {
      try {
        const data = await postSearch(search.trim());
        setSearchResults(data.results);
        setSearchAiPowered(data.aiPowered);
        setSearchError(null);
        fetchHistory().then(setHistory).catch(() => {});
      } catch {
        setSearchError('Search failed. Please try again.');
        setSearchResults(null);
      } finally {
        setIsSearching(false);
      }
    }, 420);

    return () => { if (searchTimeout.current) clearTimeout(searchTimeout.current); };
  }, [search, isAuthenticated]);

  // Intersection observer → highlight active sidebar module
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
    // Root must be the actual scrollable container, not the window — the layout
    // uses overflow-y-auto on #main-scroll, so window.scroll* is a no-op here.
    const root = document.getElementById('main-scroll');
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          setActiveCategory(visible[0].target.id.replace('module-', ''));
        }
      },
      { root, rootMargin: '-20% 0px -80% 0px' }
    );
    localFilteredCategories.forEach(cat => {
      const el = document.getElementById(`module-${cat.id}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [localFilteredCategories, searchResults]);

  const scrollTo = useCallback((id: string) => {
    setSearch('');
    setSearchResults(null);
    setTimeout(() => {
      const container = document.getElementById('main-scroll');
      const el = document.getElementById(`module-${id}`);
      if (el && container) {
        // Compute position relative to the scrollable container, not the window.
        const containerRect = container.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const offset = elRect.top - containerRect.top + container.scrollTop - 100;
        container.scrollTo({ top: offset, behavior: 'smooth' });
        setActiveCategory(id);
      }
    }, 50);
    setIsMobileMenuOpen(false);
  }, []);

  const onSelectTopic = useCallback((categoryId: string) => {
    setView('directory');
    setActiveCategory(categoryId);
    setTimeout(() => {
      const container = document.getElementById('main-scroll');
      const el = document.getElementById(`module-${categoryId}`);
      if (el && container) {
        const containerRect = container.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const offset = elRect.top - containerRect.top + container.scrollTop - 100;
        container.scrollTo({ top: offset, behavior: 'smooth' });
      }
    }, 120);
  }, []);

  // Bookmark handler — prompts login for guests
  const handleSave = useCallback(async (tool: { url: string; name: string }, cat: { id: string; label: string }) => {
    if (!isAuthenticated) {
      openLogin('save');
      return;
    }
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
  }, [isAuthenticated, savedSet, openLogin]);

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

    const handleToolOpen = (e: React.MouseEvent | React.KeyboardEvent) => {
      if (isAuthenticated) return; // let the <a> navigate normally
      e.preventDefault();
      openLogin('tool-open', tool.url);
    };

    return (
      <div
        className="tool-card group p-5 flex flex-col relative overflow-hidden"
        style={{ '--card-color': colorVar, '--card-i': idx } as React.CSSProperties}
        onClick={!isAuthenticated ? handleToolOpen : undefined}
        role={!isAuthenticated ? 'button' : undefined}
        tabIndex={!isAuthenticated ? 0 : undefined}
        onKeyDown={!isAuthenticated ? (e) => { if (e.key === 'Enter' || e.key === ' ') handleToolOpen(e); } : undefined}
      >
        {/* Badge + save button */}
        <div className="flex items-start justify-between mb-3 gap-2">
          <span
            className="cat-badge px-2 py-0.5 text-[10px] font-bold rounded-full uppercase-tracking shrink-0 border bg-white"
            style={{ color: colorVar, borderColor: colorVar }}
          >
            {catId}.{String(idx + 1).padStart(2, '0')}
          </span>
          <button
            onClick={e => { e.stopPropagation(); e.preventDefault(); handleSave(tool, { id: catId, label: catLabel }); }}
            className={cn(
              // save-btn is targeted by the @media (hover: none) rule in index.css
              // to keep the button always visible on touch devices.
              "save-btn shrink-0 w-7 h-7 flex items-center justify-center rounded-full transition-all",
              isSaved
                ? "text-indigo-600 bg-indigo-50 opacity-100"
                : "text-slate-300 opacity-0 group-hover:opacity-100 hover:text-indigo-600 hover:bg-indigo-50",
            )}
            aria-label={isAuthenticated ? (isSaved ? 'Remove from saved' : 'Save tool') : 'Sign in to save'}
            disabled={isSaving}
          >
            {isSaving
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : !isAuthenticated
                ? <Lock className="w-3 h-3" />
                : isSaved
                  ? <BookmarkCheck className="w-3.5 h-3.5" />
                  : <Bookmark className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Name */}
        <a
          href={isAuthenticated ? tool.url : undefined}
          target={isAuthenticated ? '_blank' : undefined}
          rel="noopener noreferrer"
          onClick={!isAuthenticated ? handleToolOpen : undefined}
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

        {/* AI relevance note */}
        {relevance && (
          <p className="text-[10px] text-indigo-500 font-medium mt-2 leading-snug border-t border-indigo-50 pt-2">
            {relevance}
          </p>
        )}
      </div>
    );
  }, [savedSet, savingUrls, handleSave, isAuthenticated]);

  // ── Sidebar ────────────────────────────────────────────────────────────

  const SidebarContent = () => (
    <>
      {/* Logo + user strip */}
      <div className="p-4 border-b border-slate-100 bg-white shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h1 className="flex items-center">
            <button
              onClick={() => { setView('topics'); setIsMobileMenuOpen(false); }}
              className="hover:opacity-75 transition-opacity"
              aria-label="Back to module picker"
            >
              <img src="/gdy-logo.png" alt="GDY — Go Duck Yourself" className="h-8 w-auto object-contain" />
            </button>
          </h1>
          <button
            className="lg:hidden p-1 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Choose topic shortcut */}
        <button
          onClick={() => { setView('topics'); setIsMobileMenuOpen(false); }}
          className="w-full flex items-center gap-2 px-3 py-2 mb-2 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition-colors"
        >
          <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
          Choose a topic
          <span className="ml-auto text-[10px] text-indigo-400 font-normal">25 modules</span>
        </button>

        {/* User strip / sign-in CTA */}
        {isAuthenticated ? (
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
                {user?.firstName ?? user?.email ?? 'Signed in'}
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
        ) : (
          <button
            onClick={() => openLogin('generic')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <User className="w-3.5 h-3.5" />
            Sign in with Google
          </button>
        )}
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
          <div className="metric text-base font-extrabold text-indigo-600">
            {isAuthenticated ? savedTools.length : '—'}
          </div>
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
            onClick={() => {
              if (!isAuthenticated && (tab === 'saved' || tab === 'history')) {
                openLogin(tab === 'saved' ? 'save' : 'history');
                return;
              }
              setSidebarTab(tab);
            }}
            className={cn(
              "flex-1 py-2 text-xs font-semibold transition-colors",
              sidebarTab === tab && isAuthenticated
                ? "text-indigo-600 border-b-2 border-indigo-500"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            {label}
            {!isAuthenticated && (tab === 'saved' || tab === 'history') && (
              <Lock className="inline w-2.5 h-2.5 ml-1 opacity-40" />
            )}
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
      {sidebarTab === 'saved' && isAuthenticated && (
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 sidebar-scroll">
          {savedTools.length === 0 ? (
            <div className="text-center py-10 px-4">
              <Bookmark className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-xs text-slate-400">No saved tools yet. Click the bookmark icon on any tool card.</p>
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
      {sidebarTab === 'history' && isAuthenticated && (
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
      {/* Topic Picker overlay */}
      {view === 'topics' && (
        <TopicPicker
          onSelectTopic={onSelectTopic}
          onBrowseAll={() => setView('directory')}
        />
      )}

      {/* Login modal — shown on interaction for guests */}
      <LoginModal
        open={loginModal.show}
        reason={loginModal.reason}
        onClose={closeLogin}
        onLogin={login}
      />

      {/* CCPA consent banner */}
      <CcpaConsent />

      {/* Skip link */}
      <a href="#main-content" className="skip-link">Skip to content</a>

      {/* Scroll progress bar */}
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
        <div className="hero-gradient flex flex-col shrink-0 fluid-gutter pt-8 lg:pt-12 pb-5 sm:pb-8 relative shadow-lg z-10">
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-white/80 hover:text-white rounded-md transition-colors"
              aria-label="Open navigation"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-2 ml-auto flex-wrap justify-end">
              {/* Topic picker pill */}
              <button
                onClick={() => setView('topics')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={{
                  background: 'rgba(255,255,255,0.10)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: 'rgba(255,255,255,0.80)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Choose topic
              </button>

              {/* Sign in / user pill */}
              {isAuthenticated ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' }}>
                  {user?.profileImageUrl
                    ? <img src={user.profileImageUrl} alt="" className="w-5 h-5 rounded-full object-cover" />
                    : <User className="w-3.5 h-3.5 text-white/80" />}
                  <span className="text-xs font-semibold text-white/80 max-w-[80px] truncate">
                    {user?.firstName ?? 'You'}
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => openLogin('generic')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.95)',
                    color: '#4f46e5',
                  }}
                >
                  Sign in
                </button>
              )}
            </div>
          </div>

          {/* Hero row: text left, duck right */}
          <div className="flex items-end justify-between gap-4 mb-0">
            <div className="min-w-0">
              <button
                onClick={() => setView('topics')}
                className="fluid-heading font-extrabold tracking-tight mb-2 block text-left hover:opacity-80 transition-opacity cursor-pointer group"
                id="main-content"
                aria-label="Back to module picker"
                title="Back to module picker"
              >
                <span className="gradient-text">GDY</span>
                <span className="ml-2 text-white/30 text-base align-middle opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden>↩</span>
              </button>

              <p className="text-white/70 text-sm sm:text-base mb-4 sm:mb-5 font-medium max-w-xl">
                <span className="metric font-bold text-white">{totalTools}</span>
                {' tools · '}
                <span className="metric font-bold text-white">{CATEGORIES.length}</span>
                {' modules'}
                {isAuthenticated && savedTools.length > 0 && (
                  <>{' · '}<span className="metric font-bold text-indigo-300">{savedTools.length}</span>{' saved'}</>
                )}
              </p>
            </div>

            {/* Duck mascot — click to go back to the module picker */}
            <button
              onClick={() => setView('topics')}
              aria-label="Back to module picker"
              className="shrink-0 hover:scale-105 transition-transform duration-200 cursor-pointer"
              style={{ marginBottom: '-1rem', background: 'none', border: 'none', padding: 0 }}
            >
              <img
                src="/gdy-hero.png"
                alt="Back to module picker"
                draggable={false}
                className="object-contain drop-shadow-2xl select-none"
                style={{
                  height: 'clamp(80px, 14vw, 160px)',
                  filter: 'drop-shadow(0 0 20px rgba(139,92,246,0.55))',
                }}
              />
            </button>
          </div>

          {/* Category chip strip — wrapped for right-edge fade hint */}
          <div className="chip-strip-wrap">
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
          </div>{/* end chip-strip-wrap */}

          {/* Back to carousel CTA */}
          <button
            onClick={() => setView('topics')}
            className="mt-4 sm:mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            ← Back to module picker
          </button>
        </div>

        {/* Sticky search bar */}
        <div className="sticky top-0 z-30 glass-panel fluid-gutter py-3 border-b border-black/5">
          <div className="search-wrapper rounded-lg max-w-3xl flex items-center relative bg-white border border-slate-200 shadow-sm h-11">
            {isSearching
              ? <Loader2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 animate-spin pointer-events-none" />
              : <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />}
            <input
              type="search"
              placeholder={
                isAuthenticated
                  ? `Search ${totalTools} tools with AI… try "find email addresses" or "blockchain scanner"`
                  : `Search ${totalTools} tools… sign in to unlock AI-powered results`
              }
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

          {/* Search status line */}
          {search && (
            <div className="max-w-3xl mt-1.5 flex items-center gap-3">
              {isSearching && (
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  AI is searching…
                </span>
              )}
              {!isSearching && searchResults !== null && isAuthenticated && (
                <span className={cn(
                  "text-xs flex items-center gap-1 font-medium",
                  searchAiPowered ? "text-indigo-500" : "text-slate-400"
                )}>
                  {searchAiPowered
                    ? <><Sparkles className="w-3 h-3" /> AI-powered · {searchResults.length} results</>
                    : <><Search className="w-3 h-3" /> {searchResults.length} results</>}
                </span>
              )}
              {!isSearching && searchResults !== null && !isAuthenticated && (
                <>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Search className="w-3 h-3" />
                    {searchResults.length} results
                  </span>
                  <button
                    onClick={() => openLogin('ai-search')}
                    className="text-xs text-indigo-500 font-semibold flex items-center gap-1 hover:text-indigo-700 transition-colors ml-auto"
                  >
                    <Sparkles className="w-3 h-3" />
                    Unlock AI search →
                  </button>
                </>
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

          {/* Search results */}
          {search && searchResults !== null && (
            <section aria-label="Search results">
              <div className="flex items-center gap-3 mb-6">
                {searchAiPowered
                  ? <Sparkles className="w-5 h-5 text-indigo-500 shrink-0" />
                  : <Search className="w-5 h-5 text-slate-400 shrink-0" />}
                <h2 className="fluid-section-heading font-extrabold text-slate-800">
                  {searchAiPowered ? 'AI Results' : 'Results'}
                </h2>
                <span className="text-xs font-mono text-slate-400">{searchResults.length} tools</span>

                {/* AI upgrade nudge for guests */}
                {!isAuthenticated && (
                  <button
                    onClick={() => openLogin('ai-search')}
                    className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    Get AI-ranked results
                  </button>
                )}
              </div>

              {searchResults.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center max-w-sm mx-auto">
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

          {/* Module sections */}
          {(!search || searchResults === null) && (
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
          )}

          {/* Empty search state */}
          {search && searchResults === null && !isSearching && localFilteredCategories.length === 0 && (
            <div className="text-center py-24 flex flex-col items-center max-w-sm mx-auto">
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
// No auth wall — the full site is publicly accessible.
// Auth state is resolved in the background; Home handles the unauthenticated UX.

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Switch>
            {/* Core */}
            <Route path="/" component={Home} />
            <Route path="/about" component={AboutPage} />
            <Route path="/contact" component={ContactPage} />
            <Route path="/privacy-policy" component={PrivacyPolicyPage} />
            <Route path="/terms" component={TermsPage} />
            <Route path="/faq" component={FaqPage} />
            <Route path="/how-it-works" component={HowItWorksPage} />
            <Route path="/modules" component={ModulesPage} />
            <Route path="/site-map" component={SitemapPage} />
            {/* Dynamic module pages */}
            <Route path="/module/:id" component={ModulePage} />
            {/* Dynamic guide pages */}
            <Route path="/guide/:slug" component={GuidePage} />
            {/* Catch-all → home */}
            <Route component={Home} />
          </Switch>
        </WouterRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
