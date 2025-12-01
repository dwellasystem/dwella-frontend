import { Col, Container, Form, Row } from "react-bootstrap"
import Header from "../../components/Header"
import { FaAngleRight } from "react-icons/fa6"

function SendReminder() {
  return (
    <Container className="pt-5 d-flex flex-column w-100" style={{maxWidth:"70rem"}}>
        {/* Header component*/}
        <Header path={'admin'}>
            <div className="d-flex gap-3">
                <h3 className='fw-bold'>Send Reminders</h3>
            </div>
        </Header>

        {/* Form page heading */}
        <div className='d-flex align-items-center gap-1 pt-5 mb-3'>
            <span className='text-muted fw-bold d-flex align-items-center'>Unpaid Accounts</span>
            <FaAngleRight size={12}/>
            <span className='text-dark fw-bold d-flex align-items-center'>Send Reminders</span>
        </div>

        {/* Reminders Form */}
        <div className='p-5 rounded-3 mb-5' style={{backgroundColor:"#F2F2F7"}}>
            <h3>Details</h3>
            <Row className='pt-3 gap-4'>
                {/* Method options */}
                <Col xs={12}>
                    <Form.Group controlId="formMethodOptions">
                        <Form.Label >Choose Method</Form.Label>
                        <Form.Select>
                            <option value={undefined}>Select</option>
                            <option value="1">Method One</option>
                            <option value="2">Method Two</option>
                            <option value="3">Method Three</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                 {/* Message Content */}
                <Col xs={12}>
                    <Form.Group className="mb-3" controlId="formMessageContent">
                        <Form.Label >Message Content</Form.Label>
                        <Form.Control as="textarea" rows={4} type="text" placeholder="e.g., Water service will be unavailable on May 6 from 8AM–5PM."/>
                    </Form.Group>
                </Col>

                <Col className='d-flex gap-3 flex-wrap align-items-center justify-content-end mt-3'>
                    <div className='d-flex flex-grow-1 flex-sm-grow-0 align-items-center justify-content-center px-5 py-3 rounded-3' style={{backgroundColor:"#CED4F5", cursor:"pointer"}}><span className='text-black text-center fw-bold'>Cancel</span></div>
                    <div className='d-flex flex-grow-1 flex-sm-grow-0 align-items-center justify-content-center px-5 py-3 rounded-3' style={{backgroundColor:"#344CB7", cursor:"pointer"}}><span className='text-light text-center fw-bold'>Send</span></div>
                </Col>
            </Row>
        </div>
    </Container>
  )
}

export default SendReminder