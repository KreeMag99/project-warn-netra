import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const metadata = {
  title: 'Companies Directory | Project WARN',
  description: 'Browse the directory of companies with verified layoff and retrenchment restructuring notices across India.',
};

export default async function CompaniesPage() {
  const companies = await prisma.company.findMany({
    include: {
      _count: {
        select: { notices: true }
      }
    },
    orderBy: {
      name: 'asc'
    }
  });

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black p-4 sm:p-12 font-sans text-zinc-900 dark:text-zinc-100">
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-black dark:text-white">
            Companies
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 font-medium max-w-2xl leading-relaxed">
            A comprehensive directory of enterprises actively tracked within our registry, including full layoff historical logs, structural metadata, and automated email alerts.
          </p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {companies.map((company) => (
            <Link 
              key={company.slug} 
              href={`/companies/${company.slug}`}
              className="group flex flex-col p-6 rounded-3xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full"
            >
              <div className="flex-1 space-y-4">
                <div className="space-y-1.5">
                  <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {company.name}
                  </h2>
                  {company.sector && (
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> {company.sector}
                    </p>
                  )}
                </div>

                <div className="space-y-2.5 pt-2">
                  {(company.hqCity || company.hqState) && (
                    <div className="flex items-center text-sm font-medium text-zinc-600 dark:text-zinc-400 gap-2">
                      <span className="text-base grayscale opacity-60 group-hover:opacity-100 transition-opacity">📍</span>
                      {company.hqCity}{company.hqCity && company.hqState ? ', ' : ''}{company.hqState}
                    </div>
                  )}
                  {company.employeeCount !== null && (
                    <div className="flex items-center text-sm font-medium text-zinc-600 dark:text-zinc-400 gap-2">
                      <span className="text-base grayscale opacity-60 group-hover:opacity-100 transition-opacity">👥</span>
                      {company.employeeCount.toLocaleString('en-IN')} Employees
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${company._count.notices > 0 ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}></span>
                  <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                    {company._count.notices} {company._count.notices === 1 ? 'Notice' : 'Notices'}
                  </span>
                </div>
                <span className="text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors transform group-hover:translate-x-1 duration-300 font-bold">
                  →
                </span>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  )
}
