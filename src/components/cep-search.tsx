import type React from "react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, MapPin, AlertCircle, RefreshCw, CheckCircle2 } from "lucide-react"
import { fetchCepData, getErrorMessage, CepError } from "@/lib/api/cep"
import type { AddressData } from "@/types/address"
import { useToast } from "@/hooks/use-toast"
import { useDebounce } from "@/hooks/use-debounce"
import { isValidCep } from "@/lib/utils"

const cepSchema = z.object({
  cep: z
    .string()
    .min(8, "CEP deve ter 8 dígitos")
    .max(9, "CEP inválido")
    .regex(/^\d{5}-?\d{3}$/, "CEP deve estar no formato XXXXX-XXX ou XXXXXXXX"),
})

type CepFormData = z.infer<typeof cepSchema>

interface CepSearchProps {
  onAddressFound: (address: AddressData) => void
  onSaveHistory: (address: AddressData) => void
  selectedAddress?: AddressData | null
}

export function CepSearch({ onAddressFound, onSaveHistory, selectedAddress }: CepSearchProps) {
  const [addressResult, setAddressResult] = useState<AddressData | null>(null)
  const [inputValue, setInputValue] = useState("")
  const debouncedCep = useDebounce(inputValue, 300)
  const { toast } = useToast()

  useEffect(() => {
    if (selectedAddress) {
      setAddressResult(selectedAddress)
      setInputValue(selectedAddress.cep)
      setValue("cep", selectedAddress.cep)
    }
  }, [selectedAddress])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    reset,
  } = useForm<CepFormData>({
    resolver: zodResolver(cepSchema),
    mode: "onChange",
  })

  useEffect(() => {
    if (debouncedCep.length >= 8) {
      trigger("cep")
    }
  }, [debouncedCep, trigger])

  const mutation = useMutation({
    mutationFn: fetchCepData,
    onSuccess: (data) => {
      setAddressResult(data)
      onAddressFound(data)
      onSaveHistory(data)
      toast({
        title: "CEP encontrado!",
        description: `Endereço consultado via ${data.provider}`,
      })
    },
    onError: (error: Error) => {
      const message = getErrorMessage(error)
      const isNotFound = error instanceof CepError && error.type === "NOT_FOUND"
      
      toast({
        title: isNotFound ? "CEP não encontrado" : "Erro na consulta",
        description: message,
        variant: "destructive",
      })
    },
  })

  const onSubmit = (data: CepFormData) => {
    mutation.mutate(data.cep)
  }

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length > 8) value = value.slice(0, 8)
    if (value.length > 5) {
      value = `${value.slice(0, 5)}-${value.slice(5)}`
    }
    setInputValue(value)
    setValue("cep", value)
  }

  const handleNewSearch = () => {
    setAddressResult(null)
    setInputValue("")
    reset()
  }

  const handleRetry = () => {
    if (inputValue && isValidCep(inputValue)) {
      mutation.mutate(inputValue)
    }
  }

  return (
    <Card className="overflow-hidden border-2 border-primary/20 shadow-lg shadow-primary/5 pt-0">
      <CardHeader className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent py-3 sm:py-4">
        <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-2xl">
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-primary text-primary-foreground shadow-md">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          Consultar CEP
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Digite o CEP para buscar informações do endereço
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cep" className="text-sm font-medium">
              CEP
            </Label>
            <div className="relative">
              <Input
                id="cep"
                placeholder="00000-000"
                {...register("cep")}
                value={inputValue}
                onChange={handleCepChange}
                maxLength={9}
                disabled={mutation.isPending}
                className="h-10 sm:h-12 text-base sm:text-lg tracking-wider font-mono pr-10 border-2 transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
              {inputValue.length === 9 && !errors.cep && (
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
              )}
            </div>
            {errors.cep && (
              <p className="flex items-center gap-1.5 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {errors.cep.message}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={mutation.isPending || !inputValue}
              className="flex-1 h-10 sm:h-12 text-sm sm:text-base font-semibold shadow-md hover:shadow-lg transition-all"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  <span className="hidden xs:inline">Consultando...</span>
                  <span className="xs:hidden">Buscando...</span>
                </>
              ) : (
                <>
                  <MapPin className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden xs:inline">Buscar CEP</span>
                  <span className="xs:hidden">Buscar</span>
                </>
              )}
            </Button>
            
            {addressResult && (
              <Button
                type="button"
                variant="outline"
                onClick={handleNewSearch}
                className="h-10 sm:h-12 px-3 sm:px-4"
              >
                <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            )}
          </div>
        </form>

        {mutation.isError && !mutation.isPending && (
          <div className="mt-6 rounded-xl border-2 border-destructive/20 bg-destructive/5 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-destructive">
                  {mutation.error instanceof CepError && mutation.error.type === "NOT_FOUND"
                    ? "CEP não encontrado"
                    : "Erro na consulta"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {getErrorMessage(mutation.error)}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  className="mt-3"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Tentar novamente
                </Button>
              </div>
            </div>
          </div>
        )}

        {addressResult && (
          <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </div>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                Provedor: {addressResult.provider}
              </span>
            </div>

            <div className="rounded-xl border-2 border-border bg-gradient-to-br from-muted/50 to-muted/30 p-3 sm:p-5">
              <div className="grid gap-4">
                <AddressRow label="CEP" value={addressResult.cep} />
                <AddressRow label="Logradouro" value={addressResult.logradouro || "-"} />
                {addressResult.complemento && (
                  <AddressRow label="Complemento" value={addressResult.complemento} />
                )}
                <AddressRow label="Bairro" value={addressResult.bairro || "-"} />
                <AddressRow label="Cidade" value={addressResult.localidade} />
                <AddressRow label="UF" value={addressResult.uf} />
                {addressResult.ibge && (
                  <AddressRow label="Código IBGE" value={addressResult.ibge} />
                )}
                {addressResult.latitude && addressResult.longitude && (
                  <AddressRow
                    label="Coordenadas"
                    value={`${addressResult.latitude.toFixed(6)}, ${addressResult.longitude.toFixed(6)}`}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function AddressRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[90px_1fr] sm:grid-cols-[120px_1fr] gap-2 sm:gap-3 text-xs sm:text-sm">
      <span className="font-semibold text-foreground">{label}:</span>
      <span className="text-muted-foreground break-words">{value}</span>
    </div>
  )
}

