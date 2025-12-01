// routes/_protected/resident/pdf-view.tsx
import { createFileRoute } from '@tanstack/react-router'
import UserDataView from '../../../pages/resident/UserDataView';

export const Route = createFileRoute('/_protected/resident/pdf-view')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      data: search.data as string | undefined,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <UserDataView />;
}