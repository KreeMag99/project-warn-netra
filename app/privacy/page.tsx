import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Project WARN',
  description: 'How we collect, use, and protect your data on Project WARN.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black p-6 sm:p-12 font-sans text-zinc-900 dark:text-zinc-100">
      <div className="max-w-3xl mx-auto space-y-12">
        <header className="space-y-4 pt-8">
          <Link 
            href="/"
            className="inline-flex items-center text-sm font-semibold text-zinc-500 hover:text-black dark:hover:text-white transition-colors mb-4"
          >
            <span className="mr-2 text-lg leading-none">←</span> Back to Home
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl font-black tracking-tight text-black dark:text-white drop-shadow-sm">
            Privacy Policy
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
            Effective Date: May 10, 2026
          </p>
        </header>

        <div className="space-y-10 bg-white dark:bg-zinc-900/60 p-8 md:p-12 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800">
          
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-black dark:text-white">
              1. Introduction
            </h2>
            <div className="text-zinc-700 dark:text-zinc-300 space-y-4 leading-relaxed">
              <p>
                Welcome to Project WARN. We respect your privacy and are committed to protecting it. This Privacy Policy explains exactly what data we collect, why we collect it, and how we safeguard it when you use our website.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-black dark:text-white">
              2. Information We Collect
            </h2>
            <div className="text-zinc-700 dark:text-zinc-300 space-y-4 leading-relaxed">
              <p>
                We believe in collecting the absolute minimum amount of data necessary to provide our service.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Email Addresses:</strong> The only personal information we collect is your email address, and only if you explicitly choose to subscribe to our layoff alerts or weekly digests.</li>
                <li><strong>Analytics:</strong> We may collect basic, anonymous analytics (such as page views) to understand how the platform is used, but this is never tied to personally identifiable information.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-black dark:text-white">
              3. How We Use Your Information
            </h2>
            <div className="text-zinc-700 dark:text-zinc-300 space-y-4 leading-relaxed">
              <p>
                Your email address is used strictly for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Sending you automated alerts when a new layoff notice is published that matches your specific subscription preferences.</li>
                <li>Sending the weekly digest of notices, if opted in.</li>
                <li>Providing the necessary authentication links to verify or cancel your subscription.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-black dark:text-white">
              4. How We Protect Your Data
            </h2>
            <div className="text-zinc-700 dark:text-zinc-300 space-y-4 leading-relaxed">
              <p>
                We implement robust security measures to ensure your email address remains safe. Our database is protected by modern encryption standards, and we do not expose subscriber lists publicly or internally beyond what is required to dispatch the emails via our secure email provider.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-black dark:text-white">
              5. Sharing of Information
            </h2>
            <div className="text-zinc-700 dark:text-zinc-300 space-y-4 leading-relaxed">
              <p className="font-semibold text-black dark:text-white">
                We do not sell, rent, or trade your email address to any third parties. Ever.
              </p>
              <p>
                Your email is only shared securely with our transactional email infrastructure provider (Resend) solely for the technical purpose of delivering the alerts you requested.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-black dark:text-white">
              6. Your Rights
            </h2>
            <div className="text-zinc-700 dark:text-zinc-300 space-y-4 leading-relaxed">
              <p>
                You have complete control over your data:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Unsubscribe Anytime:</strong> Every single email we send includes a one-click unsubscribe link at the bottom.</li>
                <li><strong>Data Deletion:</strong> Clicking unsubscribe immediately and permanently removes your email and preferences from our active alert database.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-black dark:text-white">
              7. Changes to This Policy
            </h2>
            <div className="text-zinc-700 dark:text-zinc-300 space-y-4 leading-relaxed">
              <p>
                We may update this Privacy Policy from time to time to reflect structural or legal changes. Any updates will be posted on this page with an updated &quot;Effective Date&quot;.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-black dark:text-white">
              8. Contact Us
            </h2>
            <div className="text-zinc-700 dark:text-zinc-300 space-y-4 leading-relaxed">
              <p>
                If you have any questions or concerns about this Privacy Policy or how your data is handled, please reach out directly:
              </p>
              <a href="mailto:hello@projectwarn.org" className="inline-block font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                hello@projectwarn.org →
              </a>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
