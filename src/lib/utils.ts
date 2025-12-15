import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  })
}

export function formatRelativeDate(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "agora"
  if (diffMins < 60) return `há ${diffMins} minuto${diffMins > 1 ? "s" : ""}`
  if (diffHours < 24) return `há ${diffHours} hora${diffHours > 1 ? "s" : ""}`
  if (diffDays < 7) return `há ${diffDays} dia${diffDays > 1 ? "s" : ""}`

  return date.toLocaleDateString("pt-BR")
}

export function formatCep(cep: string): string {
  const cleaned = cep.replace(/\D/g, "")
  if (cleaned.length !== 8) return cep
  return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`
}

export function isValidCep(cep: string): boolean {
  const cleaned = cep.replace(/\D/g, "")
  return cleaned.length === 8 && /^\d{8}$/.test(cleaned)
}
