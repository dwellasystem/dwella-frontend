import { Container, Table } from "react-bootstrap"
import type { RecordPayments } from "../../../models/RecordPayment.model"
import { formatDateToHumanReadable } from "../../../helpers/authHelper/dateHelper"

type Props = {
  payments?: RecordPayments[]
}

function PaymentHistoryTable({payments}: Props) {
  return (
    <Container className="w-100 d-flex flex-column gap-3 pt-5">
        <div className="fw-bold" style={{fontSize:"20px"}}><span style={{borderBottom:"#344CB7 5px solid"}}>Payment History</span></div>
        <div className="overflow-auto">
          <Table responsive={"sm"} className='table-bordered'>
            <thead>
              <tr className="text-nowrap">
                <th style={{backgroundColor:"#F2F2F7"}}>Date</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Resident Name</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Unit</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Amount</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Method</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments?.map((payment: any) => <tr key={payment.id} className="text-nowrap">
                <td>{formatDateToHumanReadable(payment.bill.due_date)}</td>
                <td>{payment.user.first_name}</td>
                <td>{payment.unit}</td>
                <td>₱{payment.amount}</td>
                <td>{payment.payment_method}</td>
                <td className='text-md-start fw-bold'>{payment.status}</td>
              </tr>)}
            </tbody>
          </Table>
        </div>
      </Container>
  )
}

export default PaymentHistoryTable
