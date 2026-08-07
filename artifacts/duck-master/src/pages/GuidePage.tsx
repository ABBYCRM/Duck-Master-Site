import { Link } from 'wouter';
import { useParams } from 'wouter';
import { PageLayout } from '../components/PageLayout';
import { SeoHead } from '../components/SeoHead';
import { getGuideBySlug, GUIDES } from '../data/guides';
import { CATEGORIES } from '../data/tools';
import { MODULE_SLUGS } from '../data/modules-content';
import { useState } from 'react';
import { ChevronDown, ArrowLeft, ArrowRight, BookOpen, LayoutGrid } from 'lucide-react';

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-start justify-between gap-4 px-4 sm:px-5 py-4 text-left bg-white hover:bg-slate-50 transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-slate-800 text-sm leading-snug">{q}</span>
        <ChevronDown
          className="w-4 h-4 text-slate-400 shrink-0 mt-0.5 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)' }}
        />
      </button>
      {/* Pattern 056 — grid-template-rows expand */}
      <div className="accordion-body" data-open={open ? 'true' : 'false'}>
        <div className="accordion-inner px-4 sm:px-5 pb-4 pt-2 text-sm text-slate-600 leading-relaxed bg-white border-t border-slate-100">
          {a}
        </div>
      </div>
    </div>
  );
}

export function GuidePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? '';
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return (
      <PageLayout breadcrumbs={[{ label: 'Guides' }, { label: 'Not Found' }]}>
        <SeoHead title="Guide Not Found" description="This guide does not exist." canonical={`/guide/${slug}`} noIndex />
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-extrabold text-slate-800 mb-3">Guide Not Found</h1>
          <p className="text-slate-500 mb-6">The guide you are looking for does not exist.</p>
          <Link href="/guide/what-is-osint" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors">
            Start with OSINT Basics →
          </Link>
        </div>
      </PageLayout>
    );
  }

  const guideIndex = GUIDES.findIndex(g => g.slug === slug);
  const prevGuide = guideIndex > 0 ? GUIDES[guideIndex - 1] : null;
  const nextGuide = guideIndex < GUIDES.length - 1 ? GUIDES[guideIndex + 1] : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://duck-master.replit.app/' },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://duck-master.replit.app/guide/what-is-osint' },
      { '@type': 'ListItem', position: 3, name: guide.title, item: `https://duck-master.replit.app/guide/${slug}` },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    url: `https://duck-master.replit.app/guide/${slug}`,
    author: { '@type': 'Organization', name: 'Duck Master' },
    publisher: { '@type': 'Organization', name: 'Duck Master', url: 'https://duck-master.replit.app' },
    datePublished: '2026-08-07',
    dateModified: '2026-08-07',
  };

  const faqSchema = guide.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faq.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  } : null;

  const schemas = [breadcrumbSchema, articleSchema, ...(faqSchema ? [faqSchema] : [])];

  return (
    <PageLayout breadcrumbs={[{ label: 'Guides', href: '/guide/what-is-osint' }, { label: guide.title }]}>
      <SeoHead
        title={guide.title}
        description={guide.description}
        canonical={`/guide/${slug}`}
        ogType="article"
        schema={schemas}
      />

      {/* Pattern 053 — container query drives sidebar show/hide */}
      <div className="article-with-sidebar max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

          {/* ── Main article ── */}
          <article className="article-main-col min-w-0 flex-1">
            <header className="mb-7 sm:mb-9">
              {/* Pattern 042 — fluid guide heading */}
              <h1 className="guide-h1 mb-4">{guide.h1}</h1>
              <p className="guide-lead">{guide.intro}</p>
            </header>

            {/* Sections */}
            <div className="space-y-7 sm:space-y-9 mb-10 sm:mb-12">
              {guide.sections.map(section => (
                <section key={section.h2}>
                  <h2 className="guide-section-h2 mb-3">{section.h2}</h2>
                  <p className="text-slate-600 leading-relaxed text-[0.97rem] sm:text-base">{section.content}</p>
                </section>
              ))}
            </div>

            {/* ── Mobile-only related content — Pattern 070 pill scroll ── */}
            {(guide.relatedModules.length > 0 || guide.relatedGuides.length > 0) && (
              <div className="article-sidebar-mobile lg:hidden mb-8 sm:mb-10 space-y-4">
                {guide.relatedModules.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <LayoutGrid className="w-3.5 h-3.5 text-indigo-500" />
                      <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wide">Related Modules</h3>
                    </div>
                    <div className="pill-scroll-wrap">
                      <div className="pill-scroll">
                        {guide.relatedModules.map(modId => {
                          const cat = CATEGORIES.find(c => c.id === modId);
                          const modSlug = MODULE_SLUGS[modId];
                          if (!cat || !modSlug) return null;
                          return (
                            <Link
                              key={modId}
                              href={`/module/${modSlug}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors whitespace-nowrap"
                            >
                              <span className="font-mono text-indigo-400">{modId}</span>
                              {cat.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {guide.relatedGuides.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                      <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wide">Related Guides</h3>
                    </div>
                    <div className="pill-scroll-wrap">
                      <div className="pill-scroll">
                        {guide.relatedGuides.map(relSlug => {
                          const relGuide = GUIDES.find(g => g.slug === relSlug);
                          if (!relGuide) return null;
                          return (
                            <Link
                              key={relSlug}
                              href={`/guide/${relSlug}`}
                              className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors whitespace-nowrap"
                            >
                              {relGuide.title}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* FAQ */}
            {guide.faq.length > 0 && (
              <section className="mb-10 sm:mb-12">
                <h2 className="guide-section-h2 mb-4">Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {guide.faq.map((item, i) => (
                    <FaqItem key={i} q={item.q} a={item.a} />
                  ))}
                </div>
              </section>
            )}

            {/* CTA */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white mb-8 sm:mb-10">
              <h2 className="text-base sm:text-lg font-extrabold mb-2">Find the right tools for this topic</h2>
              <p className="text-white/75 text-sm leading-relaxed mb-4">
                Duck Master curates 842 cybersecurity, OSINT, and AI tools across 25 modules.
                Use AI-powered search to find exactly what you need.
              </p>
              <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-indigo-700 font-bold text-sm hover:bg-white/90 transition-colors">
                Open Tool Directory →
              </Link>
            </div>

            {/* Disclaimer */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-xs text-amber-700 leading-relaxed mb-8">
              <strong>Educational disclaimer:</strong> This guide is for informational and educational purposes only. Nothing in this article constitutes legal, security, or professional advice. Always ensure your use of any described technique or tool is lawful and authorised.
            </div>

            {/* Prev / Next — Pattern 038 logical margin */}
            <div className="flex items-center justify-between gap-4 pt-6 border-t border-slate-200">
              {prevGuide ? (
                <Link href={`/guide/${prevGuide.slug}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition-colors min-w-0">
                  <ArrowLeft className="w-4 h-4 shrink-0" />
                  <span className="font-medium truncate">{prevGuide.title}</span>
                </Link>
              ) : <div />}
              {nextGuide ? (
                <Link href={`/guide/${nextGuide.slug}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition-colors text-right min-w-0">
                  <span className="font-medium truncate">{nextGuide.title}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>
              ) : <div />}
            </div>
          </article>

          {/* ── Desktop sidebar — Pattern 053 container-query controlled ── */}
          <aside className="article-sidebar w-72 xl:w-80 shrink-0 space-y-5">

            {guide.relatedModules.length > 0 && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <h3 className="text-sm font-bold text-slate-700 mb-3">Related Modules</h3>
                <div className="space-y-1.5">
                  {guide.relatedModules.map(modId => {
                    const cat = CATEGORIES.find(c => c.id === modId);
                    const modSlug = MODULE_SLUGS[modId];
                    if (!cat || !modSlug) return null;
                    return (
                      <Link
                        key={modId}
                        href={`/module/${modSlug}`}
                        className="flex items-start gap-2 p-2.5 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 transition-all group"
                      >
                        <span className="shrink-0 text-[10px] font-bold text-indigo-500 mt-0.5 font-mono">{modId}</span>
                        <span className="text-xs text-slate-700 group-hover:text-indigo-700 transition-colors font-medium leading-snug">{cat.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {guide.relatedGuides.length > 0 && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <h3 className="text-sm font-bold text-slate-700 mb-3">Related Guides</h3>
                <div className="space-y-1">
                  {guide.relatedGuides.map(relSlug => {
                    const relGuide = GUIDES.find(g => g.slug === relSlug);
                    if (!relGuide) return null;
                    return (
                      <Link
                        key={relSlug}
                        href={`/guide/${relSlug}`}
                        className="block text-xs text-slate-600 hover:text-indigo-600 transition-colors p-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200"
                      >
                        {relGuide.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All guides list */}
            <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100">
              <h3 className="text-sm font-bold text-indigo-700 mb-3">All Guides</h3>
              <div className="space-y-0.5 max-h-72 overflow-y-auto pr-1 sidebar-scroll">
                {GUIDES.map(g => (
                  <Link
                    key={g.slug}
                    href={`/guide/${g.slug}`}
                    className={`block text-xs p-1.5 rounded transition-colors leading-snug ${g.slug === slug ? 'text-indigo-700 font-bold bg-indigo-100' : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-100/60'}`}
                  >
                    {g.title}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </PageLayout>
  );
}
