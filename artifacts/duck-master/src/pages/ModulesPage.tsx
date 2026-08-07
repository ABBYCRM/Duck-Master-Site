import { Link } from 'wouter';
import { PageLayout } from '../components/PageLayout';
import { SeoHead } from '../components/SeoHead';
import { CATEGORIES } from '../data/tools';
import { MODULE_SLUGS } from '../data/modules-content';

const schema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'All 25 Modules — Duck Master',
  url: 'https://duck-master.replit.app/modules',
  description: 'Browse all 25 specialist modules in the Duck Master cybersecurity and OSINT tool directory.',
};

const COLORS = [
  '#6366f1','#8b5cf6','#ec4899','#f43f5e','#ef4444',
  '#f97316','#f59e0b','#84cc16','#22c55e','#10b981',
  '#14b8a6','#06b6d4','#0ea5e9','#3b82f6','#6366f1',
  '#7c3aed','#db2777','#e11d48','#dc2626','#ea580c',
  '#d97706','#65a30d','#16a34a','#059669','#0d9488',
];

export function ModulesPage() {
  return (
    <PageLayout breadcrumbs={[{ label: 'All Modules' }]}>
      <SeoHead
        title="All 25 Modules — Duck Master Cybersecurity & OSINT Tool Directory"
        description="Browse all 25 specialist modules in Duck Master: OSINT frameworks, network intelligence, threat intelligence, blockchain OSINT, AI platforms, digital forensics, and more."
        canonical="/modules"
        schema={schema}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-3">All 25 Modules</h1>
          <p className="text-slate-500 leading-relaxed max-w-2xl">
            Duck Master organises 842 cybersecurity, OSINT, and AI tools into 25 specialist modules.
            Each module page lists all tools in that category with links to official sources.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((cat, idx) => {
            const color = COLORS[idx % COLORS.length];
            const slug = MODULE_SLUGS[cat.id] || cat.id;
            return (
              <Link
                key={cat.id}
                href={`/module/${slug}`}
                className="group flex flex-col p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <span
                    className="text-xs font-bold px-2 py-1 rounded-md"
                    style={{ backgroundColor: color + '20', color }}
                  >
                    Module {cat.id}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{cat.links.length} tools</span>
                </div>
                <h2 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-indigo-700 transition-colors mb-2">
                  {cat.label}
                </h2>
                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center text-xs text-indigo-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Browse module →
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 p-5 rounded-2xl bg-indigo-50 border border-indigo-100">
          <p className="text-sm text-slate-700 leading-relaxed">
            <strong>Looking for a specific tool?</strong> Use the{' '}
            <Link href="/" className="text-indigo-600 hover:underline">AI-powered search in the main directory</Link>
            {' '}to find tools by describing what you need in plain language.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
