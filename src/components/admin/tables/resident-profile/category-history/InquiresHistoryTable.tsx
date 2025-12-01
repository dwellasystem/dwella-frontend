import { Table } from "react-bootstrap"

function InquiresHistoryTable() {
  return (
    <div className="w-100 d-flex flex-column pt-3">
        <div className="overflow-auto">
          <Table responsive={"sm"} className='table-bordered'>
            <thead>
              <tr className="text-nowrap">
                <th style={{backgroundColor:"#F2F2F7"}}>Subject</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Type</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Date Posted</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-nowrap">
                <td>Leaking Faucet</td>
                <td>Maintenance</td>
                <td>April 25, 2025</td>
                <td>In Progress</td>
              </tr>
              <tr className="text-nowrap">
                <td>Billing Dispute</td>
                <td>Complaint</td>
                <td>April 22, 2025</td>
                <td>Resolved</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
  )
}

export default InquiresHistoryTable