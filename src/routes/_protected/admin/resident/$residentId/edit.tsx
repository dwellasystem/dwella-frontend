import { createFileRoute } from '@tanstack/react-router'
import EditProfile from '../../../../../pages/resident/EditProfile'

export const Route = createFileRoute('/_protected/admin/resident/$residentId/edit')({
  component: RouteComponent,
  loader: ({params}) => params.residentId
})

function RouteComponent() {
  const {residentId} = Route.useParams()
  return <EditProfile id={residentId}/>
}
