import { createFileRoute, Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  // const { data } = useSuspenseQuery(convexQuery(api.todos.list, {}))
  // const { mutate, isPending } = useMutation({ mutationFn: useConvexMutation(api.todos.add) })

  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <Button render={<Link to="/chat" />} variant="outline">
        Chat
      </Button>
    </main>
  )
}
