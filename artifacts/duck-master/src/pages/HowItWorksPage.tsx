import { Link } from 'wouter';
import { PageLayout } from '../components/PageLayout';
import { SeoHead } from '../components/SeoHead';
import { LayoutGrid, Search, Bookmark, Sparkles, User, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    icon: <LayoutGrid className="w-6 h-6 text-indigo-500" />,
    title: 'Choose Your Module',
    body: 'Start with the 3D module carousel — a visual overview of all 25 specialist topic areas. Select the module most relevant to your investigation or research, or browse all tools across every module at once.',
  },
  {
    number: '02',
    icon: <Search className="w-6 h-6 text-indigo-500" />,
    title: 'Search with AI',
    body: 'Use natural language to describe what you need. Sign in with Google to unlock AI-powered search using NVIDIA NIM, which understands the intent behind your query — not just keywords. Without an account, instant local text search is still available.',
  },
  {
    number: '03',
    icon: <Bookmark className="w-6 h-6 text-indigo-500" />,
    title: 'Save Your Toolkit',
    body: 'Bookmark any tool to your personal workspace with one click. Your saved tools persist across sessions and appear in the Saved sidebar tab, making it easy to build a personal reference collection tailored to your workflows.',
  },
  {
    number: '04',
    icon: <ArrowRight className="w-6 h-6 text-indigo-500" />,
    title: 'Go Directly to the Tool',
    body: 'Every tool card links directly to the official source — the tool\'s homepage, GitHub repository, or documentation. Duck Master is a discovery layer, not a wrapper. You always access the real tool.',
  },
];

export function HowItWorksPage() {
  return (
    <PageLayout breadcrumbs={[{ label: 'How It Works' }]}>
      <SeoHead
        title="How Duck Master Works — Cybersecurity & OSINT Tool Directory"
        description="Learn how to use Duck Master: browse 25 modules, search 842 tools with AI, save your toolkit, and navigate directly to any cybersecurity or OSINT resource."
        canonical="/how-it-works"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center mb-14">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">How Duck Master Works</h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Duck Master is a free, publicly browsable reference directory for security professionals,
            OSINT practitioners, and AI researchers. Here's how to get the most out of it.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6 mb-14">
          {STEPS.map(step => (
            <div key={step.number} className="flex gap-5 p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                  {step.icon}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold text-indigo-400 font-mono">STEP {step.number}</span>
                  <h2 className="font-extrabold text-slate-800">{step.title}</h2>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Free vs signed in */}
        <section className="mb-14">
          <h2 className="text-2xl font-extrabold text-slate-800 mb-6">Guest vs Signed-In</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">G</span>
                Guest (No account)
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                {['Browse all 842 tools', 'View all 25 modules', 'Use text-based search', 'Access all guide articles', 'View the 3D module picker'].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-200">
              <h3 className="font-bold text-indigo-700 mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Signed In (Google account)
              </h3>
              <ul className="space-y-2 text-sm text-slate-700">
                {['Everything guests can do', 'AI-powered semantic search', 'Save tools to workspace', 'Search history tracking', 'Personal bookmark collection'].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
                      {f === 'Everything guests can do' ? '✓' : <Sparkles className="w-2.5 h-2.5" />}
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* The modules */}
        <section className="mb-14">
          <h2 className="text-2xl font-extrabold text-slate-800 mb-4">The 25 Modules</h2>
          <p className="text-slate-600 leading-relaxed mb-5">
            Tools are organised into 25 specialist modules covering every major area of cybersecurity
            and OSINT research — from foundational identity investigation through advanced AI agent
            security and blockchain forensics. Each module contains 8–60+ tools with direct links
            to official sources.
          </p>
          <Link href="/modules" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors">
            See all 25 modules
          </Link>
        </section>

        <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white">
          <h2 className="text-xl font-extrabold mb-2">Ready to start?</h2>
          <p className="text-white/75 text-sm mb-5">Browse 842 cybersecurity and OSINT tools — no account required.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-700 font-bold text-sm hover:bg-white/90 transition-colors">
            Open the Directory →
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
