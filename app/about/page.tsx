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
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-black dark:text-white drop-shadow-sm">
            About Project WARN
          </h1>
          <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
            A public, searchable database dedicated to tracking mass layoffs and retrenchment notices across the Indian workforce to bring structured transparency to the labor market.
          </p>
        </header>

        <div className="space-y-12 bg-white dark:bg-zinc-900/60 p-8 md:p-12 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800">
          
          {/* 2. Why This Exists */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white pb-2 border-b border-zinc-100 dark:border-zinc-800">
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
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white pb-2 border-b border-zinc-100 dark:border-zinc-800">
              Our Methodology
            </h2>
            <div className="text-zinc-700 dark:text-zinc-300 space-y-4 leading-relaxed tracking-wide">
              <p>
                We do not scrape unverified rumors or social media speculation. Our methodology is rooted strictly in corroborated events. When a structural layoff occurs, we document the specific entity involved, the geographic locations impacted, the volume of affected workers, and the stated business rationale behind the restructuring.
              </p>
              <p>
                By digitizing and centralizing this information, we provide an early-warning signal for job seekers, a dataset for economic analysts, and transparency for the affected communities.
              </p>
            </div>
          </section>

          {/* 4. Data Sources */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white pb-2 border-b border-zinc-100 dark:border-zinc-800">
              Data Sources
            </h2>
            <div className="text-zinc-700 dark:text-zinc-300 space-y-4 leading-relaxed tracking-wide">
              <p>
                Because no official real-time API or single registry exists, our data is manually coalesced and corroborated from high-trust public records, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-800 dark:text-zinc-200 ml-2 font-medium">
                <li>Leading financial journalism (e.g., The Economic Times, Moneycontrol, Business Standard)</li>
                <li>Direct technology reporting (e.g., TechCrunch, Inc42, Bloomberg)</li>
                <li>Mandated statutory corporate filings and public PR statements</li>
              </ul>
            </div>
          </section>

          {/* 5. Founder's Note */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white pb-2 border-b border-zinc-100 dark:border-zinc-800">
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
            <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white pb-2 border-b border-zinc-100 dark:border-zinc-800">
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
