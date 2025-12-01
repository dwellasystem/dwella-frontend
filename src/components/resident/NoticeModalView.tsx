import { Button, Modal, Badge, Card } from "react-bootstrap";
import type { NoticeDetail } from "../../models/Notice.model";

type Props = {
  onShow: boolean;
  onHide: () => void;
  selectedNotice?: NoticeDetail | null;
};

function NoticeModalView({ onHide, onShow, selectedNotice }: Props) {
  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={onShow}
      backdrop="static"
      contentClassName="shadow-lg rounded-4 border-0"
    >
      <Modal.Header
        closeButton
        onClick={onHide}
        className="text-white rounded-top-4"
        style={{backgroundColor: "#344CB7"}}
      >
        <Modal.Title id="contained-modal-title-vcenter" className="fw-bold">
          📢 {selectedNotice?.title || "Notice Details"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4 bg-light">
        <div className="mb-3">
          <Badge bg="primary" className="fs-6 px-3 py-2 rounded-pill">
            {selectedNotice?.notice_type.name || "General Notice"}
          </Badge>
        </div>

        <Card className="shadow-sm border-0 rounded-3">
          <Card.Body>
            <h5 className="fw-semibold mb-3 text-success">Content</h5>
            <p
              className="text-secondary"
              style={{ lineHeight: "1.6", fontSize: "1rem" }}
            >
              {selectedNotice?.content || "No content available."}
            </p>
          </Card.Body>
        </Card>

        {selectedNotice?.target_audience && (
          <div className="mt-4">
            <h6 className="fw-semibold mb-2 text-success">Target Audience</h6>
            <div className="d-flex flex-wrap gap-2">
              {selectedNotice.target_audience.length > 0 ? (
                selectedNotice.target_audience.map((audience, idx) => (
                  <Badge key={idx} bg="info" className="px-3 py-2 rounded-pill">
                    {audience.unit_id.unit_name || "Unknown Unit"}
                  </Badge>
                ))
              ) : (
                <span className="text-muted">Everyone</span>
              )}
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between px-4 py-3 bg-white rounded-bottom-4">
        <small className="text-muted">
          Posted on: {new Date().toLocaleDateString()}
        </small>
        <Button
          style={{backgroundColor: "#344CB7"}}
          className="px-4 border-0 rounded-pill"
          onClick={onHide}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default NoticeModalView;
