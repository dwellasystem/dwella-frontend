import { createFileRoute } from '@tanstack/react-router'
import PendingNotices from '../../../../pages/employee/PendingNotices'

export const Route = createFileRoute('/_protected/employee/_task-summary/pending-notices')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  return <PendingNotices/>
}
