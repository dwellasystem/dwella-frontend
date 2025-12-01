import { Table } from 'react-bootstrap'

function UnverifiedPaymentsTable() {
  return (
    <div className="w-100 d-flex flex-column">
        <div className="overflow-auto">
          <Table responsive={"sm"} className='table-bordered'>
            <thead>
              <tr className="text-nowrap">
                <th style={{backgroundColor:"#F2F2F7"}}>Resident Name</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Unit Number</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Payment Date</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Amount</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Proof of Payment</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-nowrap">
                <td>Bianca Santos</td>
                <td>2D</td>
                <td>April 27, 2025</td>
                <td>₱2,500</td>
                <td>Uploaded</td>
                <td className='text-primary'>Verified</td>
              </tr>
              <tr className="text-nowrap">
                <td>Leo Fernandez</td>
                <td>6A</td>
                <td>April 25, 2025</td>
                <td>₱5,000</td>
                <td>Uploaded</td>
                <td className='text-primary'>Verified</td>
              </tr>
              <tr className="text-nowrap">
                <td>James Lim</td>
                <td>1C</td>
                <td>April 28, 2025</td>
                <td>₱3,000</td>
                <td>Uploaded</td>
                <td className='text-primary'>Verified</td>
              </tr>
              <tr className="text-nowrap">
                <td>Angela Cruz</td>
                <td>3B</td>
                <td>April 26, 2025</td>
                <td>₱2,500</td>
                <td>Uploaded</td>
                <td className='text-primary'>Verified</td>
              </tr>
              <tr className="text-nowrap">
                <td>Carlo Dizon</td>
                <td>4F</td>
                <td>April 27, 2025</td>
                <td>₱2,800</td>
                <td>Uploaded</td>
                <td className='text-primary'>Verified</td>
              </tr>
              <tr className="text-nowrap">
                <td>Irene Villanueva</td>
                <td>5E</td>
                <td>April 28, 2025</td>
                <td>₱4,000</td>
                <td>Uploaded</td>
                <td className='text-primary'>Verified</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
  )
}

export default UnverifiedPaymentsTable