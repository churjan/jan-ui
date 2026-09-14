"use client"

import { useEffect, useRef, useState, type ComponentProps } from "react"
import { Check, Clipboard, LoaderCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

export type CopyButtonProps = Omit<ComponentProps<"button">, "children" | "onCopy" | "onError"> & {
  text?: string
  iconOnly?: boolean
  label?: string
  copiedLabel?: string
}

export function CopyButton({
  text = "",
  iconOnly = true,
  label = "复制",
  copiedLabel = "已复制",
  onClick,
  disabled,
  className,
  type = "button",
  title,
  "aria-label": ariaLabel,
  ...props
}: CopyButtonProps) {
  const [state, setState] = useState<"idle" | "pending" | "copied" | "error">("idle")
  const [showPending, setShowPending] = useState(false)
  const pending = useRef(false)
  const mounted = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      if (timer.current !== null) clearTimeout(timer.current)
      if (pendingTimer.current !== null) clearTimeout(pendingTimer.current)
    }
  }, [])

  const visiblePending = state === "pending" && showPending
  const currentLabel = state === "copied" ? copiedLabel : state === "error" ? "复制失败，请重试" : visiblePending ? "正在复制" : label
  const Icon = state === "copied" ? Check : state === "error" ? X : visiblePending ? LoaderCircle : Clipboard

  return (
    <button
      {...props}
      type={type}
      disabled={disabled || state === "pending"}
      aria-label={ariaLabel ?? currentLabel}
      aria-busy={state === "pending"}
      title={title ?? currentLabel}
      data-state={state}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-xs transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none",
        iconOnly ? "size-9" : "min-h-9 border border-border px-3 py-2",
        "data-[state=error]:text-destructive",
        className,
      )}
      onClick={async (event) => {
        onClick?.(event)
        if (event.defaultPrevented || disabled || pending.current) return
        pending.current = true
        if (timer.current !== null) clearTimeout(timer.current)
        setState("pending")
        setShowPending(false)
        pendingTimer.current = setTimeout(() => setShowPending(true), 300)
        let result: "copied" | "error" = "copied"
        try {
          if (!navigator.clipboard?.writeText) throw new Error("Clipboard API is unavailable")
          await navigator.clipboard.writeText(text)
        } catch {
          result = "error"
        }
        pending.current = false
        if (pendingTimer.current !== null) clearTimeout(pendingTimer.current)
        pendingTimer.current = null
        if (!mounted.current) return
        setShowPending(false)
        setState(result)
        timer.current = setTimeout(() => setState("idle"), 2000)
      }}
    >
      <Icon aria-hidden="true" size={14} className={cn("shrink-0", visiblePending && "animate-spin motion-reduce:animate-none")} />
      <span className={iconOnly ? "sr-only" : undefined} role="status" aria-live="polite" aria-atomic="true">{currentLabel}</span>
    </button>
  )
}
