import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatDate } from '@/lib/format';
import StatusBadge from '@/components/status-badge';
import { SubscribeForm } from '@/components/subscribe-form';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const company = await prisma.company.findUnique({
    where: { slug: resolvedParams.slug }
  });
  
  if (!company) return { title: 'Company Not Found | Project WARN' };
  
  return {
    title: `${company.name} Layoffs 2026 | Project WARN India`,
    description: `Track all layoff notices from ${company.name}. ${company.sector ? company.sector + ' sector' : ''}. Total affected workers and upcoming notices.`,
    openGraph: {
      title: `${company.name} Layoffs and Retrenchment Notices`,
      description: `Latest layoff updates from ${company.name}${company.employeeCount ? ' - ' + company.employeeCount.toLocaleString('en-IN') + ' employees' : ''}`
    }
  };
}

export default async function CompanyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  const company = await prisma.company.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      notices: {
        orderBy: { date: 'desc' }
      }
    }
  });

  if (!company) {
    notFound();
  }

  const totalNotices = company.notices.length;
  // Reduce to calculate overall retrenchment volume associated with enterprise structure
  const totalAffected = company.notices.reduce((sum, notice) => sum + notice.affected, 0);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black p-4 sm:p-12 font-sans text-zinc-900 dark:text-zinc-100">
      <div className="max-w-4xl mx-auto space-y-12">
        <Link 
          href="/companies"
          className="inline-flex items-center text-sm font-semibold text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
        >
          <span className="mr-2 text-lg leading-none">←</span> Back to directory
        </Link>
        
        <header className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-8 border-b border-zinc-200 dark:border-zinc-800">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-black dark:text-white">
                {company.name}
              </h1>
              {company.fullName && company.fullName !== company.name && (
                <p className="text-xl font-medium text-zinc-500 dark:text-zinc-400">
                  {company.fullName}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {company.sector && (
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 shadow-sm border border-zinc-200/50 dark:border-zinc-700/50">
                    {company.sector}
                  </span>
                )}
                {(company.hqCity || company.hqState) && (
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 shadow-sm border border-zinc-200/50 dark:border-zinc-700/50">
                    📍 {company.hqCity}{company.hqCity && company.hqState ? ', ' : ''}{company.hqState}
                  </span>
                )}
                {company.employeeCount && company.employeeCount > 0 ? (
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 shadow-sm border border-zinc-200/50 dark:border-zinc-700/50">
                    👥 ≈ {company.employeeCount.toLocaleString('en-IN')} Staff
                  </span>
                ) : (
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 shadow-sm border border-zinc-200/50 dark:border-zinc-700/50">
                    👥 Actively monitoring
                  </span>
                )}
              </div>
              
              {company.description && (
                <p className="text-base text-zinc-600 dark:text-zinc-400 font-medium max-w-2xl leading-relaxed mt-4">
                  {company.description}
                </p>
              )}
            </div>
            
            {company.careersUrl && (
              <div className="flex-shrink-0 pt-2">
                <a 
                  href={company.careersUrl}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm inline-flex items-center"
                >
                  Careers Page ↗
                </a>
              </div>
            )}
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900/80 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col space-y-4 transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-xl">
              📄
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Total Notices Logged</h3>
              <p className="text-3xl sm:text-4xl font-bold text-black dark:text-white tracking-tight">
                {totalNotices}
              </p>
            </div>
          </div>
          
          <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900/80 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col space-y-4 transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-xl">
              👥
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Total Workers Affected</h3>
              <p className="text-3xl sm:text-4xl font-bold text-red-600 dark:text-red-400 tracking-tight">
                {totalAffected.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </section>

        <section className="p-6 sm:p-8 bg-zinc-900 border-zinc-800 dark:bg-zinc-900/40 rounded-3xl shadow-sm dark:border border-zinc-800/60 space-y-4">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-3">
              <span className="text-2xl drop-shadow-md">🔔</span> Get alerts for {company.name}
            </h2>
            <p className="text-zinc-400 font-medium text-sm mt-2 leading-relaxed max-w-2xl">
              Get email alerts when new layoff notices are published for this company.
            </p>
          </div>
          <div className="pt-2">
            <SubscribeForm alertType="company" alertValue={company.name} />
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-black dark:text-white flex items-center gap-3">
            <span className="text-zinc-400 text-3xl">🗓️</span> Incident Timeline
          </h2>
          
          {company.notices.length === 0 ? (
            <div className="p-8 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-zinc-800">
              <p className="text-zinc-500 dark:text-zinc-400 font-medium text-lg tracking-tight">No recorded layoffs or retrenchments found for this company.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {company.notices.map((notice) => {
                return (
                  <Link 
                    key={notice.id} 
                    href={`/notices/${notice.id}`}
                    className="group block p-6 bg-white dark:bg-zinc-900/80 rounded-3xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <p className="text-lg font-bold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{formatDate(notice.date)}</p>
                          <StatusBadge status={notice.status} />
                        </div>
                        <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                          {notice.affected.toLocaleString('en-IN')} workers impacted in {notice.location}
                        </p>
                        {notice.reason && (
                          <p className="text-sm text-zinc-500 line-clamp-1 italic">
                            &quot;{notice.reason}&quot;
                          </p>
                        )}
                      </div>
                      
                      <div className="flex-shrink-0 text-zinc-400 group-hover:text-black dark:group-hover:text-white font-bold transition-colors">
                        View Notice →
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
