import { Button, Col, Container, Form, Row } from "react-bootstrap"
import Header from "../../components/Header"
import { FaAngleRight } from "react-icons/fa6"
import { useGetUsers } from "../../hooks/user/useGetUsers"
import { useMemo, useState } from "react";
import { useMonthlyBill } from "../../hooks/monthly-bills/useMonthlyBill";
import { useNavigate } from "@tanstack/react-router";
import { useGetUnits } from "../../hooks/unit/useGetUnits";
import { useAuth } from "../../contexts/auth/AuthContext";

type FormType = {
    user_id: number | undefined,
    unit_id: number | undefined,
    amount_due: number | undefined,
    due_date: string,
    payment_status: string | undefined,
}

const initialFormState: FormType = {
    user_id: undefined,
    unit_id: undefined,
    amount_due: undefined,
    due_date: "",
    payment_status: undefined,
}

function CreateBill() {
    const navigate = useNavigate();
    const {role} = useAuth();

    const filtersUsers = useMemo(() => {
        return {
            role: 'resident',
        }
    },[]);

    const filtersUnits = useMemo(() => {
        return {
            isAvailable: false,
        }
    },[]);

    const {usersAsOptions} = useGetUsers(filtersUsers);
    const {units} = useGetUnits(filtersUnits);
    const {createNewMonthlyBill} = useMonthlyBill();
    const [formData, setFormData] = useState<FormType>(initialFormState);

    const validateForm = () => {
      const validUser = formData.user_id !== undefined && formData.user_id > 0;
      const validAmountDue = formData.amount_due !== undefined && formData.amount_due > 0;
      const validDueDate = formData.due_date !== "";
      const validPaymentStatus = formData.payment_status !== undefined && formData.payment_status !== "" && formData.payment_status !== "Select";
  
      if(!validUser){
        return console.log("Resident is required");
      }
      if(!validAmountDue){
        return console.log("Amount Due is required");
      }
      if(!validDueDate){
        return console.log("Due Date is required");
      }
      if(!validPaymentStatus){
        return console.log("Payment Status is required");
      }
  
      return true;
    }

    const createNewBill = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        if(!validateForm()){
            console.log('validation failed');
            return;
        };
        await createNewMonthlyBill(formData);
        navigate({to:`/${role}/monthly-bill`})
      } catch (error) {
          console.log(error)
      }
    }

  return (
   <Container
      className="pt-5 d-flex flex-column w-100"
      style={{ maxWidth: "70rem" }}
    >
      {/* Header component*/}
      <Header path={"admin"}>
        <div className="d-flex gap-3">
          <h3 className="fw-bold">Create New Bill</h3>
        </div>
      </Header>

      {/* Form page heading */}
      <div className="d-flex align-items-center gap-1 pt-5 mb-3">
        <span className="text-muted fw-bold d-flex align-items-center">
          Monthly Bill
        </span>
        <FaAngleRight size={12} />
        <span className="text-dark fw-bold d-flex align-items-center">
          Create New Bill
        </span>
      </div>

      {/* Add Resident Form */}
      <Form
        onSubmit={createNewBill}
        className="p-5 rounded-3 mb-5"
        style={{ backgroundColor: "#F2F2F7" }}
      >
        <h3>Details</h3>
        <Row className="pt-3">
          {/* Fullname */}
          <Col xs={12} md={6}>
            <Form.Group className="mb-3" controlId="formResidenttMethod">
              <Form.Label>Resident</Form.Label>
              <Form.Select aria-label="Default select example" onChange={(e) => setFormData((prev) => ({...prev, user_id: Number(e.target.value)}))}>
                <option value={undefined}>Select Resident</option>
                {usersAsOptions?.map((user) => (
                  <option key={user.id} value={user.id}>{user.first_name} {user.middle_name} {user.last_name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>


          {/* Units */}
          <Col xs={12} md={6}>
            <Form.Group className="mb-3" controlId="formResidenttMethod">
              <Form.Label>Unit</Form.Label>
              <Form.Select aria-label="Default select example" onChange={(e) => setFormData((prev) => ({...prev, unit_id: Number(e.target.value)}))}>
                <option value={undefined}>Select Unit</option>
                {units?.map((unit) => (
                  <option key={unit.id} value={unit.id}>{unit.unit_name}({unit.building})</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Amount Paid */}
          <Col>
            <Form.Group className="mb-3" controlId="formAmountPaid">
              <Form.Label>Amount Paid</Form.Label>
              <Form.Control value={initialFormState.amount_due} onChange={(e) => setFormData((prev) => ({...prev, amount_due: Number(e.target.value)}))} required type="text" placeholder="e.g., 1,200" />
            </Form.Group>
          </Col>

          {/* Date of payment */}
          <Col xs={12} md={6}>
            <Form.Group className="mb-3" controlId="formDateOfPayment">
              <Form.Label>Date of payment</Form.Label>
              <Form.Control onChange={(e) => setFormData((prev) => ({...prev, due_date: e.target.value}))} required type="date" />
            </Form.Group>
          </Col>

          {/* Payment status */}
          <Col xs={12} md={6}>
            <Form.Group className="mb-3" controlId="formPaymentStatus">
              <Form.Label>Payment Status</Form.Label>
              <Form.Select aria-label="Default select example" value={initialFormState.payment_status} onChange={(e) => setFormData((prev) => ({...prev, payment_status: e.target.value}))}>
                <option value={undefined}>Select</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col className="d-flex gap-3 flex-wrap align-items-center justify-content-end mt-3">
            <div
              onClick={() => navigate({to:'/admin/monthly-bill'})}
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
              Create Bill
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  )
}

export default CreateBill