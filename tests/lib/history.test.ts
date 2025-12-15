import { describe, it, expect, beforeEach } from "vitest"
import { getHistory, saveToHistory, clearHistory } from "@/lib/history"
import type { AddressData } from "@/types/address"

describe("History utilities", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("should return empty array when no history", () => {
    expect(getHistory()).toEqual([])
  })

  it("should save address to history", () => {
    const address: AddressData = {
      cep: "01310-100",
      logradouro: "Avenida Paulista",
      bairro: "Bela Vista",
      localidade: "São Paulo",
      uf: "SP",
      provider: "BrasilAPI",
      timestamp: Date.now(),
    }

    saveToHistory(address)
    const history = getHistory()

    expect(history).toHaveLength(1)
    expect(history[0].cep).toBe("01310-100")
  })

  it("should remove duplicates based on CEP", () => {
    const address1: AddressData = {
      cep: "01310-100",
      logradouro: "Avenida Paulista",
      bairro: "Bela Vista",
      localidade: "São Paulo",
      uf: "SP",
      provider: "BrasilAPI",
      timestamp: Date.now(),
    }

    const address2: AddressData = {
      ...address1,
      timestamp: Date.now() + 1000,
    }

    saveToHistory(address1)
    saveToHistory(address2)
    const history = getHistory()

    expect(history).toHaveLength(1)
  })

  it("should limit history to 10 items", () => {
    for (let i = 0; i < 15; i++) {
      const address: AddressData = {
        cep: `0${i}310-100`,
        logradouro: "Test Street",
        bairro: "Test",
        localidade: "Test City",
        uf: "SP",
        provider: "BrasilAPI",
        timestamp: Date.now() + i,
      }
      saveToHistory(address)
    }

    const history = getHistory()
    expect(history).toHaveLength(10)
  })

  it("should clear all history", () => {
    const address: AddressData = {
      cep: "01310-100",
      logradouro: "Avenida Paulista",
      bairro: "Bela Vista",
      localidade: "São Paulo",
      uf: "SP",
      provider: "BrasilAPI",
      timestamp: Date.now(),
    }

    saveToHistory(address)
    clearHistory()
    expect(getHistory()).toEqual([])
  })
})
