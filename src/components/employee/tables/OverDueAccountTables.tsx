import { Table } from 'react-bootstrap'
import type { Overdues } from '../../../hooks/payments/useOverdues'
type Props = {
  overdues?: Overdues[] | null
}
function OverDueAccountTables({overdues}: Props) {
  return (
    <div className="w-100 d-flex flex-column">
        <div className="overflow-auto">
          <Table responsive={"sm"} className='table-bordered'>
            <thead>
              <tr className="text-nowrap">
                <th style={{backgroundColor:"#F2F2F7"}}>Resident Name</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Unit Number</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Total Amount Due</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Months Due</th>
              </tr>
            </thead>
            <tbody>
              {overdues && overdues.map((overdue, index) => (
                <tr key={index} className="text-nowrap">
                  <td>{overdue.user}</td>
                  <td>{overdue.unit.join(", ")}</td>
                  <td>₱{overdue.totalAmountDue.toLocaleString()}</td>
                  <td>{overdue.monthsDue.join(", ")}</td>
                </tr>
              ))}
              {overdues?.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center">No overdue accounts found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
  )
}

export default OverDueAccountTables