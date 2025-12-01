import { createFileRoute } from '@tanstack/react-router'
import PaymentHistoryTable from '../../../../../../components/admin/tables/resident-profile/category-history/PaymentHistoryTable'

export const Route = createFileRoute('/_protected/employee/resident/$residentId/_view/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <PaymentHistoryTable/>
}
