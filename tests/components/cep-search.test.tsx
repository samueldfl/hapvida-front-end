import type React from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { CepSearch } from "@/components/cep-search"

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe("CepSearch Component", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should render search form", () => {
    const mockOnAddressFound = vi.fn()
    const mockOnSaveHistory = vi.fn()
    
    render(
      <CepSearch 
        onAddressFound={mockOnAddressFound} 
        onSaveHistory={mockOnSaveHistory}
      />, 
      { wrapper: createWrapper() }
    )

    expect(screen.getByText("Consultar CEP")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("00000-000")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /buscar cep/i })).toBeInTheDocument()
  })

  it("should format CEP input with hyphen", async () => {
    const user = userEvent.setup()
    const mockOnAddressFound = vi.fn()
    const mockOnSaveHistory = vi.fn()
    
    render(
      <CepSearch 
        onAddressFound={mockOnAddressFound} 
        onSaveHistory={mockOnSaveHistory}
      />, 
      { wrapper: createWrapper() }
    )

    const input = screen.getByPlaceholderText("00000-000")
    await user.type(input, "01310100")

    expect(input).toHaveValue("01310-100")
  })

  it("should show validation error for invalid CEP", async () => {
    const user = userEvent.setup()
    const mockOnAddressFound = vi.fn()
    const mockOnSaveHistory = vi.fn()
    
    render(
      <CepSearch 
        onAddressFound={mockOnAddressFound} 
        onSaveHistory={mockOnSaveHistory}
      />, 
      { wrapper: createWrapper() }
    )

    const input = screen.getByPlaceholderText("00000-000")
    const button = screen.getByRole("button", { name: /buscar cep/i })

    await user.type(input, "123")
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText(/cep deve ter 8 dígitos/i)).toBeInTheDocument()
    })
  })

  it("should disable button while loading", async () => {
    const user = userEvent.setup()
    const mockOnAddressFound = vi.fn()
    const mockOnSaveHistory = vi.fn()

    global.fetch = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => ({
                  cep: "01310100",
                  state: "SP",
                  city: "São Paulo",
                  neighborhood: "Bela Vista",
                  street: "Avenida Paulista",
                }),
              }),
            100
          )
        )
    )

    render(
      <CepSearch 
        onAddressFound={mockOnAddressFound} 
        onSaveHistory={mockOnSaveHistory}
      />, 
      { wrapper: createWrapper() }
    )

    const input = screen.getByPlaceholderText("00000-000")
    const button = screen.getByRole("button", { name: /buscar cep/i })

    await user.type(input, "01310100")
    await user.click(button)

    expect(button).toBeDisabled()
    expect(screen.getByText(/consultando/i)).toBeInTheDocument()
  })

  it("should show success result after fetch", async () => {
    const user = userEvent.setup()
    const mockOnAddressFound = vi.fn()
    const mockOnSaveHistory = vi.fn()

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        cep: "01310100",
        state: "SP",
        city: "São Paulo",
        neighborhood: "Bela Vista",
        street: "Avenida Paulista",
      }),
    })

    render(
      <CepSearch 
        onAddressFound={mockOnAddressFound} 
        onSaveHistory={mockOnSaveHistory}
      />, 
      { wrapper: createWrapper() }
    )

    const input = screen.getByPlaceholderText("00000-000")
    const button = screen.getByRole("button", { name: /buscar cep/i })

    await user.type(input, "01310100")
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText(/provedor: brasilapi/i)).toBeInTheDocument()
    })

    expect(mockOnAddressFound).toHaveBeenCalled()
    expect(mockOnSaveHistory).toHaveBeenCalled()
  })
})
