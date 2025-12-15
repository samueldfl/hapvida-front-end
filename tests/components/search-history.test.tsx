import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { SearchHistory } from "@/components/search-history"
import type { AddressData } from "@/types/address"

describe("SearchHistory Component", () => {
  const mockAddress: AddressData = {
    cep: "01310-100",
    logradouro: "Avenida Paulista",
    bairro: "Bela Vista",
    localidade: "São Paulo",
    uf: "SP",
    provider: "BrasilAPI",
    timestamp: Date.now(),
  }

  it("should render empty state when no history", () => {
    const mockOnSelectHistory = vi.fn()
    const mockOnClearHistory = vi.fn()

    render(
      <SearchHistory 
        history={[]}
        onSelectHistory={mockOnSelectHistory}
        onClearHistory={mockOnClearHistory}
      />
    )

    expect(screen.getByText("Histórico")).toBeInTheDocument()
    expect(screen.getByText(/nenhuma consulta realizada/i)).toBeInTheDocument()
  })

  it("should render history items", () => {
    const mockOnSelectHistory = vi.fn()
    const mockOnClearHistory = vi.fn()

    render(
      <SearchHistory 
        history={[mockAddress]}
        onSelectHistory={mockOnSelectHistory}
        onClearHistory={mockOnClearHistory}
      />
    )

    expect(screen.getByText("01310-100")).toBeInTheDocument()
    expect(screen.getByText("São Paulo/SP")).toBeInTheDocument()
    expect(screen.getByText("Avenida Paulista")).toBeInTheDocument()
  })

  it("should call onSelectHistory when clicking an item", async () => {
    const user = userEvent.setup()
    const mockOnSelectHistory = vi.fn()
    const mockOnClearHistory = vi.fn()

    render(
      <SearchHistory 
        history={[mockAddress]}
        onSelectHistory={mockOnSelectHistory}
        onClearHistory={mockOnClearHistory}
      />
    )

    const historyItem = screen.getByRole("button", { name: /01310-100/i })
    await user.click(historyItem)

    expect(mockOnSelectHistory).toHaveBeenCalledWith(mockAddress)
  })

  it("should call onClearHistory when clicking clear button", async () => {
    const user = userEvent.setup()
    const mockOnSelectHistory = vi.fn()
    const mockOnClearHistory = vi.fn()

    render(
      <SearchHistory 
        history={[mockAddress]}
        onSelectHistory={mockOnSelectHistory}
        onClearHistory={mockOnClearHistory}
      />
    )

    const clearButton = screen.getByRole("button", { name: /limpar histórico/i })
    await user.click(clearButton)

    const confirmButton = screen.getByRole("button", { name: /^limpar$/i })
    await user.click(confirmButton)

    expect(mockOnClearHistory).toHaveBeenCalled()
  })

  it("should show singular form for one item", () => {
    const mockOnSelectHistory = vi.fn()
    const mockOnClearHistory = vi.fn()

    render(
      <SearchHistory 
        history={[mockAddress]}
        onSelectHistory={mockOnSelectHistory}
        onClearHistory={mockOnClearHistory}
      />
    )

    expect(screen.getByText(/últimas 1 consulta/i)).toBeInTheDocument()
  })
})
