import { getExampleSource } from "@/lib/component-source"
import { ComponentPreviewClient } from "./component-preview-client"
import { CopyButtonPlayground } from "./copy-button-playground"

import { CopyButtonDemo } from "@/components/examples/copy-button/demo"
import type { ComponentType } from "react"
import { ServerCodeBlock } from "fumadocs-ui/components/codeblock.rsc"

const examples = {
  "copy-button": { demo: CopyButtonDemo },
}
export async function ComponentPreview({ name, variant = "demo" }: { name: keyof typeof examples; variant?: string }) {
  const Demo = (examples[name] as Record<string, ComponentType>)[variant]
  if (!Demo) throw new Error(`Unknown example: ${name}/${variant}`)
  const exampleSource = await getExampleSource(name, variant)
  const code = <ServerCodeBlock code={exampleSource} lang="tsx" codeblock={{ allowCopy: false, className: "my-0 rounded-none border-0 bg-background shadow-none", viewportProps: { className: "max-h-[480px]" } }} />
  if (name === "copy-button" && variant === "demo") return <CopyButtonPlayground code={code} exampleSource={exampleSource} />
  return <ComponentPreviewClient code={code} exampleSource={exampleSource}><Demo/></ComponentPreviewClient>
}

