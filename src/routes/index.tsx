import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: ({context}) => {
      const {token} = context.auth;
      if (!token) {
        return redirect({ to: '/login' });
      }
    return redirect({ to: `/resident/dashboard` });
  },
  component: () => null,
})