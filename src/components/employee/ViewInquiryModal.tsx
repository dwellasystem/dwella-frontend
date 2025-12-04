// components/modals/ViewInquiryModal.tsx
import { Modal, Button, Row, Col, Badge } from 'react-bootstrap';
import type { Inquiry } from '../../models/Inquiry.model';
import { formatDateToHumanReadable } from '../../helpers/authHelper/dateHelper';

type ViewInquiryModalProps = {
  inquiry: Inquiry | null;
  show: boolean;
  onClose: () => void;
};

function ViewInquiryModal({ inquiry, show, onClose }: ViewInquiryModalProps) {
  if (!inquiry) return null;

  // Function to get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'open': return 'warning';
      case 'in_progress': return 'info';
      case 'resolved': return 'success';
      default: return 'secondary';
    }
  };

  // Function to format status text
  const formatStatusText = (status: string) => {
    if (!status) return 'N/A';
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  };

  // Function to format type text
  const formatTypeText = (type: string) => {
    if (!type) return 'N/A';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">Inquiry Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-3">
          <Col xs={12} md={6}>
            <div>
              <label className="fw-semibold text-secondary">Resident Name</label>
              <p className="fw-bold">
                {inquiry.resident.first_name} {inquiry.resident.middle_name} {inquiry.resident.last_name}
              </p>
            </div>
          </Col>
          <Col xs={12} md={6}>
            <div>
              <label className="fw-semibold text-secondary">Unit Number</label>
              <p className="fw-bold">{inquiry.unit.unit_name}</p>
            </div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xs={12} md={6}>
            <div>
              <label className="fw-semibold text-secondary">Type</label>
              <p className="fw-bold">{formatTypeText(inquiry.type)}</p>
            </div>
          </Col>
          <Col xs={12} md={6}>
            <div>
              <label className="fw-semibold text-secondary">Date Submitted</label>
              <p className="fw-bold">
                {formatDateToHumanReadable(inquiry.created_at ?? '')}
              </p>
            </div>
          </Col>
        </Row>

        <div className="mb-3">
          <label className="fw-semibold text-secondary">Status</label>
          <p className="fw-bold">
            <Badge 
              bg={getStatusBadgeColor(inquiry.status)} 
              className="px-3 py-2"
            >
              {formatStatusText(inquiry.status)}
            </Badge>
          </p>
        </div>

        <div className="mb-3">
          <label className="fw-semibold text-secondary">Title</label>
          <div className="p-3 border rounded" style={{ backgroundColor: '#f8f9fa' }}>
            <p className="fw-bold mb-0">{inquiry.title}</p>
          </div>
        </div>

        <div className="mb-3">
          <label className="fw-semibold text-secondary">Description</label>
          <div className="p-3 border rounded" style={{ backgroundColor: '#f8f9fa', minHeight: '100px' }}>
            <p className="mb-0">{inquiry.description}</p>
          </div>
        </div>

        {/* Photo/Attachment Section */}
        {inquiry.photo && (
          <div className="mb-3">
            <label className="fw-semibold text-secondary">Attachment</label>
            <div className="mt-2">
              <div className="border rounded p-2" style={{ backgroundColor: '#f8f9fa' }}>
                <img 
                  src={inquiry.photo} 
                  alt="Inquiry attachment" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '300px',
                    borderRadius: '4px'
                  }}
                  className="img-fluid d-block mx-auto"
                />
                <div className="d-flex justify-content-center gap-2 mt-2">
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => window.open(inquiry.photo!, "_blank")}
                  >
                    Open in New Tab
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={() => {
                      // Download the image
                      const link = document.createElement('a');
                      link.href = inquiry.photo!;
                      link.download = `inquiry-${inquiry.id}-attachment.jpg`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* If there's no photo */}
        {!inquiry.photo && (
          <div className="mb-3">
            <label className="fw-semibold text-secondary">Attachment</label>
            <div className="p-3 border rounded" style={{ backgroundColor: '#f8f9fa' }}>
              <p className="text-muted fst-italic mb-0">No attachment provided</p>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ViewInquiryModal;