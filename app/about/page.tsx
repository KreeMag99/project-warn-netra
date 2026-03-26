import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Project WARN',
  description: 'Learn about Project WARN, the Indian Layoff Early Warning System.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black p-6 sm:p-12 font-sans text-zinc-900 dark:text-zinc-100">
      <div className="max-w-3xl mx-auto space-y-12">
        <header className="space-y-4 pt-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-black dark:text-white">
            About Project WARN
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 font-medium">
            Shedding transparency on mass layoffs and retrenchment in the Indian workforce.
          </p>
        </header>

        <div className="space-y-12 bg-white dark:bg-zinc-900/60 p-8 md:p-12 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white pb-2 border-b border-zinc-100 dark:border-zinc-800">
              What is this?
            </h2>
            <div className="text-zinc-700 dark:text-zinc-300 space-y-4 leading-relaxed tracking-wide">
              <p>
                Project WARN (Worker Adjustment and Retraining Notification) is a public, searchable database of Indian layoff and retrenchment notices.
              </p>
              <p>
                Inspired by the United States&apos; WARN Act—which strictly mandates employers to provide advance notice of mass layoffs or plant closings—this independent initiative seeks to map these incidents across the Indian subcontinent in a single, accessible repository.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white pb-2 border-b border-zinc-100 dark:border-zinc-800">
              Why India Needs This
            </h2>
            <div className="text-zinc-700 dark:text-zinc-300 space-y-4 leading-relaxed tracking-wide">
              <p>
                Under the Indian Industrial Disputes Act of 1947, large industrial establishments are legally required to notify the government before executing mass retrenchments. However, there is a massive gap in how this information reaches the public.
              </p>
              <p>
                Presently, there exists no centralized, public-facing database for these disclosures. Workers, analysts, and policymakers are left to triangulate isolated media reports. Project WARN aims to bridge this data asymmetry and bring much-needed structured transparency to the labor market.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white pb-2 border-b border-zinc-100 dark:border-zinc-800">
              Data Sources
            </h2>
            <div className="text-zinc-700 dark:text-zinc-300 space-y-4 leading-relaxed tracking-wide">
              <p>
                Because no official real-time API or single registry exists, our data is manually coalesced and corroborated from high-trust public records, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-800 dark:text-zinc-200 ml-2 font-medium">
                <li>Leading financial journalism (e.g., ET Tech, Moneycontrol)</li>
                <li>Direct technology reporting (e.g., TechCrunch India, The Morning Context)</li>
                <li>Mandated statutory corporate filings and public PR statements</li>
                <li>Verified crowdsourced industry tracks</li>
              </ul>
            </div>
          </section>
          
        </div>
      </div>
    </main>
  );
}
