import { Button, Container, Form, Row } from "react-bootstrap"

function SignUp() {
  return (
    <Container className="vh-100">
      <Row style={{height: "10%"}}>
        <h1 className="my-auto custom-color fw-bold">Dwella</h1>
      </Row>
      <Row style={{height: "90%"}}>
        <Container className="m-auto">
            {/* Form for account creation */}
            <Form className="custom-form rounded-4 mb-3">
            <Form.Label className="d-block text-center fs-2 fw-medium custom-color">
                Sign up
            </Form.Label>

            {/* Fullname, Email Phone and Password field */}
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label className="custom-font-size">Fullname</Form.Label>
                <Form.Control className="custom-font-size" type="text" placeholder="ex. Brix Daomilas" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                <Form.Label className="custom-font-size">Email</Form.Label>
                <Form.Control className="custom-font-size" type="email" required placeholder="Enter email" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                <Form.Label className="custom-font-size">Phone number</Form.Label>
                <Form.Control className="custom-font-size" type="number" placeholder="Enter phone number" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                <Form.Label className="custom-font-size">Password</Form.Label>
                <Form.Control className="custom-font-size" type="password" placeholder="Enter password" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput5">
                <Form.Label className="custom-font-size">Confirm Password</Form.Label>
                <Form.Control className="custom-font-size" type="password" placeholder="Confirm your password" />
            </Form.Group>

            {/* Button to create account  */}
            <Button className="d-block w-100 border-0 mt-4" style={{backgroundColor: "#344CB7"}} type="submit">
                Create account
            </Button>
            {/* Button to redirect login */}
            <span className="text-center w-100 d-block mt-3">Already have an account? <a href="">Login</a></span>
            </Form>
        </Container>
      </Row>
    </Container>
  )
}

export default SignUp