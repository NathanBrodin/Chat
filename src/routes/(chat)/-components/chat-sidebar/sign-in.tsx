import { Link, useLocation } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardPanel, CardTitle } from '@/components/ui/card'

export function SignInButton() {
  const location = useLocation()

  return (
    <Card>
      <CardHeader className="p-4">
        <CardTitle>Unlock More Features</CardTitle>
        <CardDescription>
          Save history, unlock advanced models, and get higher limits.
        </CardDescription>
      </CardHeader>
      <CardPanel className="p-4">
        <Button
          render={<Link to="/sign-in" search={{ redirect: location.href }} />}
          className="w-full"
        >
          Sign In
        </Button>
      </CardPanel>
    </Card>
  )
}
