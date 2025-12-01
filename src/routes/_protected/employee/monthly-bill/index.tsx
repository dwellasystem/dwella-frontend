import { createFileRoute } from '@tanstack/react-router'
import UnpaidAccount from '../../../../pages/admin/UnpaidAccount'

export const Route = createFileRoute('/_protected/employee/monthly-bill/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <UnpaidAccount/>
}
