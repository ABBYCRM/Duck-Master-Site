import { Link, useLocation } from 'wouter';
import { ExternalLink, Menu, X, ChevronRight, ChevronDown, ArrowUp } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

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
      { href: '/module/osint-master-collections', label: 'OSINT Frameworks' },
      { href: '/module/domain-dns-ip-internet-asset', label: 'Domain & DNS Intel' },
      { href: '/module/threat-intelligence-malware-phishing', label: 'Threat Intelligence' },
      { href: '/module/geoint-maps-satellite-flight-vessel', label: 'GEOINT & Maps' },
      { href: '/module/ai-chat-search-model-platforms', label: 'AI Platforms' },
      { href: '/module/ai-agent-frameworks-automation', label: 'AI Agents' },
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

/** Pattern 025 — Accordion section for mobile footer */
function FooterAccordion({ col }: { col: typeof FOOTER_COLUMNS[number] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-800">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between py-3 text-left"
        aria-expanded={open}
      >
        <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">{col.heading}</span>
        <ChevronDown
          className="w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      {/* Pattern 056 — grid-template-rows height animation */}
      <div className="accordion-body" data-open={open ? 'true' : 'false'}>
        <div className="accordion-inner pb-3">
          <ul className="space-y-2 pt-1">
            {col.links.map(link => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors block py-0.5">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function PageLayout({ children, breadcrumbs }: PageLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [backVisible, setBackVisible] = useState(false);
  const [location] = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);

  // Pattern 107 — show back-to-top after scrolling 300px
  useEffect(() => {
    const onScroll = () => setBackVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location]);

  return (
    <div className="min-h-dvh bg-slate-50 flex flex-col font-sans text-slate-800">

      {/* Pattern 107 — floating back-to-top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="back-to-top"
        data-visible={backVisible ? 'true' : 'false'}
        aria-label="Back to top"
      >
        <ArrowUp className="w-4 h-4" />
      </button>

      {/* ── Top Nav — Pattern 100 page-header ───────────────────── */}
      <header className="page-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
              <img src="/gdy-logo.png" alt="GDY — Go Duck Yourself" className="h-8 w-auto object-contain shrink-0" />
              <span className="hidden sm:inline text-xs text-slate-400 font-normal">· 842 tools</span>
            </Link>

            {/* Desktop nav — Pattern 077 animated underline */}
            <nav className="hidden md:flex items-center gap-0.5">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="nav-link px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Browse Directory
                <ExternalLink className="w-3 h-3" />
              </Link>
              {/* Mobile browse link — visible below sm */}
              <Link
                href="/"
                className="sm:hidden px-2.5 py-1.5 rounded-lg text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
              >
                Directory
              </Link>
              <button
                onClick={() => setMobileOpen(v => !v)}
                className="md:hidden p-2 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile nav — Pattern 056 smooth grid-template-rows expand */}
          <div className="mobile-nav-outer md:hidden" data-open={mobileOpen ? 'true' : 'false'}>
            <div className="mobile-nav-inner">
              <div className="py-2 border-t border-slate-100">
                {NAV_LINKS.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-2 py-3 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    {link.label}
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumbs — Pattern 100 page-breadcrumb */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="page-breadcrumb">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            {/* Pattern 038 — single line with truncation on mobile */}
            <ol className="flex items-center gap-1 min-w-0 overflow-hidden">
              <li className="shrink-0">
                <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
              </li>
              {breadcrumbs.map((crumb, i) => (
                <li key={i} className={`flex items-center gap-1 ${i === breadcrumbs.length - 1 ? 'min-w-0' : 'shrink-0'}`}>
                  <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" aria-hidden />
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-indigo-600 transition-colors shrink-0">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-slate-700 font-medium truncate" aria-current="page">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </nav>
      )}

      {/* Page content */}
      <main ref={mainRef} className="flex-1">{children}</main>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-400 mt-12 sm:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 footer-safe">

          {/* Desktop grid — hidden on mobile */}
          <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {FOOTER_COLUMNS.map(col => (
              <div key={col.heading}>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">{col.heading}</h3>
                <ul className="space-y-2">
                  {col.links.map(link => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Mobile accordions — Pattern 025 */}
          <div className="sm:hidden mb-4">
            {FOOTER_COLUMNS.map(col => (
              <FooterAccordion key={col.heading} col={col} />
            ))}
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/gdy-logo.png" alt="GDY" className="h-7 w-auto object-contain brightness-90" />
            </div>
            <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
              <strong className="text-slate-400">Educational reference only.</strong>{' '}
              GDY is an independent tool directory. We do not own, operate, or endorse any listed tool. Content is for research and educational purposes.
            </p>
          </div>
          <p className="text-xs text-slate-600 mt-4 pb-2">© {new Date().getFullYear()} GDY — Go Duck Yourself. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
