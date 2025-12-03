// src/components/HoaInformation/HoaInformation.tsx
import { useState, useEffect } from 'react';
import { 
  Container, 
  Card, 
  Row, 
  Col, 
  Button, 
  Form, 
  Alert,
  Badge,
  Spinner,
  ToastContainer,
  Toast,
} from 'react-bootstrap';

import { 
  FaEdit, 
  FaSave, 
  FaTimes, 
  FaPhone, 
  FaShieldAlt, 
  FaBuilding,
  FaUserShield,
  FaCreditCard,
  FaListAlt
} from 'react-icons/fa';

import { useAuth } from '../contexts/auth/AuthContext';
import { useHoaInformation } from '../hooks/hoa/useHoaInformation';
import { usePaymentMethods } from '../hooks/payment-methods/usePaymentMethods';

// Define the HOA Information type
export type HoaInfoType = {
  id?: number;
  
  // Payment method references
  primary_payment_method?: PaymentMethodType | null;
  primary_payment_method_id?: number | null;
  additional_payment_methods?: PaymentMethodType[];
  additional_payment_method_ids?: number[];
  all_payment_methods?: PaymentMethodType[];
  active_payment_methods?: PaymentMethodType[];
  
  reference_format: string;
  
  // Emergency contacts
  emergency_hotline: string;
  security_guard_contact: string;
  fire_department: string;
  police_station: string;
  hospital: string;
  
  // HOA Office
  hoa_office_phone: string;
  hoa_email: string;
  office_hours: string;
  office_address: string;
  
  // Maintenance
  maintenance_contact: string;
  electrician_contact: string;
  plumber_contact: string;
  
  // Notices
  important_notices: string;
  
  updated_at?: string;
  created_by?: number;
  updated_by?: number;
};

// Payment Method type (from your existing system)
type PaymentMethodType = {
  id: number;
  name: string;
  account_name?: string;
  account_number?: string;
  instructions?: string;
  is_active: boolean;
  is_primary?: boolean;
};

// Initial empty state
const initialHoaInfo: HoaInfoType = {
  reference_format: '',
  emergency_hotline: '',
  security_guard_contact: '',
  fire_department: '',
  police_station: '',
  hospital: '',
  hoa_office_phone: '',
  hoa_email: '',
  office_hours: '',
  office_address: '',
  maintenance_contact: '',
  electrician_contact: '',
  plumber_contact: '',
  important_notices: ''
};

const HoaInformation = () => {
  const { user } = useAuth();
  const { 
    hoaInfo, 
    loading, 
    error, 
    updateHoaInformation, 
    createHoaInformation 
  } = useHoaInformation();
  
  // Get available payment methods
  const { methods: allPaymentMethods } = usePaymentMethods();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<HoaInfoType>(initialHoaInfo);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'danger' | 'dark'>('danger');

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  // Initialize form data when hoaInfo loads
  useEffect(() => {
    if (hoaInfo) {
      setFormData(hoaInfo);
    } else {
      setFormData(initialHoaInfo);
    }
  }, [hoaInfo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'select-multiple') {
      const selectElement = e.target as HTMLSelectElement;
      const selectedValues = Array.from(selectElement.selectedOptions, option => Number(option.value));
      setFormData(prev => ({
        ...prev,
        [name]: selectedValues
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    
    try {
      // Prepare data for API
      const saveData = {
        ...formData,
        // Ensure IDs are sent, not objects
        primary_payment_method_id: formData.primary_payment_method?.id || null,
        additional_payment_method_ids: formData.additional_payment_methods?.map(m => m.id) || []
      };
      
      if (hoaInfo?.id) {
        // Update existing record
        await updateHoaInformation(hoaInfo.id, saveData);
        setToastMessage('HOA information updated successfully!');
      } else {
        // Create new record
        await createHoaInformation(saveData);
        setToastMessage('HOA information created successfully!');
      }
      
      setToastVariant('success');
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error saving HOA information:', error);
      setToastMessage(error.data?.message || 'Failed to save HOA information');
      setToastVariant('dark');
    } finally {
      setIsSubmitting(false);
      setShowToast(true);
    }
  };

  const handleCancel = () => {
    // Reset form to original data
    setFormData(hoaInfo || initialHoaInfo);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  // Get active payment methods for dropdown
  const activePaymentMethods = allPaymentMethods?.filter(method => method.is_active) || [];

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading HOA Information...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error Loading HOA Information</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Toast Container */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          delay={5000} 
          autohide
          bg={toastVariant}
        >
          <Toast.Header>
            <strong className="me-auto">
              {toastVariant === 'success' ? 'Success' : 'Failed'}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Header with Edit Button (Admin only) */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold">HOA Information</h1>
          <p className="text-muted mb-0">
            Important contact information and payment details for homeowners
          </p>
          {hoaInfo?.updated_at && (
            <small className="text-muted">
              Last updated: {new Date(hoaInfo.updated_at).toLocaleDateString()}
            </small>
          )}
        </div>
        
        {isAdmin && !isEditing && (
          <Button 
            variant="primary" 
            onClick={handleEdit}
            className="d-flex align-items-center gap-2"
          >
            <FaEdit /> Edit Information
          </Button>
        )}
        
        {isAdmin && isEditing && (
          <div className="d-flex gap-2">
            <Button 
              variant="outline-secondary" 
              onClick={handleCancel}
              className="d-flex align-items-center gap-2"
              disabled={isSubmitting}
            >
              <FaTimes /> Cancel
            </Button>
            <Button 
              variant="success" 
              onClick={handleSave}
              className="d-flex align-items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner animation="border" size="sm" /> Saving...
                </>
              ) : (
                <>
                  <FaSave /> Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Payment Methods Section */}
      <Card className="mb-4">
        <Card.Header className="bg-light">
          <h5 className="mb-0 d-flex align-items-center gap-2">
            <FaCreditCard /> Accepted Payment Methods
          </h5>
        </Card.Header>
        <Card.Body>
          {isEditing ? (
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Primary Payment Method</Form.Label>
                  <Form.Select 
                    name="primary_payment_method_id"
                    value={formData.primary_payment_method?.id || ''}
                    onChange={(e) => {
                      const methodId = e.target.value ? Number(e.target.value) : null;
                      const method = activePaymentMethods.find(m => m.id === methodId);
                      setFormData(prev => ({
                        ...prev,
                        primary_payment_method: method || null
                      }));
                    }}
                  >
                    <option value="">Select primary payment method</option>
                    {activePaymentMethods.map(method => (
                      <option key={method.id} value={method.id}>
                        {method.name} {method.account_number ? `(${method.account_number})` : ''}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Additional Payment Methods</Form.Label>
                  <Form.Select 
                    name="additional_payment_method_ids"
                    multiple
                    value={formData.additional_payment_methods?.map(m => m.id.toString()) || []}
                    onChange={handleInputChange}
                    size={'lg'}
                  >
                    {activePaymentMethods.map(method => (
                      <option 
                        key={method.id} 
                        value={method.id}
                        disabled={method.id === formData.primary_payment_method?.id}
                      >
                        {method.name} {method.account_number ? `(${method.account_number})` : ''}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Hold Ctrl/Cmd to select multiple methods
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          ) : (
            <>
              {/* Display primary payment method */}
              {hoaInfo?.primary_payment_method && (
                <div className="mb-4">
                  <h6 className="text-primary">
                    <Badge bg="primary" className="me-2">Primary</Badge>
                    Primary Payment Method
                  </h6>
                  <Card className="border-primary">
                    <Card.Body>
                      <h5>{hoaInfo.primary_payment_method.name}</h5>
                      {hoaInfo.primary_payment_method.account_name && (
                        <p className="mb-1">
                          <strong>Account Name:</strong> {hoaInfo.primary_payment_method.account_name}
                        </p>
                      )}
                      {hoaInfo.primary_payment_method.account_number && (
                        <p className="mb-1">
                          <strong>Account Number:</strong> {hoaInfo.primary_payment_method.account_number}
                        </p>
                      )}
                      {hoaInfo.primary_payment_method.instructions && (
                        <Alert variant="info" className="mt-2 mb-0">
                          <strong>Instructions:</strong> {hoaInfo.primary_payment_method.instructions}
                        </Alert>
                      )}
                    </Card.Body>
                  </Card>
                </div>
              )}
              
              {/* Display additional payment methods */}
              {hoaInfo?.additional_payment_methods && hoaInfo.additional_payment_methods.length > 0 && (
                <div>
                  <h6 className="mb-3">
                    <FaListAlt className="me-2" />
                    Additional Payment Methods
                  </h6>
                  <Row>
                    {hoaInfo.additional_payment_methods.map(method => (
                      <Col md={6} key={method.id} className="mb-3">
                        <Card>
                          <Card.Body>
                            <h6>{method.name}</h6>
                            {method.account_name && (
                              <p className="mb-1 small">
                                <strong>Account:</strong> {method.account_name}
                              </p>
                            )}
                            {method.account_number && (
                              <p className="mb-1 small">
                                <strong>Number:</strong> {method.account_number}
                              </p>
                            )}
                            {method.instructions && (
                              <p className="mb-0 small text-muted">
                                {method.instructions}
                              </p>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
            </>
          )}
          
          {/* Reference Format */}
          {/* <Form.Group className="mt-4">
            <Form.Label>Payment Reference Format</Form.Label>
            {isEditing ? (
              <Form.Control
                as="textarea"
                rows={2}
                name="reference_format"
                value={formData.reference_format || ''}
                onChange={handleInputChange}
                placeholder="e.g., Unit No. + Month (101-January)"
              />
            ) : (
              <Alert variant="info" className="mb-0">
                <strong>Reference Format:</strong> {hoaInfo?.reference_format || 'Not specified'}
              </Alert>
            )}
          </Form.Group> */}
        </Card.Body>
      </Card>

      {/* Emergency Contacts Section */}
      <Card className="mb-4">
        <Card.Header className="bg-light">
          <h5 className="mb-0 d-flex align-items-center gap-2">
            <FaPhone /> Emergency Contact Numbers
          </h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="d-flex align-items-center gap-2">
                  <FaPhone className="text-danger" /> Emergency Hotline
                </Form.Label>
                {isEditing ? (
                  <Form.Control
                    type="text"
                    name="emergency_hotline"
                    value={formData.emergency_hotline}
                    onChange={handleInputChange}
                    placeholder="e.g., 911 or local emergency number"
                  />
                ) : (
                  <div className="p-2 border rounded bg-light">
                    {hoaInfo?.emergency_hotline || 'Not specified'}
                  </div>
                )}
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="d-flex align-items-center gap-2">
                  <FaShieldAlt className="text-primary" /> Security Guard
                </Form.Label>
                {isEditing ? (
                  <Form.Control
                    type="text"
                    name="security_guard_contact"
                    value={formData.security_guard_contact}
                    onChange={handleInputChange}
                    placeholder="e.g., 0917-123-4567"
                  />
                ) : (
                  <div className="p-2 border rounded bg-light">
                    {hoaInfo?.security_guard_contact || 'Not specified'}
                  </div>
                )}
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="d-flex align-items-center gap-2">
                  <FaBuilding className="text-danger" /> Fire Department
                </Form.Label>
                {isEditing ? (
                  <Form.Control
                    type="text"
                    name="fire_department"
                    value={formData.fire_department}
                    onChange={handleInputChange}
                    placeholder="e.g., 911 or local fire department"
                  />
                ) : (
                  <div className="p-2 border rounded bg-light">
                    {hoaInfo?.fire_department || 'Not specified'}
                  </div>
                )}
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="d-flex align-items-center gap-2">
                  <FaUserShield className="text-primary" /> Police Station
                </Form.Label>
                {isEditing ? (
                  <Form.Control
                    type="text"
                    name="police_station"
                    value={formData.police_station}
                    onChange={handleInputChange}
                    placeholder="e.g., 911 or local police"
                  />
                ) : (
                  <div className="p-2 border rounded bg-light">
                    {hoaInfo?.police_station || 'Not specified'}
                  </div>
                )}
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Hospital / Medical Emergency</Form.Label>
                {isEditing ? (
                  <Form.Control
                    type="text"
                    name="hospital"
                    value={formData.hospital}
                    onChange={handleInputChange}
                    placeholder="e.g., 911 or nearest hospital"
                  />
                ) : (
                  <div className="p-2 border rounded bg-light">
                    {hoaInfo?.hospital || 'Not specified'}
                  </div>
                )}
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Maintenance Contact</Form.Label>
                {isEditing ? (
                  <Form.Control
                    type="text"
                    name="maintenance_contact"
                    value={formData.maintenance_contact}
                    onChange={handleInputChange}
                    placeholder="e.g., 0917-987-6543"
                  />
                ) : (
                  <div className="p-2 border rounded bg-light">
                    {hoaInfo?.maintenance_contact || 'Not specified'}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* HOA Office Information Section */}
      <Card>
        <Card.Header className="bg-light">
          <h5 className="mb-0 d-flex align-items-center gap-2">
            <FaBuilding /> HOA Office Information
          </h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Office Phone Number</Form.Label>
                {isEditing ? (
                  <Form.Control
                    type="text"
                    name="hoa_office_phone"
                    value={formData.hoa_office_phone}
                    onChange={handleInputChange}
                    placeholder="e.g., (02) 123-4567"
                  />
                ) : (
                  <div className="p-2 border rounded bg-light">
                    {hoaInfo?.hoa_office_phone || 'Not specified'}
                  </div>
                )}
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                {isEditing ? (
                  <Form.Control
                    type="email"
                    name="hoa_email"
                    value={formData.hoa_email}
                    onChange={handleInputChange}
                    placeholder="e.g., info@hoa-condo.com"
                  />
                ) : (
                  <div className="p-2 border rounded bg-light">
                    {hoaInfo?.hoa_email || 'Not specified'}
                  </div>
                )}
              </Form.Group>
            </Col>
            
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Office Address</Form.Label>
                {isEditing ? (
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="office_address"
                    value={formData.office_address}
                    onChange={handleInputChange}
                    placeholder="Complete office address..."
                  />
                ) : (
                  <div className="p-2 border rounded bg-light">
                    {hoaInfo?.office_address || 'Not specified'}
                  </div>
                )}
              </Form.Group>
            </Col>
            
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Office Hours</Form.Label>
                {isEditing ? (
                  <Form.Control
                    type="text"
                    name="office_hours"
                    value={formData.office_hours}
                    onChange={handleInputChange}
                    placeholder="e.g., Monday-Friday, 9:00 AM - 5:00 PM"
                  />
                ) : (
                  <div className="p-2 border rounded bg-light">
                    {hoaInfo?.office_hours || 'Not specified'}
                  </div>
                )}
              </Form.Group>
            </Col>
            
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Important Notices</Form.Label>
                {isEditing ? (
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="important_notices"
                    value={formData.important_notices}
                    onChange={handleInputChange}
                    placeholder="Important announcements or notices..."
                  />
                ) : (
                  <Alert variant="warning" className="mb-0">
                    {hoaInfo?.important_notices || 'No important notices at this time.'}
                  </Alert>
                )}
              </Form.Group>
            </Col>
          </Row>
          
          {!isEditing && (!hoaInfo || Object.values(hoaInfo).every(val => !val)) && (
            <Alert variant="warning" className="mt-3">
              <strong>Information Needed:</strong> HOA information has not been set up yet. 
              {isAdmin ? ' Please contact an administrator to add this information.' : ''}
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default HoaInformation;