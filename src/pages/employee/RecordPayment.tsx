import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Header from "../../components/Header";
import { FaAngleRight } from "react-icons/fa6";
import { useGetUsers } from "../../hooks/user/useGetUsers";
import type { User } from "../../models/User.model";
import { useMemo, useState, type ChangeEvent } from "react";
import { useGetUnits } from "../../hooks/unit/useGetUnits";
import type { Unit } from "../../models/Unit.model";
import { usePaymentMethods } from "../../hooks/payment-methods/usePaymentMethods";
import type { PaymentMethod } from "../../models/PaymentMethod.model";
import { formatDateToHumanReadable } from "../../helpers/authHelper/dateHelper";
import { useNavigate } from "@tanstack/react-router";
import { PaymentService } from "../../services/payment.service";
import { useMonthlyBill } from "../../hooks/monthly-bills/useMonthlyBill";

type FormType = {
  user: number | undefined;
  unit: number | undefined;
  amount: number | undefined;
  status: string;
  reference_number: string | undefined;
  payment_method: number | undefined;
  bill: number | undefined
}

const initialRecordPayment = {
  user: undefined,
  unit: undefined,
  amount: undefined,
  status: "",
  reference_number: undefined,
  payment_method: undefined,
  bill: undefined
}

function RecordPayment() {

  const filterResident = useMemo(() => {
      return {
        role: 'resident',
      }
    },[]);

  const filterBill = useMemo(() => {
    return {
      search: 'pending'
    }
  },[]);

  const {usersAsOptions: users} = useGetUsers(filterResident);
  const {monthlyBill, viewMonthlyBill} = useMonthlyBill(filterBill);
  const units = useGetUnits();
  const paymentMethods = usePaymentMethods();
  const [formData, setFormData] = useState<FormType>(initialRecordPayment);

  const navigate = useNavigate();

  const {createPayment} = PaymentService();

  const validateForm = () => {
    const validResidentId = formData.user !== undefined && formData.user > 0;
    const validUnitNumber = formData.unit !== undefined && formData.unit > 0;
    const validAmountPaid = formData.amount !== undefined && formData.amount > 0;
    const validReferenceNumber = formData.reference_number !== undefined && formData.reference_number !== "";
    const validPaymentMethod = formData.payment_method !== undefined && formData.payment_method > 0;
    const validDateOfPayment = formData.bill !== undefined && formData.bill !== null && Number(formData.bill) > 0;
    const validPaymentStatus = formData.status !== undefined && formData.status !== "" && formData.status !== "Select";

    if(!validResidentId){
      return console.log("Resident is required");
    }

    if(!validUnitNumber){
      return console.log("Unit is required");
    }

    if(!validAmountPaid){
      return console.log("Amount paid is required && must be a number greater than 0");

    }

    if(!validReferenceNumber){
      return console.log("Reference number is required");
    }

    if(!validDateOfPayment){
      return console.log("Date of payment is required");
    }

    if(!validPaymentMethod){
      return console.log("Payment method is required");
    }

    if(!validPaymentStatus){
      return console.log("Payment status is required");
    }
    
    return true;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      if(!validateForm()){
        console.log('validation failed');
        return;
      };

      await createPayment({
        user:formData.user,
        unit:formData.unit,
        amount:formData.amount,
        status:formData.status,
        payment_method:formData.payment_method,
        bill:formData.bill,
        reference_number:formData.reference_number,
      })

      navigate({to:'/employee/payments'});

    } catch (error) {
      console.log(error)
    }
    
  }

  const handlePaymentChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const {name, value} = e.target;
    const data = await viewMonthlyBill(value);
    setFormData((prev) => ({...prev, [name]: value, amount: Number(data?.amount_due), user: Number(data?.user.id), unit:Number(data?.unit.id)}))
  }


  return (
    <Container
      className="pt-5 d-flex flex-column w-100"
      style={{ maxWidth: "70rem" }}
    >
      {/* Header component*/}
      <Header path={"admin"}>
        <div className="d-flex gap-3">
          <h3 className="fw-bold">Record Payments</h3>
        </div>
      </Header>

      {/* Form page heading */}
      <div className="d-flex align-items-center gap-1 pt-5 mb-3">
        <span className="text-muted fw-bold d-flex align-items-center">
          Financial
        </span>
        <FaAngleRight size={12} />
        <span className="text-dark fw-bold d-flex align-items-center">
          Record Payments
        </span>
      </div>

      {/* Add Resident Form */}
      <Form
        onSubmit={handleSubmit}
        className="p-5 rounded-3 mb-5"
        style={{ backgroundColor: "#F2F2F7" }}
      >
        <h3>Details</h3>
        <Row className="pt-3">
          {/* Fullname */}
          <Col xs={12} md={6}>
            <Form.Group className="mb-3" controlId="formResidentName">
              <Form.Label>Resident Name</Form.Label>
              <Form.Select aria-label="Default select example" value={formData.user} onChange={(e) => setFormData((prev) => ({...prev, user: Number(e.target.value)}))}>
                <option value={''}>- - -</option>
                {users && (users.map((user: User) => user.role === 'resident' &&(
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.middle_name} {user.last_name}
                  </option>
                )))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Unit Number */}
          <Col xs={12} md={6}>
            <Form.Group className="mb-3" controlId="formUnitNumber">
              <Form.Label>Unit Number</Form.Label>
                <Form.Select aria-label="Default select example" value={formData.unit} onChange={(e) => setFormData((prev) => ({...prev, unitNumber: Number(e.target.value)}))}>
                  <option value={undefined}>Selec Unit</option>
                  {units.units && (units.units.map((unit: Unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.unit_name}
                    </option>
                  )))}
                </Form.Select>
            </Form.Group>
          </Col>

          {/* Amount Paid */}
          <Col>
            <Form.Group className="mb-3" controlId="formAmountPaid">
              <Form.Label>Amount Paid</Form.Label>
              <Form.Control required type="text" value={formData.amount ?? 1} onChange={(e) => setFormData((prev) => ({...prev, amount: Number(e.target.value)}))} placeholder="e.g., 1,200" />
            </Form.Group>
          </Col>

          {/* Date of payment */}
          <Col xs={12} md={6}>
            <Form.Group className="mb-3" controlId="formDateOfPayment">
              <Form.Label>Date of payment</Form.Label>
              <Form.Select name='bill' value={formData.bill} aria-label="Default select example" onChange={handlePaymentChange}>
                <option value={undefined}>Select Due Date</option>
                {monthlyBill?.results.map((month) => (
                  <option key={month.id} value={month.id}>{`Unit ${month.unit.unit_name} (${formatDateToHumanReadable(month.due_date)})`}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Payment Method*/}
          <Col xs={12} md={6}>
            <Form.Group className="mb-3" controlId="formPaymentMethod">
              <Form.Label>Payment Method</Form.Label>
              <Form.Select aria-label="Default select example" value={formData.payment_method} onChange={(e) => setFormData((prev) => ({...prev, payment_method: Number(e.target.value)}))}>
                <option value={undefined}>Select</option>
                {paymentMethods.methods && paymentMethods.methods.map((method: PaymentMethod) => {
                  return (
                    <option key={method.id} value={method.id}>
                      {method.name}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Reference number of payment */}
          <Col xs={12} md={6}>
            <Form.Group controlId="formReferenceNumber" className="mb-3">
              <Form.Label>Reference Number</Form.Label>
              <Form.Control required type="text" value={formData.reference_number ?? ''} onChange={(e) => setFormData((prev) => ({...prev, reference_number: e.target.value}))} placeholder="e.g., 1234 1234 1234" />
            </Form.Group>
          </Col>

          {/* Payment status */}
          <Col xs={12} md={6}>
            <Form.Group className="mb-3" controlId="formPaymentStatus">
              <Form.Label>Payment Status</Form.Label>
              <Form.Select aria-label="Default select example" value={formData.status} onChange={(e) => setFormData((prev) => ({...prev, status: e.target.value}))}>
                <option value={undefined}>Select</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Rejected</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col className="d-flex gap-3 flex-wrap align-items-center justify-content-end mt-3">
            <div
              onClick={() => navigate({to:`/employee/payments`})}
              className="d-flex flex-grow-1 flex-sm-grow-0 align-items-center justify-content-center px-5 py-3 rounded-3"
              style={{ backgroundColor: "#CED4F5", cursor: "pointer" }}
            >
              <span className="text-black text-center fw-bold">Cancel</span>
            </div>
            <Button
              type="submit"
              title="Add Employee"
              className="d-flex flex-grow-1 flex-sm-grow-0 align-items-center justify-content-center fw-bold border-0 px-3 py-3 rounded-3"
              style={{ backgroundColor: "#344CB7", cursor: "pointer" }}
            >
              Add Payment
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default RecordPayment;
