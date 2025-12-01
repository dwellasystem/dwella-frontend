import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Row, Toast, ToastContainer, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from '@tanstack/react-router';
import api from '../../api/api';
import { API_BASE_URL } from '../../api/endpoint';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidLink, setIsValidLink] = useState(true);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const navigate = useNavigate();
  const { uid, token } = useParams({ from: '/reset-password/$uid/$token' });

  // ✅ Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'danger'>('danger');

  useEffect(() => {
    // Validate the token and uid
    if (!uid || !token) {
      setIsValidLink(false);
      setToastMessage('❌ Invalid reset link.');
      setToastVariant('danger');
      setShowToast(true);
    }
  }, [uid, token]);

  // Simple password validation
  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('At least 8 characters');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('At least one lowercase letter');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('At least one uppercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('At least one number');
    }

    // Remove the common patterns check - too restrictive
    // Remove the entirely numeric check - covered by the letter requirements

    return errors;
  };

  const handlePasswordChange = (password: string) => {
    setNewPassword(password);
    if (password.length > 0) {
      setPasswordErrors(validatePassword(password));
    } else {
      setPasswordErrors([]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // Final validation
    const errors = validatePassword(newPassword);
    
    if (errors.length > 0) {
      setToastMessage(`❌ Please fix password requirements: ${errors.join(', ')}`);
      setToastVariant('danger');
      setShowToast(true);
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setToastMessage('❌ Passwords do not match.');
      setToastVariant('danger');
      setShowToast(true);
      setIsLoading(false);
      return;
    }

    try {
      // Call the reset password API
      await api.post(`${API_BASE_URL}/password-reset/confirm/`, {
        uid,
        token,
        new_password: newPassword,
        confirm_password: confirmPassword
      });
      
      setToastMessage('✅ Password reset successfully! You can now login with your new password.');
      setToastVariant('success');
      setShowToast(true);
      
      // Redirect to login after success
      setTimeout(() => {
        navigate({ to: '/login' });
      }, 2000);
      
    } catch (error: any) {
      // Handle backend validation errors
      if (error.response?.data?.new_password) {
        const backendErrors = error.response.data.new_password;
        const errorMessage = Array.isArray(backendErrors) ? backendErrors.join(', ') : backendErrors;
        setToastMessage(`❌ Password requirements: ${errorMessage}`);
      } else {
        const message = error.response?.data?.error || error.response?.data?.message || '❌ Failed to reset password. Please try again.';
        setToastMessage(message);
      }
      setToastVariant('danger');
      setShowToast(true);
      console.error('Error resetting password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate({ to: '/login' });
  };

  if (!isValidLink) {
    return (
      <Container className="vh-100">
        <Row style={{ height: "10%" }}>
          <h1 className="my-auto custom-color fw-bold">Dwella</h1>
        </Row>
        <Row style={{ height: "90%" }}>
          <Container className="m-auto text-center">
            <div className="mb-4" style={{ fontSize: '4rem', color: '#dc3545' }}>
              ⚠️
            </div>
            <h5 className="custom-color mb-3">Invalid Reset Link</h5>
            <p className="text-muted mb-4">
              This password reset link is invalid or has expired.
            </p>
            <Button
              variant="primary"
              onClick={handleBackToLogin}
              style={{ backgroundColor: "#344CB7", border: 'none' }}
            >
              Back to Login
            </Button>
          </Container>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="vh-100">
      <Row style={{ height: "10%" }}>
        <h1 className="my-auto custom-color fw-bold">Dwella</h1>
      </Row>
      <Row style={{ height: "90%" }}>
        <Container className="m-auto">
          <Form className="custom-form rounded-4" onSubmit={handleSubmit}>
            <Form.Label className="d-block text-center fs-2 fw-medium custom-color mb-5">
              Reset Password
            </Form.Label>

            <Form.Group className="mb-3" controlId="newPassword">
              <Form.Label className="custom-font-size">New Password</Form.Label>
              <Form.Control
                value={newPassword}
                onChange={(e) => handlePasswordChange(e.target.value)}
                className="custom-font-size"
                type="password"
                placeholder="Enter new password"
                autoComplete="new-password"
                disabled={isLoading}
                isInvalid={passwordErrors.length > 0 && newPassword.length > 0}
                isValid={passwordErrors.length === 0 && newPassword.length > 0}
              />
              
              {/* Simple Password Requirements */}
              <div className="mt-2">
                <small className="text-muted">Password requirements:</small>
                <div className="small text-muted mt-1">
                  <div className={newPassword.length >= 8 ? 'text-success' : 'text-danger'}>
                    {newPassword.length >= 8 ? '✓' : '•'} At least 8 characters
                  </div>
                  <div className={/[a-z]/.test(newPassword) ? 'text-success' : 'text-danger'}>
                    {/[a-z]/.test(newPassword) ? '✓' : '•'} One lowercase letter
                  </div>
                  <div className={/[A-Z]/.test(newPassword) ? 'text-success' : 'text-danger'}>
                    {/[A-Z]/.test(newPassword) ? '✓' : '•'} One uppercase letter
                  </div>
                  <div className={/\d/.test(newPassword) ? 'text-success' : 'text-danger'}>
                    {/\d/.test(newPassword) ? '✓' : '•'} One number
                  </div>
                </div>
              </div>

              {/* Error Messages */}
              {passwordErrors.length > 0 && (
                <Alert variant="danger" className="mt-2 small">
                  <strong>Please fix:</strong>
                  <ul className="mb-0 mt-1">
                    {passwordErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </Alert>
              )}
            </Form.Group>

            <Form.Group className="mb-4" controlId="confirmPassword">
              <Form.Label className="custom-font-size">Confirm Password</Form.Label>
              <Form.Control
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="custom-font-size"
                type="password"
                placeholder="Confirm new password"
                autoComplete="new-password"
                disabled={isLoading}
                isInvalid={confirmPassword.length > 0 && newPassword !== confirmPassword}
                isValid={confirmPassword.length > 0 && newPassword === confirmPassword}
              />
              {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                <Form.Text className="text-danger">
                  Passwords do not match
                </Form.Text>
              )}
              {confirmPassword.length > 0 && newPassword === confirmPassword && (
                <Form.Text className="text-success">
                  Passwords match ✓
                </Form.Text>
              )}
            </Form.Group>

            {/* Submit Button */}
            <Button
              className="mb-3 d-block w-100 border-0"
              style={{ backgroundColor: "#344CB7" }}
              type="submit"
              disabled={isLoading || passwordErrors.length > 0 || newPassword !== confirmPassword || newPassword.length === 0}
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
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

export default ResetPassword;