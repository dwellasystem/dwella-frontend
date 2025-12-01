import { createFileRoute } from '@tanstack/react-router'
import Resident from '../../../../pages/admin/Resident'

export const Route = createFileRoute('/_protected/admin/resident/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Resident/>
}
