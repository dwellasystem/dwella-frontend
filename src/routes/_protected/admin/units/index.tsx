import { createFileRoute } from '@tanstack/react-router'
import Units from '../../../../pages/admin/Units'

export const Route = createFileRoute('/_protected/admin/units/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Units/>
}
