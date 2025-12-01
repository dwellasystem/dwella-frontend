import { createFileRoute } from '@tanstack/react-router'
import Dashboard from '../../../pages/admin/Dashboard'

export const Route = createFileRoute('/_protected/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Dashboard/>
}
