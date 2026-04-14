import { CircleAlertIcon } from 'lucide-react'

import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

import { useChatContext } from '.'

export function ChatError() {
  const { error, regenerate } = useChatContext()

  return (
    <>
      {error && (
        <Alert variant="error" className="mx-auto mt-2.5 w-full max-w-xl">
          <CircleAlertIcon />
          <AlertTitle>Something went wrong!</AlertTitle>
          <AlertDescription>An error occured.</AlertDescription>
          <AlertAction>
            <Button onClick={() => regenerate()} size="xs">
              Retry
            </Button>
          </AlertAction>
        </Alert>
      )}
    </>
  )
}
