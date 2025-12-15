import { describe, it, expect, vi, beforeEach } from "vitest"
import { fetchWeatherData, geocodeLocation } from "@/lib/api/weather"

describe("Weather API", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should geocode location successfully", async () => {
    const mockResponse = {
      results: [
        {
          name: "São Paulo",
          latitude: -23.5505,
          longitude: -46.6333,
          admin1: "São Paulo",
        },
      ],
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    })

    const result = await geocodeLocation("São Paulo", "SP")

    expect(result.latitude).toBe(-23.5505)
    expect(result.longitude).toBe(-46.6333)
  })

  it("should fetch weather data successfully", async () => {
    const mockResponse = {
      current: {
        time: "2024-01-15T12:00",
        temperature_2m: 25.5,
        apparent_temperature: 27.0,
        relative_humidity_2m: 65,
      },
      daily: {
        time: ["2024-01-15", "2024-01-16", "2024-01-17"],
        temperature_2m_max: [30, 32, 31],
        temperature_2m_min: [20, 21, 19],
      },
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    })

    const result = await fetchWeatherData(-23.5505, -46.6333, 3, "São Paulo", "SP")

    expect(result.current.temperature).toBe(25.5)
    expect(result.daily).toHaveLength(3)
    expect(result.location.city).toBe("São Paulo")
  })

  it("should throw error when geocoding fails", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    })

    await expect(geocodeLocation("InvalidCity", "XX")).rejects.toThrow("Localização não encontrada")
  })
})
