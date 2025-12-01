import Header from '../../components/Header'
import { Col, Container, Form, Row } from 'react-bootstrap'
import { FaAngleRight } from 'react-icons/fa6'

function Contact() {
  return (
    <Container className="pt-5 d-flex flex-column w-100" style={{maxWidth:"70rem"}}>
        {/* Header component*/}
        <Header path={'resident'}>
            <div className="d-flex gap-3">
                <h3 className='fw-bold'>Contact Admin</h3>
            </div>
        </Header>

        {/* Form page heading */}
        <div className='d-flex align-items-center gap-1 pt-5 mb-3'>
            <span className='text-muted fw-bold d-flex align-items-center'>Dashboard</span>
            <FaAngleRight size={12}/>
            <span className='text-dark fw-bold d-flex align-items-center'>Contact Admin</span>
        </div>

        {/* Pay now Form */}
        <div className='p-5 rounded-3 mb-5' style={{backgroundColor:"#F2F2F7"}}>
            <h3>Details</h3>
            <Row className='pt-3'>
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formFullname">
                        <Form.Label >Fullname</Form.Label>
                        <Form.Control type="text" placeholder="Amount" />
                    </Form.Group>
                </Col>

                {/* Payment option */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formUnitNumber">
                        <Form.Label >Unit number</Form.Label>
                        <Form.Control type="text" placeholder="Unit number" />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" controlId="formSubject">
                        <Form.Label>Subject</Form.Label>
                        <Form.Control type="text" placeholder="eg. Internet issue..." />
                    </Form.Group>
                </Col>

                {/* Remarks text for description */}
                <Col xs={12}>
                    <Form.Group className="mb-3" controlId="formMessage">
                        <Form.Label >Message</Form.Label>
                        <Form.Control as="textarea" type="text" rows={4} placeholder="e.g., Water service will be unavailable on May 6 from 8AM–5PM."/>
                    </Form.Group>
                </Col>

                 {/* Upload file component for file upload */}
                <Col xs={'12'}>
                    {/* <UploadFile title='Attach File(Optional)'/> */}
                </Col>

                <Col className='d-flex gap-3 flex-wrap align-items-center justify-content-end mt-3'>
                    <div className='d-flex flex-grow-1 flex-sm-grow-0 align-items-center justify-content-center px-5 py-3 rounded-3' style={{backgroundColor:"#CED4F5", cursor:"pointer"}}><span className='text-black text-center fw-bold'>Cancel</span></div>
                    <div className='d-flex flex-grow-1 flex-sm-grow-0 align-items-center justify-content-center px-3 py-3 rounded-3' style={{backgroundColor:"#344CB7", cursor:"pointer"}}><span className='text-light text-center fw-bold'>Send Message</span></div>
                </Col>
            </Row>
        </div>
    </Container>
  )
}

export default Contact