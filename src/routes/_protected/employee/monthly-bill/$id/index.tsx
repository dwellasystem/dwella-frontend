import { createFileRoute } from '@tanstack/react-router'
import ViewBill from '../../../../../pages/admin/ViewBill'

export const Route = createFileRoute('/_protected/employee/monthly-bill/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  const {id} = Route.useParams()
  return <ViewBill id={id}/>
}
