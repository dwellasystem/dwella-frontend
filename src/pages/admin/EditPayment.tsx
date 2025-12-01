import { Col, Container, Form, Row } from "react-bootstrap"
import Header from "../../components/Header"
import { FaAngleRight } from "react-icons/fa6"

function EditPayment() {
  return (
    <Container className="pt-5 d-flex flex-column w-100" style={{maxWidth:"70rem"}}>
        {/* Header component*/}
        <Header path={'admin'}>
            <div className="d-flex gap-3">
                <h3 className='fw-bold'>Edit Payment</h3>
            </div>
        </Header>

        {/* Form page heading */}
        <div className='d-flex align-items-center gap-1 pt-5 mb-3'>
            <span className='text-muted fw-bold d-flex align-items-center'>Financial</span>
            <FaAngleRight size={12}/>
            <span className='text-dark fw-bold d-flex align-items-center'>Edit Payment</span>
        </div>

        {/* Add Resident Form */}
        <div className='p-5 rounded-3 mb-5' style={{backgroundColor:"#F2F2F7"}}>
            <h3>Details</h3>
            <Row className='pt-3'>

                {/* Resident Name */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formResidentName">
                        <Form.Label >Resident Name</Form.Label>
                        <Form.Control type="text" placeholder="e.g., EJ Gwapo" />
                    </Form.Group>
                </Col>

                {/* Unit Number */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formUnitNumber">
                        <Form.Label >Unit Number</Form.Label>
                        <Form.Control type="text" placeholder="e.g., 09123456789" />
                    </Form.Group>
                </Col>

                {/* Amount Paid */}
                <Col>
                    <Form.Group className="mb-3" controlId="formAmountPaid">
                        <Form.Label >Amount Paid</Form.Label>
                        <Form.Control type="number" placeholder="e.g., 2500" />
                    </Form.Group>
                </Col>

                {/* Date of Payment */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formDateOfPayment">
                        <Form.Label >Date of Payment</Form.Label>
                        <Form.Control type="date"/>
                    </Form.Group>
                </Col>

                {/* Payment Method */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formPaymentMethod">
                        <Form.Label >Payment Method</Form.Label>
                        <Form.Select  aria-label="Default select example">
                            <option value={undefined}>Select</option>
                            <option value="active">Gcash</option>
                            <option value="inactive">Bank</option>
                            <option value="inactive">Cash</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                
                 {/* Proof payment */}
                <Col xs={12} md={6}>
                     <Form.Group controlId="formPaymentProof" className="mb-3">
                        <Form.Label>Proof of Payment</Form.Label>
                        <Form.Control type="file" />
                    </Form.Group>
                </Col>

                {/* Payment Status */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formPaymentStatus">
                        <Form.Label >Payment Status</Form.Label>
                        <Form.Select  aria-label="Default select example">
                            <option value={undefined}>Select</option>
                            <option value="verified">Verified</option>
                            <option value="pending">Pending</option>
                            <option value="reject">Reject</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col className='d-flex gap-3 flex-wrap align-items-center justify-content-end mt-3'>
                    <div className='d-flex flex-grow-1 flex-sm-grow-0 align-items-center justify-content-center px-5 py-3 rounded-3' style={{backgroundColor:"#CED4F5", cursor:"pointer"}}><span className='text-black text-center fw-bold'>Cancel</span></div>
                    <div className='d-flex flex-grow-1 flex-sm-grow-0 align-items-center justify-content-center px-3 py-3 rounded-3' style={{backgroundColor:"#344CB7", cursor:"pointer"}}><span className='text-light text-center fw-bold'>Edit Payment</span></div>
                </Col>
            </Row>
        </div>
    </Container>
  )
}

export default EditPayment