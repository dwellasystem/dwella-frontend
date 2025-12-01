import { Col, Container, Form, Row } from "react-bootstrap"
import Header from "../../components/Header"
import { FaAngleRight } from "react-icons/fa6"

function MonthlyDue() {
  return (
    <Container className="pt-5 d-flex flex-column w-100" style={{maxWidth:"70rem"}}>
        {/* Header component*/}
        <Header path={'admin'}>
            <div className="d-flex gap-3">
                <h3 className='fw-bold'>Upload Monthly Dues</h3>
            </div>
        </Header>

        {/* Form page heading */}
        <div className='d-flex align-items-center gap-1 pt-5 mb-3'>
            <span className='text-muted fw-bold d-flex align-items-center'>Financial</span>
            <FaAngleRight size={12}/>
            <span className='text-dark fw-bold d-flex align-items-center'>Upload Monthly Dues</span>
        </div>

        {/* Monthly due form */}
        <div className='p-5 rounded-3 mb-5' style={{backgroundColor:"#F2F2F7"}}>
            <h3>Details</h3>
            <Row className='pt-3'>

                {/* Unit Number */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formUnitNumber">
                        <Form.Label >Unit Number</Form.Label>
                        <Form.Control type="text" placeholder="e.g., 3A" />
                    </Form.Group>
                </Col>

                {/* Resident Name */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formResidentName">
                        <Form.Label >Resident Name</Form.Label>
                        <Form.Control type="text" placeholder="e.g., John Cruz" />
                    </Form.Group>
                </Col>

                {/* Amount Due */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formAmountDue">
                        <Form.Label >Amount Due</Form.Label>
                        <Form.Control type="number" placeholder="e.g., 2,500" />
                    </Form.Group>
                </Col>

                {/* Due Date */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formDueDate">
                        <Form.Label >Due Date</Form.Label>
                        <Form.Control type="date"/>
                    </Form.Group>
                </Col>

                <Col className='d-flex gap-3 flex-wrap align-items-center justify-content-end mt-3'>
                    <div className='d-flex flex-grow-1 flex-sm-grow-0 align-items-center justify-content-center px-5 py-3 rounded-3' style={{backgroundColor:"#CED4F5", cursor:"pointer"}}><span className='text-black text-center fw-bold'>Cancel</span></div>
                    <div className='d-flex flex-grow-1 flex-sm-grow-0 align-items-center justify-content-center px-5 py-3 rounded-3' style={{backgroundColor:"#344CB7", cursor:"pointer"}}><span className='text-light text-center fw-bold'>Upload</span></div>
                </Col>
            </Row>
        </div>
    </Container>
  )
}

export default MonthlyDue