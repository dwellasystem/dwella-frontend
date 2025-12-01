import React, { useState } from 'react';
import { Button, Container, Form, Row, Toast, ToastContainer } from 'react-bootstrap';
import api from '../../api/api';
import { useNavigate } from '@tanstack/react-router';
import { API_BASE_URL } from '../../api/endpoint';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'danger'>('danger');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // Basic email validation
    if (!email.trim()) {
      setToastMessage('❌ Please enter your email address.');
      setToastVariant('danger');
      setShowToast(true);
      setIsLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setToastMessage('❌ Please enter a valid email address.');
      setToastVariant('danger');
      setShowToast(true);
      setIsLoading(false);
      return;
    }

    try {
      // Call the actual API
      await api.post(`${API_BASE_URL}/password-reset/`, { email });
      
      setToastMessage('✅ Password reset link sent! Check your email.');
      setToastVariant('success');
      setShowToast(true);
      setIsSubmitted(true);
      
    } catch (error: any) {
      const message = error.response?.data?.message || '❌ Failed to send reset link. Please try again.';
      setToastMessage(message);
      setToastVariant('danger');
      setShowToast(true);
      console.error('Error sending reset email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate({to:'/login'});
  };

  return (
    <Container className="vh-100">
      <Row style={{ height: "10%" }}>
        <h1 className="my-auto custom-color fw-bold">Dwella</h1>
      </Row>
      <Row style={{ height: "90%" }}>
        <Container className="m-auto">
          {/* Forgot Password Form */}
          <Form className="custom-form rounded-4" onSubmit={handleSubmit}>
            <Form.Label className="d-block text-center fs-2 fw-medium custom-color mb-5">
              Forgot Password
            </Form.Label>

            {!isSubmitted ? (
              <>
                <Form.Group className="mb-4" controlId="forgotPasswordEmail">
                  <Form.Label className="custom-font-size">Email Address</Form.Label>
                  <Form.Control
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="custom-font-size"
                    type="email"
                    placeholder="Enter your email address"
                    autoComplete="email"
                    disabled={isLoading}
                  />
                  <Form.Text className="text-muted">
                    We'll send you a link to reset your password.
                  </Form.Text>
                </Form.Group>

                {/* Submit Button */}
                <Button
                  className="mb-3 d-block w-100 border-0"
                  style={{ backgroundColor: "#344CB7" }}
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>

                {/* Back to Login */}
                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={handleBackToLogin}
                    className="custom-color text-decoration-none"
                    disabled={isLoading}
                  >
                    ← Back to Login
                  </Button>
                </div>
              </>
            ) : (
              /* Success Message */
              <div className="text-center">
                <div className="mb-4" style={{ fontSize: '4rem', color: '#28a745' }}>
                  ✓
                </div>
                <h5 className="custom-color mb-3">Check Your Email</h5>
                <p className="text-muted mb-4">
                  We've sent a password reset link to:<br />
                  <strong>{email}</strong>
                </p>
                <p className="text-muted small mb-4">
                  Didn't receive the email? Check your spam folder or{' '}
                  <Button
                    variant="link"
                    onClick={() => setIsSubmitted(false)}
                    className="p-0 custom-color text-decoration-none"
                  >
                    try again
                  </Button>
                </p>
                <Button
                  variant="outline-primary"
                  onClick={handleBackToLogin}
                  className="border-0"
                  style={{ color: '#344CB7', border: '1px solid #344CB7 !important' }}
                >
                  Back to Login
                </Button>
              </div>
            )}
          </Form>
        </Container>
      </Row>

      {/* ✅ Toast Notification */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg={toastVariant}
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={4000}
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

export default ForgotPassword;