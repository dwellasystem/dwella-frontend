import { Col, Container, Form, Row } from "react-bootstrap"
import Header from "../../components/Header"
import { FaAngleRight } from "react-icons/fa6"
import { useEffect, useState } from "react";
import { useMonthlyBill } from "../../hooks/monthly-bills/useMonthlyBill";
import { useNavigate } from "@tanstack/react-router";
import type { User } from "../../models/User.model";
import { formatDateToHumanReadable } from "../../helpers/authHelper/dateHelper";
import type { Unit } from "../../models/Unit.model";
import { useAuth } from "../../contexts/auth/AuthContext";

type FormType = {
    user: User | undefined,
    unit: Unit | undefined,
    amount_due: number | undefined,
    due_date: string,
    payment_status: string | undefined,
    due_status: string | undefined,
}

const initialFormState: FormType = {
    user: undefined,
    unit: undefined,
    amount_due: undefined,
    due_date: "",
    payment_status: undefined,
    due_status: undefined,
}

function ViewBill({id}: {id: string}) {

    const navigate = useNavigate();
    const {role} = useAuth();

    const {viewMonthlyBill} = useMonthlyBill();
    const [formData, setFormData] = useState<FormType>(initialFormState);

    const fullName = formData.user ? `${formData.user.first_name} ${formData.user.middle_name} ${formData.user.last_name}` : '';

    useEffect(() => {
        const fetchBill = async () => {
            try {
                const response = await viewMonthlyBill(id);
                // console.log(response?.payment_status)
                setFormData({
                    user: response?.user,
                    unit: response?.unit,
                    amount_due: Number(response?.amount_due),
                    due_date: response?.due_date ?? "",
                    payment_status: response?.payment_status,
                    due_status: response?.due_status,
                })
            } catch (error) {
                console.log(error)
            }
        }
        fetchBill();
    },[])

  return (
   <Container
      className="pt-5 d-flex flex-column w-100"
      style={{ maxWidth: "70rem" }}
    >
      {/* Header component*/}
      <Header path={"admin"}>
        <div className="d-flex gap-3">
          <h3 className="fw-bold">View Bill</h3>
        </div>
      </Header>

      {/* Form page heading */}
      <div className="d-flex align-items-center gap-1 pt-5 mb-3">
        <span className="text-muted fw-bold d-flex align-items-center">
          Monthly Bill
        </span>
        <FaAngleRight size={12} />
        <span className="text-dark fw-bold d-flex align-items-center">
          View Bill
        </span>
      </div>

      {/* Add Resident Form */}
      <Form
        className="p-5 rounded-3 mb-5"
        style={{ backgroundColor: "#F2F2F7" }}
      >
        <h3>Details</h3>
        <Row className="pt-3">
          {/* Fullname */}
          <Col xs={12} md={6}>
            <Form.Group className="mb-3" controlId="formResidenttMethod">
              <Form.Label>Resident</Form.Label>
              <Form.Control disabled value={fullName ?? ""}/>
            </Form.Group>
          </Col>

          {/* Unit */}
          <Col xs={12} md={6}>
            <Form.Group className="mb-3" controlId="formResidenttMethod">
              <Form.Label>Unit</Form.Label>
              <Form.Control disabled value={formData.unit?.unit_name ?? ""}/>
            </Form.Group>
          </Col>

          {/* Amount Paid */}
          <Col>
            <Form.Group className="mb-3" controlId="formAmountPaid">
              <Form.Label>Amount Paid</Form.Label>
              <Form.Control disabled value={formData.amount_due ?? ""} onChange={(e) => setFormData((prev) => ({...prev, amount_due: Number(e.target.value)}))} required type="number" placeholder="e.g., 1,200" />
            </Form.Group>
          </Col>

          {/* Date of payment */}
          <Col xs={12} md={6}>
            <Form.Group className="mb-3" controlId="formDateOfPayment">
              <Form.Label>Date of payment</Form.Label>
              <Form.Control disabled value={formatDateToHumanReadable(formData.due_date)}/>
            </Form.Group>
          </Col>

          {/* Payment status */}
          <Col xs={12} md={6}>
            <Form.Group className="mb-3" controlId="formPaymentStatus">
              <Form.Label>Payment Status</Form.Label>
              <Form.Control disabled value={formData.payment_status}/>
            </Form.Group>
          </Col>

           {/* Due status */}
          <Col xs={12} md={6}>
            <Form.Group className="mb-3" controlId="formPaymentStatus">
              <Form.Label>Payment Status</Form.Label>
              <Form.Control disabled value={formData.due_status}/>
            </Form.Group>
          </Col>

          <Col className="d-flex gap-3 flex-wrap align-items-center justify-content-end mt-3">
            <div
              onClick={() => navigate({to:`/${role}/monthly-bill`})}
              className="d-flex flex-grow-1 flex-sm-grow-0 align-items-center justify-content-center px-5 py-3 rounded-3"
              style={{ backgroundColor: "#CED4F5", cursor: "pointer" }}
            >
              <span className="text-black text-center fw-bold">Back</span>
            </div>
          </Col>
        </Row>
      </Form>
    </Container>
  )
}

export default ViewBill