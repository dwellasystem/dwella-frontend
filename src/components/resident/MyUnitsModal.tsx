import { useState, useEffect, type ChangeEvent } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import type { PaginatedAssignedUnit } from '../../models/PaginatedAssignedUnit.model';

type Props = {
  onShow: boolean;
  onHide: () => void;
  selectedUnit: PaginatedAssignedUnit | null;
  updateUnit: (id: string, data: {}) => Promise<void>;
};

function MyUnitsModal({ onShow, onHide, selectedUnit, updateUnit }: Props) {
  const [formData, setFormData] = useState({
    unit_status: '',
    amenities: false,
    security: false,
    maintenance: false,
  });

  useEffect(() => {
    if (selectedUnit) {
      setFormData({
        unit_status: selectedUnit.unit_status || '',
        amenities: selectedUnit.amenities || false,
        security: selectedUnit.security || false,
        maintenance: selectedUnit.maintenance || false,
      });
    }
  }, [selectedUnit]);

  const handleClose = () => onHide();

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Properly typed checkbox handler
  // const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const { name, checked } = e.target; // ✅ Type-safe access to `checked`
  //   setFormData(prev => ({
  //     ...prev,
  //     [name]: checked,
  //   }));
  // };

  const handleSave = async() => {
    await updateUnit(selectedUnit?.id?.toString() || '', formData);
    // TODO: Send update request to API here
    handleClose();
  };

  return (
    <Modal show={onShow} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Edit Unit — {selectedUnit?.unit_id?.unit_name || 'N/A'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="unit_status"
              value={formData.unit_status}
              onChange={handleChange}
            >
              <option value="">Select status</option>
              <option value="owner_occupied">Owner Occupied</option>
              <option value="rented_short_term">Rented (Short Term)</option>
              <option value="air_bnb">Airbnb</option>
            </Form.Select>
          </Form.Group>

          {/* <hr /> */}

          {/* <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Amenities"
              name="amenities"
              checked={formData.amenities}
              onChange={handleCheckboxChange}
            />
            <Form.Check
              type="checkbox"
              label="Security"
              name="security"
              checked={formData.security}
              onChange={handleCheckboxChange}
            />
            <Form.Check
              type="checkbox"
              label="Maintenance"
              name="maintenance"
              checked={formData.maintenance}
              onChange={handleCheckboxChange}
            />
          </Form.Group> */}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default MyUnitsModal;
