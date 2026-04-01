import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getNoticeById } from '@/lib/notices';
import { formatDate, daysUntil } from '@/lib/format';
import StatusBadge from '@/components/status-badge';
import { SubscribeForm } from '@/components/subscribe-form';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  
  if (isNaN(id)) return { title: 'Notice Not Found' };
  
  const notice = await getNoticeById(id);
  
  if (!notice) return { title: 'Notice Not Found' };
  
  return {
    title: `${notice.company} Layoff Notice | Project WARN`,
    description: `Details regarding ${notice.company} affecting ${notice.affected.toLocaleString('en-IN')} workers in ${notice.location}.`,
  };
}

export default async function NoticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  if (isNaN(id)) {
    notFound();
  }

  const notice = await getNoticeById(id);

  if (!notice) {
    notFound();
  }

  const isUpcoming = notice.status.toLowerCase() === 'upcoming';
  const remainingDays = daysUntil(notice.date);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black p-4 sm:p-12 font-sans text-zinc-900 dark:text-zinc-100">
      <div className="max-w-4xl mx-auto space-y-12">
        <Link 
          href="/notices"
          className="inline-flex items-center text-sm font-semibold text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
        >
          <span className="mr-2 text-lg leading-none">←</span> Back to all notices
        </Link>
        
        <header className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-black dark:text-white">
                {notice.company}
              </h1>
              {notice.sector && (
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  {notice.sector}
                </span>
              )}
            </div>
            <div className="flex-shrink-0 pt-2">
              <StatusBadge status={notice.status} />
            </div>
          </div>
        </header>

        {notice.reason && (
          <section className="p-6 sm:p-8 bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl shadow-sm border border-blue-100 dark:border-blue-900/40">
            <h3 className="text-xs font-bold text-blue-800 dark:text-blue-400 uppercase tracking-widest mb-3">Reason for Action</h3>
            <p className="text-lg md:text-xl font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">
              &quot;{notice.reason}&quot;
            </p>
          </section>
        )}

        {isUpcoming && remainingDays > 0 && (
          <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm gap-4">
            <div className="flex items-center gap-4">
              <span className="text-3xl drop-shadow-sm">⏳</span>
              <div>
                <p className="font-bold text-amber-900 dark:text-amber-400 text-lg">
                  Takes Effect in {remainingDays} Days
                </p>
                <p className="text-sm font-medium text-amber-700 dark:text-amber-500/80">
                  Workers have until {formatDate(notice.date)} before the layoff is effective.
                </p>
              </div>
            </div>
          </div>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900/80 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col space-y-4 transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xl">
              📅
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Effective Date</h3>
              <p className="text-2xl sm:text-3xl font-bold text-black dark:text-white tracking-tight">
                {formatDate(notice.date)}
              </p>
            </div>
          </div>
          
          <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900/80 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col space-y-4 transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-xl">
              👥
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Workers Affected</h3>
              <p className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400 tracking-tight">
                {notice.affected.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
          
          <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900/80 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col space-y-4 transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-xl">
              📍
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Location</h3>
              <p className="text-2xl sm:text-3xl font-bold text-black dark:text-white tracking-tight break-words">
                {notice.location}
              </p>
            </div>
          </div>
        </section>

        <section className="p-6 sm:p-8 bg-white dark:bg-zinc-900/80 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 space-y-6">
          <h2 className="text-2xl font-bold text-black dark:text-white flex items-center gap-3">
            <span className="text-zinc-400 text-3xl">📄</span> Additional Details
          </h2>
          <div className="space-y-3 p-6 bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/80">
            <p className="text-zinc-500 font-semibold text-xs uppercase tracking-widest">Source Reference</p>
            <a 
              href={notice.source} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold underline underline-offset-4 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              View Source Article →
            </a>
          </div>
        </section>

        <section className="p-6 sm:p-8 bg-zinc-900 border-zinc-800 dark:bg-zinc-900/40 rounded-3xl shadow-sm dark:border border-zinc-800/60 space-y-4">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-3">
              <span className="text-2xl drop-shadow-md">🔔</span> Get alerts for this company
            </h2>
            <p className="text-zinc-400 font-medium text-sm mt-2 leading-relaxed max-w-2xl">
              Get an instant email alert if {notice.company} formally announces any further large-scale layoffs or retrenchments across the database.
            </p>
          </div>
          <div className="pt-2">
            <SubscribeForm alertType="company" alertValue={notice.company} />
          </div>
        </section>
      </div>
    </main>
  );
}
