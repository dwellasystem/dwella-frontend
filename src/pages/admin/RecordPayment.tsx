import { useState, useMemo, type FormEvent, type ChangeEvent } from "react";
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
  Badge
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
  const { createPaymentRecord,  calculateAdvance} = usePayments();
  const paymentMethods = usePaymentMethods();

  const [formData, setFormData] = useState<FormType>(initialFormState);
  const [calculatedAdvance, setCalculatedAdvance] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState("regular");

  const navigate = useNavigate();

  console.log(monthlyBillsList)

  const addPayment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // For advance payments, make sure dates are set
    if (activeTab === 'advance' && (!formData.advance_start_date || !formData.advance_end_date)) {
      alert('Please select both start and end dates for advance payment');
      return;
    }
    
    const submissionData = {
      ...formData,
      payment_type: activeTab
    };
    
    await createPaymentRecord(submissionData);
    navigate({ to: '/admin/financial' });
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

  const handleAdvanceDateChange = (field: 'advance_start_date' | 'advance_end_date', value: string) => {
    const updatedFormData = {
      ...formData,
      [field]: value
    };
    
    setFormData(updatedFormData);

    // For a real implementation, you would call calculateAdvancePayment here
    // This is just a placeholder since calculateAdvancePayment doesn't exist in your hook
    if (updatedFormData.advance_start_date && updatedFormData.advance_end_date && updatedFormData.unit && updatedFormData.user) {
      calculateAdvanceAmount(updatedFormData);
    }
  };

  // Placeholder function since calculateAdvancePayment doesn't exist in your hook
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

      const placeholderCalculation = computed;
      // This would be your actual calculation logic
      // For now, we'll just set a placeholder amount
      // const placeholderCalculation = {
      //   months_covered: 3,
      //   monthly_amount: 20000,
      //   total_amount: 60000,
      //   breakdown: {
      //     base_rent: 15000,
      //     additional_charges: 5000
      //   }
      // };

      console.log(computed)
      
      setCalculatedAdvance(placeholderCalculation);
      setFormData(prev => ({
        ...prev,
        amount: placeholderCalculation.total_amount
      }));
    } catch (error) {
      console.error('Error calculating advance payment:', error);
      setCalculatedAdvance(null);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="container py-4">
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
               setFormData(previousFormData => ({...previousFormData, advance_start_date: undefined, advance_end_date: undefined, amount: undefined, bill: undefined}));
               setActiveTab(tab || "regular")
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
                  Record payment for an existing bill. Select a bill to auto-fill the resident and amount.
                </p>
                
                <Row className="g-3">
                  {/* Resident */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Resident</Form.Label>
                      <Form.Control
                        type="text"
                        value={
                          usersAsOptions?.find(user => user.id === formData.user)
                            ? `${usersAsOptions.find(user => user.id === formData.user)?.first_name} ${usersAsOptions.find(user => user.id === formData.user)?.middle_name} ${usersAsOptions.find(user => user.id === formData.user)?.last_name}`
                            : ''
                        }
                        placeholder="Auto-filled from bill"
                        disabled
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                  {/* Bill Selection */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Select Bill</Form.Label>
                      <Form.Select 
                        value={formData.bill || ''} 
                        onChange={handlePaymentChange}
                      >
                        <option value="">Select a bill to pay</option>
                        {monthlyBillsList?.map((month) => (
                          <option key={month.id} value={month.id}>
                            Unit {month.unit?.unit_name} - {formatDateToHumanReadable(month.due_date)}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* Amount (auto-filled from bill) */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Amount</Form.Label>
                      <Form.Control
                        type="number"
                        value={formData.amount || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => 
                          setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))
                        }
                        placeholder="Auto-filled from bill"
                        required
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
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => 
                          setFormData(prev => ({ ...prev, user: Number(e.target.value) }))
                        }
                      >
                        <option value="">Select resident</option>
                        {usersAsOptions?.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.first_name} {user.middle_name} {user.last_name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* Unit Selection */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Unit</Form.Label>
                      <Form.Select 
                        value={formData.unit || ''}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => 
                          setFormData(prev => ({ ...prev, unit: Number(e.target.value) }))
                        }
                      >
                        <option value="">Select unit</option>
                        {units?.map((unit) => (
                          <option key={unit.id} value={unit.id}>
                            {unit.unit_name} ({unit.building})
                          </option>
                        ))}
                      </Form.Select>
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
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                disabled={activeTab === 'advance' && (!formData.advance_start_date || !formData.advance_end_date || !formData.amount)}
              >
                {activeTab === 'advance' ? 'Record Advance Payment' : 'Record Payment'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default RecordPayment;