import { notFound } from "next/navigation"
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page"
import defaultMdxComponents from "fumadocs-ui/mdx"
import { source } from "@/lib/source"
import { InstallCommand } from "@/components/install-command-server"
import { ComponentPreview } from "@/components/component-preview"
import { components } from "@/lib/components"
import { PropsTable } from "@/components/props-table"
export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params
  const page = source.getPage(slug)
  if (!page) notFound()
  const MDX = page.data.body
  const component = slug?.[0] === "components" && slug.length === 2
    ? components.find(item => item.name === slug[1])
    : undefined
  return <DocsPage toc={page.data.toc} full={page.data.full} breadcrumb={{ enabled: !component }} className="max-w-none md:px-10 xl:px-12">
    <DocsTitle>{page.data.title}</DocsTitle>
    <DocsDescription>{page.data.description}</DocsDescription>
    <DocsBody><MDX components={{ ...defaultMdxComponents, ComponentPreview, InstallCommand, PropsTable }} /></DocsBody>
  </DocsPage>
}
export function generateStaticParams() { return source.generateParams() }
export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params
  const page = source.getPage(slug)
  if (!page) notFound()
  return { title: page.data.title, description: page.data.description }
}
