import { Link } from 'wouter';
import { useParams } from 'wouter';
import { PageLayout } from '../components/PageLayout';
import { SeoHead } from '../components/SeoHead';
import { getModuleBySlug, MODULE_SLUGS } from '../data/modules-content';
import { CATEGORIES } from '../data/tools';
import { ExternalLink, ArrowLeft, ArrowRight } from 'lucide-react';

function getToolName(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    const parts = host.split('.');
    const name = parts.length >= 2 ? parts[parts.length - 2] : parts[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  } catch {
    return url;
  }
}

const COLORS = [
  '#6366f1','#8b5cf6','#ec4899','#f43f5e','#ef4444',
  '#f97316','#f59e0b','#84cc16','#22c55e','#10b981',
  '#14b8a6','#06b6d4','#0ea5e9','#3b82f6','#6366f1',
  '#7c3aed','#db2777','#e11d48','#dc2626','#ea580c',
  '#d97706','#65a30d','#16a34a','#059669','#0d9488',
];

export function ModulePage() {
  const params = useParams<{ id: string }>();
  const slug = params.id ?? '';
  const module = getModuleBySlug(slug);

  if (!module) {
    return (
      <PageLayout breadcrumbs={[{ label: 'Modules', href: '/modules' }, { label: 'Not Found' }]}>
        <SeoHead title="Module Not Found" description="This module does not exist." canonical={`/module/${slug}`} noIndex />
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-extrabold text-slate-800 mb-3">Module Not Found</h1>
          <p className="text-slate-500 mb-6">The module you are looking for does not exist.</p>
          <Link href="/modules" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors">
            ← All Modules
          </Link>
        </div>
      </PageLayout>
    );
  }

  const catIndex = CATEGORIES.findIndex(c => c.id === module.id);
  const color = COLORS[catIndex % COLORS.length];
  const prevCat = catIndex > 0 ? CATEGORIES[catIndex - 1] : null;
  const nextCat = catIndex < CATEGORIES.length - 1 ? CATEGORIES[catIndex + 1] : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://duck-master.replit.app/' },
      { '@type': 'ListItem', position: 2, name: 'Modules', item: 'https://duck-master.replit.app/modules' },
      { '@type': 'ListItem', position: 3, name: module.label, item: `https://duck-master.replit.app/module/${slug}` },
    ],
  };

  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${module.label} — Duck Master Module ${module.id}`,
    url: `https://duck-master.replit.app/module/${slug}`,
    description: module.description,
  };

  return (
    <PageLayout breadcrumbs={[{ label: 'Modules', href: '/modules' }, { label: `Module ${module.id}: ${module.label}` }]}>
      <SeoHead
        title={`${module.label} — Module ${module.id} | Duck Master`}
        description={`${module.description} Browse all ${module.toolCount} tools in this module with direct links to official sources.`}
        canonical={`/module/${slug}`}
        schema={[breadcrumbSchema, pageSchema]}
      />

      {/* Hero — Pattern 027 module-hero compaction */}
      <div className="module-hero">
        <div className="module-hero-inner">
          {/* Meta row */}
          <div className="flex items-center gap-3 flex-wrap mb-3">
            <span
              className="px-2.5 py-1 rounded-lg text-xs font-bold"
              style={{ backgroundColor: color + '18', color }}
            >
              Module {module.id}
            </span>
            <span className="text-sm text-slate-400 font-mono">{module.toolCount} tools</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 leading-tight">{module.label}</h1>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base max-w-2xl mb-4">{module.longDescription}</p>

          {/* Use cases — Pattern 070 pill scroll on mobile */}
          {module.useCases && module.useCases.length > 0 && (
            <div className="pill-scroll-wrap">
              <div className="pill-scroll">
                {module.useCases.map(uc => (
                  <span key={uc} className="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 font-medium border border-slate-200 whitespace-nowrap">
                    {uc}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* Tool grid */}
        <section aria-label={`Tools in ${module.label}`}>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-800 mb-4 sm:mb-5">
            All {module.toolCount} Tools in This Module
          </h2>
          {/* Pattern 013 — container query grid */}
          <div className="tool-grid-container mb-8 sm:mb-10">
            <div className="auto-fit-grid">
              {module.tools.map((url, idx) => {
                const name = getToolName(url);
                const domain = url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '').split('/')[0];
                return (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col p-3 sm:p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all active:scale-95"
                    style={{ '--card-i': idx } as React.CSSProperties}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: color + '18', color }}
                      >
                        {module.id}.{String(idx + 1).padStart(2, '0')}
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <p className="font-bold text-slate-800 text-sm group-hover:text-indigo-700 transition-colors line-clamp-1 mb-1">{name}</p>
                    <p className="text-[10px] font-mono text-slate-400 line-clamp-1">{domain}</p>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Related modules — pill scroll on mobile, flex-wrap on desktop */}
        {module.relatedModules && module.relatedModules.length > 0 && (
          <section className="mb-8 sm:mb-10">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-800 mb-3 sm:mb-4">Related Modules</h2>
            {/* Mobile: pill scroll */}
            <div className="sm:hidden pill-scroll-wrap">
              <div className="pill-scroll">
                {module.relatedModules.map(relId => {
                  const relCat = CATEGORIES.find(c => c.id === relId);
                  const relSlug = MODULE_SLUGS[relId];
                  if (!relCat || !relSlug) return null;
                  return (
                    <Link
                      key={relId}
                      href={`/module/${relSlug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all whitespace-nowrap"
                    >
                      <span className="font-mono text-slate-400">{relCat.id}</span>
                      {relCat.label}
                    </Link>
                  );
                })}
              </div>
            </div>
            {/* Tablet+: flex wrap */}
            <div className="hidden sm:flex flex-wrap gap-3">
              {module.relatedModules.map(relId => {
                const relCat = CATEGORIES.find(c => c.id === relId);
                const relSlug = MODULE_SLUGS[relId];
                if (!relCat || !relSlug) return null;
                return (
                  <Link
                    key={relId}
                    href={`/module/${relSlug}`}
                    className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-sm font-medium text-slate-700 hover:text-indigo-700 transition-all"
                  >
                    Module {relCat.id}: {relCat.label}
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50 border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <p className="font-bold text-slate-800 mb-1 text-sm sm:text-base">Want AI-powered search across all 842 tools?</p>
            <p className="text-xs sm:text-sm text-slate-500">Sign in with Google to use natural-language search powered by NVIDIA NIM.</p>
          </div>
          <Link href="/" className="shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-colors">
            Open Directory →
          </Link>
        </div>

        {/* Prev / Next */}
        <div className="flex items-center justify-between gap-3 pt-6 border-t border-slate-200">
          {prevCat ? (
            <Link href={`/module/${MODULE_SLUGS[prevCat.id]}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition-colors min-w-0">
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span className="font-medium truncate hidden sm:block">Module {prevCat.id}: {prevCat.label}</span>
              <span className="font-medium sm:hidden">Prev</span>
            </Link>
          ) : <div />}
          {nextCat ? (
            <Link href={`/module/${MODULE_SLUGS[nextCat.id]}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition-colors min-w-0 text-right">
              <span className="font-medium truncate hidden sm:block">Module {nextCat.id}: {nextCat.label}</span>
              <span className="font-medium sm:hidden">Next</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </Link>
          ) : <div />}
        </div>
      </div>
    </PageLayout>
  );
}
