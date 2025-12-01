import { createFileRoute } from '@tanstack/react-router'
import AddEmployee from '../../../../pages/admin/AddEmployee'

export const Route = createFileRoute('/_protected/admin/employee/add-employee')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AddEmployee/>
}
