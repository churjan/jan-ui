"use client"

import { useId, useState, type ReactNode } from "react"
import { CopyButtonDemo } from "@/components/examples/copy-button/demo"
import { ComponentPreviewClient } from "./component-preview-client"

const defaults = {
  text: "Hello, world!",
  iconOnly: true,
  label: "复制",
  copiedLabel: "已复制",
  disabled: false,
}

export function CopyButtonPlayground({ code, exampleSource }: { code: ReactNode; exampleSource: string }) {
  const [values, setValues] = useState(defaults)
  const [revision, setRevision] = useState(0)
  const id = useId()
  const reset = () => {
    setValues(defaults)
    setRevision(value => value + 1)
  }
  const settings = <fieldset className="min-w-0 space-y-3">
    <legend className="mb-3 text-sm font-medium">CopyButton</legend>
    <div className="space-y-3 rounded-lg border border-border bg-background p-3">
      {(["iconOnly", "disabled"] as const).map(name => <label key={name} className="flex items-center justify-between gap-3 text-xs">
        <span>{name}</span>
        <input type="checkbox" checked={values[name]} onChange={event => setValues(current => ({ ...current, [name]: event.target.checked }))} className="size-4 accent-primary" />
      </label>)}
      {(["text", "label", "copiedLabel"] as const).map(name => <div key={name} className="space-y-1.5">
        <label htmlFor={`${id}-${name}`} className="block text-xs">{name}</label>
        {name === "text" ? <textarea id={`${id}-${name}`} rows={3} value={values[name]} onChange={event => setValues(current => ({ ...current, [name]: event.target.value }))} className="block w-full resize-y rounded-md border border-border bg-background px-2 py-1.5 text-xs" /> :
          <input id={`${id}-${name}`} type="text" value={values[name]} onChange={event => setValues(current => ({ ...current, [name]: event.target.value }))} className="block w-full min-w-0 rounded-md border border-border bg-background px-2 py-1.5 text-xs" />}
      </div>)}
    </div>
  </fieldset>

  return <ComponentPreviewClient code={code} exampleSource={exampleSource} settings={settings} onReset={reset}>
    <CopyButtonDemo key={revision} {...values} />
  </ComponentPreviewClient>
}
