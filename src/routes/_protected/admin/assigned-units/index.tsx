import { createFileRoute } from '@tanstack/react-router'
import AssignedUnits from '../../../../pages/admin/AssignedUnits'

export const Route = createFileRoute('/_protected/admin/assigned-units/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AssignedUnits/>
}
