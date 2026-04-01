import Link from 'next/link';
import { searchNotices } from '@/lib/notices';
import { formatDate } from '@/lib/format';
import StatusBadge from '@/components/status-badge';

export default async function NoticesPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : '';
  const status = typeof resolvedParams.status === 'string' ? resolvedParams.status : 'all';

  const notices = await searchNotices(q, status);

  const statuses = [
    { label: 'All', value: 'all' },
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' }
  ];

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black p-4 sm:p-12 font-sans text-zinc-900 dark:text-zinc-100 relative">
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10 pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        <header className="space-y-8">
          <div className="space-y-3 pt-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-500">
              Database Explorer
            </h1>
            <p className="text-base sm:text-xl text-zinc-600 dark:text-zinc-400 font-medium">
              A comprehensive list of all recorded layoff and retrenchment notices in India.
            </p>
          </div>

          <div className="space-y-5 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-lg shadow-zinc-200/40 dark:shadow-none border border-zinc-200/80 dark:border-zinc-800">
            <form method="get" className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-3xl">
              <input 
                type="text" 
                name="q" 
                defaultValue={q} 
                placeholder="Search by company or location..." 
                className="flex-1 px-5 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 text-base shadow-sm font-medium transition-shadow"
              />
              {status !== 'all' && <input type="hidden" name="status" value={status} />}
              <button type="submit" className="w-full sm:w-auto px-10 py-4 bg-blue-600 dark:bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 dark:hover:bg-blue-500 active:scale-95 transition-all shadow-md hover:shadow-xl hover:shadow-blue-600/20">
                Search
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs sm:text-sm font-bold text-zinc-500 uppercase tracking-widest mr-2 w-full sm:w-auto mb-2 sm:mb-0">Filter By Status</span>
              {statuses.map(s => {
                const isActive = s.value === status;
                
                const params = new URLSearchParams();
                if (q) params.set('q', q);
                if (s.value !== 'all') params.set('status', s.value);
                
                const linkHref = params.toString() ? `?${params.toString()}` : '?';

                return (
                  <Link 
                    key={s.value} 
                    href={linkHref}
                    className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                        : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700/50 hover:shadow-sm'
                    }`}
                  >
                    {s.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </header>

        <section className="bg-transparent sm:bg-white sm:dark:bg-zinc-900/80 rounded-3xl sm:shadow-lg sm:shadow-zinc-200/50 sm:dark:shadow-none sm:border sm:border-zinc-200 sm:dark:border-zinc-800 overflow-hidden">
          
          {/* Mobile Card Layout (< 640px) */}
          <div className="block sm:hidden space-y-4">
            {notices.length > 0 ? (
              notices.map(notice => (
                <div key={notice.id} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-md border border-zinc-200 dark:border-zinc-800 flex flex-col gap-5">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <Link 
                        href={`/notices/${notice.id}`}
                        className="font-black text-2xl text-zinc-900 dark:text-white hover:text-blue-600 transition-colors"
                      >
                        {notice.company}
                      </Link>
                      {notice.sector && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-zinc-100/80 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                            {notice.sector}
                          </span>
                        </div>
                      )}
                    </div>
                    <StatusBadge status={notice.status} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-5 gap-x-2 text-sm bg-zinc-50 dark:bg-zinc-950/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/60">
                    <div className="flex flex-col">
                      <span className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">Affected</span>
                      <span className="font-extrabold text-xl text-black dark:text-white">{notice.affected.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">Effective Date</span>
                      <span className="font-bold text-[15px] text-zinc-800 dark:text-zinc-200 tracking-wide pt-0.5">{formatDate(notice.date)}</span>
                    </div>
                    <div className="flex flex-col col-span-2 mt-1">
                      <span className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">Location</span>
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 break-words">
                        <span className="opacity-60 text-sm">📍</span> {notice.location}
                      </span>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/notices/${notice.id}`}
                    className="w-full mt-2 py-3.5 text-center text-sm font-bold text-white bg-blue-600 dark:bg-blue-600 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-500 active:scale-95 transition-all shadow-sm"
                  >
                    View Details →
                  </Link>
                </div>
              ))
            ) : (
                <div className="p-12 text-center bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 rounded-3xl">
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium italic">
                    No matching notices found for your filters.
                  </p>
                </div>
            )}
          </div>

          {/* Desktop Table Layout (>= 640px) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-zinc-50/80 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800 text-xs font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">
                  <th className="px-8 py-6">Company</th>
                  <th className="px-6 py-6 text-right">Affected</th>
                  <th className="px-6 py-6">Location</th>
                  <th className="px-6 py-6">Effective Date</th>
                  <th className="px-8 py-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
                {notices.length > 0 ? (
                  notices.map((notice) => (
                    <tr key={notice.id} className="transition-all hover:bg-white dark:hover:bg-zinc-800/40 group relative">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex flex-col items-start gap-1.5">
                          <Link 
                            href={`/notices/${notice.id}`}
                            className="font-extrabold text-xl text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors focus:outline-none"
                          >
                            <span className="absolute inset-0 z-10" aria-hidden="true"></span>
                            {notice.company}
                          </Link>
                          {notice.sector && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                              {notice.sector}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-right">
                        <span className="font-bold text-[17px] text-zinc-800 dark:text-zinc-200">
                          {notice.affected.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-semibold text-sm">
                          <span className="opacity-60 text-base">📍</span>
                          {notice.location}
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <span className="font-semibold text-[15px] text-zinc-700 dark:text-zinc-300 tracking-wide">
                          {formatDate(notice.date)}
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap flex justify-center relative z-20">
                        <StatusBadge status={notice.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-zinc-500 dark:text-zinc-400 font-medium italic">
                      No matching notices found for your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
