// routes/login.tsx
import { createFileRoute, redirect } from '@tanstack/react-router'
import Login from '../pages/authentication/Login'
import type { ITokenPayload } from '../interfaces/payloads/ITokenPayload';
import { jwtDecode } from 'jwt-decode';

export const Route = createFileRoute('/login')({
  beforeLoad: ({context}) => {
    const { token } = context.auth;

    if(token) {
      const decoded = jwtDecode<ITokenPayload>(token.access);

      switch (decoded.role) {
        case 'admin':
          return redirect({ to: '/admin'});
        case 'resident':
          return redirect({ to: '/resident/dashboard' });
        case 'employee':
          return redirect({ to: '/employee'});
      }
    }
  
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <Login />;
}
