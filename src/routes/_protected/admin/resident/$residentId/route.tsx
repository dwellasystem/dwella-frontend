import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/admin/resident/$residentId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet/>
}
