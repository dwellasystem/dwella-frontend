import { createFileRoute } from '@tanstack/react-router'
import ForgotPassword from '../pages/authentication/ForgotPassword'

export const Route = createFileRoute('/forgot-password')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ForgotPassword/>
}
