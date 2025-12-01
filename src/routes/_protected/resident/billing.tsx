import { createFileRoute } from '@tanstack/react-router'
import Billings from '../../../pages/resident/Billings'

export const Route = createFileRoute('/_protected/resident/billing')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Billings/>
}
