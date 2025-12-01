import { createFileRoute } from '@tanstack/react-router'
import AccountSetting from '../../../pages/resident/AccountSetting'

export const Route = createFileRoute('/_protected/resident/account')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AccountSetting/>
}
