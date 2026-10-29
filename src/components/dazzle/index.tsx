import * as React from "react"

import { cn } from "@/lib/utils"

import { DAZZLE_STAR_PATH } from "./star"
import "./style.css"

const STAR_COUNT = 5

export function Dazzle({ text, className }: { text: string; className?: string }) {
  const starId = `dazzle-star-${React.useId().replace(/[^a-zA-Z0-9]/g, "")}`

  return (
    <div
      className={cn(
        "dazzle font-heading font-semibold whitespace-nowrap max-sm:whitespace-normal",
        className,
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
          <path id={starId} d={DAZZLE_STAR_PATH} />
        </defs>
      </svg>
    </div>
  )
}
