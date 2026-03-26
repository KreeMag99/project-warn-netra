import { getStats, getAllNotices } from '@/lib/notices'
import StatusBadge from '@/components/status-badge'

export default async function Home() {
  const stats = await getStats()
  const notices = await getAllNotices()
  
  // Get first 5 notices
  const recentNotices = notices.slice(0, 5)

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black p-8 sm:p-16 font-sans text-zinc-900 dark:text-zinc-100">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Hero Section */}
        <section className="text-center space-y-6 pt-12 pb-8">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-black dark:text-white">
            India Layoff Early Warning System
          </h1>
          <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto font-medium">
            Public searchable database of Indian layoff and retrenchment notices
          </p>
        </section>

        {/* Stats Row */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-white dark:bg-zinc-900/50 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center space-y-3 transition-transform hover:scale-[1.02]">
            <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Total Notices</h3>
            <p className="text-5xl font-bold text-black dark:text-white">{stats.totalNotices}</p>
          </div>
          
          <div className="p-8 bg-white dark:bg-zinc-900/50 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center space-y-3 transition-transform hover:scale-[1.02]">
            <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Workers Affected</h3>
            <p className="text-5xl font-bold text-black dark:text-white">{stats.totalAffected.toLocaleString('en-IN')}</p>
          </div>
          
          <div className="p-8 bg-white dark:bg-zinc-900/50 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center space-y-3 transition-transform hover:scale-[1.02]">
            <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Upcoming Layoffs</h3>
            <p className="text-5xl font-bold text-amber-600 dark:text-amber-500">{stats.upcomingNotices}</p>
          </div>
        </section>

        {/* Recent Notices */}
        <section className="space-y-8 pb-12">
          <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-4">
            Recent Notices
          </h2>
          
          <div className="flex flex-col gap-4">
            {recentNotices.length > 0 ? (
              recentNotices.map((notice) => (
                <div key={notice.id} className="p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/80">
                  <div className="space-y-1.5 flex-1">
                    <h3 className="text-xl font-bold text-black dark:text-white">{notice.company}</h3>
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                      <span className="inline-block w-4 h-4 opacity-50">📍</span>
                      {notice.location}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-8 bg-zinc-50 dark:bg-zinc-950/50 p-4 rounded-lg md:bg-transparent md:p-0">
                    <div className="text-left md:text-right">
                      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Affected</p>
                      <p className="font-bold text-xl text-black dark:text-white">{notice.affected.toLocaleString('en-IN')}</p>
                    </div>
                    
                    <div className="text-left md:text-right">
                      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Date</p>
                      <p className="font-semibold text-zinc-800 dark:text-zinc-200 text-[15px]">
                        {new Intl.DateTimeFormat('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        }).format(new Date(notice.date))}
                      </p>
                    </div>
                    
                    <div className="min-w-[100px] flex justify-end">
                      <StatusBadge status={notice.status} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center bg-zinc-50 border border-dashed border-zinc-300 dark:bg-zinc-900/30 dark:border-zinc-800 rounded-2xl">
                <p className="text-zinc-500 dark:text-zinc-400 text-lg">No recent layoff notices found in the database.</p>
              </div>
            )}
          </div>
        </section>
        
      </div>
    </main>
  )
}