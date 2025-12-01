import { createFileRoute } from '@tanstack/react-router'
import MonthlyBill from '../../../pages/resident/MonthlyBill'

export const Route = createFileRoute('/_protected/resident/monthly-bill')({
  component: RouteComponent,
})

function RouteComponent() {
  return <MonthlyBill/>
}
