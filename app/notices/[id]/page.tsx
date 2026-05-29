import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getNoticeById } from '@/lib/notices';
import { formatDate, daysUntil, slugify } from '@/lib/format';
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

  const computedStatus = notice.computedStatus;
  const isUpcoming = computedStatus === 'upcoming' || computedStatus === 'in_progress';
  const remainingDays = daysUntil(notice.date);

  const shareUrl = encodeURIComponent(`https://projectwarn.org/notices/${notice.id}`);
  const shareText = encodeURIComponent(`${notice.company} Layoff Notice: ${notice.affected} workers affected.`);

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
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-8 border-b border-zinc-200 dark:border-zinc-800">
            <div className="space-y-5">
              <div>
                {notice.sector && (
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 shadow-sm border border-zinc-200/50 dark:border-zinc-700/50 mb-2">
                    {notice.sector}
                  </span>
                )}
              </div>
              <Link 
                href={`/companies/${notice.companySlug || slugify(notice.company)}`} 
                className="inline-block hover:opacity-80 transition-opacity"
              >
                <h1 className="text-5xl md:text-7xl font-black tracking-tight text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors drop-shadow-sm">
                  {notice.company}
                </h1>
              </Link>
            </div>
            <div className="flex-shrink-0 pt-2 sm:pt-4">
              <StatusBadge status={computedStatus} />
            </div>
          </div>
        </header>

        {notice.reason && (
          <section className="pt-2">
            <p className="text-xl md:text-2xl font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed">
              <span className="font-bold text-zinc-900 dark:text-white mr-2">Reason:</span>
              {notice.reason}
            </p>
          </section>
        )}

        {isUpcoming && remainingDays > 0 && (
          <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm gap-4 mt-6">
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

        <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800"></div>

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

        <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800"></div>

        <section className="flex flex-col sm:flex-row gap-6">
          {/* Share Section */}
          <div className="flex-1 p-6 sm:p-8 bg-white dark:bg-zinc-900/80 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 space-y-6">
            <h2 className="text-2xl font-bold text-black dark:text-white flex items-center gap-3">
              <span className="text-zinc-400 text-3xl">🔗</span> Share Notice
            </h2>
            <div className="flex flex-wrap gap-3">
              <a 
                href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1DA851] text-white font-bold transition-colors shadow-sm text-sm"
              >
                WhatsApp
              </a>
              <a 
                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white font-bold transition-colors shadow-sm text-sm"
              >
                X (Twitter)
              </a>
              <a 
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#084e96] text-white font-bold transition-colors shadow-sm text-sm"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Source Section */}
          <div className="flex-1 p-6 sm:p-8 bg-white dark:bg-zinc-900/80 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 space-y-6">
            <h2 className="text-2xl font-bold text-black dark:text-white flex items-center gap-3">
              <span className="text-zinc-400 text-3xl">📄</span> Official Source
            </h2>
            <div className="pt-2">
              <a 
                href={notice.source} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-lg hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                View Source Article →
              </a>
            </div>
          </div>
        </section>

        <section className="p-6 sm:p-8 bg-zinc-900 border-zinc-800 dark:bg-zinc-900/40 rounded-3xl shadow-sm dark:border border-zinc-800/60 space-y-4">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-3">
              <span className="text-2xl drop-shadow-md">🔔</span> Get alerts for this company
            </h2>
            <p className="text-zinc-400 font-medium text-sm mt-2 leading-relaxed max-w-2xl">
              Get email alerts when new layoff notices are published for {notice.company}.
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
