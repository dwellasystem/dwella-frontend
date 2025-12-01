import { Button, Col, Container, Form, Row, Toast, ToastContainer } from "react-bootstrap";
import "../../index.css";
import { useAuth } from "../../contexts/auth/AuthContext";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Authentication } from "../../models/Authentication.model";
import { jwtDecode } from "jwt-decode";
import type { ITokenPayload } from "../../interfaces/payloads/ITokenPayload";
import { PiEyeBold, PiEyeClosedBold } from "react-icons/pi";

const initialAuthentication: Authentication = {
  username: "",
  password: ""
};

export type LoginResponse = {
  access: string;
  refresh: string;
};

function Login() {
  const { login, token } = useAuth();
  const navigate = useNavigate();

  const [auth, setAuth] = useState<Authentication>(initialAuthentication);
  const [isPasswordShow, setIsPasswordShow] = useState(false);

  // ✅ Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "danger">("danger");

  // ✅ Redirect after login
  useEffect(() => {
    if (!token) return;

    const decoded = jwtDecode<ITokenPayload>(token.access);
    switch (decoded.role) {
      case "admin":
        navigate({ to: "/admin", replace: true });
        break;
      case "resident":
        navigate({ to: "/resident/dashboard", replace: true });
        break;
      case "employee":
        navigate({ to: "/employee", replace: true });
        break;
    }
  }, [token]);

  // ✅ Form validation
  // const validateForm = () => {
  //   if (!auth.username.trim() || !auth.password.trim()) {
  //     return "Username and Password are required.";
  //   }
  //   if (auth.password.length < 6) {
  //     return "Password must be at least 6 characters long.";
  //   }
  //   return null; // no error
  // };


 // ✅ Handle login
const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  try {
    const response = await login(auth.username, auth.password);

    if (response?.access) {
      setToastMessage("✅ Login successful! Redirecting...");
      setToastVariant("success");
      setShowToast(true);
      setAuth(initialAuthentication);
    }
  } catch (error) {
    console.error(error);
    setToastMessage("❌ Invalid username or password.");
    setToastVariant("danger");
    setShowToast(true);
  }
};

  return (
    <Container className="vh-100">
      <Row style={{ height: "10%" }}>
        <h1 className="my-auto custom-color fw-bold">Dwella</h1>
      </Row>
      <Row style={{ height: "90%" }}>
        <Container className="m-auto">
          {/* Login Form */}
          <Form className="custom-form rounded-4" onSubmit={handleLogin}>
            <Form.Label className="d-block text-center fs-2 fw-medium custom-color mb-5">
              Login in to DWELLA
            </Form.Label>

            {/* Username Field */}
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label className="custom-font-size">Username</Form.Label>
              <Form.Control
                value={auth.username}
                onChange={(e) => setAuth((data) => ({ ...data, username: e.target.value }))}
                className="custom-font-size"
                type="text"
                placeholder="Enter username"
                autoComplete="username"
              />
            </Form.Group>

            {/* Password Field */}
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label className="custom-font-size">Password</Form.Label>
              <div className="position-relative d-flex align-items-center border rounded-2">
                <Form.Control
                  value={auth.password}
                  onChange={(e) => setAuth((data) => ({ ...data, password: e.target.value }))}
                  className="custom-font-size border-0"
                  type={isPasswordShow ? "text" : "password"}
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
                <span
                  onClick={() => setIsPasswordShow(!isPasswordShow)}
                  className="me-2 position-absolute end-0"
                  style={{ cursor: "pointer" }}
                >
                  {!isPasswordShow ? <PiEyeClosedBold /> : <PiEyeBold />}
                </span>
              </div>
            </Form.Group>

            {/* Remember Me / Forgot Password */}
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Row>
                <Col xs={6}>
                  <Form.Check type="checkbox" label="Remember me" />
                </Col>
                <Col xs={6} className="text-end">
                  <a style={{cursor:'pointer'}} onClick={() => navigate({to:'/forgot-password'})}>Forgot password?</a>
                </Col>
              </Row>
            </Form.Group>

            {/* Submit Button */}
            <Button
              className="mb-3 d-block w-100 border-0"
              style={{ backgroundColor: "#344CB7" }}
              type="submit"
            >
              Login
            </Button>
          </Form>
        </Container>
      </Row>

      {/* ✅ Toast Notification */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg={toastVariant}
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={2500}
          autohide
        >
          <Toast.Header closeButton={false}>
            <strong className="me-auto">
              {toastVariant === "success" ? "Success" : "Error"}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
}

export default Login;
