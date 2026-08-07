import { PageLayout } from '../components/PageLayout';
import { SeoHead } from '../components/SeoHead';

export function PrivacyPolicyPage() {
  return (
    <PageLayout breadcrumbs={[{ label: 'Privacy Policy' }]}>
      <SeoHead
        title="Privacy Policy — Duck Master"
        description="Duck Master privacy policy: how we collect, use, and protect your data. We do not sell personal information. GDPR and CCPA compliant."
        canonical="/privacy-policy"
        noIndex={false}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-400 mb-8">Last updated: 7 August 2026</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">1. Who We Are</h2>
            <p>Duck Master is an educational cybersecurity, OSINT, and AI tool directory ("the Service"). References to "we," "us," or "our" in this policy refer to Duck Master and its operators.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">2. Information We Collect</h2>
            <p><strong>Account information:</strong> When you create an account, we collect your name and email address provided through the authentication service (Google OAuth via Replit Auth).</p>
            <p><strong>Usage data:</strong> We collect information about how you use the Service, including tools you save to your workspace, search queries you enter, and pages you visit.</p>
            <p><strong>Technical data:</strong> We collect standard server logs including IP addresses, browser type, device information, and referring URLs. This data is used to operate and improve the Service.</p>
            <p><strong>Cookies:</strong> We use session cookies to maintain your authenticated session and preference cookies (such as your consent choice for this privacy policy). We do not use third-party advertising cookies.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide and operate the Service, including your personal workspace</li>
              <li>Enable AI-powered search features (search queries are sent to NVIDIA NIM for processing)</li>
              <li>Improve the directory and user experience</li>
              <li>Communicate important service updates</li>
              <li>Maintain security and prevent abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">4. We Do Not Sell Your Data</h2>
            <p><strong>We do not sell, rent, or trade your personal information to any third party for commercial purposes.</strong> This applies to all users, including California residents exercising their rights under the California Consumer Privacy Act (CCPA).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">5. Third-Party Services</h2>
            <p>The Service uses the following third-party services that may process your data:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Replit</strong> — hosting and authentication infrastructure</li>
              <li><strong>Google (via Replit Auth)</strong> — OAuth authentication</li>
              <li><strong>NVIDIA NIM</strong> — AI search processing (queries only, no personal data)</li>
              <li><strong>PostgreSQL</strong> — data storage for your workspace</li>
            </ul>
            <p>All tool links in the directory point to external third-party websites. We are not responsible for the privacy practices of those external sites.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">6. Data Retention</h2>
            <p>Account data is retained for the duration of your account. Authenticated sessions expire after 7 days. Server logs are retained for up to 90 days. You can request deletion of your account data by contacting us.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">7. Your Rights</h2>
            <p><strong>All users:</strong> You may request access to, correction of, or deletion of your personal data at any time.</p>
            <p><strong>GDPR (EU/EEA residents):</strong> You have the right to access, rectify, erase, restrict processing of, and port your personal data. You have the right to object to processing and to withdraw consent where processing is based on consent.</p>
            <p><strong>CCPA (California residents):</strong> You have the right to know what personal information we collect, the right to delete it, and the right to opt out of its sale (we do not sell it). You also have the right to non-discrimination for exercising your CCPA rights.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">8. Security</h2>
            <p>We implement appropriate technical and organisational measures to protect your personal data, including HTTPS encryption, secure session management, and access controls. No internet transmission is completely secure; we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">9. Children's Privacy</h2>
            <p>The Service is not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal data, please contact us for immediate deletion.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify registered users of material changes by email. Continued use of the Service after changes constitutes acceptance of the updated policy.</p>
          </section>

        </div>
      </div>
    </PageLayout>
  );
}
