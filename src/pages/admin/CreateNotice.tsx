import { Col, Container, FloatingLabel, Form, Row } from "react-bootstrap"
import Header from "../../components/Header"
import { FaAngleRight } from "react-icons/fa6"

function CreateNotice() {
  return (
    <Container className="pt-5 d-flex flex-column w-100" style={{maxWidth:"70rem"}}>
        {/* Header component*/}
        <Header path={'admin'}>
            <div className="d-flex gap-3">
                <h3 className='fw-bold'>New Notice</h3>
            </div>
        </Header>

        {/* Form page heading */}
        <div className='d-flex align-items-center gap-1 pt-5 mb-3'>
            <span className='text-muted fw-bold d-flex align-items-center'>Notifications</span>
            <FaAngleRight size={12}/>
            <span className='text-dark fw-bold d-flex align-items-center'>New Notice</span>
        </div>

        {/* Notice Form */}
        <div className='p-5 rounded-3 mb-5' style={{backgroundColor:"#F2F2F7"}}>
            <h3>Details</h3>
            <Row className='pt-3'>

                {/* Title */}
                <Col xs={12}>
                    <Form.Group className="mb-3" controlId="formTitle">
                        <Form.Label >Title</Form.Label>
                        <Form.Control type="text" placeholder="e.g., Water Interruption Notice" />
                    </Form.Group>
                </Col>

                {/* Description */}
                <Col xs={12}>
                    <Form.Group className="mb-3" controlId="formTitle">
                        <Form.Label >Description</Form.Label>
                        <Form.Control as="textarea" rows={4} type="text" placeholder="e.g., Water service will be unavailable on May 6 from 8AM–5PM." />
                    </Form.Group>
                </Col>


                {/* Target Audience */}
                <Col xs={12} md={6}>
                    <FloatingLabel controlId="floatingSelect" label="Target Audience">
                        <Form.Select>
                            <option value={undefined}>Select audience</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                        </Form.Select>
                    </FloatingLabel>
                </Col>

                {/* Expiry Date */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formTitle">
                        <FloatingLabel controlId="floatingInputGrid" label="Expiry Date">
                            <Form.Control type="date" placeholder="name@example.com" />
                        </FloatingLabel>
                    </Form.Group>
                </Col>

                <Col className='d-flex gap-3 flex-wrap align-items-center justify-content-end mt-3'>
                    <div className='d-flex flex-grow-1 flex-sm-grow-0 align-items-center justify-content-center px-5 py-3 rounded-3' style={{backgroundColor:"#CED4F5", cursor:"pointer"}}><span className='text-black text-center fw-bold'>Cancel</span></div>
                    <div className='d-flex flex-grow-1 flex-sm-grow-0 align-items-center justify-content-center px-5 py-3 rounded-3' style={{backgroundColor:"#344CB7", cursor:"pointer"}}><span className='text-light text-center fw-bold'>Create</span></div>
                </Col>
            </Row>
        </div>
    </Container>
  )
}

export default CreateNotice