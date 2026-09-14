"use client"

import { useId, useState, type ReactNode } from "react"
import { RotateCcw, SlidersHorizontal } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "fumadocs-ui/components/ui/tabs"
import { CopyButton } from "@/components/jan-ui/copy-button"

export function ComponentPreviewClient({ children, code, exampleSource, settings, onReset }: { children: ReactNode; code: ReactNode; exampleSource: string; settings?: ReactNode; onReset?: () => void }) {
  const [view, setView] = useState("preview")
  const [settingsOpen, setSettingsOpen] = useState(false)
  const settingsId = useId()

  return <Tabs value={view} onValueChange={setView} className="not-prose my-6 overflow-hidden rounded-xl border border-border">
    <div className="flex items-center justify-between border-b border-border px-4 py-3">
      <TabsList aria-label="组件示例" className="flex gap-2">
        <TabsTrigger value="preview" className="rounded-md px-3 py-1.5 text-sm data-[state=active]:bg-muted">预览</TabsTrigger>
        <TabsTrigger value="code" className="rounded-md px-3 py-1.5 text-sm data-[state=active]:bg-muted">代码</TabsTrigger>
      </TabsList>
      {view === "code" && <CopyButton text={exampleSource} label="复制示例代码" />}
      {settings && view === "preview" && <div className="flex gap-1">
        <button type="button" aria-label="重置预览" title="重置预览" className="inline-flex size-9 items-center justify-center rounded-md hover:bg-muted" onClick={onReset}><RotateCcw size={15} aria-hidden="true" /></button>
        <button type="button" aria-label="调整参数" title="调整参数" aria-expanded={settingsOpen} aria-controls={settingsId} className="inline-flex size-9 items-center justify-center rounded-md hover:bg-muted aria-expanded:bg-muted" onClick={() => setSettingsOpen(open => !open)}><SlidersHorizontal size={15} aria-hidden="true" /></button>
      </div>}
    </div>
    <TabsContent value="preview" forceMount className="flex flex-col data-[state=inactive]:hidden sm:flex-row">
      <div className="flex min-h-56 min-w-0 flex-1 items-center justify-center overflow-auto p-6">{children}</div>
      {settings && <aside id={settingsId} aria-label="预览参数" hidden={!settingsOpen} className="shrink-0 border-t border-border bg-muted/60 p-3 sm:w-64 sm:border-t-0 sm:border-l">{settings}</aside>}
    </TabsContent>
    <TabsContent value="code">{code}</TabsContent>
  </Tabs>
}
