import { OverlayTrigger, Table, Tooltip } from 'react-bootstrap'
import { FaPencilAlt, FaRegTrashAlt } from 'react-icons/fa'
import { IoMdEye } from 'react-icons/io'
import type { User } from '../../../models/User.model'
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../../../contexts/auth/AuthContext';
import { formatDateToHumanReadable } from '../../../helpers/authHelper/dateHelper';
import UnitList from '../UnitList';

type ResidentListTableProps = {
  users?: User[];
  deleteResident: (id: number) => void;
};

function ResidentListTable({users, deleteResident}: ResidentListTableProps) {

  const navigate = useNavigate();

  const {role} = useAuth();

  return (
    <div className="w-100 d-flex flex-column gap-3 pt-2">
        <div className="overflow-auto">
          <Table responsive={"sm"} className='table-bordered'>
            <thead>
              <tr className="text-nowrap">
                <th style={{backgroundColor:"#F2F2F7"}}>Unit</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Resident Name</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Contact Number</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Email</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Account Status</th>
                {/* <th style={{backgroundColor:"#F2F2F7"}}>Address</th> */}
                <th style={{backgroundColor:"#F2F2F7"}}>Date Created</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user: User) => (
                <tr key={user.id} className="text-nowrap overflow-hidden ">
                    <td>
                      <UnitList id={user.id?.toString()}/>
                    </td>
                    <td>{user.first_name} {user.middle_name} {user.last_name}</td>
                    <td>{user.phone_number}</td>
                    <td>{user.email}</td>
                    <td>{user.account_status}</td>
                    {/* <td>{user.address === '' && 'not set'}</td> */}
                    <td>{formatDateToHumanReadable(user.created_at ?? '')}</td>
                    <td className='d-flex align-items-center justify-content-center gap-2'>
                      <OverlayTrigger
                        placement={'top'}
                        overlay={
                          <Tooltip id={`tooltip-top`}>
                            Edit
                          </Tooltip>
                          }
                        >
                          <div onClick={() => navigate({to:`/${role}/resident/$residentId/edit`, params:{residentId: user.id?.toString() ?? ''}})} className='text-black fw-bold fs-5' style={{cursor:'pointer'}}><FaPencilAlt /></div>
                        </OverlayTrigger>
                        <OverlayTrigger
                        placement={'top'}
                        overlay={
                          <Tooltip id={`tooltip-top`}>
                            Delete
                          </Tooltip>
                          }
                        >
                          <div onClick={() => deleteResident(user.id ?? 0)} className='text-danger fw-bold fs-5' style={{cursor:'pointer'}}><FaRegTrashAlt /></div>
                        </OverlayTrigger>
                        <OverlayTrigger
                        placement={'top'}
                        overlay={
                          <Tooltip id={`tooltip-top`}>
                            View
                          </Tooltip>
                          }
                        >
                          <div onClick={() => navigate({to:`/${role}/resident/$residentId`, params:{residentId: user.id?.toString() ?? ''}})} className='text-primary fw-bold fs-5' style={{cursor:'pointer'}}><IoMdEye /></div>
                        </OverlayTrigger>
                    </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {users && users.length < 1 && <h3 className='text-center'>No Resident Available</h3>}
        </div>
      </div>
  )
}

export default ResidentListTable