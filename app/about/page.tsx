import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About | Project WARN',
  description: 'Learn about Project WARN, the Indian Layoff Early Warning System.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black p-6 sm:p-12 font-sans text-zinc-900 dark:text-zinc-100">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* 1. Hero / Introduction */}
        <header className="space-y-4 pt-8">
          <h1 className="font-serif text-5xl md:text-6xl font-black tracking-tight text-black dark:text-white drop-shadow-sm">
            About Project WARN
          </h1>
          <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
            A public, searchable database dedicated to tracking mass layoffs and retrenchment notices across the Indian workforce to bring structured transparency to the labor market.
          </p>
        </header>

        <div className="space-y-12 bg-white dark:bg-zinc-900/60 p-8 md:p-12 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800">
          
          {/* 2. Why This Exists */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-black dark:text-white pb-2 border-b border-zinc-100 dark:border-zinc-800">
              Why This Exists
            </h2>
            <div className="text-zinc-700 dark:text-zinc-300 space-y-4 leading-relaxed tracking-wide">
              <p>
                Inspired by the United States&apos; WARN Act—which strictly mandates employers to provide advance notice of mass layoffs or plant closings—this independent initiative seeks to map these incidents across the Indian subcontinent in a single, accessible repository.
              </p>
              <p>
                Under the Indian Industrial Disputes Act of 1947, large industrial establishments are legally required to notify the government before executing mass retrenchments. However, there is a massive gap in how this information reaches the public. Presently, there exists no centralized, public-facing database for these disclosures. Workers, analysts, and policymakers are left to triangulate isolated media reports. 
              </p>
            </div>
          </section>

          {/* 3. Our Methodology */}
          <section id="methodology" className="space-y-6 scroll-mt-24">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-black dark:text-white pb-2 border-b border-zinc-100 dark:border-zinc-800">
              Our Methodology
            </h2>
            <div className="text-zinc-700 dark:text-zinc-300 space-y-5 leading-relaxed tracking-wide">
              <p>
                Our database is manually curated and updated daily to maintain accuracy and integrity. Since there is no official real-time government registry or public API, we gather data from high-trust sources, including leading financial journalism (such as <em>The Economic Times</em>, <em>Moneycontrol</em>, and <em>Business Standard</em>), statutory corporate filings, and anonymous, verified whistleblower submissions.
              </p>
              <p>
                Every layoff notice undergoes a rigorous manual verification process before publication. We require at least one credible public news report or direct internal documentation (such as severance notices or internal communications) to corroborate the event. When numbers are unconfirmed or vary across reporting sources, we adopt conservative estimates to ensure the database remains reliable and free of speculation.
              </p>
              <p>
                To provide transparency and clarity, we classify every notice in our system under one of three verification tiers:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 pb-2">
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 mb-2">Confirmed</span>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">Verified through official company press releases, corporate statements, or statutory regulatory filings.</p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 mb-2">Reported</span>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">Corroborated by multiple credible, mainstream business and technology publications.</p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 mb-2">Estimate</span>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">Approximated figures based on initial reports, industry analyses, or ranges when exact counts are undisclosed.</p>
                </div>
              </div>

              <p>
                Under the Indian Industrial Disputes Act of 1947, industrial establishments with 100 or more workers must seek government approval before proceeding with retrenchment. However, there is no legal requirement to make these filings accessible to the public, nor is there a direct public disclosure mandate similar to the U.S. WARN Act.
              </p>
              <p>
                By digitizing and centralizing this information, Project WARN acts as an early-warning registry, helping job seekers prepare, allowing analysts to monitor labor trends, and providing transparency to local communities.
              </p>
            </div>
          </section>

          {/* 5. Founder's Note */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-black dark:text-white pb-2 border-b border-zinc-100 dark:border-zinc-800">
              Founder&apos;s Note
            </h2>
            <div className="text-zinc-700 dark:text-zinc-300 space-y-4 leading-relaxed tracking-wide">
              <p className="italic border-l-4 border-zinc-300 dark:border-zinc-700 pl-4 py-1">
                &quot;I built Project WARN because watching thousands of talented Indian professionals get blindsided by overnight corporate restructuring felt fundamentally broken. A healthy ecosystem demands transparency. This tool exists to give power and preparation time back to the people who actually build the economy.&quot;
              </p>
            </div>
          </section>

          {/* 6. Contact */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-black dark:text-white pb-2 border-b border-zinc-100 dark:border-zinc-800">
              Contact
            </h2>
            <div className="text-zinc-700 dark:text-zinc-300 space-y-4 leading-relaxed tracking-wide flex flex-col">
              <p>
                If you have questions, press inquiries, or corrections to any data mapped in our database, please reach out directly:
              </p>
              <div>
                <a href="mailto:hello@projectwarn.org" className="inline-flex font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                  hello@projectwarn.org →
                </a>
              </div>
            </div>
          </section>

          {/* 7. Legal */}
          <section className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <div className="text-zinc-500 dark:text-zinc-500 text-sm space-y-3 leading-relaxed">
              <p>
                <strong>Disclaimer:</strong> Project WARN is an independent research project and is not affiliated with the Government of India or any regulatory body. Data is provided for informational purposes only.
              </p>
              <p>
                <Link href="/privacy" className="underline underline-offset-4 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors">
                  Privacy Policy
                </Link>
                {' • '}
                <Link href="/terms" className="underline underline-offset-4 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors">
                  Terms of Service
                </Link>
              </p>
            </div>
          </section>
          
        </div>
      </div>
    </main>
  );
}
