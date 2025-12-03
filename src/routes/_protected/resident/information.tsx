import { createFileRoute } from '@tanstack/react-router'
import HoaInformation from '../../../components/HoaInformation'

export const Route = createFileRoute('/_protected/resident/information')({
  component: RouteComponent,
})

function RouteComponent() {
  return <HoaInformation/>
}
