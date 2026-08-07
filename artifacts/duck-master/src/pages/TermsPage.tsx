import { PageLayout } from '../components/PageLayout';
import { SeoHead } from '../components/SeoHead';

export function TermsPage() {
  return (
    <PageLayout breadcrumbs={[{ label: 'Terms of Service' }]}>
      <SeoHead
        title="Terms of Service — Duck Master"
        description="Duck Master terms of service: acceptable use, disclaimers, and your rights when using the cybersecurity and OSINT tool directory."
        canonical="/terms"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-slate-400 mb-8">Last updated: 7 August 2026</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using Duck Master ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">2. Description of Service</h2>
            <p>Duck Master is an educational reference directory of cybersecurity, OSINT, and AI tools. We provide curated links to publicly available external tools and educational guides about using those tools. We do not own, operate, or provide any of the listed tools directly.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">3. Acceptable Use</h2>
            <p>You agree to use the Service and any tools discovered through it only for lawful purposes. Specifically, you agree NOT to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use any listed tool against systems, networks, or individuals without explicit written authorisation</li>
              <li>Use information obtained through the Service to harass, stalk, or harm any person</li>
              <li>Attempt to gain unauthorised access to systems or data</li>
              <li>Violate any applicable local, national, or international law or regulation</li>
              <li>Use the Service to facilitate cybercrime, fraud, or illegal surveillance</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">4. Educational Purpose Disclaimer</h2>
            <p><strong>Important:</strong> Duck Master is an educational reference directory. All content is provided for informational and research purposes only.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Nothing on this site constitutes legal advice</li>
              <li>Nothing on this site constitutes cybersecurity consulting or professional security advice</li>
              <li>No attorney-client relationship is created by your use of this Service</li>
              <li>We make no representations about the suitability, legality, or safety of any listed tool for your specific use case</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">5. Third-Party Tools and Links</h2>
            <p>Duck Master links to hundreds of external tools and resources. We do not control, maintain, or take responsibility for any external website or tool. External links are provided for reference only. Use of any external tool is subject to that tool's own terms of service, which may differ significantly from ours. We are not responsible for any harm, data loss, or legal consequences arising from your use of listed tools.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">6. Intellectual Property</h2>
            <p>The Duck Master directory structure, guides, and original content are our intellectual property. Tool names, descriptions, and external resources are the property of their respective owners. You may reference and link to this directory, but you may not reproduce our original content without attribution.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">7. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Duck Master and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service or any tool referenced on the Service. Our total liability shall not exceed the amount paid by you for the Service in the 12 months preceding the claim.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">8. Termination</h2>
            <p>We reserve the right to suspend or terminate your account for violation of these Terms, illegal activity, or any reason at our discretion. You may terminate your account at any time by contacting us.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">9. Governing Law</h2>
            <p>These Terms are governed by applicable law. Any dispute arising from use of the Service shall be resolved through binding arbitration or in courts of competent jurisdiction.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">10. Changes to Terms</h2>
            <p>We may update these Terms at any time. Continued use of the Service after changes are posted constitutes acceptance of the updated Terms. We will notify registered users of material changes.</p>
          </section>

        </div>
      </div>
    </PageLayout>
  );
}
