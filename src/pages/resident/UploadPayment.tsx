import { Button, Col, Container, Form, Row, Card, Tabs, Tab, Alert, Badge, ToastContainer, Toast } from 'react-bootstrap'
import Header from '../../components/Header'
import { FaAngleRight } from 'react-icons/fa6'
import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { usePaymentMethods } from '../../hooks/payment-methods/usePaymentMethods';
import { usePayments } from '../../hooks/payments/usePayments';
import { useAuth } from '../../contexts/auth/AuthContext';
import { useMonthlyBill } from '../../hooks/monthly-bills/useMonthlyBill';
import { formatDateToHumanReadable } from '../../helpers/authHelper/dateHelper';
import { useNavigate } from '@tanstack/react-router';
import UploadFile from '../../components/UploadFile';
import { BiCalculator, BiCalendar } from 'react-icons/bi';
import { useGetAssignedUnits } from '../../hooks/assigned-unit/useGetAssignedUnits';

type FormType = {
  user: number | undefined;
  unit: number | undefined;
  amount: number;
  payment_method: number | undefined;
  reference_number: string;
  bill: number | undefined;
  payment_type: string;
  advance_start_date: string | undefined;
  advance_end_date: string | undefined;
  photo?: File | null;
};

// Define type for payment method with account details
type PaymentMethod = {
  id: number;
  name: string;
  account_name?: string;
  account_number?: string;
  instructions?: string;
  is_active: boolean;
};

const initialFormData: FormType = {
  user: undefined,
  unit: undefined,
  amount: 0,
  bill: undefined,
  payment_method: undefined,
  reference_number: "",
  payment_type: "regular",
  advance_start_date: undefined,
  advance_end_date: undefined,
  photo: undefined,
}

function UploadPayment() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const filtersMonthlyBill = useMemo(() => {
    return {
      user: user?.id,
      payment_status: "pending"
    }
  }, [user?.id]);

  const { monthlyBill, viewMonthlyBill } = useMonthlyBill(filtersMonthlyBill);

  const filterOwneUnit = useMemo(() => {
    return {
      assigned_by: user?.id,
    }
  }, [user?.id]);

  const { units } = useGetAssignedUnits(filterOwneUnit);
  const [formData, setFormData] = useState<FormType>(initialFormData);
  const { methods } = usePaymentMethods();
  const { createPaymentRecord, calculateAdvance } = usePayments();
  const [calculatedAdvance, setCalculatedAdvance] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState("regular");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  // Add toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'danger' | 'dark'>('danger')

  // Filter only active payment methods
  const activePaymentMethods = useMemo(() => {
    return methods?.filter((method: PaymentMethod) => method.is_active) || [];
  }, [methods]);

  // Handle payment method selection
  const handlePaymentMethodChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const methodId = Number(e.target.value);
    setFormData((prev) => ({ ...prev, payment_method: methodId }));
    
    // Find and set the selected payment method details
    const method = activePaymentMethods?.find((m: PaymentMethod) => m.id === methodId);
    setSelectedMethod(method || null);
  };

  
  const submitForm = async (e: FormEvent) => {
  e.preventDefault();
  
  // Validation for both payment types
  if (!formData.user || !formData.payment_method) {
    setToastMessage("Required fields are missing");
    setToastVariant('danger');
    setShowToast(true);
    return;
  }

  if (formData.amount <= 0 || !formData.reference_number.trim()) {
    setToastMessage("Amount must be positive and reference number is required");
    setToastVariant('danger');
    setShowToast(true);
    return;
  }

  // Additional validation for regular payments
  if (activeTab === "regular" && !formData.bill) {
    setToastMessage("Bill selection is required for regular payments");
    setToastVariant('danger');
    setShowToast(true);
    return;
  }

  // Additional validation for advance payments
  if (activeTab === "advance" && (!formData.advance_start_date || !formData.advance_end_date)) {
    setToastMessage("Start and end dates are required for advance payments");
    setToastVariant('danger');
    setShowToast(true);
    return;
  }

  // Prepare form data
  const data = new FormData();
  data.append('user', formData.user.toString());
  
  if (formData.unit) {
    data.append('unit', formData.unit.toString());
  }
  
  data.append('amount', formData.amount.toString());
  data.append('payment_method', formData.payment_method.toString());
  data.append('reference_number', formData.reference_number);
  data.append('payment_type', activeTab);
  
  // Only append photo if it exists
  if (formData.photo) {
    data.append('proof_of_payment', formData.photo);
  }
  
  // Add bill for regular payments
  if (activeTab === "regular" && formData.bill) {
    data.append('bill', formData.bill.toString());
  }
  
  // Add advance dates for advance payments
  if (activeTab === "advance" && formData.advance_start_date && formData.advance_end_date) {
    data.append('advance_start_date', formData.advance_start_date);
    data.append('advance_end_date', formData.advance_end_date);
  }

  try {
    // First make the API call
    await createPaymentRecord(data, { 'Content-Type': 'multipart/form-data' });
    
    // Only after successful API call, show success message
    setToastMessage("Payment uploaded successfully!");
    setToastVariant('success');
    setShowToast(true);

    // Wait a moment for the user to see the success message, then navigate
    setTimeout(() => {
      navigate({ to: '/resident/dashboard' });
    }, 2000); // 2 second delay
    
  } catch (error: any) {
    // Handle duplicate payment error specifically
    const errorMessage = error.data?.non_field_errors?.[0] || 
                        error.data?.reference_number?.[0] || 
                        error.data?.detail || 
                        "An error occurred while processing your payment";
    
    setToastMessage(errorMessage);
    setToastVariant('dark');
    setShowToast(true);
    console.error(error);
  }
}

  const handleBillChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    if (value) {
      const res = await viewMonthlyBill(value);
      setFormData((prev) => ({
        ...prev, 
        bill: Number(value), 
        unit: res?.unit.id, 
        user: user?.id, 
        amount: Number(res?.amount_due || 0)
      }));
    } else {
      setFormData((prev) => ({
        ...prev, 
        bill: undefined, 
        amount: 0
      }));
    }
  }

  const handleAdvanceDateChange = async (field: 'advance_start_date' | 'advance_end_date', value: string) => {
    const updatedFormData = {
      ...formData,
      [field]: value
    };
    
    setFormData(updatedFormData);

    // Calculate advance amount when both dates are set
    if (updatedFormData.advance_start_date && 
        updatedFormData.advance_end_date && 
        updatedFormData.unit && 
        updatedFormData.user) {
      await calculateAdvanceAmount(updatedFormData);
    } else {
      // Reset calculated amount if dates are incomplete
      setCalculatedAdvance(null);
      setFormData(prev => ({ ...prev, amount: 0 }));
    }
  };

  const calculateAdvanceAmount = async (data: FormType) => {
    if (!data.user || !data.unit || !data.advance_start_date || !data.advance_end_date) return;

    setIsCalculating(true);
    try {
      const computed = await calculateAdvance({
        user: data.user,
        unit: data.unit,
        startDate: data.advance_start_date,
        endDate: data.advance_end_date
      });

      setCalculatedAdvance(computed);
      setFormData(prev => ({
        ...prev,
        amount: computed.total_amount || 0
      }));
    } catch (error) {
      console.error('Error calculating advance payment:');
      setCalculatedAdvance(null);
      setFormData(prev => ({ ...prev, amount: 0 }));
    } finally {
      setIsCalculating(false);
    }
  };

  const resetFormForTabChange = (tab: string) => {
    setFormData({
      ...initialFormData,
      user: user?.id,
      payment_type: tab
    });
    setCalculatedAdvance(null);
    setSelectedMethod(null);
    setActiveTab(tab);
  };

  return (
    <Container className="pt-5 d-flex flex-column w-100" style={{ maxWidth: "70rem" }}>
      {/* Header component*/}
      <Header path={'resident'}>
        <div className="d-flex gap-3">
          <h3 className='fw-bold'>Upload Payment</h3>
        </div>
      </Header>

      {/* Form page heading */}
      <div className='d-flex align-items-center gap-1 pt-5 mb-3'>
        <span className='text-muted fw-bold d-flex align-items-center'>Financial</span>
        <FaAngleRight size={12} />
        <span className='text-dark fw-bold d-flex align-items-center'>Upload Payment</span>
      </div>

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
          <Toast.Body className={toastVariant === 'success' ? 'text-white' : 'text-white'}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Payment Form with Tabs */}
      <Card className='mb-5'>
        <Card.Header>
          <Tabs
            activeKey={activeTab}
            onSelect={(tab) => resetFormForTabChange(tab || "regular")}
            className="mb-0"
          >
            <Tab
              eventKey="regular"
              title={
                <span className="d-flex align-items-center gap-2">
                  <BiCalendar size={16} />
                  Monthly Payment
                </span>
              }
            />
            <Tab
              eventKey="advance"
              title={
                <span className="d-flex align-items-center gap-2">
                  <BiCalculator size={16} />
                  Advance Payment
                </span>
              }
            />
          </Tabs>
        </Card.Header>

        <Card.Body>
          <Form onSubmit={submitForm}>
            {/* Regular Payment Tab Content */}
            {activeTab === "regular" && (
              <div>
                <h5 className="mb-3">Monthly Payment</h5>
                <p className="text-muted mb-4">
                  Upload payment for an existing bill. Select a bill to auto-fill the amount.
                </p>

                <Row className='g-3'>
                  {/* Billing Month */}
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formPaymentOption">
                      <Form.Label>Billing Month</Form.Label>
                      <Form.Select 
                        name='bill' 
                        value={formData.bill || ''} 
                        onChange={handleBillChange} 
                        required
                      >
                        <option value="">Select Bill</option>
                        {monthlyBill?.results.map((month) => (
                          <option key={month.id} value={month.id}>
                            {`${month.unit.unit_name} - ${formatDateToHumanReadable(month.due_date)}`}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* Amount Paid */}
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formAmountPayment">
                      <Form.Label>Paid Amount</Form.Label>
                      <Form.Control 
                        type="text"
                        disabled
                        value={formData.amount} 
                        onChange={(e) => setFormData((prev) => ({ ...prev, amount: Number(e.target.value) }))} 
                        placeholder="Enter amount here" 
                        required
                        min="1"
                      />
                    </Form.Group>
                  </Col>

                  {/* Payment method */}
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formPaymentOption">
                      <Form.Label>Payment method</Form.Label>
                      <Form.Select 
                        value={formData.payment_method || ''} 
                        onChange={handlePaymentMethodChange} 
                        required
                      >
                        <option value="">Select Payment Method</option>
                        {activePaymentMethods?.map((method: PaymentMethod) => (
                          <option key={method.id} value={method.id}>{method.name}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* Reference Number */}
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formReferenceNumber">
                      <Form.Label>Reference Number</Form.Label>
                      <Form.Control 
                        required 
                        value={formData.reference_number} 
                        onChange={(e) => setFormData((prev) => ({ ...prev, reference_number: e.target.value }))} 
                        type="text" 
                        placeholder="Enter Reference number" 
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            )}

            {/* Advance Payment Tab Content */}
            {activeTab === "advance" && (
              <div>
                <h5 className="mb-3">Advance Payment</h5>
                <p className="text-muted mb-4">
                  Upload payment for future periods. The amount will be automatically calculated based on the date range.
                </p>

                <Row className='g-3'>
                  {/* Unit Selection (Read-only for resident) */}
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Unit</Form.Label>
                      <Form.Select 
                        value={formData.unit || ''} 
                        onChange={(e) => setFormData((prev) => ({ ...prev, unit: Number(e.target.value) }))} 
                        required
                      >
                        <option value="">Select Unit</option>
                        {units?.map((unit: any) => (
                          <option key={unit.id} value={unit.unit_id.id}>{unit.unit_id.unit_name} - {unit.building}</option>
                        ))}
                      </Form.Select>
                      <Form.Text className="text-muted">
                        Your assigned unit
                      </Form.Text>
                    </Form.Group>
                  </Col>

                   {/* Payment Method */}
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Payment Method</Form.Label>
                      <Form.Select
                        value={formData.payment_method || ''}
                        onChange={handlePaymentMethodChange}
                        required
                      >
                        <option value="">Select Payment Method</option>
                        {activePaymentMethods?.map((method: PaymentMethod) => (
                          <option key={method.id} value={method.id}>{method.name}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* Advance Period Dates */}
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Start Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={formData.advance_start_date || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleAdvanceDateChange('advance_start_date', e.target.value)
                        }
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>End Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={formData.advance_end_date || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleAdvanceDateChange('advance_end_date', e.target.value)
                        }
                        required
                      />
                    </Form.Group>
                  </Col>

                  {/* Calculated Amount */}
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Amount</Form.Label>
                      <Form.Control
                        type="number"
                        value={formData.amount}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))
                        }
                        placeholder={isCalculating ? "Calculating..." : "Auto-calculated"}
                        readOnly={!!calculatedAdvance}
                        required
                        min="1"
                      />
                      {isCalculating && (
                        <Form.Text className="text-muted">
                          Calculating amount...
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>

                  {/* Reference Number */}
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Reference Number</Form.Label>
                      <Form.Control
                        value={formData.reference_number}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setFormData(prev => ({ ...prev, reference_number: e.target.value }))
                        }
                        placeholder="Enter Reference number"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Advance Payment Summary */}
                {calculatedAdvance && (
                  <Alert variant="info" className="mt-4">
                    <div className="space-y-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-medium">Period:</span>
                        <Badge bg="secondary">
                          {formatDateToHumanReadable(formData.advance_start_date!)} - {formatDateToHumanReadable(formData.advance_end_date!)}
                        </Badge>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-medium">Months Covered:</span>
                        <span>{calculatedAdvance.months_covered} months</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-medium">Monthly Amount:</span>
                        <span>₱{calculatedAdvance.monthly_amount?.toLocaleString()}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-medium">Total Amount:</span>
                        <span className="fw-bold">₱{calculatedAdvance.total_amount?.toLocaleString()}</span>
                      </div>
                      {calculatedAdvance.breakdown && (
                        <div className="pt-2 border-top">
                          <p className="fw-medium small">Breakdown:</p>
                          <div className="row small">
                            <div className="col-6">Base Rent:</div>
                            <div className="col-6">₱{calculatedAdvance.breakdown.base_rent?.toLocaleString()}</div>
                            <div className="col-6">Additional Charges:</div>
                            <div className="col-6">₱{calculatedAdvance.breakdown.additional_charges?.toLocaleString()}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Alert>
                )}
              </div>
            )}

            {/* Payment Method Account Details */}
            {selectedMethod && (
              <Alert variant="light" className="border mt-3">
                <h6 className="fw-bold mb-3">Payment Instructions for {selectedMethod.name}</h6>
                <Row>
                  {selectedMethod.account_name && (
                    <Col xs={12} md={6}>
                      <div className="mb-2">
                        <strong>Account Name:</strong>
                        <div className="text-primary">{selectedMethod.account_name}</div>
                      </div>
                    </Col>
                  )}
                  {selectedMethod.account_number && (
                    <Col xs={12} md={6}>
                      <div className="mb-2">
                        <strong>Account Number:</strong>
                        <div className="text-primary">{selectedMethod.account_number}</div>
                      </div>
                    </Col>
                  )}
                  {selectedMethod.instructions && (
                    <Col xs={12}>
                      <div className="mb-2">
                        <strong>Instructions:</strong>
                        <div className="text-muted small mt-1">{selectedMethod.instructions}</div>
                      </div>
                    </Col>
                  )}
                  {!selectedMethod.account_name && !selectedMethod.account_number && !selectedMethod.instructions && (
                    <Col xs={12}>
                      <div className="text-muted">
                        Please contact administration for payment details.
                      </div>
                    </Col>
                  )}
                </Row>
                <div className="mt-3 p-2 bg-warning bg-opacity-10 rounded">
                  <small className="text-muted">
                    💡 <strong>Important:</strong> Make sure to include the reference number in your payment transaction. 
                    Take a screenshot or photo of the successful transaction as proof of payment.
                  </small>
                </div>
              </Alert>
            )}

            {/* File Upload Section (Common for both payment types) */}
            <Row className='mt-3'>
              <Col xs={12}>
                <UploadFile 
                  formData={formData} 
                  setFormData={setFormData} 
                  title='Upload proof of payment' 
                />
              </Col>
            </Row>

            {/* Form Buttons */}
            <Row className='mt-4'>
              <Col className='d-flex gap-3 flex-wrap align-items-center justify-content-end'>
                <div 
                  onClick={() => navigate({ to: '/resident/financial' })} 
                  className='d-flex flex-grow-1 flex-sm-grow-0 align-items-center justify-content-center px-5 py-3 rounded-3' 
                  style={{ backgroundColor: "#CED4F5", cursor: "pointer" }}
                >
                  <span className='text-black text-center fw-bold'>Cancel</span>
                </div>
                <Button 
                  type='submit' 
                  className='d-flex flex-grow-1 border-0 flex-sm-grow-0 align-items-center justify-content-center px-3 py-3 rounded-3' 
                  style={{ backgroundColor: "#344CB7", cursor: "pointer" }}
                  disabled={activeTab === 'advance' && (!formData.advance_start_date || !formData.advance_end_date || formData.amount <= 0)}
                >
                  <span className='text-light text-center fw-bold'>
                    {activeTab === 'advance' ? 'Upload Advance Payment' : 'Upload Payment'}
                  </span>
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default UploadPayment