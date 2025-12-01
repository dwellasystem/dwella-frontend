import { Table } from "react-bootstrap"

function MonthlyDuesTable() {
  return (
    <div className="w-100 d-flex flex-column gap-3 pt-3">
        <div className="overflow-auto">
          <Table responsive={"sm"} className='table-bordered'>
            <thead>
              <tr className="text-nowrap">
                <th style={{backgroundColor:"#F2F2F7"}}>Unit Number</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Resident Name</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Amount Due</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Due Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-nowrap">
                <td>3A</td>
                <td>John Cruz</td>
                <td>₱2,500</td>
                <td>May 05, 2025</td>
              </tr>
              <tr className="text-nowrap">
                <td>3B</td>
                <td>Anna Reyes</td>
                <td>₱2,500</td>
                <td>May 05, 2025</td>
              </tr>
              <tr className="text-nowrap">
                <td>4A</td>
                <td>Mark Santos</td>
                <td>₱3,000</td>
                <td>May 05, 2025</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
  )
}

export default MonthlyDuesTable