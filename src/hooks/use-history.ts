import { useState, useCallback, useEffect } from "react"
import type { AddressData } from "@/types/address"

const HISTORY_KEY = "cep-history"
const MAX_HISTORY_ITEMS = 10

export function useHistory() {
  const [history, setHistory] = useState<AddressData[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY)
      if (stored) {
        setHistory(JSON.parse(stored))
      }
    } catch {
      setHistory([])
    }
  }, [])

  const saveToHistory = useCallback((address: AddressData) => {
    try {
      const newAddress = { ...address, timestamp: Date.now() }
      
      setHistory((prev) => {
        const filtered = prev.filter((item) => item.cep !== address.cep)
        const updated = [newAddress, ...filtered].slice(0, MAX_HISTORY_ITEMS)
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
        return updated
      })
    } catch (error) {
      console.error("Failed to save to history:", error)
    }
  }, [])

  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem(HISTORY_KEY)
      setHistory([])
    } catch (error) {
      console.error("Failed to clear history:", error)
    }
  }, [])

  const removeFromHistory = useCallback((cep: string) => {
    try {
      setHistory((prev) => {
        const filtered = prev.filter((item) => item.cep !== cep)
        localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered))
        return filtered
      })
    } catch (error) {
      console.error("Failed to remove from history:", error)
    }
  }, [])

  return {
    history,
    saveToHistory,
    clearHistory,
    removeFromHistory,
  }
}

