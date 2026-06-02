import React from 'react';

export default function VerificationBadge({ verification }: { verification: string }) {
  const verificationLower = (verification || 'reported').toLowerCase();
  
  let styles = 'bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-zinc-300';
  let icon = '•';
  
  if (verificationLower === 'confirmed') {
    styles = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400';
    icon = '✓';
  } else if (verificationLower === 'reported') {
    styles = 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400';
    icon = '📰';
  } else if (verificationLower === 'estimate') {
    styles = 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-400';
    icon = '≈';
  }

  const displayText = verificationLower;

  return (
    <span className={`px-2 py-1 text-[10px] font-bold rounded-full border border-current/10 capitalize tracking-wide whitespace-nowrap inline-flex items-center gap-1 ${styles}`}>
      <span className="text-[10px]">{icon}</span>
      {displayText}
    </span>
  );
}
