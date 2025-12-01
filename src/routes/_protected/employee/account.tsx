import { createFileRoute } from '@tanstack/react-router'
import AccountSetting from '../../../pages/employee/AccountSetting'

export const Route = createFileRoute('/_protected/employee/account')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AccountSetting/>
}
