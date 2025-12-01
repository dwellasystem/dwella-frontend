import { createFileRoute, Outlet} from '@tanstack/react-router'
import ResidentProfile from '../../../../../../pages/admin/ResidentProfile'
import { Container} from 'react-bootstrap'

export const Route = createFileRoute('/_protected/admin/resident/$residentId/_view')({
  component: RouteComponent,
})

function RouteComponent() {
  const {residentId} = Route.useParams()
  return <>
    <Container 
      className="pt-5 d-flex flex-column"
      style={{ maxWidth: "70rem" }}
      >
     <ResidentProfile residentId={residentId}/>
     
     {/* <div className='d-flex gap-2 pt-3'>
        <Button 
          onClick={() => navigate({to:'/admin/resident/$residentId', params: {residentId}})}
          className='text-decoration-none rounded-0 border-end-0 border-start-0 border-top-0 text-primary'
          style={{backgroundColor:'white',borderBottom: location.pathname.endsWith(`/${residentId}`) ? "#344CB7 5px solid": "none"}}
        >
          Payment history
        </Button>
        <Button
          onClick={() => navigate({to:'/admin/resident/$residentId/notice-received', params: {residentId}})}
          className='text-decoration-none rounded-0 border-end-0 border-start-0 border-top-0 text-primary'
          style={{backgroundColor:'white',borderBottom: location.pathname.endsWith('/notice-received') ? "#344CB7 5px solid": "none"}}
        >
          Noticed Received
        </Button>
        <Button
          onClick={() => navigate({to:'/admin/resident/$residentId/inquires-history', params: {residentId}})}
          className='text-decoration-none rounded-0 border-end-0 border-start-0 border-top-0 text-primary'
          style={{backgroundColor:'white',borderBottom: location.pathname.endsWith('/inquires-history') ? "#344CB7 5px solid": "none"}}
        >
          Inquires History
        </Button>
     </div> */}
     
    <Outlet/>
    </Container>
  </>
}
