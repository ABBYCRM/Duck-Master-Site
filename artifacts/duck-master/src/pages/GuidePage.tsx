import { Link } from 'wouter';
import { useParams } from 'wouter';
import { PageLayout } from '../components/PageLayout';
import { SeoHead } from '../components/SeoHead';
import { getGuideBySlug, GUIDES } from '../data/guides';
import { CATEGORIES } from '../data/tools';
import { MODULE_SLUGS } from '../data/modules-content';
import { useState } from 'react';
import { ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react';

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left bg-white hover:bg-slate-50 transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-slate-800 text-sm leading-snug">{q}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 mt-0.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 pt-1 text-sm text-slate-600 leading-relaxed bg-white border-t border-slate-100">
          {a}
        </div>
      )}
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-[1fr_280px] gap-10">

          {/* Main content */}
          <article>
            <header className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                {guide.h1}
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed">
                {guide.intro}
              </p>
            </header>

            {/* Sections */}
            <div className="space-y-8 mb-12">
              {guide.sections.map(section => (
                <section key={section.h2}>
                  <h2 className="text-xl font-extrabold text-slate-800 mb-3">{section.h2}</h2>
                  <p className="text-slate-600 leading-relaxed">{section.content}</p>
                </section>
              ))}
            </div>

            {/* FAQ */}
            {guide.faq.length > 0 && (
              <section className="mb-12">
                <h2 className="text-xl font-extrabold text-slate-800 mb-4">Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {guide.faq.map((item, i) => (
                    <FaqItem key={i} q={item.q} a={item.a} />
                  ))}
                </div>
              </section>
            )}

            {/* CTA */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white mb-10">
              <h2 className="text-lg font-extrabold mb-2">Find the right tools for this topic</h2>
              <p className="text-white/75 text-sm leading-relaxed mb-4">
                Duck Master curates 842 cybersecurity, OSINT, and AI tools across 25 modules.
                Use AI-powered search to find exactly what you need.
              </p>
              <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-indigo-700 font-bold text-sm hover:bg-white/90 transition-colors">
                Open Tool Directory →
              </Link>
            </div>

            {/* Disclaimer */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-xs text-amber-700 leading-relaxed">
              <strong>Educational disclaimer:</strong> This guide is for informational and educational purposes only. Nothing in this article constitutes legal, security, or professional advice. Always ensure your use of any described technique or tool is lawful and authorised.
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">

            {/* Related modules */}
            {guide.relatedModules.length > 0 && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <h3 className="text-sm font-bold text-slate-700 mb-3">Related Modules</h3>
                <div className="space-y-2">
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

            {/* Related guides */}
            {guide.relatedGuides.length > 0 && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <h3 className="text-sm font-bold text-slate-700 mb-3">Related Guides</h3>
                <div className="space-y-2">
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

            {/* All guides */}
            <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100">
              <h3 className="text-sm font-bold text-indigo-700 mb-3">All Guides</h3>
              <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                {GUIDES.map(g => (
                  <Link
                    key={g.slug}
                    href={`/guide/${g.slug}`}
                    className={`block text-xs p-1.5 rounded transition-colors leading-snug ${g.slug === slug ? 'text-indigo-700 font-bold' : 'text-slate-600 hover:text-indigo-600'}`}
                  >
                    {g.title}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Prev/Next */}
        <div className="flex items-center justify-between gap-4 pt-8 border-t border-slate-200 mt-8">
          {prevGuide ? (
            <Link href={`/guide/${prevGuide.slug}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition-colors max-w-xs">
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span className="font-medium line-clamp-1">{prevGuide.title}</span>
            </Link>
          ) : <div />}
          {nextGuide ? (
            <Link href={`/guide/${nextGuide.slug}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition-colors max-w-xs text-right">
              <span className="font-medium line-clamp-1">{nextGuide.title}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </Link>
          ) : <div />}
        </div>
      </div>
    </PageLayout>
  );
}
