import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Providers } from "@/components/providers"
import "./globals.css"
export const metadata: Metadata = {
  title: { default: "Jan UI", template: "%s | Jan UI" },
  description: "Jan UI React 组件库：预览、文档与可直接复制的组件源码。",
}
export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="zh-CN" suppressHydrationWarning><body><Providers>{children}</Providers></body></html>
}
