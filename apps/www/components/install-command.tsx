"use client"

import { useId, useState, type ReactNode } from "react"
import { Terminal } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "fumadocs-ui/components/ui/tabs"
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock"
import { getInstallCommand } from "@/lib/components"
import { cn } from "@/lib/utils"

const runners = { pnpm: "pnpm dlx", npm: "npx", yarn: "yarn dlx", bun: "bunx --bun" }
const managers = Object.keys(runners) as (keyof typeof runners)[]

export function InstallCommand({ name, code, children }: { name: string; code: ReactNode; children?: ReactNode }) {
  const id = useId()
  const [expanded, setExpanded] = useState(false)
  return <Tabs defaultValue="CLI" className="my-5">
    <TabsList aria-label="安装方式" className="not-prose mb-3 flex gap-5">
      {["CLI", "Manual"].map(value => <TabsTrigger key={value} value={value} className="border-b-2 border-transparent px-0 pb-2 text-sm font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground">{value}</TabsTrigger>)}
    </TabsList>
    <TabsContent value="CLI">
      <Tabs defaultValue="pnpm" groupId="jan-package-manager" className="not-prose overflow-hidden rounded-xl border border-border bg-muted/40">
        <TabsList aria-label="包管理器" className="flex items-center gap-1 overflow-x-auto border-b border-border px-3 py-2">
          <Terminal aria-hidden="true" size={16} className="mr-2 shrink-0 text-muted-foreground" />
          {managers.map(value => <TabsTrigger key={value} value={value} className="rounded-md border border-transparent px-2 py-1 font-mono text-xs text-muted-foreground data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-foreground">{value}</TabsTrigger>)}
        </TabsList>
        {managers.map(value => <TabsContent key={value} value={value}>
          <CodeBlock className="my-0 rounded-none border-0 bg-transparent shadow-none">
            <Pre className="px-5 text-sm"><code>{getInstallCommand(name).replace("pnpm dlx", runners[value])}</code></Pre>
          </CodeBlock>
        </TabsContent>)}
      </Tabs>
    </TabsContent>
    <TabsContent value="Manual">
      <p>复制以下源码到你的项目中。</p>
      <div className="not-prose my-5">
        <button type="button" aria-expanded={expanded} aria-controls={id} onClick={() => setExpanded(!expanded)} className="mb-2 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted">{expanded ? "收起" : "展开源码"}</button>
        <div id={id} className={cn(!expanded && "max-h-64 overflow-hidden [mask-image:linear-gradient(to_bottom,black_65%,transparent)]")}>{code}</div>
      </div>
      {children ?? <p>按下方「手动获取源码」及主题配置说明完成依赖和样式配置。</p>}
    </TabsContent>
  </Tabs>
}
