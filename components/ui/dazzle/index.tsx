import { useEffect, useState } from "react"
import "./style.css"
import { cn } from "@/lib/utils"

// Predefine the SVG path to avoid repetition
const STAR_PATH =
  "M93.781 51.578C95 50.969 96 49.359 96 48c0-1.375-1-2.969-2.219-3.578 0 0-22.868-1.514-31.781-10.422-8.915-8.91-10.438-31.781-10.438-31.781C50.969 1 49.375 0 48 0s-2.969 1-3.594 2.219c0 0-1.5 22.87-10.406 31.781-8.908 8.913-31.781 10.422-31.781 10.422C1 45.031 0 46.625 0 48c0 1.359 1 2.969 2.219 3.578 0 0 22.873 1.51 31.781 10.422 8.906 8.911 10.406 31.781 10.406 31.781C45.031 95 46.625 96 48 96s2.969-1 3.562-2.219c0 0 1.523-22.871 10.438-31.781 8.913-8.908 31.781-10.422 31.781-10.422Z"

export default function Dazzle({ text, accent }: { text: string; accent?: string }) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    // Use requestAnimationFrame for smoother animation timing
    let animationId: number

    // Start animation only if component is visible in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animationId = requestAnimationFrame(() => {
            setAnimate(true)
          })

          // Cleanup observer once triggered
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    const element = document.querySelector(".dazzle")
    if (element) observer.observe(element)

    // Reset animation - only needed if component stays mounted for a long time
    const resetTimer = setTimeout(() => {
      setAnimate(false)
    }, 2000)

    // Cleanup
    return () => {
      if (animationId) cancelAnimationFrame(animationId)
      clearTimeout(resetTimer)
      observer.disconnect()
    }
  }, [])

  // Optimize stars rendering by using an array and map
  const starPositions = [
    { x: 0, y: 20, scale: 1.1, delay: 1 },
    { x: 15, y: 80, scale: 1.25, delay: 2 },
    { x: 45, y: 40, scale: 1.1, delay: 3 },
    { x: 75, y: 60, scale: 0.9, delay: 2 },
    { x: 100, y: 30, scale: 0.8, delay: 4 },
  ]

  return (
    <div className={cn("dazzle fluid font-display font-semibold", animate && "animate-on-load")}>
      {starPositions.map((pos, index) => (
        <svg
          key={index}
          aria-hidden="true"
          viewBox="0 0 96 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={
            {
              "--x": pos.x,
              "--y": pos.y,
              "--s": pos.scale,
              "--d": pos.delay,
            } as React.CSSProperties
          }
        >
          <path d={STAR_PATH} fill="#000" />
        </svg>
      ))}

      <p className="fluid">
        {text}
        <span className="accent">{accent}</span>
      </p>
      <p className="fluid" aria-hidden="true">
        {text}
        <span className="accent text-shadow-accent">{accent}</span>
      </p>
    </div>
  )
}
