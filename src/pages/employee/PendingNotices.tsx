import { Container } from "react-bootstrap"
import Header from "../../components/Header"
import PendingNoticesTable from "../../components/employee/tables/PendingNoticesTable"
import { FaAngleRight } from "react-icons/fa6"

function PendingNotices() {
  return (
    <Container className="pt-5 d-flex overflow-auto flex-column">
      {/* Header page */}
      <Header path={'employee'}>
        <div className="d-flex">
            <h3 className='fw-bold'>Pending Notices</h3>
        </div>
      </Header>

      <div className='d-flex align-items-center gap-1 pt-5 mb-3'>
        <span className='text-muted fw-bold d-flex align-items-center'>Dashboard</span>
            <FaAngleRight size={12}/>
        <span className='text-dark fw-bold d-flex align-items-center'>Pending Notices</span>
      </div>

      <PendingNoticesTable/>
    </Container>
  )
}

export default PendingNotices