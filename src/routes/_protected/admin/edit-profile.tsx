import { createFileRoute } from '@tanstack/react-router'
import EditProfile from '../../../pages/admin/EditProfile'

export const Route = createFileRoute('/_protected/admin/edit-profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <EditProfile/>
}
