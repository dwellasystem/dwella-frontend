import { Table } from "react-bootstrap"

function PaymentHistoryTable() {
  return (
    <div className="w-100 d-flex flex-column gap-3 pt-3">
        <div className="overflow-auto">
          <Table responsive={"sm"} className='table-bordered'>
            <thead>
              <tr className="text-nowrap">
                <th style={{backgroundColor:"#F2F2F7"}}>Date</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Amount</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Method</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-nowrap">
                <td>Apr 27, 2025</td>
                <td>₱2,500</td>
                <td>Gcash</td>
                <td>Paid</td>
              </tr>
              <tr className="text-nowrap">
                <td>Mar 25, 2025</td>
                <td>₱2,500</td>
                <td>Bank Transfer</td>
                <td>Paid</td>
              </tr>
              <tr className="text-nowrap">
                <td>Feb 25, 2025</td>
                <td>₱2,500</td>
                <td>Gcash</td>
                <td>Paid</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
  )
}

export default PaymentHistoryTable