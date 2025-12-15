import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useDebounce } from "@/hooks/use-debounce"

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("should return initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 500))
    expect(result.current).toBe("initial")
  })

  it("should debounce value changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } }
    )

    expect(result.current).toBe("initial")

    rerender({ value: "changed", delay: 500 })

    expect(result.current).toBe("initial")

    act(() => {
      vi.advanceTimersByTime(250)
    })
    expect(result.current).toBe("initial")

    act(() => {
      vi.advanceTimersByTime(250)
    })
    expect(result.current).toBe("changed")
  })

  it("should reset timer on new value", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } }
    )

    rerender({ value: "first", delay: 500 })
    
    act(() => {
      vi.advanceTimersByTime(400)
    })
    expect(result.current).toBe("initial")

    rerender({ value: "second", delay: 500 })

    act(() => {
      vi.advanceTimersByTime(400)
    })
    expect(result.current).toBe("initial")

    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current).toBe("second")
  })

  it("should handle different delay values", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "test", delay: 1000 } }
    )

    rerender({ value: "changed", delay: 1000 })

    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(result.current).toBe("test")

    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(result.current).toBe("changed")
  })

  it("should work with numeric values", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 0, delay: 300 } }
    )

    expect(result.current).toBe(0)

    rerender({ value: 42, delay: 300 })

    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current).toBe(42)
  })

  it("should work with object values", () => {
    const initial = { name: "test" }
    const changed = { name: "changed" }

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: initial, delay: 300 } }
    )

    expect(result.current).toBe(initial)

    rerender({ value: changed, delay: 300 })

    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current).toBe(changed)
  })
})

