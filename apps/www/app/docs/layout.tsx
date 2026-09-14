import { DocsLayout } from "fumadocs-ui/layouts/docs"
import { source } from "@/lib/source"
import type { ReactNode } from "react"
import { DocsHeader } from "@/components/docs-header"
import { ThemeToggle } from "@/components/theme-toggle"
import { DocsSidebar } from "@/components/docs-sidebar"
import { SidebarProvider, SidebarTrigger, useSidebar } from "fumadocs-ui/layouts/docs/slots/sidebar"
export default function Layout({ children }: { children: ReactNode }) {
  return <DocsLayout tree={source.pageTree} nav={{ title: "Jan UI", url: "/" }} slots={{ header: DocsHeader, themeSwitch: ThemeToggle, sidebar: { provider: SidebarProvider, root: DocsSidebar, trigger: SidebarTrigger, useSidebar } }} sidebar={{ collapsible: false }} containerProps={{ className: "md:[--fd-sidebar-width:240px] xl:[--fd-toc-width:220px]", style: { width: "100%", maxWidth: "1600px", marginInline: "auto", gridTemplate: '"header header header header header" 64px "sidebar sidebar toc-popover toc toc" auto "sidebar sidebar main toc toc" 1fr / 0px var(--fd-sidebar-col) minmax(0, 1fr) var(--fd-toc-width) 0px', "--fd-docs-row-1": "64px", "--fd-docs-row-2": "64px" } as React.CSSProperties }}>{children}</DocsLayout>
}
