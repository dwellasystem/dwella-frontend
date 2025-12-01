import { createFileRoute } from '@tanstack/react-router'
import Resident from '../../../../pages/employee/Resident'

export const Route = createFileRoute('/_protected/employee/resident/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Resident/>
}
