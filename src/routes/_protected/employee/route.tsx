import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import SideBar from '../../../components/employee/sidebar/SideBar'
import type { ITokenPayload } from '../../../interfaces/payloads/ITokenPayload';
import { jwtDecode } from 'jwt-decode';

export const Route = createFileRoute('/_protected/employee')({
  beforeLoad: ({ context }) => {
      const { token } = context.auth;

      if (token) {
        const decoded = jwtDecode<ITokenPayload>(token.access);
        switch(decoded.role){
          case 'resident':
            return redirect({to: '/resident/dashboard'})
          case 'admin':
            return redirect({to: '/admin'})
        }
      }
    },
  component: RouteComponent,
})

function RouteComponent() {
  return <>
        <div className="d-flex vh-100 flex-column flex-column-reverse flex-sm-row">
          <SideBar/>
          <div className='w-100 overflow-auto'>
            <Outlet/>
          </div>
        </div>
      </>
}
