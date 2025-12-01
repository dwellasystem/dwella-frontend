import { Table } from "react-bootstrap"

function NoticeReceivedTable() {
  return (
    <div className="w-100 d-flex flex-column pt-3">
        <div className="overflow-auto">
          <Table responsive={"sm"} className='table-bordered'>
            <thead>
              <tr className="text-nowrap">
                <th style={{backgroundColor:"#F2F2F7"}}>Title</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Type</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Date Posted</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Expires</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-nowrap">
                <td>Water Interruption – May 6</td>
                <td>Maintenance</td>
                <td>April 25, 2025</td>
                <td>May 7, 2025</td>
                <td>View</td>
              </tr>
              <tr className="text-nowrap">
                <td>Reminder: May Dues</td>
                <td>Payment Reminder</td>
                <td>April 20, 2025</td>
                <td>May 6, 2025</td>
                <td>View</td>
              </tr>
            </tbody>
          </Table>
        </div>
    </div>
  )
}

export default NoticeReceivedTable