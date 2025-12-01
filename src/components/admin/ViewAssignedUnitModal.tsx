import { Modal, Button } from "react-bootstrap";
import { FaBuilding, FaHome, FaUser, FaShieldAlt, FaToolbox, FaCogs } from "react-icons/fa";
import type { PaginatedAssignedUnit } from "../../models/PaginatedAssignedUnit.model";

type Props = {
  show: boolean;
  onHide: () => void;
  unit: PaginatedAssignedUnit | null;
};

function ViewAssignedUnitModal({ show, onHide, unit }: Props) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      contentClassName="border-0 shadow-lg rounded-4"
    >
      {/* Header */}
      <Modal.Header
        closeButton
        className="border-0 text-white rounded-top-4"
        style={{backgroundColor: 'rgb(52, 76, 183)'}}
      >
        <Modal.Title className="fw-semibold">
          🏢 View Assigned Unit
        </Modal.Title>
      </Modal.Header>

      {/* Body */}
      <Modal.Body
        className="p-4"
        style={{
          backgroundColor: "#f9fafb",
        }}
      >
        {unit ? (
          <div className="d-flex flex-column gap-3">
            <div
              className="p-3 rounded-3 shadow-sm bg-white d-flex align-items-center gap-3"
              style={{ borderLeft: "5px solid #0d6efd" }}
            >
              <FaHome className="text-primary fs-5" />
              <div>
                <p className="mb-1 text-muted small">Unit</p>
                <h6 className="fw-semibold mb-0">{unit.unit_id?.unit_name}</h6>
              </div>
            </div>

            <div
              className="p-3 rounded-3 shadow-sm bg-white d-flex align-items-center gap-3"
              style={{ borderLeft: "5px solid #6610f2" }}
            >
              <FaBuilding className="text-secondary fs-5" />
              <div>
                <p className="mb-1 text-muted small">Building</p>
                <h6 className="fw-semibold mb-0">{unit.unit_id?.building}</h6>
              </div>
            </div>

            <div
              className="p-3 rounded-3 shadow-sm bg-white d-flex align-items-center gap-3"
              style={{ borderLeft: "5px solid #20c997" }}
            >
              <FaUser className="text-success fs-5" />
              <div>
                <p className="mb-1 text-muted small">Owner</p>
                <h6 className="fw-semibold mb-0">
                  {unit.assigned_by?.first_name}{" "}
                  {unit.assigned_by?.middle_name}{" "}
                  {unit.assigned_by?.last_name}
                </h6>
              </div>
            </div>

            <div
              className="p-3 rounded-3 shadow-sm bg-white d-flex align-items-center gap-3"
              style={{ borderLeft: "5px solid #ffc107" }}
            >
              <FaCogs className="text-warning fs-5" />
              <div>
                <p className="mb-1 text-muted small">Status</p>
                <h6 className="fw-semibold mb-0 text-capitalize">
                  {unit.unit_status.replace(/_/g, " ")}
                </h6>
              </div>
            </div>

            <div
              className="p-3 rounded-3 shadow-sm bg-white d-flex align-items-center gap-3"
              style={{ borderLeft: "5px solid #198754" }}
            >
              <FaToolbox className="text-success fs-5" />
              <div>
                <p className="mb-1 text-muted small">Maintenance</p>
                <h6 className="fw-semibold mb-0">
                  {unit.maintenance ? "Yes" : "No"}
                </h6>
              </div>
            </div>

            <div
              className="p-3 rounded-3 shadow-sm bg-white d-flex align-items-center gap-3"
              style={{ borderLeft: "5px solid #0dcaf0" }}
            >
              <FaShieldAlt className="text-info fs-5" />
              <div>
                <p className="mb-1 text-muted small">Security</p>
                <h6 className="fw-semibold mb-0">
                  {unit.security ? "Yes" : "No"}
                </h6>
              </div>
            </div>

            <div
              className="p-3 rounded-3 shadow-sm bg-white d-flex align-items-center gap-3"
              style={{ borderLeft: "5px solid #fd7e14" }}
            >
              <FaBuilding className="text-warning fs-5" />
              <div>
                <p className="mb-1 text-muted small">Amenities</p>
                <h6 className="fw-semibold mb-0">
                  {unit.amenities ? "Yes" : "No"}
                </h6>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-muted">No details available.</p>
        )}
      </Modal.Body>

      {/* Footer */}
      <Modal.Footer className="border-0 bg-light rounded-bottom-4">
        <Button variant="outline-secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ViewAssignedUnitModal;
