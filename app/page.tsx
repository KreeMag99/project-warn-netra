import { getStats, getAllNotices } from '@/lib/notices'
import { prisma } from '@/lib/prisma'
import StatusBadge from '@/components/status-badge'
import Link from 'next/link'

export default async function Home() {
  const stats = await getStats()
  const notices = await getAllNotices()
  
  // Get first 5 notices
  const recentNotices = notices.slice(0, 5)

  const sectorBreakdown = await prisma.notice.groupBy({
    by: ['sector'],
    _sum: { affected: true },
    where: { sector: { not: null } }
  });
  
  const validSectors = sectorBreakdown
    .filter(s => s._sum.affected && s._sum.affected > 0)
    .sort((a, b) => (b._sum.affected || 0) - (a._sum.affected || 0))
    .slice(0, 10);

  const maxSectorAffected = validSectors.length > 0 
    ? Math.max(...validSectors.map(s => s._sum.affected || 0)) 
    : 1;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black p-6 sm:p-12 font-sans text-zinc-900 dark:text-zinc-100 overflow-hidden relative">
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10 pointer-events-none" />
      
      <div className="max-w-5xl mx-auto space-y-16 relative z-10">
        
        {/* Premium Hero Section */}
        <section className="text-center space-y-6 pt-16 pb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
          <Link href="/about" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold mb-2 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer border border-blue-200/50 dark:border-blue-800/50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Real-time public database
          </Link>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-200 dark:to-zinc-500 drop-shadow-sm">
            India Layoff Warning System
          </h1>
          <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto font-medium leading-relaxed">
            The intelligent, centralized repository tracking mass layoff and retrenchment notices across the subcontinent.
          </p>
          <div className="pt-6">
            <Link href="/notices" className="inline-flex items-center justify-center px-8 py-4 text-bases font-bold text-white bg-blue-600 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/20 active:scale-95 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-2xl transition-all shadow-md">
              Search the Database
            </Link>
          </div>
        </section>

        {/* Elevated Stats Row */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <div className="p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-lg shadow-zinc-200/50 dark:shadow-none border border-zinc-200 dark:border-zinc-800 flex flex-col items-start space-y-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900/50 group">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              📊
            </div>
            <div className="w-full">
              <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1.5">Total Notices</h3>
              <p className="text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tighter">{stats.totalNotices}</p>
            </div>
          </div>
          
          <div className="p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-lg shadow-zinc-200/50 dark:shadow-none border border-zinc-200 dark:border-zinc-800 flex flex-col items-start space-y-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-red-200 dark:hover:border-red-900/50 group">
            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              👥
            </div>
            <div className="w-full">
              <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1.5">Workers Affected</h3>
              <p className="text-4xl lg:text-5xl font-extrabold text-red-600 dark:text-red-500 tracking-tighter">{stats.totalAffected.toLocaleString('en-IN')}</p>
            </div>
          </div>
          
          <div className="p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-lg shadow-zinc-200/50 dark:shadow-none border border-zinc-200 dark:border-zinc-800 flex flex-col items-start space-y-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-amber-200 dark:hover:border-amber-900/50 group">
            <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              ⏳
            </div>
            <div className="w-full">
              <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1.5">Upcoming Layoffs</h3>
              <p className="text-4xl lg:text-5xl font-extrabold text-amber-600 dark:text-amber-500 tracking-tighter">{stats.upcomingNotices}</p>
            </div>
          </div>
        </section>

        {/* Sector Breakdown Chart */}
        <section className="space-y-8 pt-6">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-5">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Layoffs by Sector
            </h2>
          </div>
          
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 shadow-sm border border-zinc-200 dark:border-zinc-800 relative z-20">
            <div className="space-y-6">
              {validSectors.length > 0 ? (
                validSectors.map((sectorData) => {
                  const affected = sectorData._sum.affected || 0;
                  const percentage = Math.max(1, (affected / maxSectorAffected) * 100);
                  
                  return (
                    <div key={sectorData.sector} className="space-y-2 group">
                      <div className="flex justify-between items-center text-sm font-bold">
                        <span className="text-zinc-700 dark:text-zinc-300 uppercase tracking-widest text-[11px] sm:text-xs">{sectorData.sector}</span>
                        <span className="text-zinc-900 dark:text-white font-extrabold">{affected.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800/80 rounded-full overflow-hidden flex shadow-inner">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full transition-all duration-1000 ease-out group-hover:from-blue-500 group-hover:to-blue-400"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <p className="text-zinc-500 dark:text-zinc-400 font-medium">No sector data available yet.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Polished Recent Notices */}
        <section className="space-y-8 pb-12 pt-6">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-5">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Recent Notices
            </h2>
            <Link href="/notices" className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
              View All →
            </Link>
          </div>
          
          <div className="flex flex-col gap-5">
            {recentNotices.length > 0 ? (
              recentNotices.map((notice) => (
                <div key={notice.id} className="p-6 md:p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-sm hover:shadow-lg border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 group">
                  <div className="space-y-2 flex-1 relative">
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-amber-400 transition-colors">
                      <Link href={`/notices/${notice.id}`} className="focus:outline-none">
                        <span className="absolute inset-0 z-10" aria-hidden="true"></span>
                        {notice.company}
                      </Link>
                    </h3>
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                      <span className="opacity-60 text-base">📍</span>
                      {notice.location}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-6 sm:gap-10 bg-zinc-50 dark:bg-zinc-950/50 p-5 rounded-2xl md:bg-transparent md:p-0 z-20">
                    <div className="text-left md:text-right">
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Affected</p>
                      <p className="font-bold text-xl text-zinc-900 dark:text-white">{notice.affected.toLocaleString('en-IN')}</p>
                    </div>
                    
                    <div className="text-left md:text-right">
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Effective</p>
                      <p className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">
                        {new Intl.DateTimeFormat('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        }).format(new Date(notice.date))}
                      </p>
                    </div>
                    
                    <div className="min-w-[110px] flex justify-end">
                      <StatusBadge status={notice.status} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-16 text-center bg-zinc-50 border-2 border-dashed border-zinc-200 dark:bg-zinc-900/30 dark:border-zinc-800 rounded-3xl">
                <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium">No recent layoff notices found in the database.</p>
              </div>
            )}
          </div>
        </section>
        
      </div>
    </main>
  )
}