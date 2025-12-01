import { Table } from 'react-bootstrap'
import type { Inquiry } from '../../../models/Inquiry.model';
import { formatDateToHumanReadable } from '../../../helpers/authHelper/dateHelper';

type Props = {
  inquiries?: Inquiry[];
}

function InquiriesTable({inquiries}:Props) {
  
  return (
    <div className="w-100 d-flex flex-column">
        <div className="overflow-auto">
          <Table responsive={"sm"} className='table-bordered'>
            <thead>
              <tr className="text-nowrap">
                <th style={{backgroundColor:"#F2F2F7"}}>Title</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Unit Number</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Type</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Date Requested</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Status</th>
              </tr>
            </thead>
            <tbody>
              {inquiries?.map((inquiry: Inquiry) => (
                <tr key={inquiry.id} className="text-nowrap">
                  <td>{inquiry.title}</td>
                  <td>{inquiry.unit.unit_name}</td>
                  <td>{inquiry.type}</td>
                  <td>{formatDateToHumanReadable(inquiry.created_at ?? '')}</td>
                  <td>{inquiry.status}</td>
                </tr>
              ))}
              {inquiries && inquiries.length < 1 && <tr><td colSpan={5} className="text-center">No inquiries found.</td></tr>}
            </tbody>
          </Table>
        </div>
      </div>
  )
}

export default InquiriesTable