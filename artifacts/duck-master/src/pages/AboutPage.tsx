import { Link } from 'wouter';
import { PageLayout } from '../components/PageLayout';
import { SeoHead } from '../components/SeoHead';
import { BookOpen, Shield, Search, Users } from 'lucide-react';

const schema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Duck Master',
  url: 'https://duck-master.replit.app/about',
  description: 'Duck Master is a curated educational directory of cybersecurity, OSINT, and AI tools.',
  isPartOf: { '@type': 'WebSite', name: 'Duck Master', url: 'https://duck-master.replit.app/' },
};

export function AboutPage() {
  return (
    <PageLayout breadcrumbs={[{ label: 'About' }]}>
      <SeoHead
        title="About Duck Master — Cybersecurity & OSINT Tool Directory"
        description="Learn about Duck Master: a curated directory of 842 cybersecurity, OSINT, and AI tools across 25 specialist modules. Built for security researchers, investigators, and practitioners."
        canonical="/about"
        schema={schema}
      />

      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-800 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center mx-auto mb-5">
            <BookOpen className="w-7 h-7 text-indigo-300" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">About Duck Master</h1>
          <p className="text-lg text-white/70 leading-relaxed max-w-2xl mx-auto">
            A curated reference directory of 842 cybersecurity, OSINT, and AI tools — organised
            into 25 specialist modules for researchers, investigators, and security professionals.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        {/* Mission */}
        <section className="mb-14">
          <h2 className="text-2xl font-extrabold text-slate-800 mb-4">Our Mission</h2>
          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
            <p>
              Duck Master exists to make the security and OSINT tool landscape navigable. The internet
              contains thousands of tools for cybersecurity research, open-source intelligence, digital
              forensics, threat intelligence, and AI security — but they are scattered across GitHub
              repositories, blog posts, conference talks, and personal bookmarks.
            </p>
            <p>
              We have curated 842 of the most useful, actively maintained, and professionally relevant
              tools into 25 specialist modules. Every tool has been selected based on its utility,
              community adoption, documentation quality, and relevance to real-world investigation and
              security workflows.
            </p>
            <p>
              Duck Master is an educational reference platform. We do not own, operate, or endorse any
              of the tools listed — we simply curate, organise, and make them discoverable.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="mb-14">
          <h2 className="text-2xl font-extrabold text-slate-800 mb-6">What We Stand For</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { icon: <Search className="w-5 h-5 text-indigo-500" />, title: 'Discoverability', body: 'Finding the right tool for a specific task should take seconds, not hours. Our 25-module taxonomy and AI-powered search make that possible.' },
              { icon: <Shield className="w-5 h-5 text-indigo-500" />, title: 'Responsibility', body: 'Every tool in this directory can be used for legitimate research. We do not catalogue tools designed exclusively for illegal activity.' },
              { icon: <BookOpen className="w-5 h-5 text-indigo-500" />, title: 'Education', body: 'Understanding tools — not just knowing their names — makes better practitioners. Our guides provide the context to use tools effectively.' },
              { icon: <Users className="w-5 h-5 text-indigo-500" />, title: 'Community', body: 'Security knowledge flourishes when shared. Duck Master is built on the open-source community that creates and maintains the tools we reference.' },
            ].map(v => (
              <div key={v.title} className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">{v.icon}</div>
                  <h3 className="font-bold text-slate-800">{v.title}</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Modules overview */}
        <section className="mb-14">
          <h2 className="text-2xl font-extrabold text-slate-800 mb-4">The 25 Modules</h2>
          <p className="text-slate-600 mb-5 leading-relaxed">
            Our tool directory is organised into 25 specialist modules, ranging from OSINT fundamentals
            to advanced AI agent frameworks and blockchain intelligence. Each module contains 8–60+
            carefully selected tools with direct links to their official sources.
          </p>
          <Link
            href="/modules"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors"
          >
            Browse all 25 modules →
          </Link>
        </section>

        {/* Disclaimer */}
        <section className="p-5 rounded-2xl bg-amber-50 border border-amber-100">
          <h2 className="text-base font-bold text-amber-800 mb-2">Important Disclaimer</h2>
          <p className="text-sm text-amber-700 leading-relaxed">
            Duck Master is an independent educational reference directory. We do not own, operate,
            control, or endorse any tool listed in this directory. All tools link to their official
            external sources. Nothing on this site constitutes legal, security, or professional advice.
            Use all tools listed in accordance with applicable laws and the terms of service of each
            tool's provider. Always obtain proper authorisation before using security testing tools
            against any system.
          </p>
        </section>
      </div>
    </PageLayout>
  );
}
