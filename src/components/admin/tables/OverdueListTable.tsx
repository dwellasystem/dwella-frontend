import { OverlayTrigger, Table, Tooltip } from 'react-bootstrap'
import type { MonthlyBill } from '../../../models/MonthlyBill.model'
import { IoMdEye } from 'react-icons/io';
import { formatDateToHumanReadable } from '../../../helpers/authHelper/dateHelper';

type OverdueListTableProps = {
    overdues?: MonthlyBill[];
}

function OverdueListTable({overdues}: OverdueListTableProps) {
  return (
   <div className="w-100 d-flex flex-column gap-3 pt-2">
      <div className="overflow-auto">
        <Table responsive="sm" className="table-bordered">
          <thead>
            <tr className="text-nowrap">
              <th style={{ backgroundColor: "#F2F2F7" }}>Resident</th>
              <th style={{ backgroundColor: "#F2F2F7" }}>Due Date</th>
              <th style={{ backgroundColor: "#F2F2F7" }}>Status</th>
              <th style={{ backgroundColor: "#F2F2F7" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {overdues?.map((overdue) => <tr key={overdue.id}>
                <td>{overdue.user.first_name} {overdue.user.middle_name} {overdue.user.last_name}</td>
                <td>{formatDateToHumanReadable(overdue.due_date)}</td>
                <td>{overdue.due_status}</td>
                  <td className='d-flex align-items-center justify-content-center gap-2'>
                        <OverlayTrigger
                        placement={'top'}
                        overlay={
                          <Tooltip id={`tooltip-top`}>
                            View
                          </Tooltip>
                          }
                        >
                          <div className='text-primary fw-bold fs-5' style={{cursor:'pointer'}}><IoMdEye /></div>
                        </OverlayTrigger>
                    </td>
            </tr>)}
            {overdues && overdues?.length < 1 && <tr><td colSpan={6} className="text-center">No Assigned units found.</td></tr>}
          </tbody>
        </Table>
      </div>
       {/* 🟦 View Modal */}
    </div>
  )
}

export default OverdueListTable