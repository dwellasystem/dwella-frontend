import { OverlayTrigger, Table, Tooltip } from 'react-bootstrap'
import { FaPencilAlt, FaRegTrashAlt } from 'react-icons/fa'
import { IoMdEye } from 'react-icons/io'
import type { User } from '../../../models/User.model';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../../../contexts/auth/AuthContext';

type ResidentListTableProps = {
  users?: User[];
  deleteUser: (id: number) => void;
};

function EmployeeListTable({users, deleteUser}: ResidentListTableProps) {

    const navigate = useNavigate();
  
    const {role} = useAuth();
  
  
    const viewHandler = async (id: string) => {
      navigate({to:`/${role}/employee/$employeeId`, params:{employeeId: id}})
    }

  return (
    <div className="w-100 d-flex flex-column gap-3 pt-2">
            <div className="overflow-auto">
              <Table responsive={"sm"} className='table-bordered'>
                <thead>
                  <tr className="text-nowrap">
                    <th style={{backgroundColor:"#F2F2F7"}}>Employee Name</th>
                    <th style={{backgroundColor:"#F2F2F7"}}>Role</th>
                    <th style={{backgroundColor:"#F2F2F7"}}>Contact Number</th>
                    <th style={{backgroundColor:"#F2F2F7"}}>Email</th>
                    <th style={{backgroundColor:"#F2F2F7"}}>Account Status</th>
                    <th style={{backgroundColor:"#F2F2F7"}}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user: User) => (
                    <tr key={user.id} className="text-nowrap">
                        <td>{user.first_name} {user.middle_name}</td>
                        <td>{user.role}</td>
                        <td>{user.phone_number}</td>
                        <td>{user.email}</td>
                        <td>{user.account_status}</td>
                        <td className='d-flex align-items-center justify-content-center gap-2'>
                          <OverlayTrigger
                            placement={'top'}
                            overlay={
                              <Tooltip id={`tooltip-top`}>
                                Edit
                              </Tooltip>
                              }
                            >
                              <div onClick={() => navigate({to:`/${role}/employee/$employeeId`, params:{employeeId: user.id?.toString() ?? ''}})} className='text-black fw-bold fs-5' style={{cursor:'pointer'}}><FaPencilAlt /></div>
                            </OverlayTrigger>
                            
                            <OverlayTrigger
                            placement={'top'}
                            overlay={
                              <Tooltip id={`tooltip-top`}>
                                Delete
                              </Tooltip>
                              }
                            >
                              <div onClick={() => deleteUser(user.id ?? 0)} className='text-danger fw-bold fs-5' style={{cursor:'pointer'}}><FaRegTrashAlt /></div>
                            </OverlayTrigger>

                            <OverlayTrigger
                            placement={'top'}
                            overlay={
                              <Tooltip id={`tooltip-top`}>
                                View
                              </Tooltip>
                              }
                            >
                              <div onClick={() => viewHandler(user.id?.toString() ?? "")} className='text-primary fw-bold fs-5' style={{cursor:'pointer'}}><IoMdEye /></div>
                            </OverlayTrigger>
                        </td>
                    </tr>
                  ))}
                  {users && users.length < 1 && <tr><td colSpan={6} className="text-center">No Employees found.</td></tr>}
                </tbody>
              </Table>
            </div>
          </div>
  )
}

export default EmployeeListTable