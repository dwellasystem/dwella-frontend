import { createFileRoute } from '@tanstack/react-router'
import OverDueAccounts from '../../../../pages/employee/OverDueAccounts'

export const Route = createFileRoute(
  '/_protected/employee/_task-summary/over-due-accounts',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <OverDueAccounts/>
}
