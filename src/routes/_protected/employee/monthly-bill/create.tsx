import { createFileRoute } from '@tanstack/react-router'
import CreateBill from '../../../../pages/admin/CreateBill'

export const Route = createFileRoute(
  '/_protected/employee/monthly-bill/create',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <CreateBill/>
}
