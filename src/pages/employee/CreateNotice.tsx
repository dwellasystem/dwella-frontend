import { Col, Container, Form, Row } from "react-bootstrap";
import Header from "../../components/Header";
import { FaAngleRight } from "react-icons/fa6";
import { type FormEvent } from "react";
import type { NoticeType } from "../../models/NoticeType.model";
import type { AssignedUnitPopulated } from "../../models/AssigneUnit.model";

interface initialFormDataType {
  title: string;
  content: string;
  target_audience: number[] | undefined;
  notice_type: undefined | number;
}

interface CreateNoticeProps {
  setFormData: React.Dispatch<React.SetStateAction<initialFormDataType>>;
  formData: initialFormDataType;
  allChecked: boolean;
  navigateTo: () => Promise<void>;
  submitForm: (e: FormEvent) => void;
  handleAllChange: () => void;
  handleUnitChange: (id: number) => void
  units?: AssignedUnitPopulated[];
  title: string;
  noticeTypes: NoticeType[] | undefined;
}

function CreateNotice({formData,noticeTypes, setFormData, units,title, allChecked, submitForm, handleAllChange, handleUnitChange, navigateTo}: CreateNoticeProps) {

  return (
    <Container
      className="pt-5 d-flex flex-column w-100"
      style={{ maxWidth: "70rem" }}
    >
      {/* Header component*/}
      <Header path={"admin"}>
        <div className="d-flex gap-3">
          <h3 className="fw-bold">New Notice</h3>
        </div>
      </Header>

      {/* Form page heading */}
      <div className="d-flex align-items-center gap-1 pt-5 mb-3">
        <span className="text-muted fw-bold d-flex align-items-center">
          Notifications
        </span>
        <FaAngleRight size={12} />
        <span className="text-dark fw-bold d-flex align-items-center">
          New Notice
        </span>
      </div>

      {/* Notice Form */}
      <Form
        onSubmit={submitForm}
        className="p-5 rounded-3 mb-5"
        style={{ backgroundColor: "#F2F2F7" }}
      >
        <h3>Details</h3>
        <Row className="pt-3">
          {/* Title */}
          <Col xs={6}>
            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={formData?.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                type="text"
                placeholder="e.g., Water Interruption Notice"
              />
            </Form.Group>
          </Col>
          {/* Select Notice Type */}
          <Col xs={6}>
            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>Type</Form.Label>
              <Form.Select value={formData.notice_type}  aria-label="Default select example" onChange={(e) => setFormData((prev) => ({...prev, notice_type: Number(e.target.value)}))}>
                {noticeTypes && noticeTypes.map((notice) => <option key={notice.id} value={notice.id}>{notice.name}</option>)}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Description */}
          <Col xs={12}>
            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>Description</Form.Label>
              <Form.Control
                value={formData?.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                as="textarea"
                rows={4}
                type="text"
                placeholder="e.g., Water service will be unavailable on May 6 from 8AM–5PM."
              />
            </Form.Group>
          </Col>

          {/* Target Audience */}
          <Col xs={12} md={6}>
            <label className="mb-2">Select  Audience:</label>
            <div className="mb-3">
              {/* All Checkbox */}
              <Form.Check
                inline
                type="checkbox"
                id="checkbox-all"
                label="All"
                checked={allChecked}
                onChange={handleAllChange}
              />
              {units?.map((unit) => (
                <Form.Check
                  inline
                  key={unit.id}
                  type="checkbox"
                  id={`checkbox-${unit.id}`}
                  label={unit.unit_id.unit_name + "-" + unit.unit_id.building}
                  checked={allChecked || formData.target_audience?.includes(Number(unit.id))} // if allChecked true -> all checked
                  onChange={() => handleUnitChange(Number(unit.id))}
                />
              ))}
            </div>
          </Col>

          {/* Expiry Date */}
          {/* <Col xs={12} md={6}>
            <Form.Group className="mb-3" controlId="formTitle">
              <FloatingLabel controlId="floatingInputGrid" label="Expiry Date">
                <Form.Control 
                value={formData?.content}
                onChange={(e) => setFormData((prev) => ({...prev, content: e.target.value}))}
                type="date" 
                placeholder="name@example.com" />
              </FloatingLabel>
            </Form.Group>
          </Col> */}

          <Col className="d-flex gap-3 flex-wrap align-items-center justify-content-end mt-3">
            <div
              className="d-flex flex-grow-1 flex-sm-grow-0 align-items-center justify-content-center px-5 py-3 rounded-3"
              style={{ backgroundColor: "#CED4F5", cursor: "pointer" }}
              onClick={navigateTo}
            >
              <span
                className="text-black text-center fw-bold"
              >
                Cancel
              </span>
            </div>
            <button
              type="submit"
              className="d-flex flex-grow-1 border-0 flex-sm-grow-0 align-items-center justify-content-center px-5 py-3 rounded-3"
              style={{ backgroundColor: "#344CB7", cursor: "pointer" }}
            >
              <span className="text-light text-center fw-bold">{title}</span>
            </button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default CreateNotice;
