import {Table } from "react-bootstrap"
import type { MonthlyBill } from "../../../models/MonthlyBill.model"
import { formatDateToHumanReadable } from "../../../helpers/authHelper/dateHelper";

type Props = {
    bills?: MonthlyBill[];
}

function BillingListTable({bills}: Props) {
  return (
     <div className="overflow-auto">
        <Table responsive={"sm"} className='table-bordered'>
            <thead>
            <tr className="text-nowrap">
                <th style={{backgroundColor:"#F2F2F7"}}>Unit</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Due Date</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Amount</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Status</th>
            </tr>
            </thead>
            <tbody>
            {bills && bills.length > 0 ? (
                bills.map((bill) => (
                <tr key={bill.id} className="text-nowrap">
                    <td>{bill.unit?.unit_name}</td>
                    <td>{formatDateToHumanReadable(bill.due_date)}</td>
                    <td>{`PHP ${bill.amount_due}`}</td>
                    <td>{bill.due_status}</td>
                </tr>
                ))
            ) : (
                <tr>
                <td colSpan={4} className="text-center">
                    No bills found.
                </td>
                </tr>
            )}
            </tbody>
        </Table>
    </div>
  )
}

export default BillingListTable