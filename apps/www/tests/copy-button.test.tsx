import { afterEach, expect, it, vi } from "vitest"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { CopyButton } from "@/components/jan-ui/copy-button"

function clipboard(writeText = vi.fn().mockResolvedValue(undefined)) {
  vi.stubGlobal("navigator", { clipboard: { writeText } })
  return writeText
}

afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals() })

it("copies an empty string when text is omitted", async () => {
  const write = clipboard()
  render(<CopyButton />)
  await act(async () => { fireEvent.click(screen.getByRole("button")) })
  expect(write).toHaveBeenCalledWith("")
  expect(screen.getByRole("button", { name: "已复制" })).toBeTruthy()
})

it("copies exact text and restarts the feedback timer on another copy", async () => {
  vi.useFakeTimers()
  const write = clipboard()
  render(<CopyButton text={"hello\n世界"} />)
  await act(async () => { fireEvent.click(screen.getByRole("button")) })
  expect(write).toHaveBeenCalledWith("hello\n世界")
  expect(screen.getByRole("button", { name: "已复制" })).toBeTruthy()
  act(() => vi.advanceTimersByTime(1500))
  await act(async () => { fireEvent.click(screen.getByRole("button")) })
  act(() => vi.advanceTimersByTime(500))
  expect(screen.getByRole("button", { name: "已复制" })).toBeTruthy()
  act(() => vi.advanceTimersByTime(1500))
  expect(screen.getByRole("button", { name: "复制" })).toBeTruthy()
})

it("blocks duplicate writes while pending", async () => {
  let resolve!: () => void
  const write = clipboard(vi.fn(() => new Promise<void>(done => { resolve = done })))
  render(<CopyButton text="content" />)
  fireEvent.click(screen.getByRole("button"))
  fireEvent.click(screen.getByRole("button"))
  expect(write).toHaveBeenCalledTimes(1)
  expect(screen.getByRole("button").getAttribute("aria-busy")).toBe("true")
  await act(async () => resolve())
  expect(screen.getByRole("button", { name: "已复制" })).toBeTruthy()
})

it("shows loading only after 300ms while blocking clicks immediately", async () => {
  vi.useFakeTimers()
  let resolve!: () => void
  const write = clipboard(vi.fn(() => new Promise<void>(done => { resolve = done })))
  render(<CopyButton text="content" iconOnly={false} />)
  const button = screen.getByRole("button") as HTMLButtonElement
  fireEvent.click(button)
  expect(button.disabled).toBe(true)
  expect(button.getAttribute("aria-busy")).toBe("true")
  act(() => vi.advanceTimersByTime(299))
  expect(screen.getByRole("status").textContent).toBe("复制")
  expect(button.querySelector(".animate-spin")).toBeNull()
  fireEvent.click(button)
  expect(write).toHaveBeenCalledTimes(1)
  act(() => vi.advanceTimersByTime(1))
  expect(screen.getByRole("status").textContent).toBe("正在复制")
  expect(button.querySelector(".animate-spin")).not.toBeNull()
  await act(async () => resolve())
  expect(screen.getByRole("status").textContent).toBe("已复制")
  expect(button.disabled).toBe(false)
})

it.each(["success", "error"])("cancels delayed loading after a fast %s", async (result) => {
  vi.useFakeTimers()
  let finish!: () => void
  clipboard(vi.fn(() => new Promise<void>((resolve, reject) => {
    finish = () => result === "success" ? resolve() : reject(new Error("denied"))
  })))
  render(<CopyButton text="content" />)
  fireEvent.click(screen.getByRole("button"))
  act(() => vi.advanceTimersByTime(100))
  expect(screen.getByRole("status").textContent).toBe("复制")
  await act(async () => finish())
  expect(vi.getTimerCount()).toBe(1)
  act(() => vi.advanceTimersByTime(300))
  expect(screen.getByRole("status").textContent).toBe(result === "success" ? "已复制" : "复制失败，请重试")
  expect(screen.getByRole("button").querySelector(".animate-spin")).toBeNull()
})

it("reports rejection and allows retry", async () => {
  const error = new Error("denied")
  const write = clipboard(vi.fn().mockRejectedValueOnce(error).mockResolvedValue(undefined))
  render(<CopyButton text="" />)
  await act(async () => { fireEvent.click(screen.getByRole("button")) })
  expect(screen.getByRole("button", { name: "复制失败，请重试" })).toBeTruthy()
  await act(async () => { fireEvent.click(screen.getByRole("button")) })
  expect(write).toHaveBeenLastCalledWith("")
  expect(screen.getByRole("button", { name: "已复制" })).toBeTruthy()
})

it("handles missing clipboard support", async () => {
  vi.stubGlobal("navigator", {})
  render(<CopyButton text="content" />)
  await act(async () => { fireEvent.click(screen.getByRole("button")) })
  expect(screen.getByRole("status").textContent).toBe("复制失败，请重试")
})

it("respects disabled, cancelled clicks, and accessible icon labels", () => {
  const write = clipboard()
  const { rerender } = render(<CopyButton text="content" disabled iconOnly label="复制邮箱" />)
  fireEvent.click(screen.getByRole("button", { name: "复制邮箱" }))
  expect(write).not.toHaveBeenCalled()
  rerender(<CopyButton text="content" onClick={event => event.preventDefault()} />)
  fireEvent.click(screen.getByRole("button"))
  expect(write).not.toHaveBeenCalled()
  expect(screen.getByRole("button").getAttribute("type")).toBe("button")
})

it("ignores a pending result after unmount", async () => {
  vi.useFakeTimers()
  let resolve!: () => void
  clipboard(vi.fn(() => new Promise<void>(done => { resolve = done })))
  const { unmount } = render(<CopyButton text="content" />)
  fireEvent.click(screen.getByRole("button"))
  unmount()
  expect(vi.getTimerCount()).toBe(0)
  await act(async () => resolve())
  expect(vi.getTimerCount()).toBe(0)
})
