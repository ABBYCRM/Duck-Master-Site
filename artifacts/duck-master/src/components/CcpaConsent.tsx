import { useState, useEffect } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'dm_consent_v1';

type ConsentState = 'accepted' | 'declined' | null;

export function CcpaConsent() {
  const [state, setState] = useState<ConsentState>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show if user hasn't already made a choice
    const stored = localStorage.getItem(STORAGE_KEY) as ConsentState | null;
    if (stored) {
      setState(stored);
      return;
    }
    // Small delay so it doesn't flash immediately on load
    const t = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(t);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setState('accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, 'declined');
    setState('declined');
    setVisible(false);
  };

  // Already consented → nothing to show
  if (state !== null) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-[150] p-3 sm:p-4"
          role="region"
          aria-label="Cookie and privacy consent"
        >
          <div
            className="max-w-4xl mx-auto rounded-2xl border border-slate-200 bg-white shadow-2xl p-4 sm:p-5"
            style={{ boxShadow: '0 -4px 32px rgba(0,0,0,0.08), 0 4px 32px rgba(0,0,0,0.12)' }}
          >
            <div className="flex items-start gap-3 sm:gap-4">
              {/* Icon */}
              <div className="shrink-0 w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mt-0.5">
                <ShieldCheck className="w-5 h-5 text-indigo-500" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 mb-1">
                  Your privacy matters to us
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  We use cookies and collect data (name, email, and usage) to personalise your
                  experience and improve the platform. We{' '}
                  <strong className="text-slate-700">never sell your personal information</strong>{' '}
                  to third parties.{' '}
                  <a href="#privacy" className="text-indigo-600 underline hover:text-indigo-800 transition-colors">
                    Privacy Policy
                  </a>
                  {' · '}
                  <a href="#terms" className="text-indigo-600 underline hover:text-indigo-800 transition-colors">
                    Terms of Service
                  </a>
                  {' · '}
                  <a href="#ccpa" className="text-indigo-600 underline hover:text-indigo-800 transition-colors">
                    Do Not Sell My Info (CCPA)
                  </a>
                </p>
              </div>

              {/* Actions */}
              <div className="shrink-0 flex items-center gap-2 ml-2">
                <button
                  onClick={decline}
                  className="hidden sm:flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  Decline
                </button>
                <button
                  onClick={accept}
                  className="flex items-center px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Accept
                </button>
                <button
                  onClick={decline}
                  className="sm:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CCPA detail strip */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-3 sm:gap-6 text-[10px] text-slate-400">
              <span>🇺🇸 CCPA — California Consumer Privacy Act</span>
              <span>🇪🇺 GDPR — General Data Protection Regulation</span>
              <span>Data stored in the United States</span>
              <span>Sessions expire after 7 days</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
