
import { useState } from 'react'
import { OverlayTrigger, Table, Tooltip } from 'react-bootstrap'
import type { Unit } from '../../../models/Unit.model';
import ViewUnitModal from '../../admin/ViewUnitModal';
import { IoMdEye } from 'react-icons/io';
import EditUnitModal from '../../admin/EditUnitModal';
import { FaPencilAlt } from 'react-icons/fa';


type Props = {
    units?: Unit[];
    deleteUnit: (id: string) => Promise<void>;
    updateUnit: (id: string, data: {}) => Promise<void>;
}

function UnitListTable({units, updateUnit}: Props) {
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  
    const handleView = (unit: Unit) => {
        setSelectedUnit(unit);
        setShowViewModal(true);
    };

    const handleEdit = (unit: Unit) => {
        setSelectedUnit(unit);
        setShowEditModal(true);
    };
      
    const handleClose = () => {
        setShowEditModal(false);
        setShowViewModal(false);
        setSelectedUnit(null);
    };
  return (
   <div className="w-100 d-flex flex-column gap-3 pt-2">
      <div className="overflow-auto">
        <Table responsive="sm" className="table-bordered">
          <thead>
            <tr className="text-nowrap">
              <th style={{ backgroundColor: "#F2F2F7" }}>Building</th>
              <th style={{ backgroundColor: "#F2F2F7" }}>Unit</th>
              <th style={{ backgroundColor: "#F2F2F7" }}>Bedrooms</th>
              <th style={{ backgroundColor: "#F2F2F7" }}>Floor Area</th>
              <th style={{ backgroundColor: "#F2F2F7" }}>Rent Amount</th>
              <th style={{ backgroundColor: "#F2F2F7" }}>Available</th>
              <th style={{ backgroundColor: "#F2F2F7" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {units?.map((unit) => <tr key={unit.id}>
                <td>{unit.building}</td>
                <td>{unit.unit_name}</td>
                <td>{unit.bedrooms}</td>
                <td>{unit.floor_area}</td>
                <td>{unit.rent_amount}</td>
                <td>{unit.isAvailable ? 'Available' : 'Occupied'}</td>
                  <td className='d-flex align-items-center justify-content-center gap-2'>
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
                    </td>
            </tr>)}
            {units && units?.length < 1 && <tr><td colSpan={6} className="text-center">No Assigned units found.</td></tr>}
          </tbody>
        </Table>
      </div>
       {/* 🟦 View Modal */}
      <ViewUnitModal
        show={showViewModal}
        onHide={handleClose}
        unit={selectedUnit}
      />

      <EditUnitModal
        show={showEditModal}
        onHide={handleClose}
        unit={selectedUnit}
        updateUnit={updateUnit}
      />
    </div>
  )
}

export default UnitListTable