import registry from "../../../registry.json"

export const components = registry.items
export const githubRepository = registry.homepage.replace("https://github.com/", "").replace(/\/$/, "")
export function getInstallCommand(name: string) {
  return `pnpm dlx shadcn@latest add ${githubRepository}/${name}`
}
