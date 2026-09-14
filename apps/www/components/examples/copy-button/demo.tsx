import { CopyButton, type CopyButtonProps } from "@/components/jan-ui/copy-button"

type CopyButtonDemoProps = Pick<
  CopyButtonProps,
  "text" | "iconOnly" | "label" | "copiedLabel" | "disabled"
>

export function CopyButtonDemo({ text = "Hello, world!", ...props }: CopyButtonDemoProps) {
  return <CopyButton text={text} {...props} />
}
