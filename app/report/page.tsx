'use client';

import { useState } from 'react';
import Link from 'next/link';

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
    <main className="min-h-screen bg-zinc-50 dark:bg-black p-6 sm:p-12 font-sans text-zinc-900 dark:text-zinc-100 flex items-center justify-center">
      <div className="max-w-xl w-full space-y-8 bg-white dark:bg-zinc-900/60 p-8 sm:p-12 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800">
        
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-black tracking-tight text-black dark:text-white">
            Report a Layoff
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
            Help us track corporate retrenchments. All submissions are manually verified before appearing publicly.
          </p>
        </div>

        {isSuccess ? (
          <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 rounded-2xl text-center space-y-4">
            <div className="text-4xl">✅</div>
            <h3 className="text-lg font-bold text-green-800 dark:text-green-400">
              Thank you! Your report has been received and will be reviewed.
            </h3>
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
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl border border-red-200 dark:border-red-900/50">
                {error}
              </div>
            )}

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
                className="w-full py-4 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
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
        )}
      </div>
    </main>
  );
}
