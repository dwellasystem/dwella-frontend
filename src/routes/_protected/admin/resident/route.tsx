import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/admin/resident')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet/>
}
