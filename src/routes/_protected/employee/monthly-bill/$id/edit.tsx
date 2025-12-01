import { createFileRoute } from '@tanstack/react-router'
import EditBill from '../../../../../pages/admin/EditBill'

export const Route = createFileRoute(
  '/_protected/employee/monthly-bill/$id/edit',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const {id} = Route.useParams()
  return <EditBill id={id}/>
}
