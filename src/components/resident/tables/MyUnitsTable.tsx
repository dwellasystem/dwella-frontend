import { OverlayTrigger, Table, Tooltip } from "react-bootstrap"
import unitStatus from "../../../helpers/unitStatus";
import { CiCircleMore } from "react-icons/ci";
import MyUnitsModal from "../MyUnitsModal";
import { useState } from "react";
import type { PaginatedAssignedUnit } from "../../../models/PaginatedAssignedUnit.model";

type Props = {
  units?: PaginatedAssignedUnit[];
  updateUnit: (id: string, data: {}) => Promise<void>;
}

function MyUnitsTable({units, updateUnit}: Props) {
  const [show, setShow] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<PaginatedAssignedUnit | null>(null)

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleEdit = (unit:PaginatedAssignedUnit) => {
    setSelectedUnit(unit);
    handleShow()
  }

  return (
    <div className="w-100 d-flex flex-column gap-3">

      <div className="overflow-auto">
        <Table responsive="sm" className="table-bordered">
          <thead>
            <tr className="text-nowrap">
              <th style={{ backgroundColor: '#F2F2F7' }}>Unit</th>
              <th style={{ backgroundColor: '#F2F2F7' }}>Building</th>
              <th style={{ backgroundColor: '#F2F2F7' }}>Bedrooms</th>
              <th style={{ backgroundColor: '#F2F2F7' }}>Floor Area</th>
              <th style={{ backgroundColor: '#F2F2F7' }}>Status</th>
              {/* <th style={{ backgroundColor: '#F2F2F7' }}>Security</th>
              <th style={{ backgroundColor: '#F2F2F7' }}>Maintenance</th>
              <th style={{ backgroundColor: '#F2F2F7' }}>Amenities</th> */}
              <th style={{ backgroundColor: '#F2F2F7' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {units && units.length > 0 ? (
              units.map((unit) => (
                <tr key={unit.id} className="text-nowrap">
                  <td>{unit.unit_id?.unit_name}</td>
                  <td>{unit.building}</td>
                  <td>{unit.unit_id?.bedrooms}sqm</td>
                  <td>{unit.unit_id?.floor_area}sqm</td>
                  <td>{unitStatus(unit.unit_status)}</td>
                  {/* <td>{unit.security ? "Yes" : "No"}</td>
                  <td>{unit.maintenance ? "Yes" : "No"}</td>
                  <td>{unit.amenities ? "Yes" : "No"}</td> */}
                  {/* <td className="text-md-center">
                    <FiEye color="blue" size={20} />
                  </td> */}
                   <td className='text-primary d-flex justify-content-center gap-2'>
                      <OverlayTrigger
                        placement={'top'}
                        overlay={
                          <Tooltip id={`tooltip-top`}>
                            Edit
                          </Tooltip>
                          }
                        >
                        <a onClick={() => handleEdit(unit)} style={{cursor:'pointer'}}><CiCircleMore size={25}/></a>
                      </OverlayTrigger>
                    </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={12} className="text-center">
                  You don't have any units yet!
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      <div>
        <MyUnitsModal updateUnit={updateUnit} onHide={handleClose} onShow={show} selectedUnit={selectedUnit}/>
      </div>
    </div>
  )
}

export default MyUnitsTable