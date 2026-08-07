import { Link } from 'wouter';
import { BookOpen, ExternalLink, Menu, X, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/modules', label: 'All Modules' },
  { href: '/guide/what-is-osint', label: 'Guides' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
];

const FOOTER_COLUMNS = [
  {
    heading: 'Directory',
    links: [
      { href: '/', label: 'Home' },
      { href: '/modules', label: 'All 25 Modules' },
      { href: '/how-it-works', label: 'How It Works' },
      { href: '/faq', label: 'FAQ' },
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    heading: 'Featured Modules',
    links: [
      { href: '/module/05-osint-master-collections', label: 'OSINT Frameworks' },
      { href: '/module/08-domain-dns-ip-internet-asset', label: 'Domain & DNS Intel' },
      { href: '/module/09-threat-intelligence-malware-phishing', label: 'Threat Intelligence' },
      { href: '/module/10-geoint-maps-satellite-flight-vessel', label: 'GEOINT & Maps' },
      { href: '/module/17-ai-chat-search-model-platforms', label: 'AI Platforms' },
      { href: '/module/20-ai-agent-frameworks-automation', label: 'AI Agents' },
    ],
  },
  {
    heading: 'Guides',
    links: [
      { href: '/guide/what-is-osint', label: 'What is OSINT?' },
      { href: '/guide/google-dorking-guide', label: 'Google Dorking' },
      { href: '/guide/threat-intelligence-guide', label: 'Threat Intelligence' },
      { href: '/guide/digital-forensics-tools', label: 'Digital Forensics' },
      { href: '/guide/ai-osint-tools', label: 'AI for OSINT' },
      { href: '/guide/blockchain-intelligence-guide', label: 'Blockchain Intel' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { href: '/privacy-policy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
      { href: '/site-map', label: 'Sitemap' },
    ],
  },
];

export function PageLayout({ children, breadcrumbs }: PageLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Nav */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 text-slate-900 hover:text-indigo-600 transition-colors">
              <BookOpen className="w-5 h-5 text-indigo-500 shrink-0" />
              <span className="font-extrabold text-sm tracking-tight">Duck Master</span>
              <span className="hidden sm:inline text-xs text-slate-400 font-normal">· 842 tools</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Browse Directory
                <ExternalLink className="w-3 h-3" />
              </Link>
              <button
                onClick={() => setMobileOpen(v => !v)}
                className="md:hidden p-2 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile nav */}
          {mobileOpen && (
            <div className="md:hidden py-3 border-t border-slate-100">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-2 py-2.5 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  {link.label}
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              ))}
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 mt-2 px-2 py-2.5 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                Browse Directory →
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <ol className="flex items-center gap-1 text-xs text-slate-500 flex-wrap">
              <li>
                <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
              </li>
              {breadcrumbs.map((crumb, i) => (
                <li key={i} className="flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-slate-300" aria-hidden />
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-indigo-600 transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-slate-700 font-medium" aria-current="page">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </nav>
      )}

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {FOOTER_COLUMNS.map(col => (
              <div key={col.heading}>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">{col.heading}</h3>
                <ul className="space-y-2">
                  {col.links.map(link => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="text-sm font-bold text-slate-300">Duck Master</span>
            </div>
            <div className="text-xs text-slate-500 max-w-xl leading-relaxed">
              <strong className="text-slate-400">Educational reference only.</strong> Duck Master is an independent tool directory. We do not own, operate, or endorse any listed tool. Content is for research and educational purposes. Nothing on this site constitutes legal, security, or professional advice.
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-4">© {new Date().getFullYear()} Duck Master. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
