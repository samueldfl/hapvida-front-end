import { describe, it, expect, vi, beforeEach } from "vitest"
import { fetchCepData, CepError, getErrorMessage } from "@/lib/api/cep"

describe("CEP API", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should fetch data from BrasilAPI successfully", async () => {
    const mockResponse = {
      cep: "01310100",
      state: "SP",
      city: "São Paulo",
      neighborhood: "Bela Vista",
      street: "Avenida Paulista",
      location: {
        coordinates: {
          latitude: "-23.561414",
          longitude: "-46.656882",
        },
      },
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    })

    const result = await fetchCepData("01310-100")

    expect(result.cep).toBe("01310100")
    expect(result.localidade).toBe("São Paulo")
    expect(result.provider).toBe("BrasilAPI")
    expect(result.latitude).toBe(-23.561414)
  })

  it("should throw CepError for invalid CEP format", async () => {
    try {
      await fetchCepData("123")
      expect.fail("Should have thrown an error")
    } catch (error) {
      expect(error).toBeInstanceOf(CepError)
      expect((error as CepError).type).toBe("INVALID_FORMAT")
      expect((error as CepError).message).toBe("CEP deve conter 8 dígitos")
    }
  })

  it("should clean CEP before making request", async () => {
    const mockResponse = {
      cep: "01310100",
      state: "SP",
      city: "São Paulo",
      neighborhood: "Bela Vista",
      street: "Avenida Paulista",
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    })

    await fetchCepData("01310-100")

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("01310100"),
      expect.anything()
    )
  })
})

describe("getErrorMessage", () => {
  it("should return message from CepError", () => {
    const error = new CepError("Custom message", "NOT_FOUND")
    expect(getErrorMessage(error)).toBe("Custom message")
  })

  it("should return generic message for unknown errors", () => {
    const error = new Error("Unknown error")
    const message = getErrorMessage(error)
    expect(message).toContain("inesperado")
  })
})
