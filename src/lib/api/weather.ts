import type { WeatherData, OpenMeteoCurrentResponse, GeocodingResult } from "@/types/weather"

const TIMEOUT_MS = 5000

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

export async function geocodeLocation(city: string): Promise<{ latitude: number; longitude: number }> {
  const query = `${city}`
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    query,
  )}&countryCode=BR&count=1&language=pt&format=json`

  const response = await fetchWithTimeout(url, TIMEOUT_MS)

  if (!response.ok) {
    throw new Error("Geocoding request failed")
  }

  const data: { results?: GeocodingResult[] } = await response.json()

  if (!data.results || data.results.length === 0) {
    throw new Error("Localização não encontrada")
  }

  const result = data.results[0]
  return {
    latitude: result.latitude,
    longitude: result.longitude,
  }
}

export async function fetchWeatherData(
  latitude: number,
  longitude: number,
  days: number,
  city: string,
): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min&forecast_days=${days}&timezone=America/Sao_Paulo`

  const response = await fetchWithTimeout(url, TIMEOUT_MS)

  if (!response.ok) {
    throw new Error("Weather API request failed")
  }

  const data: OpenMeteoCurrentResponse = await response.json()

  const dailyForecasts = data.daily.time.map((date, index) => ({
    date,
    temperatureMin: data.daily.temperature_2m_min[index],
    temperatureMax: data.daily.temperature_2m_max[index],
  }))

  return {
    current: {
      temperature: data.current.temperature_2m,
      apparentTemperature: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      time: data.current.time,
    },
    daily: dailyForecasts,
    location: {
      city,
      latitude,
      longitude,
    },
  }
}
