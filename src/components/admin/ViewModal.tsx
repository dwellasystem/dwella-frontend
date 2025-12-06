import { Modal, Button, Badge, Row, Col } from 'react-bootstrap'
import type { MonthlyBill } from '../../models/MonthlyBill.model'
import { formatDateToHumanReadable } from '../../helpers/authHelper/dateHelper'

type ViewModalProps = {
  show: boolean
  onHide: () => void
  monthlyBill: MonthlyBill | null
}

function ViewModal({ show, onHide, monthlyBill }: ViewModalProps) {
  if (!monthlyBill) return null

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: string; text: string }> = {
      paid: { variant: 'success', text: 'Paid' },
      unpaid: { variant: 'danger', text: 'Unpaid' },
      pending: { variant: 'warning', text: 'Pending' },
      overdue: { variant: 'danger', text: 'Overdue' },
      partial: { variant: 'info', text: 'Partial Payment' },
      active: { variant: 'success', text: 'Active' },
      inactive: { variant: 'secondary', text: 'Inactive' }
    }

    const statusInfo = statusMap[status.toLowerCase()] || { variant: 'secondary', text: status }
    return <Badge bg={statusInfo.variant}>{statusInfo.text}</Badge>
  }

  const formatCurrency = (amount: string) => {
    const numAmount = parseFloat(amount)
    return isNaN(numAmount) ? amount : `₱${numAmount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-bottom-0 pb-0">
        <Modal.Title className="fw-bold">
          Monthly Bill Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-0">
        <Row className="mb-4">
          <Col md={6}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h6 className="card-title text-muted mb-3">RESIDENT INFORMATION</h6>
                <div className="mb-2">
                  <small className="text-muted">Full Name</small>
                  <p className="fw-semibold mb-0">
                    {monthlyBill.user.first_name} {monthlyBill.user.middle_name} {monthlyBill.user.last_name}
                  </p>
                </div>
                <div className="mb-2">
                  <small className="text-muted">Email</small>
                  <p className="fw-semibold mb-0">{monthlyBill.user.email}</p>
                </div>
                {monthlyBill.user.phone_number && (
                  <div className="mb-2">
                    <small className="text-muted">Phone Number</small>
                    <p className="fw-semibold mb-0">{monthlyBill.user.phone_number}</p>
                  </div>
                )}
                <div className="mb-2">
                  <small className="text-muted">Account Status</small>
                  <div className="fw-semibold">{getStatusBadge(monthlyBill.user.account_status || 'inactive')}</div>
                </div>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h6 className="card-title text-muted mb-3">UNIT INFORMATION</h6>
                <div className="mb-2">
                  <small className="text-muted">Unit Name</small>
                  <p className="fw-semibold mb-0">{monthlyBill.unit.unit_name}</p>
                </div>
                <div className="mb-2">
                  <small className="text-muted">Building</small>
                  <p className="fw-semibold mb-0">{monthlyBill.unit.building}</p>
                </div>
                <div className="mb-2">
                  <small className="text-muted">Floor Area</small>
                  <p className="fw-semibold mb-0">{monthlyBill.unit.floor_area} sqm</p>
                </div>
                <div className="mb-2">
                  <small className="text-muted">Monthly Rent</small>
                  <p className="fw-semibold mb-0">₱{monthlyBill.unit.rent_amount.toLocaleString('en-PH')}</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h6 className="card-title text-muted mb-3">BILLING INFORMATION</h6>
            <Row>
              <Col md={6} className="mb-3">
                <small className="text-muted">Amount Due</small>
                <h4 className="fw-bold text-primary">{formatCurrency(monthlyBill.amount_due)}</h4>
              </Col>
              <Col md={6} className="mb-3">
                <small className="text-muted">Due Date</small>
                <p className="fw-semibold fs-5 mb-0">{formatDateToHumanReadable(monthlyBill.due_date)}</p>
              </Col>
            </Row>
            <Row>
              <Col md={6} className="mb-3">
                <small className="text-muted">Payment Status</small>
                <div className="mt-1">{getStatusBadge(monthlyBill.payment_status)}</div>
              </Col>
              <Col md={6} className="mb-3">
                <small className="text-muted">Due Status</small>
                <div className="mt-1">{getStatusBadge(monthlyBill.due_status)}</div>
              </Col>
            </Row>
            {monthlyBill.user.move_in_date && (
              <div className="mt-3">
                <small className="text-muted">Move-in Date</small>
                <p className="fw-semibold mb-0">{formatDateToHumanReadable(monthlyBill.due_date)}</p>
              </div>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="border-top-0 pt-0">
        <Button variant="outline-secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={onHide}>
          Okay
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ViewModal