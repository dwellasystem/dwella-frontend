import { createFileRoute } from '@tanstack/react-router'
import Employees from '../../../../pages/admin/Employees'

export const Route = createFileRoute('/_protected/admin/employee/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Employees/>
}
