import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Cloud, 
  Droplets, 
  Thermometer, 
  Loader2, 
  Calendar, 
  MapPin, 
  RefreshCw,
  Sun,
  Wind
} from "lucide-react"
import { fetchWeatherData, geocodeLocation } from "@/lib/api/weather"
import type { AddressData } from "@/types/address"
import { cn, formatDate, formatRelativeDate } from "@/lib/utils"

interface WeatherDisplayProps {
  addressData: AddressData
}

export function WeatherDisplay({ addressData }: WeatherDisplayProps) {
  const [forecastDays, setForecastDays] = useState(3)

  const {
    data: weatherData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [
      "weather",
      addressData.latitude,
      addressData.longitude,
      addressData.localidade,
      addressData.uf,
      forecastDays,
    ],
    queryFn: async () => {
      let lat = addressData.latitude
      let lon = addressData.longitude

      if (!lat || !lon) {
        const coords = await geocodeLocation(addressData.localidade)
        lat = coords.latitude
        lon = coords.longitude
      }

      return fetchWeatherData(lat, lon, forecastDays, addressData.localidade)
    },
    staleTime: 10 * 60 * 1000,
  })

  if (isLoading) {
    return (
      <Card className="border-2 border-accent/20 shadow-lg shadow-accent/5">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-accent/20" />
            <Loader2 className="h-12 w-12 animate-spin text-accent" />
          </div>
          <p className="mt-4 text-muted-foreground">Carregando dados climáticos...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-2 border-destructive/20 shadow-lg">
        <CardContent className="py-10">
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <Cloud className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <p className="font-semibold text-destructive">Erro ao carregar dados climáticos</p>
              <p className="text-sm text-muted-foreground mt-1">
                Não foi possível obter a previsão do tempo
              </p>
            </div>
            <Button onClick={() => refetch()} variant="outline" className="mt-2">
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!weatherData) return null

  const getTempColor = (temp: number) => {
    if (temp >= 30) return "text-orange-500"
    if (temp >= 25) return "text-yellow-500"
    if (temp >= 15) return "text-green-500"
    return "text-blue-500"
  }

  return (
    <Card className="overflow-hidden border-2 border-accent/20 shadow-lg shadow-accent/ pt-0">
      <CardHeader className="bg-linear-to-r from-accent/20 via-accent/10 to-transparent py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-2xl">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-accent text-accent-foreground shadow-md">
                <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <span className="hidden xs:inline">Previsão do Tempo</span>
              <span className="xs:hidden">Clima</span>
            </CardTitle>
            <CardDescription className="flex items-center gap-1 sm:gap-1.5 mt-1.5 sm:mt-2 text-sm sm:text-base">
              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {weatherData.location.city}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-8 w-8 sm:h-9 sm:w-9"
          >
            <RefreshCw className={cn("h-3.5 w-3.5 sm:h-4 sm:w-4", isFetching && "animate-spin")} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Dias de previsão</Label>
          <Select 
            value={forecastDays.toString()} 
            onValueChange={(value) => setForecastDays(Number.parseInt(value))}
          >
            <SelectTrigger className="h-11 border-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <SelectItem key={day} value={day.toString()}>
                  {day} {day === 1 ? "dia" : "dias"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-xl border-2 border-border bg-gradient-to-br from-card to-muted/30 p-3 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-5 flex items-center gap-2 text-foreground">
            <Cloud className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
            Clima Atual
          </h3>
          <div className="grid gap-3 sm:gap-6 sm:grid-cols-3">
            <WeatherCard
              icon={<Thermometer className="h-6 w-6" />}
              value={`${weatherData.current.temperature.toFixed(1)}°C`}
              label="Temperatura"
              valueClassName={getTempColor(weatherData.current.temperature)}
              iconBg="bg-orange-500/10"
              iconColor="text-orange-500"
            />
            <WeatherCard
              icon={<Wind className="h-6 w-6" />}
              value={`${weatherData.current.apparentTemperature.toFixed(1)}°C`}
              label="Sensação Térmica"
              valueClassName={getTempColor(weatherData.current.apparentTemperature)}
              iconBg="bg-cyan-500/10"
              iconColor="text-cyan-500"
            />
            <WeatherCard
              icon={<Droplets className="h-6 w-6" />}
              value={`${weatherData.current.humidity}%`}
              label="Umidade"
              valueClassName="text-blue-500"
              iconBg="bg-blue-500/10"
              iconColor="text-blue-500"
            />
          </div>
          <p className="mt-5 text-xs text-muted-foreground flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Atualizado {formatRelativeDate(weatherData.current.time)}
          </p>
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2 text-foreground">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Previsão Diária
          </h3>
          <div className="grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {weatherData.daily.map((day, index) => (
              <div
                key={day.date}
                className="group rounded-lg sm:rounded-xl border-2 border-border bg-gradient-to-br from-muted/50 to-muted/20 p-2.5 sm:p-4 hover:border-primary/30 hover:shadow-md transition-all duration-200"
              >
                <p className="font-semibold text-foreground text-center text-xs sm:text-base">
                  {index === 0 ? "Hoje" : formatDate(day.date)}
                </p>
                <div className="mt-2 sm:mt-4 flex items-center justify-around">
                  <div className="text-center">
                    <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">Mín</p>
                    <p className="text-base sm:text-xl font-bold text-blue-500 mt-0.5 sm:mt-1">
                      {day.temperatureMin.toFixed(0)}°
                    </p>
                  </div>
                  <div className="h-6 sm:h-10 w-px bg-border" />
                  <div className="text-center">
                    <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">Máx</p>
                    <p className="text-base sm:text-xl font-bold text-orange-500 mt-0.5 sm:mt-1">
                      {day.temperatureMax.toFixed(0)}°
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1 xs:gap-0 text-[10px] sm:text-xs text-muted-foreground pt-2 border-t border-border">
          <p className="flex items-center gap-1 sm:gap-1.5">
            <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="hidden xs:inline">Coordenadas:</span> {weatherData.location.latitude.toFixed(4)}, {weatherData.location.longitude.toFixed(4)}
          </p>
          <p>Cache: 10 min</p>
        </div>
      </CardContent>
    </Card>
  )
}

interface WeatherCardProps {
  icon: React.ReactNode
  value: string
  label: string
  valueClassName?: string
  iconBg: string
  iconColor: string
}

function WeatherCard({ icon, value, label, valueClassName, iconBg, iconColor }: WeatherCardProps) {
  return (
    <div className="flex items-center gap-2.5 sm:gap-4">
      <div className={cn("rounded-lg sm:rounded-xl p-2 sm:p-3 [&>svg]:h-4 [&>svg]:w-4 sm:[&>svg]:h-6 sm:[&>svg]:w-6", iconBg, iconColor)}>
        {icon}
      </div>
      <div>
        <p className={cn("text-lg sm:text-2xl font-bold", valueClassName)}>{value}</p>
        <p className="text-xs sm:text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

