import { Button, Col, Container, Form, Row, Alert } from 'react-bootstrap'
import Header from '../../components/Header'
import { FaAngleRight } from 'react-icons/fa6'
import { useUpdateUser } from '../../hooks/user/useUpdateUser';
import { useState } from 'react';
import { useAuth } from '../../contexts/auth/AuthContext';
import { PiEyeBold, PiEyeClosedBold } from 'react-icons/pi';

function AccountSetting() {
  const {user} = useAuth();
  
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [isPasswordShow, setIsPasswordShow] = useState(false);
    const [isConfirmPasswordShow, setIsConfirmPasswordShow] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

    // ✅ Password validation (same as reset password)
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

      return errors;
    };

    const handlePasswordChange = (newPassword: string) => {
      setPassword(newPassword);
      if (newPassword.length > 0) {
        setPasswordErrors(validatePassword(newPassword));
      } else {
        setPasswordErrors([]);
      }
    };
    
    const changePassword = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Final validation
      const errors = validatePassword(password);
      
      if (errors.length > 0) {
        console.error("Validation Error: Please fix password requirements:", errors.join(', '));
        return;
      }

      if (password !== confirmPassword) {
        console.error("Validation Error: Passwords don't match");
        return;
      }

      await useUpdateUser(user?.id, {password});
      window.location.href = window.location.origin;
    }


  return (
    <Container className="pt-5 d-flex flex-column w-100" style={{maxWidth:"70rem"}}>
        {/* Header component*/}
        <Header path={'resident'}>
            <div className="d-flex gap-3">
                <h3 className='fw-bold'>Account Settings</h3>
            </div>
        </Header>

        {/* Form page heading */}
        <div className='d-flex align-items-center gap-1 pt-5 mb-3'>
            <span className='text-muted fw-bold d-flex align-items-center'>Dashboard</span>
            <FaAngleRight size={12}/>
            <span className='text-dark fw-bold d-flex align-items-center'>Account Settings</span>
        </div>

        {/* Change password Form */}
        <Form onSubmit={changePassword} className='p-5 rounded-3 mb-5' style={{backgroundColor:"#F2F2F7"}}>
            <Row className='pt-3'>
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Enter New Password</Form.Label>
                        <div className="position-relative">
                            <div className="d-flex align-items-center border rounded-2">
                                <Form.Control 
                                  value={password} 
                                  onChange={(e) => handlePasswordChange(e.target.value)} 
                                  placeholder={"New Password"} 
                                  className="custom-font-size border-0 p-2" 
                                  type={isPasswordShow ? 'text' : 'password'} 
                                  autoComplete="new-password"
                                  isInvalid={passwordErrors.length > 0 && password.length > 0}
                                  isValid={passwordErrors.length === 0 && password.length > 0}
                                  style={{ paddingRight: '2.5rem' }} // Add padding for the eye icon
                                />
                                <span 
                                  onClick={() => setIsPasswordShow(!isPasswordShow)} 
                                  className="position-absolute end-0"
                                  style={{ cursor: "pointer", zIndex: 5, marginRight: passwordErrors.length ? 30 : 30 }} // Ensure it stays on top
                                >
                                  {!isPasswordShow ? <PiEyeClosedBold /> : <PiEyeBold />}
                                </span>
                            </div>

                            {/* Password Requirements - This will appear below the input */}
                            {password.length > 0 && (
                              <div className="mt-2">
                                <small className="text-muted">Password requirements:</small>
                                <div className="small text-muted mt-1">
                                  <div className={password.length >= 8 ? 'text-success' : 'text-danger'}>
                                    {password.length >= 8 ? '✓' : '•'} At least 8 characters
                                  </div>
                                  <div className={/[a-z]/.test(password) ? 'text-success' : 'text-danger'}>
                                    {/[a-z]/.test(password) ? '✓' : '•'} One lowercase letter
                                  </div>
                                  <div className={/[A-Z]/.test(password) ? 'text-success' : 'text-danger'}>
                                    {/[A-Z]/.test(password) ? '✓' : '•'} One uppercase letter
                                  </div>
                                  <div className={/\d/.test(password) ? 'text-success' : 'text-danger'}>
                                    {/\d/.test(password) ? '✓' : '•'} One number
                                  </div>
                                </div>
                              </div>
                            )}

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
                        </div>
                    </Form.Group>
                </Col>

                 <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formConfirmPassword">
                        <Form.Label>Confirm New Password</Form.Label>
                        <div className="position-relative">
                            <div className="d-flex align-items-center border rounded-2">
                                <Form.Control 
                                  value={confirmPassword} 
                                  onChange={(e) => setConfirmPassword(e.target.value)} 
                                  placeholder={"Confirm Password"} 
                                  className="custom-font-size border-0 p-2" 
                                  type={isConfirmPasswordShow ? 'text' : 'password'} 
                                  autoComplete="new-password"
                                  isInvalid={confirmPassword.length > 0 && password !== confirmPassword}
                                  isValid={confirmPassword.length > 0 && password === confirmPassword}
                                  style={{ paddingRight: '2.5rem' }} // Add padding for the eye icon
                                />
                                <span 
                                  onClick={() => setIsConfirmPasswordShow(!isConfirmPasswordShow)} 
                                  className="position-absolute end-0"
                                  style={{ cursor: "pointer", zIndex: 5, marginRight: passwordErrors.length ? 30 : 30 }} // Ensure it stays on top
                                >
                                  {!isConfirmPasswordShow ? <PiEyeClosedBold /> : <PiEyeBold />}
                                </span>
                            </div>
                            {confirmPassword.length > 0 && password !== confirmPassword && (
                              <Form.Text className="text-danger">
                                Passwords do not match
                              </Form.Text>
                            )}
                            {confirmPassword.length > 0 && password === confirmPassword && (
                              <Form.Text className="text-success">
                                Passwords match ✓
                              </Form.Text>
                            )}
                        </div>
                    </Form.Group>
                </Col>

                <Col className='d-flex gap-3 flex-wrap align-items-center justify-content-end mt-3'>
                    <Button 
                      type='submit' 
                      className='d-flex flex-grow-1 border-0 flex-sm-grow-0 align-items-center justify-content-center px-3 py-3 rounded-3' 
                      style={{backgroundColor:"#344CB7", cursor:"pointer"}}
                      disabled={passwordErrors.length > 0 || password !== confirmPassword || password.length === 0}
                    >
                        <span className='text-light text-center fw-bold'>Change Password</span>
                    </Button>
                </Col>
            </Row>
        </Form>
    </Container>
  )
}

export default AccountSetting