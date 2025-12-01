import { Table } from 'react-bootstrap'
import type { RecordPayments } from '../../../models/RecordPayment.model';
import { formatDateToHumanReadable } from '../../../helpers/authHelper/dateHelper';

type Props = {
  payments?: RecordPayments[];
}

function FinancialHistoryTable({payments}: Props) {
  return (
    <div className="overflow-auto">
        <Table responsive={"sm"} className='table-bordered'>
          <thead>
            <tr className="text-nowrap">
              <th style={{backgroundColor:"#F2F2F7"}}>Unit</th>
              <th style={{backgroundColor:"#F2F2F7"}}>Date</th>
              <th style={{backgroundColor:"#F2F2F7"}}>Amount</th>
              <th style={{backgroundColor:"#F2F2F7"}}>Due Date</th>
              <th style={{backgroundColor:"#F2F2F7"}}>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments?.map((payment: any) => <tr key={payment.id} className="text-nowrap">
              <td>{payment.unit}</td>
              <td>{formatDateToHumanReadable(payment.created_at)}</td>
              <td>₱{payment.amount}</td>
              <td>{formatDateToHumanReadable(payment.bill.due_date)}</td>
              <td>{payment.status}</td>
            </tr>)}
            {payments && payments.length < 1 && <tr><td colSpan={5} className="text-center">No payment history found.</td></tr>}
          </tbody>
        </Table>
    </div>
  )
}

export default FinancialHistoryTable