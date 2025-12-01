import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/employee/resident')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet/>
}
