import { Table } from "react-bootstrap"

function PendingNoticesTable() {
  return (
    <div className="w-100 d-flex flex-column">
        <div className="overflow-auto">
          <Table responsive={"sm"} className='table-bordered'>
            <thead>
              <tr className="text-nowrap">
                <th style={{backgroundColor:"#F2F2F7"}}>Title</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Type</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Created By</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Status</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-nowrap">
                <td>Water Interruption – May 6</td>
                <td>Maintenance</td>
                <td>Billing Staff</td>
                <td>Draft</td>
                <td className="text-primary">Edit</td>
              </tr>
              <tr className="text-nowrap">
                <td>Reminder: May 5 Payment Due</td>
                <td>Reminder</td>
                <td>Comm Officer</td>
                <td>Scheduled</td>
                <td className="text-primary">Edit</td>
              </tr>
              <tr className="text-nowrap">
                <td>Summer Clean-Up Campaign</td>
                <td>Event</td>
                <td>Comm Officer</td>
                <td>Draft</td>
                <td className="text-primary">Edit</td>
              </tr>
              <tr className="text-nowrap">
                <td>Elevator Inspection – May 8</td>
                <td>Maintenance</td>
                <td>Billing Staff</td>
                <td>Scheduled</td>
                <td className="text-primary">Edit</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
  )
}

export default PendingNoticesTable