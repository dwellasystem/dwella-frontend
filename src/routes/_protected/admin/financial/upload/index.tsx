import { createFileRoute } from '@tanstack/react-router'
import MonthlyDue from '../../../../../pages/admin/MonthlyDue'

export const Route = createFileRoute('/_protected/admin/financial/upload/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <MonthlyDue/>
}
