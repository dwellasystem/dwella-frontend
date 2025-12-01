import { createFileRoute } from '@tanstack/react-router'
import NoticeReceivedTable from '../../../../../../components/admin/tables/resident-profile/category-history/NoticeReceivedTable'

export const Route = createFileRoute(
  '/_protected/employee/resident/$residentId/_view/notice-received',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <NoticeReceivedTable/>
  )
}
