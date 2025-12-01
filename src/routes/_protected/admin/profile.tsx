import { createFileRoute } from '@tanstack/react-router'
import Profile from '../../../pages/admin/Profile'

export const Route = createFileRoute('/_protected/admin/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Profile/>
}
