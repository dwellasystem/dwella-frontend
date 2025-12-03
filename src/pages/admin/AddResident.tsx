import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import Header from '../../components/Header'
import { FaAngleRight } from 'react-icons/fa6'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import {type User } from '../../models/User.model'
import { useCreateUser } from '../../hooks/user/useCreateUser'
import {formatPhoneNumber, isValidPhilippineNumber } from '../../helpers/formatPhoneNumber'


const initialData: User = {
    first_name: "",
    middle_name:"",
    last_name:"",
    phone_number:"",
    account_status: undefined,
    email:"",
    password:"",
    username:"",
}

// Define validation errors interface
interface ValidationErrors {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    email?: string;
    account_status?: string;
    username?: string;
    password?: string;
}

function AddResident() {
  const [data, setData] = useState<User>(initialData);
  const [displayPhone, setDisplayPhone] = useState<string>(""); // For displaying +63 format
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Helper function to convert any format to +63 format for display
  const formatToPlus63 = (phoneNumber: string): string => {
    if (!phoneNumber) return '';
    
    // Remove all non-digit characters
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    
    if (!digitsOnly) return '';
    
    // If already starts with +63, return as is
    if (phoneNumber.startsWith('+63')) {
      return phoneNumber;
    }
    
    // If starts with 63, add + prefix
    if (digitsOnly.startsWith('63')) {
      return '+' + digitsOnly;
    }
    
    // If starts with 0, replace 0 with +63
    if (digitsOnly.startsWith('0')) {
      return '+63' + digitsOnly.substring(1);
    }
    
    // If starts with 9 (and length is 10), add +63
    if (digitsOnly.startsWith('9') && digitsOnly.length === 10) {
      return '+63' + digitsOnly;
    }
    
    // For any other input that's not empty, assume it's a Philippine number
    if (digitsOnly) {
      // If it looks like it might be a complete number (10-12 digits), format it
      if (digitsOnly.length >= 10 && digitsOnly.length <= 12) {
        // Try to format as +63XXXXXXXXXX
        if (digitsOnly.startsWith('63') && digitsOnly.length === 12) {
          return '+' + digitsOnly;
        }
        if (digitsOnly.startsWith('0') && digitsOnly.length === 11) {
          return '+63' + digitsOnly.substring(1);
        }
        if (digitsOnly.startsWith('9') && digitsOnly.length === 10) {
          return '+63' + digitsOnly;
        }
      }
      // For partial numbers, just show as user typed
      return phoneNumber;
    }
    
    return phoneNumber;
  };

  // Helper function to convert +63 format back to 09 format for backend
  const convertToZeroNineFormat = (phoneNumber: string): string => {
    if (!phoneNumber) return '';
    
    // Remove all non-digit characters
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    
    if (!digitsOnly) return '';
    
    // If starts with 63 (from +63), convert to 09
    if (digitsOnly.startsWith('63')) {
      const remaining = digitsOnly.substring(2); // Remove 63
      return '0' + remaining;
    }
    
    // If starts with 0, return as is
    if (digitsOnly.startsWith('0')) {
      return digitsOnly;
    }
    
    // If starts with 9, add 0
    if (digitsOnly.startsWith('9')) {
      return '0' + digitsOnly;
    }
    
    // For any other format, return digits as is
    return digitsOnly;
  };

  // Handle phone number input - format as +63 while typing
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Always store the raw input in display state
    setDisplayPhone(inputValue);
    
    // Convert the current input to 09 format and store in data
    const backendFormat = convertToZeroNineFormat(inputValue);
    setData(prev => ({
      ...prev,
      phone_number: backendFormat
    }));

    // Clear phone number error if user is typing
    if (errors.phone_number) {
      setErrors(prev => ({ ...prev, phone_number: undefined }));
    }
  };

  // Format phone number nicely when user leaves the field
  const handlePhoneBlur = () => {
    if (displayPhone) {
      const formatted = formatToPlus63(displayPhone);
      setDisplayPhone(formatted);
    }
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // First Name validation
    if (!data.first_name?.trim()) {
      newErrors.first_name = 'First name is required';
    } else if (data.first_name.trim().length < 2) {
      newErrors.first_name = 'First name must be at least 2 characters';
    }

    // Last Name validation
    if (!data.last_name?.trim()) {
      newErrors.last_name = 'Last name is required';
    } else if (data.last_name.trim().length < 2) {
      newErrors.last_name = 'Last name must be at least 2 characters';
    }

    // Phone Number validation
    if (!data.phone_number?.trim()) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!isValidPhilippineNumber(data.phone_number)) {
      newErrors.phone_number = 'Please enter a valid Philippine phone number (e.g., 09123456789)';
    }

    // Email validation
    if (!data.email?.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Account Status validation
    if (!data.account_status) {
      newErrors.account_status = 'Account status is required';
    }

    // Username validation
    if (!data.username?.trim()) {
      newErrors.username = 'Username is required';
    } else if (data.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Password validation
    if (!data.password?.trim()) {
      newErrors.password = 'Password is required';
    } else if (data.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const AddResidentHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
        await useCreateUser(data);
        navigate({ to: '/admin/resident' });   
    } catch (error: any) {
        console.log(error);
        
        // Handle API validation errors
        if (error.data) {
          const apiErrors: ValidationErrors = {};
          
          // Map API errors to form fields
          if (error.data.username) {
            apiErrors.username = error.data.username[0];
          }
          if (error.data.email) {
            apiErrors.email = error.data.email[0];
          }
          if (error.data.phone_number) {
            apiErrors.phone_number = error.data.phone_number[0];
          }
          
          setErrors(apiErrors);
        }
    } finally {
        setIsSubmitting(false);
    }
  };

  // Helper function to handle input change and clear errors
  const handleInputChange = (field: keyof User) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Container className="pt-5 d-flex flex-column w-100" style={{maxWidth:"70rem"}}>
        {/* Header component*/}
        <Header path={'admin'}>
            <div className="d-flex gap-3">
                <h3 className='fw-bold'>Add Resident</h3>
            </div>
        </Header>

        {/* Form page heading */}
        <div className='d-flex align-items-center gap-1 pt-5 mb-3'>
            <span className='text-muted fw-bold d-flex align-items-center'>Residents</span>
            <FaAngleRight size={12}/>
            <span className='text-dark fw-bold d-flex align-items-center'>Add Resident</span>
        </div>

        {/* Add Resident Form */}
        <Form onSubmit={AddResidentHandler} className='p-5 rounded-3 mb-5' style={{backgroundColor:"#F2F2F7"}}>
            <h3>Details</h3>
            <Row className='pt-3'>

                {/* First Name */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formFirstName">
                        <Form.Label className="required">First Name</Form.Label>
                        <Form.Control 
                          value={data?.first_name} 
                          onChange={handleInputChange('first_name')}
                          type="text" 
                          placeholder="ex. Nikola" 
                          isInvalid={!!errors.first_name}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.first_name}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                {/* Middle Name */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formMiddleName">
                        <Form.Label>Middle Name</Form.Label>
                        <Form.Control 
                          value={data?.middle_name} 
                          onChange={handleInputChange('middle_name')}
                          type="text" 
                          placeholder="ex. Curie" 
                        />
                    </Form.Group>
                </Col>

                {/* Last Name */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formLastName">
                        <Form.Label className="required">Last Name</Form.Label>
                        <Form.Control 
                          value={data?.last_name} 
                          onChange={handleInputChange('last_name')}
                          type="text" 
                          placeholder="ex. Tesla" 
                          isInvalid={!!errors.last_name}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.last_name}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                {/* Contact Number */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formContactNumber">
                        <Form.Label className="required">Contact Number</Form.Label>
                        <Form.Control 
                          value={formatPhoneNumber(displayPhone)} 
                          onChange={handlePhoneChange}
                          onBlur={handlePhoneBlur}
                          type="text" 
                          placeholder="e.g., 09123456789" 
                          isInvalid={!!errors.phone_number}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.phone_number}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                          Enter Philippine mobile number (e.g., 09123456789)
                        </Form.Text>
                    </Form.Group>
                </Col>

                {/* Email Address */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formEmailAddress">
                        <Form.Label className="required">Email Address</Form.Label>
                        <Form.Control 
                          value={data?.email} 
                          onChange={handleInputChange('email')}
                          type="email" 
                          placeholder="e.g., example@gmail.com" 
                          isInvalid={!!errors.email}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                {/* Account status */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formPaymentOption">
                        <Form.Label className="required">Account Status</Form.Label>
                        <Form.Select 
                          value={data?.account_status || ''} 
                          onChange={handleInputChange('account_status')}
                          aria-label="Account status"
                          isInvalid={!!errors.account_status}
                          required
                        >
                            <option value="">Select status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.account_status}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <h3 className='mt-sm-3'>Account</h3>

                <Col xs={12} md={12} className='d-flex gap-3 flex-column flex-sm-row mt-sm-2'>
                    <Form.Group className="mb-3 flex-grow-1" controlId="formUsername">
                        <Form.Label className="required">Username</Form.Label>
                        <Form.Control 
                          value={data?.username} 
                          onChange={handleInputChange('username')}
                          type="text" 
                          placeholder='Username'
                          isInvalid={!!errors.username}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.username}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3 flex-grow-1" controlId="formPassword">
                        <Form.Label className="required">Password</Form.Label>
                        <Form.Control 
                          value={data?.password} 
                          onChange={handleInputChange('password')}
                          autoComplete='off' 
                          type="password" 
                          placeholder='Enter Password'
                          isInvalid={!!errors.password}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col className='d-flex gap-3 flex-wrap align-items-center justify-content-end mt-3'>
                    <div 
                      onClick={() => navigate({to:'/employee/resident'})} 
                      className='d-flex flex-grow-1 flex-sm-grow-0 align-items-center justify-content-center px-5 py-3 rounded-3' 
                      style={{backgroundColor:"#CED4F5", cursor:"pointer"}}
                    >
                      <span className='text-black text-center fw-bold'>Cancel</span>
                    </div>
                    <Button 
                      type='submit' 
                      className='d-flex border-0 flex-grow-1 flex-sm-grow-0 align-items-center justify-content-center px-3 py-3 rounded-3' 
                      style={{backgroundColor:"#344CB7", cursor:"pointer"}}
                      disabled={isSubmitting}
                    >
                      <span className='text-light text-center fw-bold'>
                        {isSubmitting ? 'Adding...' : 'Add Resident'}
                      </span>
                    </Button>
                </Col>
            </Row>
        </Form>
        
        {/* Add some CSS for required field labels */}
        <style>{`
          .required::after {
            content: " *";
            color: #dc3545;
          }
        `}</style>
    </Container>
  )
}

export default AddResident