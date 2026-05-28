'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/notices', label: 'Notices' },
    { href: '/companies', label: 'Companies' },
    { href: '/about', label: 'About' },
    { href: '/report', label: 'Report a Layoff', highlight: true },
  ];

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden relative z-[60] w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        <span className={`w-5 h-0.5 bg-zinc-900 dark:bg-white rounded-full transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1' : ''}`} />
        <span className={`w-5 h-0.5 bg-zinc-900 dark:bg-white rounded-full transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
        <span className={`w-5 h-0.5 bg-zinc-900 dark:bg-white rounded-full transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1' : ''}`} />
      </button>

      {/* Fullscreen Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Panel */}
          <nav className="absolute top-0 right-0 w-full max-w-sm h-full bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-6 h-16 border-b border-zinc-200 dark:border-zinc-800">
              <span className="font-black text-lg tracking-tight text-zinc-900 dark:text-white">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Close menu"
              >
                <span className="text-xl text-zinc-600 dark:text-zinc-400">✕</span>
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center px-4 py-4 rounded-2xl text-base font-bold transition-all ${
                      link.highlight
                        ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                        : isActive
                          ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    {link.label}
                    {isActive && !link.highlight && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-6 py-6 border-t border-zinc-200 dark:border-zinc-800">
              <p className="text-xs text-zinc-500 dark:text-zinc-500 font-medium text-center">
                Project WARN Netra · India Layoff Tracker
              </p>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
