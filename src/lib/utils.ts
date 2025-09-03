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
