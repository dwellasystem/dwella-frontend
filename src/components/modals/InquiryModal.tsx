import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import type { Inquiry } from "../../models/Inquiry.model";
import { Col, Form, FormControl } from "react-bootstrap";
import { useState } from "react";
import { useGetUnits } from "../../hooks/unit/useGetUnits";
import { useGetUsers } from "../../hooks/user/useGetUsers";
import { CiEdit } from "react-icons/ci";
import { FaCheck } from "react-icons/fa6";

type FormType = {
  resident: number | undefined;
  unit: number | undefined;
  type: string;
  description: string;
  title: string;
  status: string;
};

type Props = {
  onHide: () => void;
  show: boolean;
  inquiryDetail?: Inquiry;
  setInquiryDetail: React.Dispatch<React.SetStateAction<Inquiry | undefined>>;
  newData: FormType | undefined;
  setNewData: React.Dispatch<React.SetStateAction<FormType | undefined>>;
  saveChanges: () => void;
};

function InquiryModal({
  onHide,
  show,
  newData,
  setNewData,
  saveChanges,
}: Props) {
  const { units } = useGetUnits();
  const { usersAsOptions: users } = useGetUsers();
  const [isEditBody, setIsEditBody] = useState<boolean>(false);
  const [isEditTitle, setIsEditTitle] = useState<boolean>(false);

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className="bg-light">
        <Modal.Title id="contained-modal-title-vcenter" className="fw-bold">
          Inquiry Details
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ width: "100%" }}>
        <div className="d-flex item gap-2">
          {!isEditTitle ? (
            <h5 className="fw-bold">{newData?.title}</h5>
          ) : (
            <input
              value={newData?.title}
              onChange={(e) =>
                setNewData((prev) => ({ ...prev!, title: e.target.value }))
              }
            />
          )}
          <div
            onClick={() => setIsEditTitle(!isEditTitle)}
            className="text-center"
            style={{ cursor: "pointer" }}
          >
            {!isEditTitle ? (
              <CiEdit size={25} color="black" />
            ) : (
              <FaCheck size={20} color="green" />
            )}
          </div>
        </div>
        <p className={`text-muted ${isEditBody ? "d-flex align-items-center" : ""}`}>
          {!isEditBody ? <span>
            {newData?.description}
          </span> : <FormControl as="textarea" rows={5} value={newData?.description} onChange={(e) =>
                setNewData((prev) => ({ ...prev!, description: e.target.value }))
              }/>}
          <span className="ms-2" style={{cursor:'pointer'}} onClick={() => setIsEditBody(!isEditBody)}>
            {!isEditBody ? (
              <CiEdit size={25} color="black" />
            ) : (
              <FaCheck size={20} color="green" />
            )}
          </span>
        </p>

        <Table borderless size="sm" className="mt-3">
          <tbody>
            <tr>
              <th className="w-25">Resident</th>
              <td>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3" controlId="formType">
                    <Form.Select
                      value={newData?.resident}
                      onChange={(e) =>
                        setNewData((prev) => ({
                          ...prev!,
                          resident: Number(e.target.value),
                        }))
                      }
                    >
                      <option value={""}>Select Type</option>
                      {users?.map(
                        (user) =>
                          user.role === "resident" && (
                            <option
                              key={user.id}
                              value={user.id}
                            >{`${user.first_name} ${user.middle_name} ${user.last_name}`}</option>
                          )
                      )}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </td>
            </tr>
            <tr>
              <th>Unit</th>
              <td>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3" controlId="formType">
                    <Form.Select
                      value={newData?.unit}
                      onChange={(e) =>
                        setNewData((prev) => ({
                          ...prev!,
                          unit: Number(e.target.value),
                        }))
                      }
                    >
                      <option value={""}>Select Type</option>
                      {units.map((unit) => (
                        <option key={unit.id} value={unit.id}>
                          {unit.unit_name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </td>
            </tr>
            <tr>
              <th>Type</th>
              <td className="text-capitalize">
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3" controlId="formType">
                    <Form.Select
                      value={newData?.type}
                      onChange={(e) =>
                        setNewData((prev) => ({
                          ...prev!,
                          type: e.target.value,
                        }))
                      }
                    >
                      <option value={""}>Select Type</option>
                      <option value="request">Request</option>
                      <option value="complaint">Complaint</option>
                      <option value="question">Question</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </td>
            </tr>
            <tr>
              <th>Status</th>
              <td>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3" controlId="formType">
                    <Form.Select
                      value={newData?.status}
                      onChange={(e) =>
                        setNewData((prev) => ({
                          ...prev!,
                          status: e.target.value,
                        }))
                      }
                    >
                      <option value={""}>Select Type</option>
                      <option value="resolved">Resolved</option>
                      <option value="in_progress">In Progress</option>
                      <option value="open">Open</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="success" onClick={saveChanges}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default InquiryModal;
