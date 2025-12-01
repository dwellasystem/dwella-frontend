import { createFileRoute } from '@tanstack/react-router'
import AccountSetting from '../../../pages/admin/AccountSetting'

export const Route = createFileRoute('/_protected/admin/account')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AccountSetting/>
}
