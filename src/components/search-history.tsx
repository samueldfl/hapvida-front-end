import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { History, Trash2, MapPin, Clock, ExternalLink } from "lucide-react"
import type { AddressData } from "@/types/address"
import { formatRelativeDate } from "@/lib/utils"

interface SearchHistoryProps {
  history: AddressData[]
  onSelectHistory: (address: AddressData) => void
  onClearHistory: () => void
}

export function SearchHistory({ history, onSelectHistory, onClearHistory }: SearchHistoryProps) {
  const noHistory = history.length === 0
  
  if (noHistory) {
    return (
      <Card className="border-2 border-dashed border-muted-foreground/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-xl">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-muted">
              <History className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
            </div>
            Histórico
          </CardTitle>
          <CardDescription>Suas últimas consultas aparecerão aqui</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-4 mb-3">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Nenhuma consulta realizada ainda
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Suas buscas serão salvas automaticamente
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-primary/10 shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-xl">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-primary/10">
                <History className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
              </div>
              Histórico
            </CardTitle>
            <CardDescription className="mt-1">
              Últimas {history.length} {history.length === 1 ? "consulta" : "consultas"}
            </CardDescription>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                title="Limpar histórico"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Limpar histórico</span>
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Limpar histórico?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação irá remover todas as {history.length} {history.length === 1 ? "consulta" : "consultas"} do histórico. Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onClearHistory}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Limpar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          {history.map((item, index) => (
            <button
              key={`${item.cep}-${item.timestamp}`}
              onClick={() => onSelectHistory(item)}
              className="group w-full text-left rounded-lg sm:rounded-xl border-2 border-transparent bg-muted/50 p-3 sm:p-4 hover:border-accent transition-all duration-200"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                  <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <p className="font-semibold text-xs sm:text-sm text-foreground truncate">
                      {item.cep}
                    </p>

                    <span className="text-muted-foreground hidden xs:inline">•</span>

                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {item.localidade}/{item.uf}
                    </p>
                  </div>

                  {item.logradouro && (
                    <p className="text-[10px] sm:text-xs text-muted-foreground truncate mt-0.5">
                      {item.logradouro}
                    </p>
                  )}

                  <div className="flex items-center gap-1 sm:gap-1.5 mt-1.5 sm:mt-2">
                    <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-muted-foreground" />

                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      {formatRelativeDate(new Date(item.timestamp).toISOString())}
                    </p>
                  </div>
                </div>

                <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1 shrink-0" />
              </div>
            </button>
          ))}
        </div>
        
        <p className="text-xs text-center text-muted-foreground mt-4 pt-3 border-t border-border">
          Clique para recarregar os dados
        </p>
      </CardContent>
    </Card>
  )
}

