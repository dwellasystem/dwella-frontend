import { createFileRoute } from '@tanstack/react-router'
import Payments from '../../../../pages/employee/Payments'

export const Route = createFileRoute('/_protected/employee/payments/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Payments />
}
