import Link from 'next/link';
import { searchNotices } from '@/lib/notices';
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
    <main className="min-h-screen bg-zinc-50 dark:bg-black p-6 sm:p-12 font-sans text-zinc-900 dark:text-zinc-100">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-black dark:text-white">
              All Layoff Notices
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              A comprehensive list of all recorded layoff and retrenchment notices in India.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="space-y-5 bg-white dark:bg-zinc-900/70 p-6 md:p-8 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
            <form method="get" className="flex flex-col sm:flex-row gap-4 max-w-2xl">
              <input 
                type="text" 
                name="q" 
                defaultValue={q} 
                placeholder="Search by company or location..." 
                className="flex-1 px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              {status !== 'all' && <input type="hidden" name="status" value={status} />}
              <button type="submit" className="px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors">
                Search
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mr-2">Filter</span>
              {statuses.map(s => {
                const isActive = s.value === status;
                
                // Build fresh search params retaining the current query String if it exists
                const params = new URLSearchParams();
                if (q) params.set('q', q);
                if (s.value !== 'all') params.set('status', s.value);
                
                const linkHref = params.toString() ? `?${params.toString()}` : '?';

                return (
                  <Link 
                    key={s.value} 
                    href={linkHref}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                      isActive 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400 ring-2 ring-blue-500/50' 
                        : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {s.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </header>

        <section className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/80 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800 text-xs font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
                  <th className="px-6 py-5">Company</th>
                  <th className="px-6 py-5 text-right">Affected</th>
                  <th className="px-6 py-5">Location</th>
                  <th className="px-6 py-5">Date</th>
                  <th className="px-6 py-5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {notices.length > 0 ? (
                  notices.map((notice) => (
                    <tr key={notice.id} className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                      <td className="px-6 py-5 whitespace-nowrap">
                        <Link 
                          href={`/notices/${notice.id}`}
                          className="font-bold text-lg text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-amber-500 transition-colors"
                        >
                          {notice.company}
                        </Link>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <span className="font-semibold text-[17px] text-zinc-800 dark:text-zinc-200">
                          {notice.affected.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 font-medium text-sm">
                          <span className="opacity-60 text-base">📍</span>
                          {notice.location}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="font-semibold text-sm text-zinc-700 dark:text-zinc-300 tracking-wide">
                          {new Intl.DateTimeFormat('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          }).format(new Date(notice.date))}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap flex justify-center">
                        <StatusBadge status={notice.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-zinc-500 dark:text-zinc-400 italic">
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
