import { createFileRoute } from '@tanstack/react-router'
import Inquiries from '../../../pages/resident/Inquiries'

export const Route = createFileRoute('/_protected/resident/inquiries')({
  component: RouteComponent,
})

function RouteComponent() {
  
  return <Inquiries/>
}
