import "server-only"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { components } from "@/lib/components"
export async function getComponentSource(name: string) {
  const item = components.find(item => item.name === name)
  if (!item) throw new Error(`Unknown component: ${name}`)
  return readFile(path.join(process.cwd(), "components", "jan-ui", `${item.name}.tsx`), "utf8")
}

export async function getExampleSource(name: string, variant = "demo") {
  const item = components.find(item => item.name === name)
  if (!item) throw new Error(`Unknown component: ${name}`)
  if (variant !== "demo") throw new Error(`Unknown example: ${variant}`)
  return readFile(path.join(process.cwd(), "components", "examples", item.name, `${variant}.tsx`), "utf8")
}
