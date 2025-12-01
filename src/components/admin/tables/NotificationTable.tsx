import { Table } from "react-bootstrap"

function NotificationTable() {
  return (
   <div className="w-100 d-flex flex-column gap-3 pt-3">
        <div className="overflow-auto">
          <Table responsive={"sm"} className='table-bordered'>
            <thead>
              <tr className="text-nowrap">
                <th style={{backgroundColor:"#F2F2F7"}}>Date Sent</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Message Title </th>
                <th style={{backgroundColor:"#F2F2F7"}}>Audience</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-nowrap">
                <td>Apr 27, 2025</td>
                <td>Water Interruption Notice</td>
                <td>All Residents</td>
                <td>Sent</td>
              </tr>
               <tr className="text-nowrap">
                <td>Apr 25, 2025</td>
                <td>Reminder: HOA Dues Due May 5</td>
                <td>Units 3A, 4B, 5C</td>
                <td>Sent</td>
              </tr>
               <tr className="text-nowrap">
                <td>Apr 24, 2025</td>
                <td>GYM Temporarily Closed</td>
                <td>All Residents</td>
                <td>Failed</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
  )
}

export default NotificationTable