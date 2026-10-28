import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: number
}

export function Logo({ className = "", size = 24 }: LogoProps) {
  return (
    <svg
      className={cn("text-primary", className)}
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M72.88 10.09A3.44 3.44 0 0 1 79.14 10.09L90.82 35.65A1.41 1.41 0 0 0 91.52 36.34L117.08 48.03A3.44 3.44 0 0 1 117.08 54.28L91.52 65.97A1.41 1.41 0 0 0 90.82 66.67L79.14 92.23A3.44 3.44 0 0 1 72.88 92.23L61.19 66.67A1.41 1.41 0 0 0 60.5 65.97L34.94 54.28A3.44 3.44 0 0 1 34.94 48.03L60.5 36.34A1.41 1.41 0 0 0 61.19 35.65Z" />
      <path d="M31.22 72.84A1.93 1.93 0 0 1 34.73 72.84L41.29 87.19A0.79 0.79 0 0 0 41.68 87.58L56.04 94.14A1.93 1.93 0 0 1 56.04 97.65L41.68 104.22A0.79 0.79 0 0 0 41.29 104.61L34.73 118.96A1.93 1.93 0 0 1 31.22 118.96L24.66 104.61A0.79 0.79 0 0 0 24.27 104.22L9.92 97.65A1.93 1.93 0 0 1 9.92 94.14L24.27 87.58A0.79 0.79 0 0 0 24.66 87.19Z" />
    </svg>
  )
}

export function AppLogo() {
  return (
    <span className="group/logo flex w-fit items-center gap-1.5 font-heading text-base leading-none font-semibold text-foreground">
      <Logo className="size-5 transition-all duration-300 ease-in-out" />
      <span>Nathan's AI</span>
    </span>
  )
}
