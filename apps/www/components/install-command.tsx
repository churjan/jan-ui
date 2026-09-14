"use client"

import { useId, useState, type ReactNode } from "react"
import { Terminal } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "fumadocs-ui/components/ui/tabs"
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock"
import { Step, Steps } from "fumadocs-ui/components/steps"
import { CommandTabs, runners } from "@/components/command-tabs"
import { components, getInstallCommand } from "@/lib/components"
import { cn } from "@/lib/utils"

const managers = Object.keys(runners) as (keyof typeof runners)[]
const installers = { pnpm: "pnpm add", npm: "npm install", yarn: "yarn add", bun: "bun add" }

function DependencyCommand({ dependencies, registry = false }: { dependencies: string[]; registry?: boolean }) {
  const command = (manager: keyof typeof runners) => `${registry ? `${runners[manager]} shadcn@latest add` : installers[manager]} ${dependencies.join(" ")}`
  return <CommandTabs commands={{ pnpm: command("pnpm"), npm: command("npm"), yarn: command("yarn"), bun: command("bun") }} />
}
export function InstallCommand({ name, code, children }: { name: string; code: ReactNode; children?: ReactNode }) {
  const id = useId()
  const [expanded, setExpanded] = useState(false)
  const component = components.find(component => component.name === name)
  const registryDependencies = component?.registryDependencies.filter(dependency => dependency !== "utils") ?? []
  return <Tabs defaultValue="CLI" className="my-5">
    <TabsList aria-label="安装方式" className="not-prose mb-3 flex gap-1">
      {["CLI", "Manual"].map(value => <TabsTrigger key={value} value={value} className="rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground data-[state=active]:bg-muted data-[state=active]:text-foreground">{value}</TabsTrigger>)}
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
      <Steps>
        {!!component?.dependencies.length && <Step>
          <h4 className="pt-1 text-sm font-medium">安装依赖</h4>
          <DependencyCommand dependencies={component.dependencies} />
        </Step>}
        {registryDependencies.length > 0 && <Step>
          <h4 className="pt-1 text-sm font-medium">安装以下注册表依赖：</h4>
          <DependencyCommand dependencies={registryDependencies} registry />
        </Step>}
        <Step>
          <h4 className="pt-1 text-sm font-medium">复制源码</h4>
      <div className="not-prose relative my-5 overflow-hidden rounded-xl">
        <div id={id} inert={!expanded} className={cn("overflow-hidden", expanded ? "pb-12" : "max-h-32")}>
          {code}
        </div>
        <div className={cn("absolute flex items-center justify-center rounded-t-xl bg-gradient-to-b from-neutral-300/30 to-white p-2 dark:from-neutral-700/30 dark:to-neutral-950", expanded ? "inset-x-0 bottom-0 h-12" : "inset-0")}>
          <button type="button" aria-expanded={expanded} aria-controls={id} onClick={() => setExpanded(open => !open)} className="inline-flex h-8 items-center justify-center rounded-md bg-muted px-3 text-xs font-medium text-foreground shadow-xs transition-colors hover:bg-border">{expanded ? "收起" : "展开"}</button>
        </div>
      </div>
          {children}
        </Step>
        <Step>
          <h4 className="pt-1 text-sm font-medium">根据项目结构调整导入路径</h4>
        </Step>
      </Steps>
    </TabsContent>
  </Tabs>
}
