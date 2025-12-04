// components/ViewInquiryModal.tsx
import { Button, Modal, Row, Col, Badge } from 'react-bootstrap';

import type { Inquiry } from '../../models/Inquiry.model';
import { formatDateToHumanReadable } from '../../helpers/authHelper/dateHelper';


type ViewInquiryModalProps = {
  inquiry: Inquiry | null;
  onClose: () => void;
};

function ViewInquiryModal({ inquiry, onClose }: ViewInquiryModalProps) {
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
    <Modal show={!!inquiry} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">{inquiry.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-3">
          <Col xs={12} md={6}>
            <div>
              <label className="fw-semibold text-secondary">Unit Number</label>
              <p className="fw-bold">
                {inquiry.unit?.unit_name} - {inquiry.unit?.building}
              </p>
            </div>
          </Col>
          <Col xs={12} md={6}>
            <div>
              <label className="fw-semibold text-secondary">Type</label>
              <p className="fw-bold">{formatTypeText(inquiry.type)}</p>
            </div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xs={12} md={6}>
            <div>
              <label className="fw-semibold text-secondary">Date Requested</label>
              <p className="fw-bold">
                {formatDateToHumanReadable(inquiry.created_at ?? '')}
              </p>
            </div>
          </Col>
          <Col xs={12} md={6}>
            <div>
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
          </Col>
        </Row>

        <div className="mb-3">
          <label className="fw-semibold text-secondary">Description</label>
          <div className="p-3 border rounded" style={{ backgroundColor: '#f8f9fa' }}>
            <p className="mb-0">{inquiry.description}</p>
          </div>
        </div>

        {/* Photo/Attachment Section */}
        {inquiry.photo && (
          <div className="mb-3">
            <label className="fw-semibold text-secondary">Attachment</label>
            <div className="mt-2">
              <img 
                src={inquiry.photo} 
                alt="Inquiry attachment" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '300px',
                  borderRadius: '8px',
                  border: '1px solid #dee2e6'
                }}
                className="img-fluid"
              />
              <div className="mt-2">
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => window.open(inquiry.photo!, "_blank")}
                  className="mt-2"
                >
                  Open in New Tab
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* If there's no photo */}
        {!inquiry.photo && (
          <div className="mb-3">
            <label className="fw-semibold text-secondary">Attachment</label>
            <p className="text-muted fst-italic">No attachment provided</p>
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