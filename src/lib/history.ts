import type { AddressData } from "@/types/address"

const HISTORY_KEY = "cep-history"
const MAX_HISTORY_ITEMS = 10

export function getHistory(): AddressData[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(HISTORY_KEY)
    if (!stored) return []
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function saveToHistory(address: AddressData): void {
  if (typeof window === "undefined") return

  try {
    const history = getHistory()

    // Remove duplicates based on CEP
    const filtered = history.filter((item) => item.cep !== address.cep)

    // Add new item at the beginning
    const updated = [address, ...filtered].slice(0, MAX_HISTORY_ITEMS)

    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error("Failed to save to history:", error)
  }
}

export function clearHistory(): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(HISTORY_KEY)
  } catch (error) {
    console.error("Failed to clear history:", error)
  }
}
