import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/(auth)/account/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(app)/(auth)/account/"!</div>
}
