import { useTheme } from "next-themes"
import { Prism } from "react-syntax-highlighter"
// https://github.com/react-syntax-highlighter/react-syntax-highlighter/blob/master/AVAILABLE_STYLES_PRISM.MD
import { oneDark, oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism"
import { CopyButton } from "@/components/copy-button"

export function CodeBlock({ ...props }) {
  const { resolvedTheme } = useTheme()

  // Inline code
  if (!props.className?.includes("language")) {
    return <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">{props.children}</code>
  }

  return (
    <Prism
      language={props.className?.replace(/(?:lang(?:uage)?-)/, "")}
      style={resolvedTheme === "dark" ? oneDark : oneLight}
      wrapLines={true}
      showLineNumbers={false}
      className="not-prose rounded-md text-sm"
    >
      {props.children}
    </Prism>
  )
}

export function Pre({ ...props }) {
  const codeString = props.children.props.children

  return (
    <div className="not-prose group/code relative">
      <CopyButton content={codeString} className="absolute right-1 top-1 opacity-0 group-hover/code:opacity-100" />
      {props.children}
    </div>
  )
}
