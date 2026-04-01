export default function LoadingNotices() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black p-6 sm:p-12 font-sans text-zinc-900 dark:text-zinc-100">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="space-y-6">
          <div className="space-y-3 animate-pulse">
            <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-5 w-96 max-w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>

          <div className="space-y-5 bg-white dark:bg-zinc-900/70 p-6 md:p-8 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 animate-pulse">
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
              <div className="flex-1 h-[52px] rounded-xl bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-[52px] w-full sm:w-28 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mr-2">Filter</span>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              ))}
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
                {[...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-md ml-auto"></div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap flex justify-center">
                      <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
