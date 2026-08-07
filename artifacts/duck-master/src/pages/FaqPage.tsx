import { Link } from 'wouter';
import { PageLayout } from '../components/PageLayout';
import { SeoHead } from '../components/SeoHead';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'What is Duck Master?',
    a: 'Duck Master is a curated, publicly browsable directory of 842 cybersecurity, OSINT, and AI tools organised across 25 specialist modules. It is a free educational reference platform — think of it as a structured, searchable bookmarks collection for security researchers and investigators.',
  },
  {
    q: 'How many tools are in the directory?',
    a: 'Currently 842 tools across 25 modules, covering OSINT, network intelligence, threat intelligence, blockchain analysis, reverse engineering, mobile security, digital forensics, AI platforms, AI agents, and more. The collection is regularly reviewed for accuracy and relevance.',
  },
  {
    q: 'Do I need to create an account to use Duck Master?',
    a: 'No — the full directory is publicly browsable without an account. Creating a free account (via Google) unlocks AI-powered search using NVIDIA NIM, the ability to save tools to your personal workspace, and your search history.',
  },
  {
    q: 'What is AI-powered search?',
    a: 'When you sign in, your search queries are processed by NVIDIA NIM (an AI inference service) to re-rank results based on semantic understanding of your query, not just keyword matching. This means you can search with natural language like "find email addresses from a company domain" and get better results than a plain keyword search would provide.',
  },
  {
    q: 'Are the tools free?',
    a: 'Most tools in the directory are free and open-source. Some have paid tiers or professional editions (like Maltego, Shodan, or SecurityTrails). Duck Master links to official tool sources and does not sell or resell any tool. Always review each tool\'s own pricing and licensing.',
  },
  {
    q: 'Is it legal to use these tools?',
    a: 'Most tools in this directory are legal to use for security research and OSINT investigation. However, many tools — particularly network scanners, exploitation frameworks, and penetration testing tools — must only be used against systems you own or have explicit written authorisation to test. Using security tools against third-party systems without authorisation is illegal in most jurisdictions. Always verify the legal framework applicable to your specific use case.',
  },
  {
    q: 'How do I navigate the 25 modules?',
    a: 'After signing in, you start with the 3D module picker — an animated carousel showing all 25 modules. Click a card to jump directly to that module. You can also use the sidebar navigation to jump between modules or the category chips at the top of the main directory view. The "Browse all 25 modules" link skips the picker and goes directly to the full list.',
  },
  {
    q: 'How do I save tools?',
    a: 'Sign in with Google, then hover over any tool card and click the bookmark icon that appears. Saved tools appear in the Saved tab in the left sidebar, where you can access them directly or remove them.',
  },
  {
    q: 'How do I suggest a tool for inclusion?',
    a: 'Visit our Contact page to submit a suggestion. We review all suggestions against our curation criteria: the tool should be publicly available, actively maintained, and genuinely useful for security research or OSINT investigation.',
  },
  {
    q: 'What is OSINT?',
    a: 'Open-Source Intelligence (OSINT) is the practice of collecting and analysing information from publicly available sources — websites, social media, government databases, satellite imagery, and more. Read our full guide: What Is OSINT?',
  },
  {
    q: 'Is my personal data safe?',
    a: 'We take data protection seriously. We do not sell your personal information. We store only what is necessary for the Service — your name, email, saved tools, and search history. Authentication is handled through Google OAuth via Replit Auth. See our full Privacy Policy for details.',
  },
  {
    q: 'How do I delete my account?',
    a: 'Contact us through the Contact page to request account deletion. We will remove all personal data associated with your account within 30 days of a verified deletion request.',
  },
];

const schema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map(item => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(index < 3);
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

export function FaqPage() {
  return (
    <PageLayout breadcrumbs={[{ label: 'FAQ' }]}>
      <SeoHead
        title="FAQ — Duck Master Cybersecurity & OSINT Tool Directory"
        description="Frequently asked questions about Duck Master: how to use the directory, AI-powered search, tool legality, account management, and OSINT basics."
        canonical="/faq"
        schema={schema}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Frequently Asked Questions</h1>
          <p className="text-slate-500 leading-relaxed">
            Everything you need to know about Duck Master. Can't find what you're looking for?{' '}
            <Link href="/contact" className="text-indigo-600 hover:underline">Contact us</Link>.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <FaqItem key={i} q={item.q} a={item.a} index={i} />
          ))}
        </div>

        <div className="mt-12 text-center p-6 rounded-2xl bg-indigo-50 border border-indigo-100">
          <p className="text-slate-700 font-medium mb-3">Ready to explore 842 security tools?</p>
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors">
            Browse the Directory →
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
