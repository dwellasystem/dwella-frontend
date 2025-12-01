import { createFileRoute } from '@tanstack/react-router'
import Contact from '../../../pages/resident/Contact'

export const Route = createFileRoute('/_protected/resident/contact')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Contact/>
}
