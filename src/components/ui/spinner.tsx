import type React from 'react'

import { Loader2Icon } from 'lucide-react'

import { cn } from '@/lib/utils'

export function Spinner({
  className,
  ...props
}: React.ComponentProps<typeof Loader2Icon>): React.ReactElement {
  return (
    <Loader2Icon
      aria-label="Loading"
      className={cn('animate-spin', className)}
      role="status"
      {...props}
    />
  )
}
