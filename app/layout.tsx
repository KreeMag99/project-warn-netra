import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from 'next/link';
import "./globals.css";
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import { SubscribeForm } from '@/components/subscribe-form';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Project WARN | India Layoff Tracking",
  description: "A public searchable database of Indian layoff and retrenchment notices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
        
        {/* Global Navigation Header */}
        <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6 sm:px-12">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <span className="bg-zinc-900 dark:bg-white text-white dark:text-black font-black px-2 py-0.5 rounded-md text-sm tracking-tight">
                WARN
              </span>
              <span className="font-bold text-lg hidden sm:inline-block tracking-tight text-zinc-900 dark:text-white">
                Project WARN
              </span>
            </Link>

            <nav className="flex items-center gap-6">
              <Link href="/" className="text-sm font-semibold text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/notices" className="text-sm font-semibold text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors">
                Notices
              </Link>
              <Link href="/about" className="text-sm font-semibold text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors">
                About
              </Link>
              <div className="pl-2 border-l border-zinc-200 dark:border-zinc-800">
                <ThemeToggle />
              </div>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center w-full">
          <div className="w-full">
            {children}
          </div>
        </div>

        {/* Global Footer */}
        <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black py-16 mt-auto">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col items-center justify-center space-y-10">
            <div className="text-center space-y-3 w-full max-w-lg flex flex-col items-center">
              <h3 className="font-bold text-lg text-black dark:text-white">Subscribe to the Weekly Digest</h3>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 pb-2">Join thousands of Indian workers obtaining immediate email notifications summarizing structural layoffs occurring nationally.</p>
              <SubscribeForm alertType="all" alertValue="all" />
            </div>

            <div className="w-full max-w-sm h-px bg-zinc-200 dark:bg-zinc-800"></div>

            <div className="flex flex-col items-center justify-center space-y-4">
              <p className="font-semibold text-zinc-600 dark:text-zinc-400 text-center tracking-wide text-sm">
                Built because Indian workers deserve advance notice.
              </p>
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
                <Link href="/about" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline underline-offset-4 transition-colors">
                  About Project WARN
                </Link>
                <span className="text-zinc-300 dark:text-zinc-700">|</span>
                <Link href="/" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Home
                </Link>
              </div>
            </div>
          </div>
        </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
