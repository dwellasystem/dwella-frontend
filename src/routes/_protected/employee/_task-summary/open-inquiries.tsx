import { createFileRoute } from '@tanstack/react-router'
import NewInquiries from '../../../../pages/employee/NewInquiries'

export const Route = createFileRoute('/_protected/employee/_task-summary/open-inquiries')({
  component: RouteComponent,
})

function RouteComponent() {
  return <NewInquiries/>
}
