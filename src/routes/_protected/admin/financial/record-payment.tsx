import { createFileRoute } from '@tanstack/react-router'
import RecordPayment from '../../../../pages/admin/RecordPayment'

export const Route = createFileRoute('/_protected/admin/financial/record-payment')({
  component: RouteComponent,
})

function RouteComponent() {
  return <RecordPayment/>
}
