import { createFileRoute } from '@tanstack/react-router'
import SendReminder from '../../../../pages/admin/SendReminder'

export const Route = createFileRoute('/_protected/admin/monthly-bill/reminders')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SendReminder/>
}
