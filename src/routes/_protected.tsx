import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected')({
  beforeLoad: ({ context }) => {
    const { token, isLoading } = context.auth;

    if (isLoading) return;

    if (!token) {
      return redirect({ to: '/login' });
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet/>
}
