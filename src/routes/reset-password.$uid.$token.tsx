import { createFileRoute } from '@tanstack/react-router'
import ResetPassword from '../pages/authentication/ResetPassword'

export const Route = createFileRoute('/reset-password/$uid/$token')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ResetPassword/>
}
