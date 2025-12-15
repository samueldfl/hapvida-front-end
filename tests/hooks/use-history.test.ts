import { describe, it, expect, beforeEach, vi } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useHistory } from "@/hooks/use-history"
import type { AddressData } from "@/types/address"

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
})

describe("useHistory", () => {
  const mockAddress: AddressData = {
    cep: "01310-100",
    logradouro: "Avenida Paulista",
    bairro: "Bela Vista",
    localidade: "São Paulo",
    uf: "SP",
    provider: "BrasilAPI",
    timestamp: Date.now(),
  }

  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  it("should return empty history initially", () => {
    const { result } = renderHook(() => useHistory())
    expect(result.current.history).toEqual([])
  })

  it("should load history from localStorage on mount", () => {
    const storedHistory = [mockAddress]
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(storedHistory))

    const { result } = renderHook(() => useHistory())

    expect(result.current.history).toEqual(storedHistory)
  })

  it("should save address to history", () => {
    const { result } = renderHook(() => useHistory())

    act(() => {
      result.current.saveToHistory(mockAddress)
    })

    expect(result.current.history).toHaveLength(1)
    expect(result.current.history[0].cep).toBe("01310-100")
    expect(localStorageMock.setItem).toHaveBeenCalled()
  })

  it("should add new items at the beginning", () => {
    const { result } = renderHook(() => useHistory())

    const address1 = { ...mockAddress, cep: "01310-100" }
    const address2 = { ...mockAddress, cep: "22041-001" }

    act(() => {
      result.current.saveToHistory(address1)
    })

    act(() => {
      result.current.saveToHistory(address2)
    })

    expect(result.current.history[0].cep).toBe("22041-001")
    expect(result.current.history[1].cep).toBe("01310-100")
  })

  it("should remove duplicates based on CEP", () => {
    const { result } = renderHook(() => useHistory())

    const address1 = { ...mockAddress, timestamp: 1000 }
    const address2 = { ...mockAddress, timestamp: 2000 }

    act(() => {
      result.current.saveToHistory(address1)
    })

    act(() => {
      result.current.saveToHistory(address2)
    })

    expect(result.current.history).toHaveLength(1)
    expect(result.current.history[0].timestamp).toBeGreaterThan(address1.timestamp)
  })

  it("should limit history to 10 items", () => {
    const { result } = renderHook(() => useHistory())

    for (let i = 0; i < 15; i++) {
      act(() => {
        result.current.saveToHistory({
          ...mockAddress,
          cep: `0${i}310-100`,
          timestamp: Date.now() + i,
        })
      })
    }

    expect(result.current.history).toHaveLength(10)
  })

  it("should clear all history", () => {
    const { result } = renderHook(() => useHistory())

    act(() => {
      result.current.saveToHistory(mockAddress)
    })

    expect(result.current.history).toHaveLength(1)

    act(() => {
      result.current.clearHistory()
    })

    expect(result.current.history).toEqual([])
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("cep-history")
  })

  it("should remove specific item from history", () => {
    const { result } = renderHook(() => useHistory())

    const address1 = { ...mockAddress, cep: "01310-100" }
    const address2 = { ...mockAddress, cep: "22041-001" }

    act(() => {
      result.current.saveToHistory(address1)
    })

    act(() => {
      result.current.saveToHistory(address2)
    })

    expect(result.current.history).toHaveLength(2)

    act(() => {
      result.current.removeFromHistory("01310-100")
    })

    expect(result.current.history).toHaveLength(1)
    expect(result.current.history[0].cep).toBe("22041-001")
  })

  it("should handle JSON parse errors gracefully", () => {
    localStorageMock.getItem.mockReturnValueOnce("invalid json")

    const { result } = renderHook(() => useHistory())

    expect(result.current.history).toEqual([])
  })

  it("should update timestamp when saving same address", () => {
    const { result } = renderHook(() => useHistory())

    const oldTimestamp = 1000
    const address = { ...mockAddress, timestamp: oldTimestamp }

    act(() => {
      result.current.saveToHistory(address)
    })

    expect(result.current.history[0].timestamp).toBeGreaterThan(oldTimestamp)
  })
})

