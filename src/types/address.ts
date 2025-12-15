export interface AddressData {
  cep: string
  logradouro: string
  complemento?: string
  bairro: string
  localidade: string
  uf: string
  ibge?: string
  latitude?: number
  longitude?: number
  provider: "BrasilAPI" | "ViaCEP"
  timestamp: number
}

export interface BrasilAPIResponse {
  cep: string
  state: string
  city: string
  neighborhood: string
  street: string
  service?: string
  location?: {
    coordinates: {
      latitude: string
      longitude: string
    }
  }
}

export interface ViaCEPResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  gia?: string
  ddd?: string
  siafi?: string
}
