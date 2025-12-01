import { createFileRoute } from '@tanstack/react-router'
import Dashboard from '../../../pages/resident/Dashboard'

export const Route = createFileRoute('/_protected/resident/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='w-100'>
      <Dashboard/>
    </div>
}
