// ============================================================
// Learn Center — Utility Functions
// ============================================================

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Install clsx + tailwind-merge for cn()
// If not available, use simple concat
export function cn(...inputs: ClassValue[]) {
  try {
    return twMerge(clsx(inputs));
  } catch {
    return inputs.filter(Boolean).join(' ');
  }
}

/**
 * Format a date string to Indonesian locale
 * e.g. "2024-03-01T08:00:00Z" → "1 Maret 2024"
 */
export function formatDate(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
  const defaults: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(dateStr).toLocaleDateString('id-ID', options ?? defaults);
}

/**
 * Format a date string with time
 * e.g. "2024-03-01T08:00:00Z" → "1 Mar 2024 15:30"
 */
export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format a number to Indonesian locale
 * e.g. 1000000 → "1.000.000"
 */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('id-ID').format(n);
}

/**
 * Calculate letter grade from score/total_points
 */
export function calculateGrade(score: number, totalPoints: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (totalPoints === 0) return 'F';
  const pct = (score / totalPoints) * 100;
  if (pct >= 90) return 'A';
  if (pct >= 75) return 'B';
  if (pct >= 60) return 'C';
  if (pct >= 45) return 'D';
  return 'F';
}

/**
 * Get Tailwind text color class for a grade
 */
export function getGradeColor(grade: string): string {
  const map: Record<string, string> = {
    A: 'text-green-500',
    B: 'text-blue-500',
    C: 'text-yellow-500',
    D: 'text-orange-500',
    F: 'text-red-500',
  };
  return map[grade] ?? 'text-gray-500';
}

/**
 * Calculate percentage from score/total_points
 */
export function calcPercentage(score: number, totalPoints: number): number {
  if (totalPoints === 0) return 0;
  return Math.round((score / totalPoints) * 100 * 10) / 10;
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, wait: number): T {
  let timeout: ReturnType<typeof setTimeout>;
  return ((...args: unknown[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  }) as T;
}

/**
 * Truncate a string to maxLength characters
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

/**
 * Strip HTML tags from a string (for note previews)
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Get difficulty badge color class
 */
export function getDifficultyColor(difficulty: string): string {
  const map: Record<string, string> = {
    easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };
  return map[difficulty] ?? 'bg-gray-100 text-gray-700';
}

/**
 * Day names in Indonesian
 */
export const DAY_NAMES_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
