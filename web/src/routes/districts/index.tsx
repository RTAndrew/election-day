import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/districts/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/districts/"!</div>
}
