'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function ReportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      companyName: formData.get('companyName'),
      affected: formData.get('affected'),
      location: formData.get('location'),
      reason: formData.get('reason'),
      sourceUrl: formData.get('sourceUrl'),
      reporterRole: formData.get('reporterRole'),
      details: formData.get('details'),
      website: formData.get('website'), // honeypot
    };

    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Failed to submit report. Please try again.');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black p-4 sm:p-6 md:p-12 font-sans text-zinc-900 dark:text-zinc-100 flex items-start sm:items-center justify-center">
      <div className="max-w-xl w-full space-y-8 bg-white dark:bg-zinc-900/60 p-5 sm:p-8 md:p-12 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        
        <div className="space-y-2 text-center">
          <h1 className="font-serif text-3xl font-black tracking-tight text-black dark:text-white">
            Report a Layoff
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
            Help us track corporate retrenchments. All submissions are manually verified before appearing publicly.
          </p>
        </div>

        {isSuccess ? (
          <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 rounded-2xl text-center space-y-4">
            <div className="flex justify-center"><CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" /></div>
            <h3 className="text-lg font-bold text-green-800 dark:text-green-400">
              Thank you! Your report has been received and will be reviewed.
            </h3>
            <p className="text-sm text-green-700 dark:text-green-400 max-w-md mx-auto leading-relaxed">
              Your submission remains completely anonymous and secure. No personal identifier or tracking data was collected, and this report will not be shared with the companies named or any third party.
            </p>
            <div className="pt-2">
              <Link 
                href="/" 
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-green-600 hover:bg-green-700 text-white font-bold transition-colors shadow-sm"
              >
                Return to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-5 bg-sky-50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/30 rounded-2xl flex items-start gap-3.5 text-sky-800 dark:text-sky-300">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-sky-600 dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div className="text-sm leading-relaxed space-y-1">
                <p className="font-bold text-sky-900 dark:text-sky-200">Whistleblower Protection</p>
                <p>
                  Your submission is completely anonymous. We do not collect, store, or share your identity or contact details. Reports are manually reviewed before publication. No information will ever be disclosed to the companies named or any third party.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl border border-red-200 dark:border-red-900/50">
                {error}
              </div>
            )}

            {/* Honeypot — hidden from real users, bots will fill it */}
            <div className="absolute opacity-0 top-0 left-0 h-0 w-0 -z-10 overflow-hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="companyName" className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                id="companyName" 
                name="companyName" 
                required
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                placeholder="e.g. Amazon India"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label htmlFor="affected" className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                  Workers Affected
                </label>
                <input 
                  type="number" 
                  id="affected" 
                  name="affected" 
                  min="1"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  placeholder="e.g. 500"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="location" className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                  Location
                </label>
                <input 
                  type="text" 
                  id="location" 
                  name="location" 
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  placeholder="e.g. Bengaluru, Karnataka"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="reason" className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                Reason (if known)
              </label>
              <input 
                type="text" 
                id="reason" 
                name="reason" 
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                placeholder="e.g. Restructuring, Cost optimization"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="sourceUrl" className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                News Source URL
              </label>
              <input 
                type="url" 
                id="sourceUrl" 
                name="sourceUrl" 
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="reporterRole" className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                Your Role
              </label>
              <select 
                id="reporterRole" 
                name="reporterRole" 
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow appearance-none"
              >
                <option value="">Select an option...</option>
                <option value="employee">Affected Employee</option>
                <option value="journalist">Journalist / Reporter</option>
                <option value="insider">Company Insider</option>
                <option value="other">Other / Observer</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="details" className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                Additional Details
              </label>
              <textarea 
                id="details" 
                name="details" 
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-y"
                placeholder="Any other context or information?"
              ></textarea>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 min-h-[48px] rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin"></span>
                    Submitting...
                  </>
                ) : 'Submit Report'}
              </button>
            </div>
          </form>
          </div>
        )}
      </div>
    </main>
  );
}
