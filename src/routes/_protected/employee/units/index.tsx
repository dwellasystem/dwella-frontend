import { createFileRoute } from '@tanstack/react-router'
import Units from '../../../../pages/employee/Units'

export const Route = createFileRoute('/_protected/employee/units/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Units/>
}
