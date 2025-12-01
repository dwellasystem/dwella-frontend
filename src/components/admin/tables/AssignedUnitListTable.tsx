import { OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import type { PaginatedAssignedUnit } from '../../../models/PaginatedAssignedUnit.model';
import { FaPencilAlt, FaRegTrashAlt } from 'react-icons/fa';
import { IoMdEye } from 'react-icons/io';
import { useState } from 'react';
import EditAssignedUnitModal from '../EditAssignedUnitModal';
import ViewAssginedUnitModal from '../ViewAssignedUnitModal';
import unitStatus from '../../../helpers/unitStatus';
import { formatDateToHumanReadable } from '../../../helpers/authHelper/dateHelper';

type Props = {
    units?: PaginatedAssignedUnit[];
    updateUnit: (id: string, data: {}) => Promise<void>;
    deleteAssignedUnit: (id: string) => Promise<void>;
}

function AssignedUnitListTable({units, updateUnit, deleteAssignedUnit}: Props) {
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<PaginatedAssignedUnit | null>(null);

  const handleView = (unit: PaginatedAssignedUnit) => {
    setSelectedUnit(unit);
    setShowViewModal(true);
  };

  const handleEdit = (unit: PaginatedAssignedUnit) => {
    setSelectedUnit(unit);
    setShowEditModal(true);
  };

  const handleClose = () => {
    setShowViewModal(false);
    setShowEditModal(false);
    setSelectedUnit(null);
  };

  return (
    <div className="w-100 d-flex flex-column gap-3 pt-2">
      <div className="overflow-auto">
        <Table responsive="sm" className="table-bordered">
          <thead>
            <tr className="text-nowrap">
              <th style={{ backgroundColor: "#F2F2F7" }}>Unit</th>
              <th style={{ backgroundColor: "#F2F2F7" }}>Building</th>
              <th style={{ backgroundColor: "#F2F2F7" }}>Owner</th>
              <th style={{ backgroundColor: "#F2F2F7" }}>Status</th>
              <th style={{ backgroundColor: "#F2F2F7" }}>Move In Date</th>
              {/* <th style={{ backgroundColor: "#F2F2F7" }}>Maintenance</th>
              <th style={{ backgroundColor: "#F2F2F7" }}>Security</th>
              <th style={{ backgroundColor: "#F2F2F7" }}>Amenities</th> */}
              <th style={{ backgroundColor: "#F2F2F7" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {units?.map((unit) => <tr key={unit.id}>
                <td>{unit.unit_id?.unit_name}</td>
                <td>{unit.unit_id?.building}</td>
                <td>{unit.assigned_by?.first_name} {unit.assigned_by?.middle_name} {unit.assigned_by?.last_name}</td>
                <td>{unitStatus(unit.unit_status)}</td>
                <td>{formatDateToHumanReadable(unit.move_in_date)}</td>
                {/* <td>{unit.maintenance ? "Yes" : "No"}</td>
                <td>{unit.security ? "Yes" : "No"}</td>
                <td>{unit.amenities ? "Yes" : "No"}</td> */}
                  <td className='d-flex align-items-center justify-content-center gap-2'>
                      <OverlayTrigger
                        placement={'top'}
                        overlay={
                          <Tooltip id={`tooltip-top`}>
                            Edit
                          </Tooltip>
                          }
                        >
                          <div onClick={() => handleEdit(unit)} className='text-black fw-bold fs-5' style={{cursor:'pointer'}}><FaPencilAlt /></div>
                        </OverlayTrigger>
                        <OverlayTrigger
                        placement={'top'}
                        overlay={
                          <Tooltip id={`tooltip-top`}>
                            Delete
                          </Tooltip>
                          }
                        >
                          <div onClick={() => deleteAssignedUnit(unit.id?.toString() ?? '')} className='text-danger fw-bold fs-5' style={{cursor:'pointer'}}><FaRegTrashAlt /></div>
                        </OverlayTrigger>
                        <OverlayTrigger
                        placement={'top'}
                        overlay={
                          <Tooltip id={`tooltip-top`}>
                            View
                          </Tooltip>
                          }
                        >
                          <div onClick={() => handleView(unit)} className='text-primary fw-bold fs-5' style={{cursor:'pointer'}}><IoMdEye /></div>
                        </OverlayTrigger>
                    </td>
            </tr>)}
            {units && units?.length < 1 && <tr><td colSpan={8} className="text-center">No Assigned units found.</td></tr>}
          </tbody>
        </Table>
      </div>
      {/* 🟦 View Modal */}
      <ViewAssginedUnitModal
        show={showViewModal}
        onHide={handleClose}
        unit={selectedUnit}
      />

      {/* 🟧 Edit Modal */}
      <EditAssignedUnitModal
        show={showEditModal}
        onHide={handleClose}
        unit={selectedUnit}
        updateUnit={updateUnit}
      />
    </div>
  );
}

export default AssignedUnitListTable