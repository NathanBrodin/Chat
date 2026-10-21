import * as React from "react"
import { cn } from "@/lib/utils"
import "./style.css"

const STAR_PATH =
  "M93.781 51.578C95 50.969 96 49.359 96 48c0-1.375-1-2.969-2.219-3.578 0 0-22.868-1.514-31.781-10.422-8.915-8.91-10.438-31.781-10.438-31.781C50.969 1 49.375 0 48 0s-2.969 1-3.594 2.219c0 0-1.5 22.87-10.406 31.781-8.908 8.913-31.781 10.422-31.781 10.422C1 45.031 0 46.625 0 48c0 1.359 1 2.969 2.219 3.578 0 0 22.873 1.51 31.781 10.422 8.906 8.911 10.406 31.781 10.406 31.781C45.031 95 46.625 96 48 96s2.969-1 3.562-2.219c0 0 1.523-22.871 10.438-31.781 8.913-8.908 31.781-10.422 31.781-10.422Z"

const STAR_COUNT = 5

export function Dazzle({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const starId = `dazzle-star-${React.useId().replace(/[^a-zA-Z0-9]/g, "")}`

  return (
    <div
      className={cn(
        "dazzle font-heading font-semibold whitespace-nowrap max-sm:whitespace-normal",
        className
      )}
    >
      {Array.from({ length: STAR_COUNT }, (_, index) => (
        <svg
          key={index}
          className="dazzle-star"
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 96 96"
        >
          <use href={`#${starId}`} />
        </svg>
      ))}
      <p>{text}</p>
      <p aria-hidden="true">{text}</p>
      <svg className="dazzle-defs" aria-hidden="true" focusable="false">
        <defs>
          <path id={starId} d={STAR_PATH} />
        </defs>
      </svg>
    </div>
  )
}
