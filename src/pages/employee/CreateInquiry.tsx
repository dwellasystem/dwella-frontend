import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Header from "../../components/Header";
import { FaAngleRight } from "react-icons/fa6";
import type { Unit } from "../../models/Unit.model";
import { type Dispatch, type FormEvent, type SetStateAction } from "react";
import type { User } from "../../models/User.model";

type FormType ={
    resident: number|undefined;
    unit: number|undefined;
    type: string;
    description: string;
    title: string;
}

type Props = {
  units: Unit[];
  users?: User[];
  formData: FormType;
  setFormData: Dispatch<SetStateAction<FormType>>;
  formSubmit: (e: FormEvent) => void;
  navigateTo: (path: string) => void;
}

function CreateInquiry({units, users, formData, formSubmit, setFormData, navigateTo}:Props) {
    

  return (
    <Container
      className="pt-5 d-flex flex-column w-100"
      style={{ maxWidth: "70rem" }}
    >
      {/* Header component*/}
      <Header path={"admin"}>
        <div className="d-flex gap-3">
          <h3 className="fw-bold">Log New Inquiry</h3>
        </div>
      </Header>

      {/* Form page heading */}
      <div className="d-flex align-items-center gap-1 pt-5 mb-3">
        <span className="text-muted fw-bold d-flex align-items-center">
          Inquiries
        </span>
        <FaAngleRight size={12} />
        <span className="text-dark fw-bold d-flex align-items-center">
          Log New Inquiry
        </span>
      </div>

      {/* Notice Form */}
      <Form
        onSubmit={formSubmit}
        className="p-5 rounded-3 mb-5"
        style={{ backgroundColor: "#F2F2F7" }}
      >
        <h3>Details</h3>
        <Row className="pt-3">
          {/* Resident Name */}
          <Col xs={12} md={6}>
            <Form.Group className="mb-3" controlId="formResidentName">
              <Form.Label>Resident</Form.Label>
              <Form.Select
                value={formData.resident}
                onChange={(e) => setFormData((prev) => ({...prev, resident: Number(e.target.value)}))}
                aria-label="Default select example"
              >
                <option value={""}>Select Resident</option>
                {users &&
                  users.map((user: User) => user.role === 'resident' && (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.middle_name} {user.last_name}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Unit Number */}
          <Col xs={12} md={6}>
            <Form.Group className="mb-3" controlId="formUnitNumber">
              <Form.Label>Unit Number</Form.Label>
              <Form.Select
                onChange={(e) => setFormData((prev) => ({...prev, unit: Number(e.target.value)}))}
                aria-label="Default select example"
              >
                <option value={""}>Select Unit</option>
                {units &&
                  units.map((unit: Unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.unit_name}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col xs={6}>
            <Form.Group className="mb-3" controlId="formDateSubmission">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={formData.title}
                onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                type="text"
                placeholder="e.g., No water 8AM–5PM."
              />
            </Form.Group>
          </Col>

          {/* Type */}
          <Col xs={12} md={6}>
            <Form.Group className="mb-3" controlId="formType">
              <Form.Label>Type</Form.Label>
              <Form.Select value={formData.type} onChange={(e) => setFormData((prev) => ({...prev, type: e.target.value}))}>
                <option value={""}>Select Type</option>
                <option value="complaint">Complaint</option>
                <option value="question">Question</option>
                <option value="request">Request</option>
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Date Submission */}
          {/* <Col xs={12} md={6}>
            <Form.Group className="mb-3" controlId="formDateSubmission">
              <Form.Label>Date Submission</Form.Label>
              <Form.Control type="date" value={formData.date} onChange={(e) => setFormData(prev => ({...prev, date: e.target.value}))}/>
            </Form.Group>
          </Col> */}

          {/* Details */}
          <Col xs={12}>
            <Form.Group className="mb-3" controlId="formDateSubmission">
              <Form.Label>Details</Form.Label>
              <Form.Control
              value={formData.description}
              onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                as="textarea"
                rows={5}
                type="date"
                placeholder="e.g., Water service will be unavailable on May 6 from 8AM–5PM."
              />
            </Form.Group>
          </Col>

          <Col className="d-flex gap-3 flex-wrap align-items-center justify-content-end mt-3">
            <div
              className="d-flex flex-grow-1 flex-sm-grow-0 align-items-center justify-content-center px-5 py-3 rounded-3"
              style={{ backgroundColor: "#CED4F5", cursor: "pointer" }}
              onClick={() => navigateTo("/employee/inquiries")}
            >
              <span className="text-black text-center fw-bold">Cancel</span>
            </div>
            <Button
              type="submit"
              className="d-flex border-0 flex-grow-1 flex-sm-grow-0 align-items-center justify-content-center px-5 py-3 rounded-3"
              style={{ backgroundColor: "#344CB7", cursor: "pointer" }}
            >
              <span className="text-light text-center fw-bold">Create</span>
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default CreateInquiry;
