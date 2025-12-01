import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import type { Unit } from "../../models/Unit.model";
import { useEffect, useState, type ChangeEvent } from "react";

type Props = {
  show: boolean;
  onHide: () => void;
  unit: Unit | null;
  updateUnit: (id: string, data: {}) => Promise<void>;
};

function EditUnitModal({ show, onHide, unit, updateUnit }: Props) {
  const [formData, setFormData] = useState({
    building: '',
    unit_name: '',
    rent_amount: 0,
    isAvailable: true,
    floor_area: 0,
    bedrooms: 0
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if(unit){
      setFormData({
        building: unit.building || '',
        unit_name: unit.unit_name || '',
        rent_amount: unit.rent_amount || 0,
        isAvailable: unit.isAvailable ?? true,
        floor_area: unit.floor_area || 0,
        bedrooms: unit.bedrooms || 0
      });
    }
  },[unit])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    // Handle floor area change and auto-calculate rent
    if (name === 'floor_area') {
      // Allow empty string for backspacing, otherwise convert to number
      const floorAreaValue = value === '' ? 0 : Number(value);
      setFormData((prev) => ({
        ...prev, 
        floor_area: floorAreaValue,
        rent_amount: value === '' ? 0 : Number((Number(value) * 592.39).toFixed(2))
      }));
      return;
    }

    // Handle other fields
    let processedValue: string | number | boolean = value;
    
    if (type === 'checkbox') {
      processedValue = checked;
    } else if (name === 'rent_amount' || name === 'bedrooms') {
      // Convert to number, use 0 if empty
      processedValue = value === '' ? 0 : Number(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue
    }));
  }

  // Format display value - show empty string for 0, otherwise show the number
  const formatDisplayValue = (value: number): string => {
    return value === 0 ? '' : value.toString();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const isEmpty = (val: string) => !val || val.trim() === '';
    
    if (isEmpty(formData.unit_name)) newErrors.unit_name = 'Unit name is required';
    if (isEmpty(formData.building)) newErrors.building = 'Building is required';
    
    if (!formData.floor_area || formData.floor_area < 1) newErrors.floor_area = 'Floor area is required';
    if (!formData.bedrooms || formData.bedrooms < 1) newErrors.bedrooms = 'Bedrooms is required';
    if (!formData.rent_amount || Number(formData.rent_amount) < 1) newErrors.rent_amount = 'Rent amount is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // console.log(formData)
      await updateUnit(unit?.id?.toString() ?? '', formData);
      onHide();
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      }
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Assigned Unit</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Building</Form.Label>
                <Form.Control
                  name="building"
                  value={formData.building}
                  onChange={handleChange}
                  placeholder="Enter Building Name"
                  isInvalid={!!errors.building}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.building}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Unit Name</Form.Label>
                <Form.Control
                  name="unit_name"
                  value={formData.unit_name}
                  onChange={handleChange}
                  placeholder="Enter Unit Name"
                  isInvalid={!!errors.unit_name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.unit_name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>No. Bedrooms</Form.Label>
                <Form.Control 
                  name='bedrooms' 
                  onChange={handleChange} 
                  value={formatDisplayValue(formData.bedrooms)} 
                  isInvalid={!!errors.bedrooms} 
                  type="number" 
                  placeholder="ex. 4" 
                  min="0"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.bedrooms}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>  
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Floor Area</Form.Label>
                <Form.Control
                  name="floor_area"
                  type="number"
                  value={formatDisplayValue(formData.floor_area)}
                  onChange={handleChange}
                  placeholder="Ex. 24sqm"
                  isInvalid={!!errors.floor_area}
                  min="0"
                  step="0.01"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.floor_area}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Payable Amount</Form.Label>
                <Form.Control
                  name="rent_amount"
                  disabled
                  value={formatDisplayValue(formData.rent_amount)}
                  onChange={handleChange}
                  placeholder="Enter Rent Amount"
                  isInvalid={!!errors.rent_amount}
                  type="number"
                  min="0"
                  step="0.01"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.rent_amount}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  id="isAvailable"
                  name="isAvailable"
                  label="Available"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button type="submit" variant="primary">
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default EditUnitModal