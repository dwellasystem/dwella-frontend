import { createFileRoute } from '@tanstack/react-router'
import SendSms from '../../../../pages/admin/SendSms'

export const Route = createFileRoute('/_protected/admin/notifications/send-sms')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SendSms/>
}
