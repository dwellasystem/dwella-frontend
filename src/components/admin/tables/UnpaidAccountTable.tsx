import { Table, Modal, Button } from "react-bootstrap";
import type { MonthlyBill } from "../../../models/MonthlyBill.model";
import { formatDateToHumanReadable } from "../../../helpers/authHelper/dateHelper";
import { FaPencilAlt, FaRegTrashAlt } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../../contexts/auth/AuthContext";
import { useState } from "react";

type Props = {
  unpaidAccounts?: MonthlyBill[];
  deleteBill: (id: number) => void;
}

function UnpaidAccountTable({unpaidAccounts, deleteBill}: Props) {
  const navigate = useNavigate();
  const {role} = useAuth();
  
  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [billToDelete, setBillToDelete] = useState<{id: number, residentName: string, unit: string, amount: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (bill: MonthlyBill) => {
    setBillToDelete({
      id: bill.id,
      residentName: `${bill.user.first_name} ${bill.user.last_name}`,
      unit: `${bill.unit.unit_name} (${bill.unit.building})`,
      amount: `₱${bill.amount_due}`
    });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!billToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteBill(billToDelete.id);
      setShowDeleteModal(false);
      setBillToDelete(null);
    } catch (error) {
      console.error("Error deleting bill:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setBillToDelete(null);
  };

  return (
    <>
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <div className="mb-4">
              <div className="d-flex justify-content-center mb-3">
                <div className="rounded-circle bg-danger p-3 d-flex align-items-center justify-content-center" style={{width: '60px', height: '60px'}}>
                  <FaRegTrashAlt size={24} className="text-white" />
                </div>
              </div>
              <h5 className="fw-bold">Are you sure you want to delete this bill?</h5>
              <p className="text-muted">This action cannot be undone.</p>
            </div>
            
            {billToDelete && (
              <div className="border rounded p-3 mb-3 bg-light">
                <div className="row">
                  <div className="col-6 text-start">
                    <p className="mb-1"><strong>Resident:</strong></p>
                    <p className="mb-1"><strong>Unit:</strong></p>
                    <p className="mb-0"><strong>Amount:</strong></p>
                  </div>
                  <div className="col-6 text-end">
                    <p className="mb-1">{billToDelete.residentName}</p>
                    <p className="mb-1">{billToDelete.unit}</p>
                    <p className="mb-0 text-danger fw-bold">{billToDelete.amount}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="outline-secondary" 
            onClick={handleCloseModal}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Deleting...
              </>
            ) : (
              'Delete Bill'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Main Table */}
      <div className="w-100 d-flex flex-column gap-3 pt-2">
        <div className="overflow-auto">
          <Table responsive="sm" className="table-bordered">
            <thead>
              <tr className="text-nowrap">
                <th style={{ backgroundColor: "#F2F2F7" }}>Building</th>
                <th style={{ backgroundColor: "#F2F2F7" }}>Unit Number</th>
                <th style={{ backgroundColor: "#F2F2F7" }}>Resident Name</th>
                <th style={{ backgroundColor: "#F2F2F7" }}>Amount Due</th>
                {/* <th style={{ backgroundColor: "#F2F2F7" }}>Construction Bond</th> */}
                <th style={{ backgroundColor: "#F2F2F7" }}>Payment Status</th>
                <th style={{ backgroundColor: "#F2F2F7" }}>Due Date</th>
                <th style={{ backgroundColor: "#F2F2F7" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {unpaidAccounts?.map((row) => (
                <tr key={row.id} className="text-nowrap">
                  <td>{row.unit.building}</td>
                  <td>{row.unit.unit_name}</td>
                  <td>{row.user.first_name} {row.user.middle_name} {row.user.last_name}</td>
                  <td>₱{row.amount_due}</td>
                  {/* <td>₱{row.construction_bond}</td> */}
                  <td>
                    <span className={`badge ${row.due_status === 'overdue' ? 'bg-danger' : row.due_status === 'due_today' ? 'bg-warning' : row.due_status === 'upcoming' ? 'bg-info' : 'bg-success'}`}>
                      {row.due_status.charAt(0).toUpperCase() + row.due_status.slice(1).replace('_', ' ')}
                    </span>
                  </td>
                  <td>{formatDateToHumanReadable(row.due_date)}</td>
                  <td className="d-flex align-items-center justify-content-center gap-2">
                    <div 
                      onClick={() => navigate({to:`/${role}/monthly-bill/$id/edit`, params:{id: row.id.toString()}})} 
                      className='text-primary fw-bold fs-5' 
                      style={{cursor:'pointer'}}
                      title="Edit Bill"
                    >
                      <FaPencilAlt />
                    </div>
                    <div 
                      onClick={() => handleDeleteClick(row)} 
                      className='text-danger fw-bold fs-5' 
                      style={{cursor:'pointer'}}
                      title="Delete Bill"
                    >
                      <FaRegTrashAlt />
                    </div>
                    <div 
                      onClick={() => navigate({to:`/${role}/monthly-bill/$id`, params:{id: row.id.toString()}})} 
                      className='text-primary fw-bold fs-5' 
                      style={{cursor:'pointer'}}
                      title="View Details"
                    >
                      <IoMdEye />
                    </div>
                  </td>
                </tr>
              ))}
              {unpaidAccounts && unpaidAccounts.length < 1 && (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    <div className="text-muted">
                      <p className="mb-1">No unpaid bills found.</p>
                      <small>All bills are paid up to date.</small>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
}

export default UnpaidAccountTable;