export interface WeatherData {
  current: {
    temperature: number
    apparentTemperature: number
    humidity: number
    time: string
  }
  daily: DailyForecast[]
  location: {
    city: string
    latitude: number
    longitude: number
  }
}

export interface DailyForecast {
  date: string
  temperatureMin: number
  temperatureMax: number
}

export interface OpenMeteoCurrentResponse {
  current: {
    time: string
    temperature_2m: number
    apparent_temperature: number
    relative_humidity_2m: number
  }
  daily: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
  }
}

export interface GeocodingResult {
  name: string
  latitude: number
  longitude: number
  admin1?: string
}
