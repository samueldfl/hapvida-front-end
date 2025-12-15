import { useState } from "react"
import { CepSearch } from "@/components/cep-search"
import { WeatherDisplay } from "@/components/weather-display"
import { SearchHistory } from "@/components/search-history"
import { useHistory } from "@/hooks/use-history"
import type { AddressData } from "@/types/address"
import { MapPin, Cloud, Github } from "lucide-react"

export function HomePage() {
  const [addressData, setAddressData] = useState<AddressData | null>(null)
  const { history, saveToHistory, clearHistory } = useHistory()

  const handleSelectHistory = (address: AddressData) => {
    const updatedAddress = { ...address, timestamp: Date.now() }
    setAddressData(updatedAddress)
    saveToHistory(updatedAddress)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        
        <div className="relative container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25">
                  <MapPin className="h-4 w-4 sm:h-6 sm:w-6" />
                </div>
                <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-accent to-accent/80 text-accent-foreground shadow-lg shadow-accent/25">
                  <Cloud className="h-4 w-4 sm:h-6 sm:w-6" />
                </div>
              </div>
              <h1 className="text-xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Consulta CEP & Clima
              </h1>
              <p className="text-muted-foreground mt-1.5 sm:mt-2 text-sm sm:text-lg">
                Busque informações de endereço e previsão do tempo em tempo real
              </p>
            </div>
            
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-primary/10 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium text-primary">
                BrasilAPI
              </span>
              <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-accent/40 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium text-accent-foreground">
                ViaCEP
              </span>
              <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-muted px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium text-muted-foreground">
                Open-Meteo
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-10">
        <div className="grid gap-8 lg:grid-cols-3 xl:gap-10">
          <div className="lg:col-span-2 space-y-8">
            <CepSearch 
              onAddressFound={setAddressData} 
              onSaveHistory={saveToHistory}
              selectedAddress={addressData}
            />
            
            {addressData && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <WeatherDisplay addressData={addressData} />
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8">
              <SearchHistory 
                history={history}
                onSelectHistory={handleSelectHistory}
                onClearHistory={clearHistory}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-border bg-muted/30">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
              <span>Feito com</span>
              <div className="flex flex-wrap gap-1 sm:gap-1.5">
                <span className="rounded-md bg-background px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium border border-border">
                  React
                </span>
                <span className="rounded-md bg-background px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium border border-border">
                  Vite
                </span>
                <span className="rounded-md bg-background px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium border border-border">
                  TanStack
                </span>
              </div>
            </div>
            <a
              href="https://github.com/samueldfl/hapvida-front-end"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

