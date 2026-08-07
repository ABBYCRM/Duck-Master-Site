import { PageLayout } from '../components/PageLayout';
import { SeoHead } from '../components/SeoHead';
import { Mail, MessageSquare, BookOpen } from 'lucide-react';

const schema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Duck Master',
  url: 'https://duck-master.replit.app/contact',
  description: 'Get in touch with the Duck Master team for tool suggestions, corrections, or feedback.',
};

export function ContactPage() {
  return (
    <PageLayout breadcrumbs={[{ label: 'Contact' }]}>
      <SeoHead
        title="Contact Duck Master — Tool Suggestions & Feedback"
        description="Contact the Duck Master team to suggest a tool for our directory, report an incorrect link, or share feedback about the cybersecurity and OSINT tool collection."
        canonical="/contact"
        schema={schema}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-7 h-7 text-indigo-500" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Contact Us</h1>
          <p className="text-slate-500 leading-relaxed max-w-xl mx-auto">
            We welcome suggestions for new tools, reports of incorrect or broken links, and any
            feedback that helps improve the directory for the security community.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-12">
          {[
            {
              icon: <BookOpen className="w-5 h-5 text-indigo-500" />,
              title: 'Suggest a Tool',
              body: 'Know a cybersecurity, OSINT, or AI tool that should be in our directory? We review all suggestions against our curation criteria.',
            },
            {
              icon: <MessageSquare className="w-5 h-5 text-emerald-500" />,
              title: 'Report an Issue',
              body: 'Found a broken link, incorrect categorisation, or outdated tool? Let us know so we can keep the directory accurate and up to date.',
            },
          ].map(c => (
            <div key={c.title} className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">{c.icon}</div>
                <h2 className="font-bold text-slate-800">{c.title}</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>

        {/* Contact note */}
        <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100 text-center">
          <p className="text-slate-700 leading-relaxed mb-2">
            <strong>Duck Master is currently in active development.</strong> A dedicated contact form
            and community feedback system are coming soon.
          </p>
          <p className="text-sm text-slate-500">
            In the meantime, you can reach the Duck Master team through the platform where this
            directory is hosted. Sign in to your account to access user feedback features.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 rounded-xl bg-amber-50 border border-amber-100">
          <p className="text-xs text-amber-700 leading-relaxed">
            <strong>Note:</strong> Duck Master is an educational reference directory. We do not
            provide legal advice, security consulting services, or professional investigation
            services. For professional enquiries, please engage a qualified practitioner directly.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
