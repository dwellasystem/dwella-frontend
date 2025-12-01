import { createFileRoute } from '@tanstack/react-router'
import EditProfile from '../../../pages/resident/EditProfile'
import { useAuth } from '../../../contexts/auth/AuthContext';

export const Route = createFileRoute('/_protected/resident/edit-profile')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useAuth();
  return <EditProfile id={user?.id?.toString()!}/>
}
