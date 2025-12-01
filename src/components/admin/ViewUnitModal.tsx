import { Button, Modal } from "react-bootstrap";
import type { Unit } from "../../models/Unit.model";

type Props = {
  show: boolean;
  onHide: () => void;
  unit: Unit | null;
};

function ViewUnitModal({ show, onHide, unit }: Props) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      contentClassName="border-0 shadow-lg rounded-4"
      backdrop="static"
    >
      <Modal.Header
        closeButton
        className="border-0 text-white rounded-top-4"
        style={{backgroundColor: 'rgb(52, 76, 183)'}}
      >
        <Modal.Title className="fw-semibold">🏠 View Unit Details</Modal.Title>
      </Modal.Header>

      <Modal.Body
        className="p-4"
        style={{
          backgroundColor: "#f9fafb",
        }}
      >
        {unit ? (
          <div
            className="d-flex flex-column gap-3"
            style={{
              fontSize: "1rem",
              color: "#333",
            }}
          >
            <div
              className="p-3 rounded-3 shadow-sm bg-white"
              style={{
                borderLeft: "5px solid #0d6efd",
              }}
            >
              <p className="mb-1 text-muted small">Unit Name</p>
              <h5 className="fw-semibold">{unit.unit_name}</h5>
            </div>

            <div
              className="p-3 rounded-3 shadow-sm bg-white"
              style={{
                borderLeft: "5px solid #198754",
              }}
            >
              <p className="mb-1 text-muted small">Rent Amount</p>
              <h5 className="fw-semibold text-success">
                ₱{unit.rent_amount.toLocaleString()}
              </h5>
            </div>

            <div
              className="p-3 rounded-3 shadow-sm bg-white"
              style={{
                borderLeft: "5px solid #198754",
              }}
            >
              <p className="mb-1 text-muted small">Availability</p>
              <h5 className="fw-semibold text-success">
                {unit.isAvailable ? 'Yes' : 'No'}
              </h5>
            </div>
          </div>
        ) : (
          <p className="text-center text-muted">No details available.</p>
        )}
      </Modal.Body>

      <Modal.Footer className="border-0 bg-light rounded-bottom-4">
        <Button variant="outline-secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ViewUnitModal;
