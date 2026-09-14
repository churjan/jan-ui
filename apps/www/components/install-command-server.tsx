import type { ReactNode } from "react"
import { getComponentSource } from "@/lib/component-source"
import { InstallCommand as InstallCommandClient } from "./install-command"
import { ServerCodeBlock } from "fumadocs-ui/components/codeblock.rsc"

export async function InstallCommand({ name, children }: { name: string; children?: ReactNode }) {
  const source = await getComponentSource(name)
  const code = <ServerCodeBlock code={source} lang="tsx" codeblock={{ title: `components/jan-ui/${name}.tsx`, viewportProps: { className: "max-h-[800px]" } }} />
  return <InstallCommandClient name={name} code={code}>{children}</InstallCommandClient>
}
