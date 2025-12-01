import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Header from "../../components/Header";
import { FaAngleRight } from "react-icons/fa6";
import { useAuth } from "../../contexts/auth/AuthContext";
import { useState } from "react";
import { useUpdateUser } from "../../hooks/user/useUpdateUser";
import { PiEyeBold, PiEyeClosedBold } from "react-icons/pi";

function AccountSetting() {
  const { user } = useAuth();

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [isConfirmPasswordShow, setIsConfirmPasswordShow] = useState(false);

  const validation = () => {
    let error = null;

    if (password !== confirmPassword) {
      error = "Password don't match";
      return { password, error };
    }

    if (password !== "" && confirmPassword !== "") {
      return { password, error };
    }

    error = "Password invalid";
    return { error, password };
  };

  const changePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { error, password } = validation();

    if (error) {
      console.error("Validation Error:", error);
      return;
    }
    await useUpdateUser(user?.id, { password });
    window.location.href = window.location.origin;
  };
  return (
    <Container
      className="pt-5 d-flex flex-column w-100"
      style={{ maxWidth: "70rem" }}
    >
      {/* Header component*/}
      <Header path={"admin"}>
        <div className="d-flex gap-3">
          <h3 className="fw-bold">Account Settings</h3>
        </div>
      </Header>

      {/* Form page heading */}
      <div className="d-flex align-items-center gap-1 pt-5 mb-3">
        <span className="text-muted fw-bold d-flex align-items-center">
          Dashboard
        </span>
        <FaAngleRight size={12} />
        <span className="text-dark fw-bold d-flex align-items-center">
          Account Settings
        </span>
      </div>

      {/* Change password Form */}
      <Form
        onSubmit={changePassword}
        className="p-5 rounded-3 mb-5"
        style={{ backgroundColor: "#F2F2F7" }}
      >
        <Row className="pt-3">
          <Col xs={12} md={6}>
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Enter New Password</Form.Label>
              <div className="position-relative d-flex align-items-center border rounded-2">
                <Form.Control value={password} onChange={(e) => setPassword(e.target.value)} placeholder={"New Password"} className="custom-font-size border-0 p-2" type={isPasswordShow ? 'text' : 'password'} autoComplete="current-password"/>
                <span onClick={() => setIsPasswordShow(!isPasswordShow)} className="me-2 position-absolute end-0">{!isPasswordShow ? <PiEyeClosedBold /> : <PiEyeBold />}</span>
              </div>
            </Form.Group>
          </Col>

          <Col xs={12} md={6}>
            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Label>Confirm New Password</Form.Label>
              <div className="position-relative d-flex align-items-center border rounded-2">
                <Form.Control value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder={"Confirm Password"} className="custom-font-size border-0 p-2" type={isConfirmPasswordShow ? 'text' : 'password'} autoComplete="current-password"/>
                <span onClick={() => setIsConfirmPasswordShow(!isConfirmPasswordShow)} className="me-2 position-absolute end-0">{!isConfirmPasswordShow ? <PiEyeClosedBold /> : <PiEyeBold />}</span>
              </div>
            </Form.Group>
          </Col>

          <Col className="d-flex gap-3 flex-wrap align-items-center justify-content-end mt-3">
            <Button
              type="submit"
              className="d-flex flex-grow-1 border-0 flex-sm-grow-0 align-items-center justify-content-center px-3 py-3 rounded-3"
              style={{ backgroundColor: "#344CB7", cursor: "pointer" }}
            >
              <span className="text-light text-center fw-bold">
                Change Password
              </span>
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default AccountSetting;
