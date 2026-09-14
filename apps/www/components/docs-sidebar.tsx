"use client"

import { X } from "lucide-react"
import { createPageTreeRenderer } from "fumadocs-ui/components/sidebar/page-tree"
import {
  SidebarContent, SidebarDrawerContent, SidebarDrawerOverlay, SidebarViewport,
  SidebarItem, SidebarFolder, SidebarFolderContent, SidebarFolderLink,
  SidebarFolderTrigger, SidebarSeparator, SidebarTrigger,
} from "fumadocs-ui/components/sidebar/base"
import type { ComponentProps } from "react"
import type { SidebarProps } from "fumadocs-ui/layouts/docs/slots/sidebar"
import { cn } from "@/lib/utils"

function NavigationItem({ className, children, ...props }: ComponentProps<typeof SidebarItem>) {
  return <SidebarItem {...props} className={cn("group relative ml-2 flex min-h-9 items-center gap-2 py-2 pr-2 pl-7 text-sm text-muted-foreground hover:text-foreground data-[active=true]:text-foreground before:absolute before:inset-y-0 before:left-[9px] before:w-px before:bg-border after:absolute after:top-[22%] after:left-2 after:h-[56%] after:w-[3px] after:rounded-full after:bg-border after:opacity-0 hover:after:opacity-100 data-[active=true]:after:bg-primary data-[active=true]:after:opacity-100", className)}>
    <span className="transition-transform group-hover:translate-x-[3px] group-data-[active=true]:translate-x-[3px] motion-reduce:transition-none">{children}</span>
  </SidebarItem>
}

function NavigationHeading(props: ComponentProps<typeof SidebarSeparator>) {
  return <SidebarSeparator {...props} className="mt-4 mb-2 px-2 text-sm text-muted-foreground" />
}

const PageTree = createPageTreeRenderer({
  SidebarItem: NavigationItem,
  SidebarSeparator: NavigationHeading,
  SidebarFolder,
  SidebarFolderContent: ({ children, ...props }) => <SidebarFolderContent {...props}>{children}</SidebarFolderContent>,
  SidebarFolderLink: ({ children, ...props }) => <SidebarFolderLink {...props} className="mt-4 mb-2 flex px-2 text-sm text-muted-foreground">{children}</SidebarFolderLink>,
  SidebarFolderTrigger: ({ children, ...props }) => <SidebarFolderTrigger {...props} className="mt-4 mb-2 flex w-full items-center gap-2 px-2 text-sm text-muted-foreground">{children}</SidebarFolderTrigger>,
})

export function DocsSidebar({ components, banner, footer, className }: SidebarProps) {
  const navigation = <SidebarViewport area={{ className: "min-h-0 flex-1" }} viewport={{ className: "px-5 py-4" }}>
    {banner}<PageTree {...components} />{footer}
  </SidebarViewport>

  return <>
    <SidebarContent>{({ ref }) => <aside ref={ref} id="nd-sidebar" aria-label="文档导航" className={cn("sticky top-(--fd-docs-row-1) flex h-[calc(100dvh-var(--fd-docs-row-1))] min-h-0 flex-col bg-background [grid-area:sidebar] max-md:hidden", className)}>{navigation}</aside>}</SidebarContent>
    <SidebarDrawerOverlay className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" />
    <SidebarDrawerContent aria-label="文档导航" className="fixed inset-y-0 right-0 z-50 flex w-[85%] max-w-80 flex-col bg-background shadow-xl">
      <div className="flex h-16 shrink-0 items-center justify-between px-5"><span className="font-semibold">Jan UI</span><SidebarTrigger aria-label="关闭导航" className="inline-flex size-9 items-center justify-center rounded-md hover:bg-muted"><X size={18} aria-hidden="true" /></SidebarTrigger></div>
      {navigation}
    </SidebarDrawerContent>
  </>
}
