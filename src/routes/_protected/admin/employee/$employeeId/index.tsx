import { createFileRoute, useNavigate } from '@tanstack/react-router'
import EmployeeProfile from '../../../../../pages/admin/EmployeeProfile';

export const Route = createFileRoute('/_protected/admin/employee/$employeeId/')({
  component: RouteComponent,
})

function RouteComponent() {
    const {employeeId} = Route.useParams();
    const navigate = useNavigate();

    if(!Number(employeeId)){
      return navigate({to:'/admin/employee'})  
    }

    return <EmployeeProfile employeeId={employeeId}/>
}
