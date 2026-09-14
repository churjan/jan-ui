"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "fumadocs-ui/components/ui/tabs"
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock"
import { CopyButton } from "@/components/jan-ui/copy-button"

export const runners = { pnpm: "pnpm dlx", npm: "npx", yarn: "yarn dlx", bun: "bunx --bun" }
type Manager = keyof typeof runners

export function CommandTabs({ commands }: { commands: Record<Manager, string> }) {
  const [manager, setManager] = useState<Manager>("pnpm")
  return <Tabs value={manager} onValueChange={value => setManager(value as Manager)} className="not-prose my-5 overflow-hidden rounded-2xl bg-muted p-1.5">
    <div className="flex items-center justify-between gap-2 px-2">
      <TabsList aria-label="包管理器" className="flex min-w-0 gap-3 overflow-x-auto">
        {(Object.keys(runners) as Manager[]).map(value => <TabsTrigger key={value} value={value} className="border-b-2 border-transparent py-2 text-xs font-medium text-muted-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground">{value}</TabsTrigger>)}
      </TabsList>
      <CopyButton text={commands[manager]} label="复制安装命令" className="size-8" />
    </div>
    {(Object.keys(runners) as Manager[]).map(value => <TabsContent key={value} value={value}>
      <CodeBlock allowCopy={false} className="my-0 rounded-xl border-0 bg-background shadow-none">
        <Pre className="p-4 text-xs"><code>{commands[value]}</code></Pre>
      </CodeBlock>
    </TabsContent>)}
  </Tabs>
}

export function ShadcnCommand({ command }: { command: string }) {
  return <CommandTabs commands={{
    pnpm: `${runners.pnpm} shadcn@latest ${command}`,
    npm: `${runners.npm} shadcn@latest ${command}`,
    yarn: `${runners.yarn} shadcn@latest ${command}`,
    bun: `${runners.bun} shadcn@latest ${command}`,
  }} />
}
