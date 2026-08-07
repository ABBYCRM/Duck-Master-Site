import { useEffect } from 'react';
import { X, Bookmark, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Google "G" SVG logo (official colours)
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

type LoginReason = 'save' | 'ai-search' | 'history' | 'generic';

const REASONS: Record<LoginReason, { title: string; body: string; icon: React.ReactNode }> = {
  save: {
    title: 'Save this tool',
    body: 'Create a free account to bookmark tools and build your personal toolkit.',
    icon: <Bookmark className="w-5 h-5 text-indigo-500" />,
  },
  'ai-search': {
    title: 'Unlock AI-powered search',
    body: 'Sign in to search 842 tools using natural language — powered by NVIDIA AI.',
    icon: <Sparkles className="w-5 h-5 text-indigo-500" />,
  },
  history: {
    title: 'View your search history',
    body: "Sign in to keep track of everything you've searched for.",
    icon: <Clock className="w-5 h-5 text-indigo-500" />,
  },
  generic: {
    title: 'Join Duck Master',
    body: 'Save tools, get AI-powered search results, and track your research — all in one place.',
    icon: <ShieldCheck className="w-5 h-5 text-indigo-500" />,
  },
};

interface LoginModalProps {
  open: boolean;
  reason: LoginReason;
  onClose: () => void;
  onLogin: () => void;
}

export function LoginModal({ open, reason, onClose, onLogin }: LoginModalProps) {
  const { title, body, icon } = REASONS[reason];

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Lock scroll while open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-md"
            onClick={onClose}
            aria-hidden
          />

          {/* Modal card */}
          <motion.div
            key="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-modal-title"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
            className="fixed z-[201] inset-0 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Header strip */}
              <div className="relative bg-gradient-to-br from-indigo-600 to-violet-700 px-7 pt-8 pb-10">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Icon badge */}
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-5 shadow-lg">
                  {icon}
                </div>

                <h2
                  id="login-modal-title"
                  className="text-xl font-extrabold text-white leading-tight mb-2"
                >
                  {title}
                </h2>
                <p className="text-white/75 text-sm leading-relaxed">{body}</p>

                {/* Wave divider */}
                <div className="absolute -bottom-px left-0 right-0 overflow-hidden leading-none">
                  <svg viewBox="0 0 400 18" preserveAspectRatio="none" className="w-full h-5" aria-hidden>
                    <path d="M0,18 C100,0 300,0 400,18 L400,18 L0,18 Z" fill="white" />
                  </svg>
                </div>
              </div>

              {/* Body */}
              <div className="px-7 pt-7 pb-6">
                {/* What you get */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { icon: <Bookmark className="w-4 h-4" />, label: 'Save tools' },
                    { icon: <Sparkles className="w-4 h-4" />, label: 'AI search' },
                    { icon: <Clock className="w-4 h-4" />, label: 'History' },
                  ].map(f => (
                    <div key={f.label} className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-indigo-500">{f.icon}</span>
                      <span className="text-[10px] font-semibold text-slate-600 text-center leading-tight">{f.label}</span>
                    </div>
                  ))}
                </div>

                {/* Google sign-in button */}
                <button
                  onClick={onLogin}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 shadow-sm transition-all font-semibold text-sm text-slate-700 mb-3"
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)' }}
                >
                  <GoogleIcon />
                  Continue with Google
                </button>

                <button
                  onClick={onLogin}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors mb-5"
                >
                  Sign in another way
                </button>

                {/* CCPA / legal notice */}
                <p className="text-[10px] text-slate-400 leading-relaxed text-center">
                  By continuing, you agree to our{' '}
                  <a href="#terms" className="underline hover:text-slate-600 transition-colors">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#privacy" className="underline hover:text-slate-600 transition-colors">Privacy Policy</a>.
                  {' '}We do not sell your personal information.{' '}
                  <a href="#ccpa" className="underline hover:text-slate-600 transition-colors">
                    California residents: exercise your CCPA rights →
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export type { LoginReason };
