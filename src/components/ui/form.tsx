import type React from 'react'

import { cn } from '@/lib/utils'

export function Form({
  className,
  ...props
}: React.FormHTMLAttributes<HTMLFormElement>): React.ReactElement {
  return (
    <form
      noValidate
      className={cn('flex w-full flex-col gap-4', className)}
      data-slot="form"
      {...props}
    />
  )
}
