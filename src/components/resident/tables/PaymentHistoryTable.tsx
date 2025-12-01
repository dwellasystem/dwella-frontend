import { Container, Table } from "react-bootstrap"
import type { RecordPayments } from "../../../models/RecordPayment.model";
import { formatDateToHumanReadable } from "../../../helpers/authHelper/dateHelper";

type Props = {
  payments?: RecordPayments[];
}

function PaymentHistoryTable({payments}: Props) {
  return (
    <Container className="w-100 d-flex flex-column gap-3">
        <div className="fw-bold" style={{fontSize:"20px"}}><span style={{borderBottom:"#344CB7 5px solid"}}>Payment History</span></div>
        <div className="overflow-auto">
          <Table responsive={"sm"} className='table-bordered'>
            <thead>
              <tr className="text-nowrap">
                <th style={{backgroundColor:"#F2F2F7"}}>Date</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Amount</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Method</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Status</th>
                {/* <th style={{backgroundColor:"#F2F2F7"}}>Receipt</th> */}
              </tr>
            </thead>
            <tbody>
              {payments?.map((payment) => {
                const isAdvancePayment = payment.payment_type === 'advance';
                
                return (
                  <tr key={payment.id} className="text-nowrap">
                    <td>
                      {isAdvancePayment 
                        ? `${formatDateToHumanReadable(payment.advance_start_date!)} - ${formatDateToHumanReadable(payment.advance_end_date!)}`
                        : payment.bill?.due_date 
                          ? formatDateToHumanReadable(payment.bill.due_date)
                          : 'N/A'
                      }
                    </td>
                    <td>₱{payment.amount}</td>
                    <td>{payment.payment_method}</td>
                    <td>{payment.status}</td>
                    {/* <td className='text-md-center' style={{color:"blue"}}>Download</td> */}
                  </tr>
                );
              })}
              {payments && payments.length < 1 && <tr><td colSpan={6} className="text-center">No payment history found.</td></tr>}
            </tbody>
          </Table>
        </div>
      </Container>
  )
}

export default PaymentHistoryTable