import { createFileRoute, Link, Outlet, useLocation } from '@tanstack/react-router'
import ResidentProfile from '../../../../../../pages/employee/ResidentProfile'
import { Container } from 'react-bootstrap';

export const Route = createFileRoute('/_protected/employee/resident/$residentId/_view')({
  component: RouteComponent,
})

function RouteComponent() {
  const {residentId} = Route.useParams();
  const location = useLocation();
  return <>

      <Container
        className="pt-5 d-flex flex-column"
        style={{ maxWidth: "70rem" }}
      >
        <ResidentProfile residentId={residentId}/>
        <div className='d-flex gap-2 pt-3'>
            <Link 
              to='/employee/resident/$residentId' 
              params={{residentId:residentId}}
              className='text-decoration-none'
              style={{borderBottom: location.pathname.endsWith(`/${residentId}`) ? "#344CB7 5px solid": ""}}
            >
              Payment history
            </Link>
            <Link 
              to='/employee/resident/$residentId/notice-received' 
              params={{residentId:residentId}}
              className='text-decoration-none'
              style={{borderBottom: location.pathname.endsWith('/notice-received') ? "#344CB7 5px solid": ""}}
            >
              Noticed Received
            </Link>
            <Link 
              to='/employee/resident/$residentId/inquires-history'
              params={{residentId:residentId}}
              className='text-decoration-none'
              style={{borderBottom: location.pathname.endsWith('/inquires-history') ? "#344CB7 5px solid": ""}}
            >
              Inquires History
            </Link>
        </div>
        <Outlet/>
      </Container>
  </>
}
