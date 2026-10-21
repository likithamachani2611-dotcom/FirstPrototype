import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Item, ItemStatus, ItemType, ConfidenceLevel } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function formatRelativeTime(dateString: string): string {
  try {
    const now = new Date();
    const then = new Date(dateString);
    const diffSeconds = Math.round((now.getTime() - then.getTime()) / 1000);

    if (diffSeconds < 60) return 'Just now';
    const diffMinutes = Math.round(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.round(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays}d ago`;
    return formatDate(dateString);
  } catch {
    return dateString;
  }
}

export function getStatusBadge(status: ItemStatus) {
  switch (status) {
    case 'open':
      return {
        label: 'Active Report',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500'
      };
    case 'claim_pending':
      return {
        label: 'Claim in Review',
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        dot: 'bg-amber-500'
      };
    case 'resolved':
      return {
        label: 'Successfully Recovered',
        bg: 'bg-teal-50 text-teal-800 border-teal-200',
        dot: 'bg-teal-600'
      };
    case 'expired':
      return {
        label: 'Expired',
        bg: 'bg-slate-100 text-slate-600 border-slate-200',
        dot: 'bg-slate-400'
      };
    case 'closed':
      return {
        label: 'Closed',
        bg: 'bg-slate-100 text-slate-600 border-slate-200',
        dot: 'bg-slate-400'
      };
    default:
      return {
        label: status,
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
        dot: 'bg-slate-400'
      };
  }
}

export function getTypeBadge(type: ItemType) {
  if (type === 'lost') {
    return {
      label: 'Lost Item',
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      badgeClass: 'text-rose-700 bg-rose-50 border-rose-200'
    };
  }
  return {
    label: 'Found Item',
    bg: 'bg-teal-50 text-teal-700 border-teal-200',
    badgeClass: 'text-teal-700 bg-teal-50 border-teal-200'
  };
}

export function getConfidenceBadge(level: ConfidenceLevel) {
  switch (level) {
    case 'Strong Candidate':
      return {
        bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        label: 'Strong Candidate (High Match)'
      };
    case 'Possible Match':
      return {
        bg: 'bg-amber-100 text-amber-800 border-amber-300',
        label: 'Possible Match (Moderate)'
      };
    case 'Weak Candidate':
      return {
        bg: 'bg-slate-100 text-slate-700 border-slate-300',
        label: 'Weak Candidate (Review Needed)'
      };
  }
}

export function calculatePlatformStats(items: Item[]) {
  const totalReports = items.length;
  const lostCount = items.filter(i => i.type === 'lost').length;
  const foundCount = items.filter(i => i.type === 'found').length;
  const recoveredCount = items.filter(i => i.status === 'resolved').length;
  const communities = new Set(items.map(i => i.community)).size;
  const recoveryRate = totalReports > 0 ? Math.round((recoveredCount / totalReports) * 100) : 0;

  return {
    totalReports,
    lostCount,
    foundCount,
    recoveredCount,
    communities,
    recoveryRate
  };
}
