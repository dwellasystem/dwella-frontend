import { createFileRoute } from '@tanstack/react-router'
import MyUnits from '../../../pages/resident/MyUnits'

export const Route = createFileRoute('/_protected/resident/my-units')({
  component: RouteComponent,
})

function RouteComponent() {
  return <MyUnits/>
}
