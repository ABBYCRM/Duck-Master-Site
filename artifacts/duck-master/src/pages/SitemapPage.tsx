import { Link } from 'wouter';
import { PageLayout } from '../components/PageLayout';
import { SeoHead } from '../components/SeoHead';
import { CATEGORIES } from '../data/tools';
import { MODULE_SLUGS } from '../data/modules-content';
import { GUIDE_SLUGS, GUIDES } from '../data/guides';

export function SitemapPage() {
  return (
    <PageLayout breadcrumbs={[{ label: 'Sitemap' }]}>
      <SeoHead
        title="Sitemap — Duck Master"
        description="Complete sitemap of Duck Master: all core pages, 25 module pages, 25 guide articles, and SEO files."
        canonical="/site-map"
        noIndex={false}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Sitemap</h1>
        <p className="text-slate-500 mb-10 leading-relaxed">
          A complete index of all pages on Duck Master. For machine-readable sitemaps, see{' '}
          <a href="/sitemap.xml" className="text-indigo-600 hover:underline">/sitemap.xml</a>{' '}
          and <a href="/llms.txt" className="text-indigo-600 hover:underline">/llms.txt</a>.
        </p>

        <div className="space-y-10">
          {/* Core pages */}
          <section>
            <h2 className="text-lg font-extrabold text-slate-700 mb-4 pb-2 border-b border-slate-200">Core Pages</h2>
            <ul className="grid sm:grid-cols-2 gap-2">
              {[
                { href: '/', label: 'Homepage — Duck Master Directory' },
                { href: '/modules', label: 'All 25 Modules' },
                { href: '/about', label: 'About Duck Master' },
                { href: '/how-it-works', label: 'How It Works' },
                { href: '/faq', label: 'Frequently Asked Questions' },
                { href: '/contact', label: 'Contact' },
                { href: '/privacy-policy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms of Service' },
                { href: '/site-map', label: 'Sitemap (this page)' },
              ].map(p => (
                <li key={p.href}>
                  <Link href={p.href} className="text-sm text-indigo-600 hover:underline leading-relaxed">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* SEO files */}
          <section>
            <h2 className="text-lg font-extrabold text-slate-700 mb-4 pb-2 border-b border-slate-200">SEO & Crawler Files</h2>
            <ul className="space-y-2">
              {['/sitemap.xml', '/robots.txt', '/llms.txt', '/humans.txt'].map(f => (
                <li key={f}>
                  <a href={f} className="text-sm text-indigo-600 hover:underline font-mono">{f}</a>
                </li>
              ))}
            </ul>
          </section>

          {/* Modules */}
          <section>
            <h2 className="text-lg font-extrabold text-slate-700 mb-4 pb-2 border-b border-slate-200">
              Module Pages ({CATEGORIES.length})
            </h2>
            <ul className="grid sm:grid-cols-2 gap-2">
              {CATEGORIES.map(cat => {
                const slug = MODULE_SLUGS[cat.id] || cat.id;
                return (
                  <li key={cat.id}>
                    <Link href={`/module/${slug}`} className="text-sm text-indigo-600 hover:underline leading-relaxed">
                      Module {cat.id}: {cat.label}
                    </Link>
                    <span className="text-xs text-slate-400 ml-1">({cat.links.length} tools)</span>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Guides */}
          <section>
            <h2 className="text-lg font-extrabold text-slate-700 mb-4 pb-2 border-b border-slate-200">
              Guide Articles ({GUIDES.length})
            </h2>
            <ul className="grid sm:grid-cols-2 gap-2">
              {GUIDES.map(g => (
                <li key={g.slug}>
                  <Link href={`/guide/${g.slug}`} className="text-sm text-indigo-600 hover:underline leading-relaxed">
                    {g.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
