import React from 'react';

export default function StatusBadge({ status }: { status: string }) {
  const statusLower = status.toLowerCase();
  
  let styles = 'bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-zinc-300'; // Default gray and completed
  
  if (statusLower === 'upcoming') {
    styles = 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400';
  } else if (statusLower === 'in_progress') {
    styles = 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400';
  }

  const displayText = status.replace('_', ' ');

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border border-current/10 capitalize tracking-wide whitespace-nowrap ${styles}`}>
      {displayText}
    </span>
  );
}
