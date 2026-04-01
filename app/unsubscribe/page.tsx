import { prisma } from '@/lib/prisma'
import Link from 'next/link'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function UnsubscribePage({ searchParams }: Props) {
  const { token } = await searchParams

  if (!token || typeof token !== 'string') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-3xl border border-red-200 dark:border-red-900/30 max-w-lg w-full shadow-sm flex flex-col items-center">
          <svg className="w-16 h-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mb-2">Invalid Link</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">Invalid or expired unsubscribe link.</p>
          <Link href="/" className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm w-full sm:w-auto">
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  const subscription = await prisma.subscription.findFirst({
    where: { verificationToken: token }
  })

  if (!subscription) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-3xl border border-red-200 dark:border-red-900/30 max-w-lg w-full shadow-sm flex flex-col items-center">
          <svg className="w-16 h-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mb-2">Not Found</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">Invalid or expired unsubscribe link.</p>
          <Link href="/" className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm w-full sm:w-auto">
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  // Delete the subscription record securely
  await prisma.subscription.delete({
    where: { id: subscription.id }
  })

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-emerald-50 dark:bg-emerald-900/20 p-8 rounded-3xl border border-emerald-200 dark:border-emerald-900/40 max-w-lg w-full shadow-sm flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 mb-3 tracking-tight">Unsubscribed</h1>
        <p className="text-emerald-800 dark:text-emerald-400 font-medium mb-8 text-lg">
          You have been successfully unsubscribed from Project WARN alerts.
        </p>
        <Link href="/" className="px-8 py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm w-full sm:w-auto">
          Return Home
        </Link>
      </div>
    </div>
  )
}
