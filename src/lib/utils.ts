import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { currencies } from "./currencies";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCurrency() {
  // Try to get currency from localStorage first
  if (typeof window !== "undefined") {
    const storedCurrency = localStorage.getItem("preferred-currency");
    if (storedCurrency) {
      return storedCurrency;
    }
  }

  // Fallback to USD
  return "USD";
}

export function setPreferredCurrency(currency: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("preferred-currency", currency);
  }
}

export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const weeks = Math.floor(diff / 604800000);
  const months = Math.floor(diff / 2629746000);
  const years = Math.floor(diff / 31556952000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
}
