import { OverlayTrigger, Table, Tooltip } from 'react-bootstrap'
import type { MonthlyBill } from '../../../models/MonthlyBill.model'
import { IoMdEye } from 'react-icons/io'
import { formatDateToHumanReadable } from '../../../helpers/authHelper/dateHelper'
import { useState } from 'react'
import ViewModal from '../ViewModal'


type OverdueListTableProps = {
  overdues?: MonthlyBill[]
}

function OverdueListTable({ overdues }: OverdueListTableProps) {
  const [selectedBill, setSelectedBill] = useState<MonthlyBill | null>(null)
  const [showModal, setShowModal] = useState(false)

  const handleViewClick = (bill: MonthlyBill) => {
    setSelectedBill(bill)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedBill(null)
  }

  return (
    <>
      <div className="w-100 d-flex flex-column gap-3 pt-2">
        <div className="overflow-auto">
          <Table responsive="sm" className="table-bordered">
            <thead>
              <tr className="text-nowrap">
                <th style={{ backgroundColor: "#F2F2F7" }}>Resident</th>
                <th style={{ backgroundColor: "#F2F2F7" }}>Due Date</th>
                <th style={{ backgroundColor: "#F2F2F7" }}>Status</th>
                <th style={{ backgroundColor: "#F2F2F7" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {overdues?.map((overdue) => (
                <tr key={overdue.id}>
                  <td>{overdue.user.first_name} {overdue.user.middle_name} {overdue.user.last_name}</td>
                  <td>{formatDateToHumanReadable(overdue.due_date)}</td>
                  <td>{overdue.due_status}</td>
                  <td className="d-flex align-items-center justify-content-center gap-2">
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-${overdue.id}`}>View Details</Tooltip>}
                    >
                      <div
                        className="text-primary fw-bold fs-5"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleViewClick(overdue)}
                      >
                        <IoMdEye />
                      </div>
                    </OverlayTrigger>
                  </td>
                </tr>
              ))}
              {overdues && overdues.length < 1 && (
                <tr>
                  <td colSpan={4} className="text-center">
                    No overdue bills found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>

      {/* View Modal */}
      <ViewModal
        show={showModal}
        onHide={handleCloseModal}
        monthlyBill={selectedBill}
      />
    </>
  )
}

export default OverdueListTable