import { Col, Container, Form, Row } from 'react-bootstrap'

function UnitInformation() {
  return (
    <Container className="vh-100">
      <Row style={{height: "10%"}}>
        <h1 className="my-auto custom-color fw-bold">Dwella</h1>
      </Row>
      <Row style={{height: "90%"}}>
        <Container className="m-auto">
            {/* Unit information form */}
            <Form className="custom-form rounded-4 mb-3">
            <Form.Label className="d-block text-start fs-2 fw-medium custom-color">
                Unit Information
            </Form.Label>

            {/* Unit number, building and move-in date field */}
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label className="custom-font-size">Unit Number</Form.Label>
                <Form.Control className="custom-font-size" type="number" placeholder="ex. Unit 1" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                <Form.Label className="custom-font-size">Building</Form.Label>
                <Form.Control className="custom-font-size" type="text" placeholder="ex. Building 1" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                <Form.Label className="custom-font-size">Move in date</Form.Label>
                <Form.Control className="custom-font-size" type="date" />
            </Form.Group>

            {/* Upload valid id */}
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                <Form.Label className="custom-font-size">Upload valid ID</Form.Label>
                <Container fluid style={{border: "1px black dashed", padding: "2rem"}}>
                    <Row>
                        <Col className='text-center'><span className="material-symbols-outlined fs-1">cloud_upload</span></Col>
                    </Row>
                    <Row>
                        <Col className='text-center' style={{fontSize: "12px"}}>Drag and drop files <a href="">Browse</a></Col>
                    </Row>
                    <Row>
                        <Col className='text-center' style={{fontSize: "12px"}}>Supported formates: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT</Col>
                    </Row>
                </Container>
            </Form.Group>

            <Form.Group className='mb-3'>
                <Form.Check type="checkbox" label="I agree to the terms and privacy policy" style={{fontSize: "14px"}} />
            </Form.Group>
            
            {/* Submit and cancel button */}
            <Form.Group>
                <Row className='gap-2 gap-md-0 justify-content-around'>
                    <Col md={5} className="text-center text-black fw-bold p-2 rounded-2" style={{backgroundColor: "#CED4F5"}}>Cancel</Col>
                    <Col md={5} className="text-center p-2 rounded-2 text-white fw-bold" style={{backgroundColor: "#344CB7"}}>Submit</Col>
                </Row>
            </Form.Group>
            </Form>
        </Container>
      </Row>
    </Container>
  )
}

export default UnitInformation