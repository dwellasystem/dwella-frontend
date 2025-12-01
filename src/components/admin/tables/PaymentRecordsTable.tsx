import { Button, Col, Dropdown, Modal, Row, Table } from "react-bootstrap"
import type { RecordPayments } from "../../../models/RecordPayment.model"
import type { Paginated } from "../../../models/Paginated.model";
import { formatDateToHumanReadable } from "../../../helpers/authHelper/dateHelper";
import { useState } from "react";
import { PiReceiptDuotone } from "react-icons/pi";
import paymentType from "../../../helpers/paymentType";


type ViewModalProps = {
  payment: any;
  onUpdate: (id: number, newStatus: string) => void;
  onDelete: () => void;
};

function ViewModal({ payment, onDelete, onUpdate }: ViewModalProps) {
  const [show, setShow] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>(payment.status);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const handleDelete = () => {
  onDelete();     // delete record
  setShow(false); // then close
};

  const handleConfirm = () => {
    onUpdate(payment.id, paymentStatus)
    handleClose();
  }

   const isAdvancePayment = payment.payment_type === 'advance';

  return (
    <>
      <a onClick={handleShow}>
        View 
      </a>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <label className="fw-semibold text-secondary" htmlFor="">Resident</label>
              <p className="fw-bold">{payment.user.first_name} {payment.user.middle_name} {payment.user.last_name}</p>
            </Col>
            <Col>
              <label className="fw-semibold text-secondary" htmlFor="">Amount</label>
              <p className="fw-bold">{payment.amount}</p>
            </Col>
          </Row>
        
          <Row>
            <Col sm={12} md={6}>
              <label className="fw-semibold text-secondary" htmlFor="">Payment Method</label>
              <p className="fw-bold">{payment.payment_method}</p>
            </Col>
            <Col sm={12} md={6}>
              <label className="fw-semibold text-secondary" htmlFor="">Payment Status</label>
               <Dropdown>
                <Dropdown.Toggle
                  variant={paymentStatus === 'pending' ? 'info' : paymentStatus === 'paid' ? 'success' : 'danger'}
                  className="text-white fw-bold" 
                  id="dropdown-basic">
                  {paymentStatus && paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setPaymentStatus('paid')}>Paid</Dropdown.Item>
                  <Dropdown.Item onClick={() => setPaymentStatus('pending')}>Pending</Dropdown.Item>
                  <Dropdown.Item onClick={() => setPaymentStatus('rejected')}>Rejected</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <p className="fw-bold"></p>
            </Col>
            <Col>
              <label className="fw-semibold text-secondary" htmlFor="">Bill</label>
              <p className="fw-bold">
                 {isAdvancePayment 
                  ? `${formatDateToHumanReadable(payment.advance_start_date)} - ${formatDateToHumanReadable(payment.advance_end_date)}`
                  : formatDateToHumanReadable(payment.bill?.due_date)
                }
              </p>
            </Col>
          </Row>

          <Row className="text-center">
            <Col>
              <PiReceiptDuotone size={200}/>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" className="fw-bold px-3 py-2" onClick={handleDelete}>
            Delete Payment
          </Button>
          <Button variant="primary" className="fw-bold px-3 py-2" onClick={handleConfirm}>
            Confirm Payment
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

type Props = {
  payments?: Paginated<RecordPayments>;
  prevButton: (url:string) => void; 
  nextButton: (url:string) => void;
  pageNumber: number;
  onUpdate: (id: number, newStatus: string) => void;
  onDelete: (id: number) => void;
}

function PaymentRecordsTable({payments, prevButton, nextButton, pageNumber, onDelete, onUpdate}: Props) {
  return (
    <div className="w-100 d-flex flex-column gap-3 pt-3">
        <div className="overflow-auto">
          <Table responsive={"sm"} className='table-bordered'>
            <thead>
              <tr className="text-nowrap">
                <th style={{backgroundColor:"#F2F2F7"}}>Resident Name</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Amount Paid</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Payment Date</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Payment Type</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Payment Method</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Status</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Reference Number</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Proof Payment</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {payments?.results.map((payment: any) => (
                <tr key={payment.id} className="text-nowrap">
                <td>{payment.user.first_name} {payment.user.middle_name} {payment.user.last_name}</td>
                <td>{payment.amount}</td>
                <td>
                  {payment.payment_type === 'regular' && payment.bill?.due_date && 
                  formatDateToHumanReadable(payment.bill.due_date)
                }
                {payment.payment_type === 'advance' && payment.advance_start_date && 
                  `${formatDateToHumanReadable(payment.advance_start_date)} to ${formatDateToHumanReadable(payment.advance_end_date)}`
                }
                {!payment.bill?.due_date && !payment.advance_start_date && 'N/A'}
                </td>
                <td>{paymentType(payment.payment_type)}</td>
                <td>{payment.payment_method}</td>
                <td>{payment.status}</td>
                <td>{payment.reference_number}</td>
                <td className='text-start text-primary'>
                 {payment.proof_of_payment && <div onClick={() => window.open(`${payment.proof_of_payment}`, "_blank")} style={{cursor:"pointer"}}>
                    View Receipt
                  </div>}
                </td>
                <td className="text-start text-primary" style={{cursor: "pointer"}}>
                  <ViewModal 
                    payment={payment}
                    onDelete={() => onDelete(payment.id)} 
                    onUpdate={onUpdate}/>
                </td>
              </tr>
              ))}
              {payments && payments.results.length < 1 && <tr><td colSpan={7} className="text-center">No Payment found.</td></tr>}
            </tbody>
          </Table>
        </div>
        <div>
        <section className="d-flex justify-content-start align-items-center gap-2">
          <button className="btn fw-bold text-white" style={{backgroundColor: 'rgb(52, 76, 183)'}} disabled={!payments?.previous} onClick={() => prevButton(payments?.previous ?? '')} >Prev</button>
            <div>{pageNumber}</div>
          <button className="btn fw-bold text-white" style={{backgroundColor: 'rgb(52, 76, 183)'}} disabled={!payments?.next} onClick={() => nextButton(payments?.next ?? "")}>Next</button>
        </section>
      </div>
      </div>
  )
}

export default PaymentRecordsTable