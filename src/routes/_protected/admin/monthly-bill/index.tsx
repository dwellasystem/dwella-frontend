import { createFileRoute } from '@tanstack/react-router'
import UnpaidAccount from '../../../../pages/admin/UnpaidAccount'

export const Route = createFileRoute('/_protected/admin/monthly-bill/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <UnpaidAccount/>
}
