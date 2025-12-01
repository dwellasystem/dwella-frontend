import { createFileRoute } from '@tanstack/react-router'
import Notices from '../../../pages/resident/Notices'

export const Route = createFileRoute('/_protected/resident/notices')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Notices/>
}
