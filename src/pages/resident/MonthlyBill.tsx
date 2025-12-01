import { Container } from "react-bootstrap"
import Header from "../../components/Header"

function MonthlyBill() {
  return (
    <Container className="vh-100 pt-sm-5 d-flex overflow-auto flex-column">

      {/* Header component */}
      <Header path={'employee'}>
        <div className="d-flex gap-3">
            <h3 className='fw-bold'>Monthly Bill</h3>
        </div>
      </Header>
    </Container>
  )
}

export default MonthlyBill