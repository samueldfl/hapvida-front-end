import { describe, it, expect } from "vitest"
import { cn, formatCep, isValidCep, formatDate, formatRelativeDate } from "@/lib/utils"

describe("utils", () => {
  describe("cn", () => {
    it("should merge class names correctly", () => {
      expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4")
    })

    it("should handle conditional classes", () => {
      expect(cn("base", false && "hidden", "visible")).toBe("base visible")
    })
  })

  describe("formatCep", () => {
    it("should format valid CEP", () => {
      expect(formatCep("01310100")).toBe("01310-100")
    })

    it("should handle CEP with hyphens", () => {
      expect(formatCep("01310-100")).toBe("01310-100")
    })

    it("should return original for invalid length", () => {
      expect(formatCep("123")).toBe("123")
    })
  })

  describe("isValidCep", () => {
    it("should validate correct CEP", () => {
      expect(isValidCep("01310100")).toBe(true)
      expect(isValidCep("01310-100")).toBe(true)
    })

    it("should reject invalid CEP", () => {
      expect(isValidCep("123")).toBe(false)
      expect(isValidCep("abcd1234")).toBe(false)
      expect(isValidCep("")).toBe(false)
    })
  })

  describe("formatDate", () => {
    it("should format date correctly", () => {
      const date = new Date("2024-01-15T12:00:00Z")
      const result = formatDate(date.toISOString().split("T")[0])
      expect(typeof result).toBe("string")
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe("formatRelativeDate", () => {
    it("should show 'agora' for recent dates", () => {
      const now = new Date().toISOString()
      expect(formatRelativeDate(now)).toBe("agora")
    })

    it("should show minutes ago", () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
      expect(formatRelativeDate(fiveMinutesAgo)).toBe("há 5 minutos")
    })

    it("should show hours ago", () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      expect(formatRelativeDate(twoHoursAgo)).toBe("há 2 horas")
    })
  })
})
