import { OverlayTrigger, Table, Tooltip } from 'react-bootstrap'
import type { Inquiry } from '../../../models/Inquiry.model'
import MessageModal from '../../modals/MessageModal';
import { CiCircleMore } from 'react-icons/ci';
import { formatDateToHumanReadable } from '../../../helpers/authHelper/dateHelper';

type Props = {
  inquiries?: Inquiry[];
  editInquiry: (detail: Inquiry) => void;
  deleteInquiry: (id: number) => void;
}

function InquiriesTable({inquiries, editInquiry, deleteInquiry}: Props) {
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
              {inquiries?.map((inquiry: Inquiry) => {
                return (
                  <tr key={inquiry.id} className="text-nowrap">
                    <td>{inquiry.resident.first_name} {inquiry.resident.middle_name} {inquiry.resident.last_name}</td>
                    <td>{inquiry.unit.unit_name}</td>
                    <td>{inquiry.type}</td>
                    <td>{formatDateToHumanReadable(inquiry?.created_at ?? "")}</td>
                    <td>{inquiry.status}</td>
                    <td className='text-primary d-flex justify-content-center gap-2'>
                      <OverlayTrigger
                        placement={'top'}
                        overlay={
                          <Tooltip id={`tooltip-top`}>
                            Edit
                          </Tooltip>
                          }
                        >
                        <a onClick={() => editInquiry(inquiry)} style={{cursor:'pointer'}}><CiCircleMore size={25}/></a>
                      </OverlayTrigger>
                      <MessageModal confirmDelete={() => deleteInquiry(inquiry.id)} deleteItem={inquiry.title}/>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
          {inquiries?.length! === 0 && <h3 className="text-center">No Available Data</h3>}
        </div>
      </div>
  )
}

export default InquiriesTable