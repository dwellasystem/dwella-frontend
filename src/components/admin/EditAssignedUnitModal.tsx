import { useEffect, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import type { PaginatedAssignedUnit } from '../../models/PaginatedAssignedUnit.model';
import type { User } from '../../models/User.model';
import api from '../../api/api';
import { API_BASE_URL } from '../../api/endpoint';
import { useGetUnits } from '../../hooks/unit/useGetUnits';

type Props = {
  show: boolean;
  onHide: () => void;
  unit: PaginatedAssignedUnit | null;
  updateUnit: (id: string, data: {}) => Promise<void>;
};

function EditAssignedUnitModal({ show, onHide, unit, updateUnit }: Props) {
  const [formData, setFormData] = useState({
    unit_id: '',
    building: '',
    assigned_by: '',
    unit_status: '',
    maintenance: '',
    security: '',
    amenities: '',
  });

  const [users, setUsers] = useState<User[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { units } = useGetUnits();

  const fetchUsers = async () => {
    const response = await api.get(`${API_BASE_URL}/users`, {
      params: { role: 'resident' },
    });
    setUsers(response.data);
  };

  useEffect(() => {
    if (unit) {
      setFormData({
        unit_id: String(unit.unit_id?.id || ''),
        building: unit.building || '',
        assigned_by: String(unit.assigned_by?.id || ''),
        unit_status: unit.unit_status || '',
        maintenance: unit.maintenance ? 'true' : 'false',
        security: unit.security ? 'true' : 'false',
        amenities: unit.amenities ? 'true' : 'false',
      });
    }
  }, [unit]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.unit_id) newErrors.unit_id = 'Unit is required';
    if (!formData.building) newErrors.building = 'Building is required';
    if (!formData.assigned_by) newErrors.owner = 'Owner is required';
    if (!formData.unit_status) newErrors.status = 'Status is required';
    if (!formData.maintenance) newErrors.maintenance = 'Maintenance is required';
    if (!formData.security) newErrors.security = 'Security is required';
    if (!formData.amenities) newErrors.amenities = 'Amenities is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
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
                <Form.Label>Unit</Form.Label>
                <Form.Select
                  name="unit_id"
                  value={formData.unit_id}
                  onChange={handleChange}
                  isInvalid={!!errors.unit_id}
                >
                  <option value="">Select Unit</option>
                  {units?.map((unitOption) => (
                    <option key={unitOption.id} value={unitOption.id}>
                      {unitOption.unit_name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.unit_id}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Building</Form.Label>
                <Form.Control
                  name="building"
                  value={formData.building}
                  onChange={handleChange}
                  placeholder="Enter building"
                  isInvalid={!!errors.building}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.building}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Owner</Form.Label>
            <Form.Select
              name="assigned_by"
              value={formData.assigned_by}
              onChange={handleChange}
              isInvalid={!!errors.owner}
            >
              <option value="">Select Owner</option>
              {users?.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.owner}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="unit_status"
              value={formData.unit_status}
              onChange={handleChange}
              isInvalid={!!errors.status}
            >
              <option value="">Select Status</option>
              <option value="owner_occupied">Owner Occupied</option>
              <option value="rented_short_term">Rented Short Term</option>
              <option value="air_bnb">Airbnb</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.status}
            </Form.Control.Feedback>
          </Form.Group>

          <Row>
            <Col>
              <Form.Select
                name="maintenance"
                value={formData.maintenance}
                onChange={handleChange}
                isInvalid={!!errors.maintenance}
              >
                <option value="">Maintenance</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.maintenance}
              </Form.Control.Feedback>
            </Col>

            <Col>
              <Form.Select
                name="security"
                value={formData.security}
                onChange={handleChange}
                isInvalid={!!errors.security}
              >
                <option value="">Security</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.security}
              </Form.Control.Feedback>
            </Col>

            <Col>
              <Form.Select
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                isInvalid={!!errors.amenities}
              >
                <option value="">Amenities</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.amenities}
              </Form.Control.Feedback>
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
  );
}

export default EditAssignedUnitModal;
