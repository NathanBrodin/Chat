import { cn } from "@/lib/utils"
import { type ButtonProps as BaseButtonProps } from "./button"

type ButtonProps = {
  children: React.ReactNode
} & BaseButtonProps

export const FancyButton = ({ children, ...rest }: ButtonProps) => {
  return (
    <button
      {...rest}
      className={cn(
        "relative rounded-xl border px-4 py-2 font-display transition-all duration-150 active:translate-y-0.5 active:scale-100",
        "border-zinc-400 bg-zinc-50 shadow-[0px_5px_0px_0px_rgba(0,0,0,0.7)] active:shadow-none",
        "dark:border-zinc-700 dark:bg-zinc-900/50 dark:shadow-[0px_4px_0px_0px_rgba(255,255,255,0.5)] dark:active:shadow-none"
      )}
    >
      {children}
    </button>
  )
}
