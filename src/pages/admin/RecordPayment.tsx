import { useState, useMemo, type FormEvent, type ChangeEvent, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { 
  Button, 
  Card, 
  Form, 
  Row, 
  Col, 
  Tab, 
  Tabs,
  Alert,
  Badge,
  ToastContainer,
  Toast
} from "react-bootstrap";
import { useMonthlyBill } from "../../hooks/monthly-bills/useMonthlyBill";
import { useGetUsers } from "../../hooks/user/useGetUsers";
import { formatDateToHumanReadable } from "../../helpers/authHelper/dateHelper";
import { useGetUnits } from "../../hooks/unit/useGetUnits";
import { usePaymentMethods } from "../../hooks/payment-methods/usePaymentMethods";
import type { PaymentMethod } from "../../models/PaymentMethod.model";
import { usePayments } from "../../hooks/payments/usePayments";
import { BiCalculator, BiCalendar } from "react-icons/bi";

type FormType = {
  user: number | undefined;
  unit: number | undefined;
  amount: number | undefined;
  status: string;
  reference_number: string | undefined;
  payment_method: number | undefined;
  bill: number | undefined;
  payment_type: string;
  advance_start_date: string | undefined;
  advance_end_date: string | undefined;
}

const initialFormState: FormType = {
  user: undefined,
  unit: undefined,
  amount: undefined,
  status: "",
  reference_number: undefined,
  payment_method: undefined,
  bill: undefined,
  payment_type: "regular",
  advance_start_date: undefined,
  advance_end_date: undefined
}

function RecordPayment() {
  const filters = useMemo(() => {
    return {
      search: 'pending'
    };
  }, []);

  const { viewMonthlyBill, monthlyBillsList } = useMonthlyBill(filters);

  const filterResident = useMemo(() => {
    return {
      role: 'resident',
    }
  }, []);
  
  const { usersAsOptions } = useGetUsers(filterResident);
  const { units } = useGetUnits();
  const { createPaymentRecord, calculateAdvance } = usePayments();
  const paymentMethods = usePaymentMethods();

  const [formData, setFormData] = useState<FormType>(initialFormState);
  const [calculatedAdvance, setCalculatedAdvance] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState("regular");
  const [filteredUnits, setFilteredUnits] = useState<any[]>([]);
  const [selectedUserName, setSelectedUserName] = useState<string>("");
  const [filteredBills, setFilteredBills] = useState<any[]>([]);

  // Add toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'danger' | 'dark'>('danger');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Filter bills based on selected user
  useEffect(() => {
    if (formData.user && monthlyBillsList) {
      // Filter bills for the selected user
      const userBills = monthlyBillsList.filter(bill => bill.user.id === formData.user);
      setFilteredBills(userBills);
      
      // Get user's name for display
      const selectedUser = usersAsOptions?.find(user => user.id === formData.user);
      if (selectedUser) {
        setSelectedUserName(`${selectedUser.first_name} ${selectedUser.last_name}`);
      } else {
        setSelectedUserName("");
      }
    } else {
      setFilteredBills(monthlyBillsList || []);
      setSelectedUserName("");
    }
  }, [formData.user, monthlyBillsList, usersAsOptions]);

  // Filter units based on selected user (for advance tab)
  useEffect(() => {
    if (activeTab === "advance" && formData.user && monthlyBillsList) {
      // Get all unique units assigned to this user from monthlyBillsList
      const userUnits = monthlyBillsList
        .filter(bill => bill.user.id === formData.user)
        .map(bill => bill.unit);
      
      // Remove duplicates based on unit id
      const uniqueUnits = userUnits.filter((unit, index, self) =>
        index === self.findIndex((u) => u.id === unit.id)
      );
      
      setFilteredUnits(uniqueUnits);
    } else {
      setFilteredUnits([]);
    }
  }, [formData.user, monthlyBillsList, activeTab]);

  const addPayment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validation for both payment types
    if (!formData.user) {
      setToastMessage("Please select a resident");
      setToastVariant('danger');
      setShowToast(true);
      return;
    }

    if (!formData.payment_method) {
      setToastMessage("Please select a payment method");
      setToastVariant('danger');
      setShowToast(true);
      return;
    }

    if (!formData.amount || formData.amount <= 0) {
      setToastMessage("Amount must be a positive number");
      setToastVariant('danger');
      setShowToast(true);
      return;
    }

    if (!formData.reference_number?.trim()) {
      setToastMessage("Reference number is required");
      setToastVariant('danger');
      setShowToast(true);
      return;
    }

    if (!formData.status) {
      setToastMessage("Please select payment status");
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
    if (activeTab === "advance") {
      if (!formData.unit) {
        setToastMessage("Please select a unit for advance payment");
        setToastVariant('danger');
        setShowToast(true);
        return;
      }

      if (!formData.advance_start_date || !formData.advance_end_date) {
        setToastMessage("Start and end dates are required for advance payments");
        setToastVariant('danger');
        setShowToast(true);
        return;
      }

      // Validate date range
      const startDate = new Date(formData.advance_start_date);
      const endDate = new Date(formData.advance_end_date);
      
      if (endDate <= startDate) {
        setToastMessage("End date must be after start date");
        setToastVariant('danger');
        setShowToast(true);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const submissionData = {
        ...formData,
        payment_type: activeTab
      };
      
      await createPaymentRecord(submissionData);
      
      // Show success message
      setToastMessage("Payment recorded successfully!");
      setToastVariant('success');
      setShowToast(true);

      // Wait a moment for the user to see the success message, then navigate
      setTimeout(() => {
        navigate({ to: '/admin/financial' });
      }, 2000);
      
    } catch (error: any) {
      // Handle API errors
      const errorMessage = error.data?.non_field_errors?.[0] || 
                          error.data?.reference_number?.[0] || 
                          error.data?.detail || 
                          "An error occurred while recording the payment";
      
      setToastMessage(errorMessage);
      setToastVariant('dark');
      setShowToast(true);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const data = await viewMonthlyBill(value);
    setFormData((prev) => ({
      ...prev, 
      bill: Number(value), 
      amount: Number(data?.amount_due), 
      user: data?.user?.id, 
      unit: Number(data?.unit?.id)
    }));
  };

  const handleUserChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const userId = Number(e.target.value);
    setFormData(prev => ({
      ...prev,
      user: userId,
      unit: undefined, // Reset unit when user changes
      amount: undefined, // Reset amount when user changes
      bill: undefined, // Reset bill when user changes
      advance_start_date: undefined, // Reset advance dates
      advance_end_date: undefined // Reset advance dates
    }));
    setCalculatedAdvance(null); // Reset calculated advance
  };

  const handleAdvanceDateChange = (field: 'advance_start_date' | 'advance_end_date', value: string) => {
    const updatedFormData = {
      ...formData,
      [field]: value
    };
    
    setFormData(updatedFormData);

    if (updatedFormData.advance_start_date && updatedFormData.advance_end_date && updatedFormData.unit && updatedFormData.user) {
      calculateAdvanceAmount(updatedFormData);
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
        amount: computed.total_amount
      }));
    } catch (error) {
      console.error('Error calculating advance payment:', error);
      setCalculatedAdvance(null);
    } finally {
      setIsCalculating(false);
    }
  };

  // Get current bills to show in dropdown (filtered or all)
  const currentBills = activeTab === "regular" && formData.user ? filteredBills : monthlyBillsList;

  return (
    <div className="container py-4">
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
              {toastVariant === 'success' ? 'Success' : toastVariant === 'dark' ? 'Error' : 'Failed'}
            </strong>
          </Toast.Header>
          <Toast.Body className={toastVariant === 'success' ? 'text-white' : 'text-white'}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Header */}
      <div className="mb-4">
        <h1 className="h2 fw-bold">Record Payments</h1>
        <p className="text-muted">
          Record regular bill payments or advance payments for future periods.
        </p>
      </div>

      {/* Payment Form with Tabs */}
      <Card>
        <Card.Header>
          <Tabs
            activeKey={activeTab}
            onSelect={(tab) => { 
               setFormData(previousFormData => ({
                 ...previousFormData, 
                 advance_start_date: undefined, 
                 advance_end_date: undefined, 
                 amount: undefined, 
                 bill: undefined,
                 user: undefined,
                 unit: undefined
               }));
               setActiveTab(tab || "regular");
               setFilteredUnits([]);
               setSelectedUserName("");
               setFilteredBills(monthlyBillsList || []);
              }}
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
          <Form onSubmit={addPayment}>
            {/* Regular Payment Tab Content */}
            {activeTab === "regular" && (
              <div>
                <h5 className="mb-3">Monthly Payment</h5>
                <p className="text-muted mb-4">
                  Record payment for an existing bill. Select a resident to see their pending bills.
                </p>
                
                <Row className="g-3">
                  {/* Resident Selection */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Resident</Form.Label>
                      <Form.Select 
                        value={formData.user || ''}
                        onChange={handleUserChange}
                        required
                      >
                        <option value="">Select resident</option>
                        {usersAsOptions?.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.first_name} {user.middle_name} {user.last_name}
                          </option>
                        ))}
                      </Form.Select>
                      {selectedUserName && (
                        <Form.Text className="text-muted">
                          Showing bills for {selectedUserName}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                  
                  {/* Bill Selection - Filtered by selected resident */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Select Bill</Form.Label>
                      <Form.Select 
                        value={formData.bill || ''} 
                        onChange={handlePaymentChange}
                        disabled={!formData.user || currentBills?.length === 0}
                        required
                      >
                        <option value="">
                          {!formData.user 
                            ? "Select a resident first"
                            : currentBills?.length === 0 
                            ? "No pending bills for this resident"
                            : "Select a bill to pay"}
                        </option>
                        {currentBills?.map((month) => (
                          <option key={month.id} value={month.id}>
                            Unit({month.unit.building}) {month.unit?.unit_name} - {formatDateToHumanReadable(month.due_date)} - ₱{month.amount_due}
                          </option>
                        ))}
                      </Form.Select>
                      {formData.user && currentBills?.length === 0 && (
                        <Form.Text className="text-danger">
                          No pending bills found for this resident.
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>

                  {/* Unit (auto-filled from bill) */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Unit</Form.Label>
                      <Form.Control
                        type="text"
                        value={
                          formData.unit && units?.find(unit => unit.id === formData.unit)
                            ? `${units.find(unit => unit.id === formData.unit)?.unit_name} (${units.find(unit => unit.id === formData.unit)?.building})`
                            : ''
                        }
                        placeholder="Auto-filled from bill selection"
                        readOnly
                      />
                    </Form.Group>
                  </Col>

                  {/* Amount (auto-filled from bill) */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Amount</Form.Label>
                      <Form.Control
                        type="text"
                        disabled
                        value={formData.amount || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => 
                          setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))
                        }
                        placeholder="Auto-filled from bill"
                        required
                        min="1"
                      />
                    </Form.Group>
                  </Col>

                  {/* Payment Method */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Payment Method</Form.Label>
                      <Form.Select 
                        value={formData.payment_method || ''}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => 
                          setFormData(prev => ({ ...prev, payment_method: Number(e.target.value) }))
                        }
                        required
                      >
                        <option value="">Select payment method</option>
                        {paymentMethods.methods?.map((method: PaymentMethod) => (
                          <option key={method.id} value={method.id}>
                            {method.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* Reference Number */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Reference Number</Form.Label>
                      <Form.Control
                        value={formData.reference_number || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => 
                          setFormData(prev => ({ ...prev, reference_number: e.target.value }))
                        }
                        placeholder="e.g., 1234 1234 1234"
                        required
                      />
                    </Form.Group>
                  </Col>

                  {/* Payment Status */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Payment Status</Form.Label>
                      <Form.Select 
                        value={formData.status}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => 
                          setFormData(prev => ({ ...prev, status: e.target.value }))
                        }
                        required
                      >
                        <option value="">Select status</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="rejected">Rejected</option>
                      </Form.Select>
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
                  Record payment for future periods. The amount will be automatically calculated based on the date range.
                </p>
                
                <Row className="g-3">
                  {/* Resident Selection */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Resident</Form.Label>
                      <Form.Select 
                        value={formData.user || ''}
                        onChange={handleUserChange}
                        required
                      >
                        <option value="">Select resident</option>
                        {usersAsOptions?.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.first_name} {user.middle_name} {user.last_name}
                          </option>
                        ))}
                      </Form.Select>
                      {selectedUserName && (
                        <Form.Text className="text-muted">
                          Showing units assigned to {selectedUserName}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>

                  {/* Unit Selection - Filtered based on selected resident */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Unit</Form.Label>
                      <Form.Select 
                        value={formData.unit || ''}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => 
                          setFormData(prev => ({ ...prev, unit: Number(e.target.value) }))
                        }
                        disabled={!formData.user || filteredUnits.length === 0}
                        required
                      >
                        <option value="">
                          {!formData.user 
                            ? "Select a resident first"
                            : filteredUnits.length === 0 
                            ? "No units assigned to this resident"
                            : "Select unit"}
                        </option>
                        {filteredUnits?.map((unit) => (
                          <option key={unit.id} value={unit.id}>
                            {unit.unit_name} ({unit.building})
                          </option>
                        ))}
                      </Form.Select>
                      {formData.user && filteredUnits.length === 0 && (
                        <Form.Text className="text-danger">
                          This resident has no pending bills or assigned units. Please check bill records.
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>

                  {/* Advance Period Dates */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Start Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={formData.advance_start_date || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => 
                          handleAdvanceDateChange('advance_start_date', e.target.value)
                        }
                        disabled={!formData.unit}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>End Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={formData.advance_end_date || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => 
                          handleAdvanceDateChange('advance_end_date', e.target.value)
                        }
                        disabled={!formData.unit}
                        required
                      />
                    </Form.Group>
                  </Col>

                  {/* Calculated Amount */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Amount</Form.Label>
                      <Form.Control
                        type="number"
                        value={formData.amount || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => 
                          setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))
                        }
                        placeholder={isCalculating ? "Calculating..." : "Auto-calculated"}
                        readOnly={!!calculatedAdvance}
                        disabled
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

                  {/* Payment Method */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Payment Method</Form.Label>
                      <Form.Select 
                        value={formData.payment_method || ''}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => 
                          setFormData(prev => ({ ...prev, payment_method: Number(e.target.value) }))
                        }
                        required
                      >
                        <option value="">Select payment method</option>
                        {paymentMethods.methods?.map((method: PaymentMethod) => (
                          <option key={method.id} value={method.id}>
                            {method.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* Reference Number */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Reference Number</Form.Label>
                      <Form.Control
                        value={formData.reference_number || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => 
                          setFormData(prev => ({ ...prev, reference_number: e.target.value }))
                        }
                        placeholder="e.g., 1234 1234 1234"
                        required
                      />
                    </Form.Group>
                  </Col>

                  {/* Payment Status */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Payment Status</Form.Label>
                      <Form.Select 
                        value={formData.status}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => 
                          setFormData(prev => ({ ...prev, status: e.target.value }))
                        }
                        required
                      >
                        <option value="">Select status</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="rejected">Rejected</option>
                      </Form.Select>
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

            {/* Form Buttons */}
            <div className="d-flex justify-content-between mt-4">
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate({ to: '/admin/financial' })}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                disabled={
                  isSubmitting || 
                  (activeTab === 'advance' && (!formData.advance_start_date || !formData.advance_end_date || !formData.amount || !formData.unit))
                }
              >
                {isSubmitting ? 'Processing...' : (activeTab === 'advance' ? 'Record Advance Payment' : 'Record Payment')}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default RecordPayment;