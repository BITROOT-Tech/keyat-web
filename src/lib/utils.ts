// lib/utils.ts - ADD THE MISSING isDev FUNCTION
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Development utility: Check if running in development
 */
export function isDev(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Format currency for Botswana Pula
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-BW', {
    style: 'currency',
    currency: 'BWP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format phone number for Botswana
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('267')) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  return phone;
}

/**
 * Validate Botswana phone number
 */
export function isValidBotswanaPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, '');
  const botswanaRegex = /^(7[1-8]|72|74|75|76|77|78|79)\d{6}$/;
  return botswanaRegex.test(cleaned);
}

/**
 * Development utility: Log current user info
 */
export function logUserInfo() {
  if (typeof window !== 'undefined' && (window as any).getCurrentUserInfo) {
    (window as any).getCurrentUserInfo();
  }
}

/**
 * Generate random ID for temporary objects
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}