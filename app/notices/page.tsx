import Link from 'next/link';
import { searchNotices, getFilterCounts, getLastUpdated } from '@/lib/notices';
import { prisma } from '@/lib/prisma';
import { formatDate, slugify } from '@/lib/format';
import StatusBadge from '@/components/status-badge';
import VerificationBadge from '@/components/verification-badge';
import { MapPin } from 'lucide-react';

export default async function NoticesPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : '';
  const status = typeof resolvedParams.status === 'string' ? resolvedParams.status : 'all';
  const sector = typeof resolvedParams.sector === 'string' ? resolvedParams.sector : 'all';
  const page = typeof resolvedParams.page === 'string' ? Math.max(1, parseInt(resolvedParams.page, 10) || 1) : 1;
  const sort = typeof resolvedParams.sort === 'string' ? resolvedParams.sort : 'date';
  const dir = typeof resolvedParams.dir === 'string' ? resolvedParams.dir : 'desc';
  const pageSize = 10;

  const { notices, totalCount } = await searchNotices(q, status, sector, page, pageSize, sort, dir);

  const counts = await getFilterCounts(q);
  const lastUpdated = await getLastUpdated();

  const rawSectors = await prisma.notice.findMany({
    select: { sector: true },
    distinct: ['sector']
  });
  const sectors = rawSectors
    .map(s => s.sector)
    .filter((s): s is string => s !== null && s !== '')
    .sort();

  const statuses = [
    { label: `All (${counts.total})`, value: 'all' },
    { label: `Upcoming (${counts.statusCounts['upcoming'] || 0})`, value: 'upcoming' },
    { label: `In Progress (${counts.statusCounts['in_progress'] || 0})`, value: 'in_progress' },
    { label: `Completed (${counts.statusCounts['completed'] || 0})`, value: 'completed' }
  ];

  const buildSortUrl = (column: string) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (status !== 'all') params.set('status', status);
    if (sector !== 'all') params.set('sector', sector);
    
    if (sort === column) {
      params.set('sort', column);
      params.set('dir', dir === 'asc' ? 'desc' : 'asc');
    } else {
      params.set('sort', column);
      if (column === 'company') {
        params.set('dir', 'asc');
      } else {
        params.set('dir', 'desc');
      }
    }
    return `?${params.toString()}`;
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sort !== column) return null;
    return <span className="ml-1 inline-block">{dir === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black p-4 sm:p-12 font-sans text-zinc-900 dark:text-zinc-100 relative">
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10 pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        <header className="space-y-8">
          <div className="space-y-3 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-6">
              <h1 className="font-serif text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-500">
                Database Explorer
              </h1>
              <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 dark:text-zinc-600 pb-1 sm:pb-2">
                <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                Updated: {lastUpdated}
              </span>
            </div>
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
              {sector !== 'all' && <input type="hidden" name="sector" value={sector} />}
              {sort !== 'date' && <input type="hidden" name="sort" value={sort} />}
              {dir !== 'desc' && <input type="hidden" name="dir" value={dir} />}
              <button type="submit" className="w-full sm:w-auto px-10 py-4 bg-blue-600 dark:bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 dark:hover:bg-blue-500 active:scale-95 transition-all shadow-md hover:shadow-xl hover:shadow-blue-600/20">
                Search
              </button>
            </form>

            <div className="flex gap-2 overflow-x-auto pb-3 snap-x pt-2 -mx-2 px-2 scrollbar-hide">
              <span className="text-xs sm:text-sm font-bold text-zinc-500 uppercase tracking-widest mr-2 flex-shrink-0 self-center">Status</span>
              {statuses.map(s => {
                const isActive = s.value === status;
                
                const params = new URLSearchParams();
                if (q) params.set('q', q);
                if (s.value !== 'all') params.set('status', s.value);
                if (sector !== 'all') params.set('sector', sector);
                if (sort !== 'date') params.set('sort', sort);
                if (dir !== 'desc') params.set('dir', dir);
                
                const linkHref = params.toString() ? `?${params.toString()}` : '?';

                return (
                  <Link 
                    key={s.value} 
                    href={linkHref}
                    className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex-shrink-0 snap-start whitespace-nowrap ${
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

            <div className="flex flex-col pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60">
              <span className="text-xs sm:text-sm font-bold text-zinc-500 uppercase tracking-widest mb-3">Filter By Sector</span>
              <div className="flex gap-2 overflow-x-auto pb-3 snap-x -mx-2 px-2 scrollbar-hide">
                {[{label: `All Sectors (${counts.total})`, value: 'all'}, ...sectors.map(s => ({label: `${s} (${counts.sectorCounts[s] || 0})`, value: s}))].map(s => {
                  const isActive = s.value === sector;
                  
                  const params = new URLSearchParams();
                  if (q) params.set('q', q);
                  if (status !== 'all') params.set('status', status);
                  if (s.value !== 'all') params.set('sector', s.value);
                  if (sort !== 'date') params.set('sort', sort);
                  if (dir !== 'desc') params.set('dir', dir);
                  
                  const linkHref = params.toString() ? `?${params.toString()}` : '?';

                  return (
                    <Link 
                      key={s.value} 
                      href={linkHref}
                      className={`px-4 py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all flex-shrink-0 snap-start whitespace-nowrap ${
                        isActive 
                          ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-md shadow-zinc-900/20' 
                          : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700/50 hover:shadow-sm'
                      }`}
                    >
                      {s.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </header>

        {/* Verification Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 pb-2">
          <span className="font-semibold uppercase tracking-wider text-[10px] mr-1">Verification:</span>
          <VerificationBadge verification="confirmed" /> <span className="opacity-75">Official statement</span>
          <span className="opacity-30">|</span>
          <VerificationBadge verification="reported" /> <span className="opacity-75">Credible news</span>
          <span className="opacity-30">|</span>
          <VerificationBadge verification="estimate" /> <span className="opacity-75">Approximation</span>
        </div>

        <section className="bg-white dark:bg-zinc-900/80 rounded-3xl shadow-lg shadow-zinc-200/50 dark:shadow-none border border-zinc-200 dark:border-zinc-800 overflow-hidden relative">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-zinc-50/80 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800 text-xs font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">
                  <th className="px-8 py-6">
                    <Link href={buildSortUrl('company')} className="hover:text-black dark:hover:text-white transition-colors group">
                      Company <SortIcon column="company" />
                    </Link>
                  </th>
                  <th className="px-6 py-6 text-right">
                    <Link href={buildSortUrl('affected')} className="hover:text-black dark:hover:text-white transition-colors group">
                      Affected <SortIcon column="affected" />
                    </Link>
                  </th>
                  <th className="px-6 py-6">Location</th>
                  <th className="px-6 py-6">
                    <Link href={buildSortUrl('date')} className="hover:text-black dark:hover:text-white transition-colors group">
                      Effective Date <SortIcon column="date" />
                    </Link>
                  </th>
                  <th className="px-8 py-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
                {notices.length > 0 ? (
                  notices.map((notice) => (
                    <tr key={notice.id} className="transition-all hover:bg-white dark:hover:bg-zinc-800/40 group relative">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex flex-col items-start gap-1.5 relative z-20">
                          <Link 
                            href={`/companies/${notice.companySlug || slugify(notice.company)}`}
                            className="font-extrabold text-xl text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none"
                          >
                            {notice.company}
                          </Link>
                          {notice.sector && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                              {notice.sector}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-right relative z-20">
                        <span className="font-bold text-[17px] text-zinc-800 dark:text-zinc-200">
                          {notice.affected.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-semibold text-sm">
                          <MapPin className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                          {notice.location}
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-[15px] text-zinc-700 dark:text-zinc-300 tracking-wide">
                            {formatDate(notice.date)}
                          </span>
                          {notice.announcedDate && (() => {
                            const gap = Math.ceil((notice.date.getTime() - new Date(notice.announcedDate).getTime()) / (1000 * 60 * 60 * 24));
                            return (
                              <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-600">
                                {gap}d notice
                              </span>
                            );
                          })()}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap relative z-20">
                        <div className="flex flex-col items-center gap-2">
                          <StatusBadge status={notice.computedStatus} />
                          <VerificationBadge verification={notice.verification} />
                        </div>
                      </td>
                      <td className="absolute inset-0 z-10">
                        <Link href={`/notices/${notice.id}`} aria-hidden="true" className="w-full h-full block focus:outline-none" tabIndex={-1}></Link>
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
        
        {/* Pagination Controls */}
        {totalCount > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-zinc-200 dark:border-zinc-800 gap-4">
            <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Showing <span className="font-bold text-zinc-900 dark:text-white">{((page - 1) * pageSize) + 1}</span> to <span className="font-bold text-zinc-900 dark:text-white">{Math.min(page * pageSize, totalCount)}</span> of <span className="font-bold text-zinc-900 dark:text-white">{totalCount}</span> notices
            </div>
            <div className="flex items-center gap-2">
              {page > 1 ? (
                <Link 
                  href={`?${new URLSearchParams({
                    ...(q ? { q } : {}),
                    ...(status !== 'all' ? { status } : {}),
                    ...(sector !== 'all' ? { sector } : {}),
                    ...(sort !== 'date' ? { sort } : {}),
                    ...(dir !== 'desc' ? { dir } : {}),
                    page: (page - 1).toString()
                  }).toString()}`}
                  className="px-4 py-2 text-sm font-bold bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-zinc-900 dark:text-white shadow-sm"
                >
                  ← Previous
                </Link>
              ) : (
                <button disabled className="px-4 py-2 text-sm font-bold bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 rounded-xl text-zinc-400 dark:text-zinc-600 cursor-not-allowed">
                  ← Previous
                </button>
              )}
              
              <div className="px-4 py-2 text-sm font-bold bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-900 dark:text-white">
                Page {page} of {Math.ceil(totalCount / pageSize)}
              </div>
              
              {page < Math.ceil(totalCount / pageSize) ? (
                <Link 
                  href={`?${new URLSearchParams({
                    ...(q ? { q } : {}),
                    ...(status !== 'all' ? { status } : {}),
                    ...(sector !== 'all' ? { sector } : {}),
                    ...(sort !== 'date' ? { sort } : {}),
                    ...(dir !== 'desc' ? { dir } : {}),
                    page: (page + 1).toString()
                  }).toString()}`}
                  className="px-4 py-2 text-sm font-bold bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-zinc-900 dark:text-white shadow-sm"
                >
                  Next →
                </Link>
              ) : (
                <button disabled className="px-4 py-2 text-sm font-bold bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 rounded-xl text-zinc-400 dark:text-zinc-600 cursor-not-allowed">
                  Next →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
