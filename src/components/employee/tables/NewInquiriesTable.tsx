import { Table } from 'react-bootstrap'
import type { Inquiry } from '../../../models/Inquiry.model'
import { formatDateToHumanReadable } from '../../../helpers/authHelper/dateHelper';
import { useNavigate } from '@tanstack/react-router';

type Props = {
  inquiries?: Inquiry[] | undefined;
}

function NewInquiriesTable({inquiries}: Props) {
  const navigate = useNavigate();


  return (
    <div className="w-100 d-flex flex-column">
        <div className="overflow-auto">
          <Table responsive={"sm"} className='table-bordered'>
            <thead>
              <tr className="text-nowrap">
                <th style={{backgroundColor:"#F2F2F7"}}>Resident Name</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Unit Number</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Type</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Date Submitted</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Status</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {inquiries && inquiries.map((inquiry) => <tr key={inquiry.id} className="text-nowrap">
                <td>{inquiry.resident.first_name} {inquiry.resident.middle_name} {inquiry.resident.last_name}</td>
                <td>{inquiry.unit.unit_name}</td>
                <td>{inquiry.type}</td>
                <td>{formatDateToHumanReadable(inquiry.created_at ?? '')}</td>
                <td>{inquiry.status}</td>
                <td className='text-primary' style={{cursor:"pointer"}} onClick={() => navigate({to:'/employee/inquiries'})}>Respond</td>
              </tr>)}
            </tbody>
          </Table>
        </div>
      </div>
  )
}

export default NewInquiriesTable