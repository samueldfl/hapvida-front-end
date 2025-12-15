import type { AddressData, BrasilAPIResponse, ViaCEPResponse } from "@/types/address"

const TIMEOUT_MS = 5000
const MAX_RETRIES = 2

export type CepErrorType = 
  | "INVALID_FORMAT"
  | "NOT_FOUND"
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "SERVER_ERROR"

export class CepError extends Error {
  constructor(
    message: string,
    public type: CepErrorType,
    public originalError?: Error
  ) {
    super(message)
    this.name = "CepError"
  }
}

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === "AbortError") {
      throw new CepError(
        "A requisição demorou muito. Verifique sua conexão e tente novamente.",
        "TIMEOUT",
        error
      )
    }
    throw error
  }
}

async function fetchWithRetry(
  url: string, 
  timeoutMs: number, 
  retries: number = MAX_RETRIES
): Promise<Response> {
  let lastError: Error | null = null
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetchWithTimeout(url, timeoutMs)
    } catch (error) {
      lastError = error as Error
      if (attempt < retries) {
        // Wait before retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500))
      }
    }
  }
  
  throw lastError
}

function normalizeBrasilAPI(data: BrasilAPIResponse): AddressData {
  return {
    cep: data.cep,
    logradouro: data.street || "",
    bairro: data.neighborhood || "",
    localidade: data.city,
    uf: data.state,
    latitude: data.location?.coordinates.latitude 
      ? Number.parseFloat(data.location.coordinates.latitude) 
      : undefined,
    longitude: data.location?.coordinates.longitude
      ? Number.parseFloat(data.location.coordinates.longitude)
      : undefined,
    provider: "BrasilAPI",
    timestamp: Date.now(),
  }
}

function normalizeViaCEP(data: ViaCEPResponse): AddressData {
  return {
    cep: data.cep,
    logradouro: data.logradouro || "",
    complemento: data.complemento,
    bairro: data.bairro || "",
    localidade: data.localidade,
    uf: data.uf,
    ibge: data.ibge,
    provider: "ViaCEP",
    timestamp: Date.now(),
  }
}

async function fetchBrasilAPI(cep: string): Promise<AddressData> {
  const response = await fetchWithRetry(
    `https://brasilapi.com.br/api/cep/v2/${cep}`, 
    TIMEOUT_MS
  )

  if (response.status === 404) {
    throw new CepError("CEP não encontrado", "NOT_FOUND")
  }

  if (!response.ok) {
    throw new CepError("Erro no servidor da BrasilAPI", "SERVER_ERROR")
  }

  const data: BrasilAPIResponse = await response.json()
  return normalizeBrasilAPI(data)
}

async function fetchViaCEP(cep: string): Promise<AddressData> {
  const response = await fetchWithRetry(
    `https://viacep.com.br/ws/${cep}/json/`, 
    TIMEOUT_MS
  )

  if (!response.ok) {
    throw new CepError("Erro no servidor do ViaCEP", "SERVER_ERROR")
  }

  const data: ViaCEPResponse = await response.json()

  if ("erro" in data) {
    throw new CepError("CEP não encontrado", "NOT_FOUND")
  }

  return normalizeViaCEP(data)
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof CepError) {
    return error.message
  }
  
  if (error instanceof Error) {
    if (error.message.includes("fetch") || error.message.includes("network")) {
      return "Erro de conexão. Verifique sua internet e tente novamente."
    }
  }
  
  return "Ocorreu um erro inesperado. Tente novamente mais tarde."
}

export async function fetchCepData(cep: string): Promise<AddressData> {
  const cleanCep = cep.replace(/\D/g, "")

  if (cleanCep.length !== 8) {
    throw new CepError("CEP deve conter 8 dígitos", "INVALID_FORMAT")
  }

  if (!/^\d{8}$/.test(cleanCep)) {
    throw new CepError("CEP deve conter apenas números", "INVALID_FORMAT")
  }

  try {
    return await fetchBrasilAPI(cleanCep)
  } catch (brasilApiError) {
    console.log("BrasilAPI falhou, tentando ViaCEP...", brasilApiError)

    try {
      return await fetchViaCEP(cleanCep)
    } catch (viaCepError) {
      console.error("ViaCEP também falhou:", viaCepError)
      
      // If both failed with NOT_FOUND, the CEP doesn't exist
      if (
        brasilApiError instanceof CepError && 
        brasilApiError.type === "NOT_FOUND"
      ) {
        throw brasilApiError
      }
      
      if (
        viaCepError instanceof CepError && 
        viaCepError.type === "NOT_FOUND"
      ) {
        throw viaCepError
      }

      // Check for timeout errors
      if (
        brasilApiError instanceof CepError && 
        brasilApiError.type === "TIMEOUT"
      ) {
        throw brasilApiError
      }
      
      throw new CepError(
        "Não foi possível consultar o CEP. Tente novamente mais tarde.",
        "NETWORK_ERROR"
      )
    }
  }
}
