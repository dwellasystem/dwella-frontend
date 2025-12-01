import { createFileRoute } from '@tanstack/react-router'
import EditPayment from '../../../../../pages/admin/EditPayment';

export const Route = createFileRoute('/_protected/admin/financial/edit/$residentId')({
  component: RouteComponent,
  loader:({params}) => params.residentId
})

function RouteComponent() {
  return <EditPayment/>
}
