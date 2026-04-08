import { Link } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <main className="flex h-screen w-screen flex-1 flex-col items-center justify-center overflow-x-hidden px-4">
      <div className="flex w-full flex-col items-center justify-center">
        <h1 className="my-6 font-heading text-8xl font-medium tracking-tighter tabular-nums">
          404
        </h1>
        <Button variant="default" render={<Link to="/" />}>
          Go to Home
          <ArrowRightIcon />
        </Button>
      </div>
    </main>
  )
}
