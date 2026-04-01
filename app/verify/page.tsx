import { prisma } from '@/lib/prisma'
import Link from 'next/link'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function VerifyPage({ searchParams }: Props) {
  const { token } = await searchParams

  if (!token || typeof token !== 'string') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-3xl border border-red-200 dark:border-red-900/30 max-w-lg w-full shadow-sm flex flex-col items-center">
          <svg className="w-16 h-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mb-2">Invalid Link</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">Invalid or expired verification link.</p>
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
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">Invalid or expired verification link.</p>
          <Link href="/" className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm w-full sm:w-auto">
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  if (subscription.verified) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-blue-50 dark:bg-blue-900/10 p-8 rounded-3xl border border-blue-200 dark:border-blue-900/30 max-w-lg w-full shadow-sm flex flex-col items-center">
          <svg className="w-16 h-16 text-blue-500 dark:text-blue-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mb-2">Already Verified</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">This subscription is already verified.</p>
          <Link href="/notices" className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm w-full sm:w-auto">
            Browse Notices
          </Link>
        </div>
      </div>
    )
  }

  // Final verification trigger
  await prisma.subscription.update({
    where: { id: subscription.id },
    data: { verified: true }
  })

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-green-50 dark:bg-green-900/20 p-8 rounded-3xl border border-green-200 dark:border-green-900/40 max-w-lg w-full shadow-sm flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 mb-3 tracking-tight">Verified!</h1>
        <p className="text-green-800 dark:text-green-300 font-medium mb-8 text-lg">
          Subscription verified successfully! You will now receive alerts.
        </p>
        <Link href="/notices" className="px-8 py-3.5 bg-green-600 dark:bg-green-500 text-white font-bold rounded-xl hover:bg-green-700 dark:hover:bg-green-600 transition-colors shadow-sm w-full sm:w-auto">
          View Active Notices
        </Link>
      </div>
    </div>
  )
}
