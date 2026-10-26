interface LogoProps {
  className?: string
  size?: number
}

export function Logo({ className = "", size = 24 }: LogoProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="currentColor">
        {/* Diagonal 1 (Top-Left) */}
        <circle
          cx="45.1222"
          cy="7.36691"
          r="7.36691"
          className="transition-colors delay-[0ms] duration-300 group-hover/logo:fill-info-foreground"
        />
        <circle
          cx="26.2957"
          cy="26.2957"
          r="7.36691"
          className="transition-colors delay-[0ms] duration-300 group-hover/logo:fill-info-foreground"
        />
        <circle
          cx="7.36691"
          cy="45.1222"
          r="7.36691"
          className="transition-colors delay-[0ms] duration-300 group-hover/logo:fill-info-foreground"
        />

        {/* Diagonal 2 */}
        <circle
          cx="63.9489"
          cy="7.36691"
          r="7.36691"
          className="transition-colors delay-[50ms] duration-300 group-hover/logo:fill-info-foreground"
        />
        <circle
          cx="45.1222"
          cy="26.2957"
          r="7.36691"
          className="transition-colors delay-[50ms] duration-300 group-hover/logo:fill-info-foreground"
        />
        <circle
          cx="26.2957"
          cy="45.1222"
          r="7.36691"
          className="transition-colors delay-[50ms] duration-300 group-hover/logo:fill-info-foreground"
        />
        <circle
          cx="7.36691"
          cy="63.9486"
          r="7.36691"
          className="transition-colors delay-[50ms] duration-300 group-hover/logo:fill-info-foreground"
        />

        {/* Diagonal 3 */}
        <circle
          cx="82.8781"
          cy="7.36691"
          r="7.36691"
          className="transition-colors delay-[100ms] duration-300 group-hover/logo:fill-info-foreground"
        />
        <circle
          cx="63.9489"
          cy="26.2957"
          r="7.36691"
          className="transition-colors delay-[100ms] duration-300 group-hover/logo:fill-info-foreground"
        />
        <circle
          cx="45.1222"
          cy="45.1222"
          r="7.36691"
          className="transition-colors delay-[100ms] duration-300 group-hover/logo:fill-info-foreground"
        />
        <circle
          cx="26.2957"
          cy="63.9486"
          r="7.36691"
          className="transition-colors delay-[100ms] duration-300 group-hover/logo:fill-info-foreground"
        />
        <circle
          cx="7.36691"
          cy="82.8774"
          r="7.36691"
          className="transition-colors delay-[100ms] duration-300 group-hover/logo:fill-info-foreground"
        />

        {/* Diagonal 4 */}
        <circle
          cx="82.8781"
          cy="26.2957"
          r="7.36691"
          className="transition-colors delay-[150ms] duration-300 group-hover/logo:fill-info-foreground"
        />
        <circle
          cx="63.9489"
          cy="45.1222"
          r="7.36691"
          className="transition-colors delay-[150ms] duration-300 group-hover/logo:fill-info-foreground"
        />
        <circle
          cx="45.1222"
          cy="63.9486"
          r="7.36691"
          className="transition-colors delay-[150ms] duration-300 group-hover/logo:fill-info-foreground"
        />
        <circle
          cx="26.2957"
          cy="82.8774"
          r="7.36691"
          className="transition-colors delay-[150ms] duration-300 group-hover/logo:fill-info-foreground"
        />

        {/* Diagonal 5 */}
        <circle
          cx="101.704"
          cy="26.2957"
          r="7.36691"
          className="transition-colors delay-[200ms] duration-300 group-hover/logo:fill-info-foreground"
        />
        <circle
          cx="82.8781"
          cy="45.1222"
          r="7.36691"
          className="transition-colors delay-[200ms] duration-300 group-hover/logo:fill-info-foreground"
        />
        <circle
          cx="63.9489"
          cy="63.9486"
          r="7.36691"
          className="transition-colors delay-[200ms] duration-300 group-hover/logo:fill-info-foreground"
        />
        <circle
          cx="45.1222"
          cy="82.8774"
          r="7.36691"
          className="transition-colors delay-[200ms] duration-300 group-hover/logo:fill-info-foreground"
        />
        <circle
          cx="26.2957"
          cy="101.704"
          r="7.36691"
          className="transition-colors delay-[200ms] duration-300 group-hover/logo:fill-info-foreground"
        />

        {/* Diagonal 6 */}
        <circle
          cx="101.704"
          cy="45.1222"
          r="7.36691"
          className="transition-colors delay-[250ms] duration-300 group-hover/logo:fill-info-foreground"
        />
        <circle
          cx="82.8781"
          cy="63.9486"
          r="7.36691"
          className="transition-colors delay-[250ms] duration-300 group-hover/logo:fill-info-foreground"
        />
        <circle
          cx="63.9489"
          cy="82.8774"
          r="7.36691"
          className="transition-colors delay-[250ms] duration-300 group-hover/logo:fill-info-foreground"
        />
        <circle
          cx="45.1222"
          cy="101.704"
          r="7.36691"
          className="transition-colors delay-[250ms] duration-300 group-hover/logo:fill-info-foreground"
        />

        {/* Diagonal 7 */}
        <circle
          cx="120.633"
          cy="45.1222"
          r="7.36691"
          className="transition-colors delay-[300ms] duration-300 group-hover/logo:fill-info-foreground"
        />
        <circle
          cx="101.704"
          cy="63.9486"
          r="7.36691"
          className="transition-colors delay-[300ms] duration-300 group-hover/logo:fill-info-foreground"
        />
        <circle
          cx="82.8781"
          cy="82.8774"
          r="7.36691"
          className="transition-colors delay-[300ms] duration-300 group-hover/logo:fill-info-foreground"
        />
        <circle
          cx="63.9489"
          cy="101.704"
          r="7.36691"
          className="transition-colors delay-[300ms] duration-300 group-hover/logo:fill-info-foreground"
        />
        <circle
          cx="45.1222"
          cy="120.634"
          r="7.36691"
          className="transition-colors delay-[300ms] duration-300 group-hover/logo:fill-info-foreground"
        />

        {/* Diagonal 8 */}
        <circle
          cx="120.633"
          cy="63.9486"
          r="7.36691"
          className="transition-colors delay-[350ms] duration-300 group-hover/logo:fill-info-foreground"
        />
        <circle
          cx="101.704"
          cy="82.8774"
          r="7.36691"
          className="transition-colors delay-[350ms] duration-300 group-hover/logo:fill-info-foreground"
        />
        <circle
          cx="82.8781"
          cy="101.704"
          r="7.36691"
          className="transition-colors delay-[350ms] duration-300 group-hover/logo:fill-info-foreground"
        />
        <circle
          cx="63.9489"
          cy="120.634"
          r="7.36691"
          className="transition-colors delay-[350ms] duration-300 group-hover/logo:fill-info-foreground"
        />

        {/* Diagonal 9 (Bottom-Right) */}
        <circle
          cx="120.633"
          cy="82.8774"
          r="7.36691"
          className="transition-colors delay-[400ms] duration-300 group-hover/logo:fill-info-foreground"
        />
        <circle
          cx="101.704"
          cy="101.704"
          r="7.36691"
          className="transition-colors delay-[400ms] duration-300 group-hover/logo:fill-info-foreground"
        />
        <circle
          cx="82.8781"
          cy="120.634"
          r="7.36691"
          className="transition-colors delay-[400ms] duration-300 group-hover/logo:fill-info-foreground"
        />
      </g>
    </svg>
  )
}

export function AppLogo() {
  return (
    <span className="group/logo flex w-fit items-center gap-1.5 font-heading text-lg leading-none font-semibold text-foreground">
      <Logo className="size-4 transition-all duration-300 ease-in-out" />
      Chatbot Template
    </span>
  )
}
