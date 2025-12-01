import { useEffect, useMemo, useState } from 'react';
import { Col, Form, Row, Button, Modal, Toast, ToastContainer } from 'react-bootstrap';
import { IoMdAdd } from 'react-icons/io';
import type { UnitFormData } from '../../pages/admin/AssignedUnits';
import type { User } from '../../models/User.model';
import api from '../../api/api';
import { API_BASE_URL } from '../../api/endpoint';
import { useGetUnits } from '../../hooks/unit/useGetUnits';

type Props = {
  formData: UnitFormData;
  setFormData: React.Dispatch<React.SetStateAction<UnitFormData>>;
  onSubmit: (data: any) => void;
};

function AssignedUnitModal({ formData, setFormData, onSubmit }: Props) {
  const [users, setUsers] = useState<User[]>();
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "danger">("danger");

  const filterAvailableUnits = useMemo(() => {
    return {
      isAvailable: true
    }
  }, [])
  const { units, fetchUnits } = useGetUnits(filterAvailableUnits);

  const fetchUsers = async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/users`, { params: { role: 'resident' } });
      setUsers(response.data);
    } catch (error) {
      setToastMessage("❌ Failed to fetch users. Please try again.");
      setToastVariant("danger");
      setShowToast(true);
      console.error('Error fetching users:', error);
    }
  }

  const handleClose = () => {
    setShow(false);
    setErrors({});
  };
  
  const handleShow = () => setShow(true);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'unit') {
      // Find the selected unit from the units array
      const selectedUnit = units?.find(unit => unit.id.toString() === value);
      if (selectedUnit) {
        setFormData((prev: any) => ({
          ...prev,
          unit: value,
          building: selectedUnit.building // Set building from the selected unit
        }));
        return; // Return early to prevent double setting
      }
    }
    setFormData((prev: any) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Helper function to check empty or whitespace
    const isEmpty = (val: string) => !val || val.trim() === '';

    if (isEmpty(formData.unit)) newErrors.unit = 'Unit is required';
    if (isEmpty(formData.building)) newErrors.building = 'Building is required';
    if (isEmpty(formData.user_id)) newErrors.owner = 'Owner is required';
    if (isEmpty(formData.unit_status)) newErrors.status = 'Status is required';
    // if (isEmpty(formData.maintenance)) newErrors.maintenance = 'Maintenance selection is required';
    // if (isEmpty(formData.security)) newErrors.security = 'Security selection is required';
    // if (isEmpty(formData.amenities)) newErrors.amenities = 'Amenities selection is required';
    // if (isEmpty(formData.move_in_date)) newErrors.move_in_date = 'Date selection is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // return true if no errors
  };

  const showValidationErrors = (errors: Record<string, string>) => {
    const errorMessages = Object.values(errors);
    if (errorMessages.length > 0) {
      setToastMessage(`❌ ${errorMessages[0]}${errorMessages.length > 1 ? ` and ${errorMessages.length - 1} more error${errorMessages.length > 2 ? 's' : ''}` : ''}`);
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log('Validation failed');
      console.log(errors);
      showValidationErrors(errors);
      return;
    }

    try {
      // If you have an API call here, you can uncomment the line below
      onSubmit(formData);
      
      // Show success toast
      setToastMessage("✅ Unit assigned successfully!");
      setToastVariant("success");
      setShowToast(true);
      
      await fetchUnits(filterAvailableUnits);
      
      // Close modal after a short delay to show the success message
      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (error) {
      setToastMessage("❌ Failed to assign unit. Please try again.");
      setToastVariant("danger");
      setShowToast(true);
      console.error('Error assigning unit:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [])

  return (
    <>
      <Button
        className="p-3"
        style={{ backgroundColor: '#344CB7', border: 'none' }}
        variant="primary"
        onClick={handleShow}
      >
        <IoMdAdd size={25} />
        <span className="fw-bold">Assign Unit</span>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Create</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Unit</Form.Label>
                  <Form.Select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    isInvalid={!!errors.unit}
                  >
                    <option value="">Select Unit</option>
                    {units?.map((unit) => <option key={unit.id} value={unit.id}>{unit.unit_name}({unit.building})</option>)}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.unit}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Building</Form.Label>
                  <Form.Select
                    name="building"
                    value={formData.building}
                    onChange={handleChange}
                    isInvalid={!!errors.building}
                    disabled // Disable the dropdown
                  >
                    <option value="">Building</option>
                    {units?.map((unit) => <option key={unit.id} value={unit.building}>{unit.building}</option>)}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.building}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Owner</Form.Label>
              <Form.Select
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                isInvalid={!!errors.owner}
              >
                <option value="">Select Resident</option>
                {users?.map((user) => <option key={user.id} value={user.id}>{user.first_name} {user.middle_name} {user.last_name}</option>)}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.owner}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Move In Date</Form.Label>
              <Form.Control isInvalid={!!errors.move_in_date} value={formData.move_in_date} name='move_in_date' onChange={handleChange} type="date" />
              <Form.Control.Feedback type="invalid">{errors.move_in_date}</Form.Control.Feedback>
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
                <option value="rented_short_term">Rented</option>
                <option value="air_bnb">Air Bnb</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.status}</Form.Control.Feedback>
            </Form.Group>

            <Row>
              {/* <Col>
                <Form.Select
                  name="maintenance"
                  value={formData.maintenance}
                  onChange={handleChange}
                  isInvalid={!!errors.maintenance}
                >
                  <option value="">Maintenance</option>
                  <option value={"true"}>Yes</option>
                  <option value={"false"}>No</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.maintenance}</Form.Control.Feedback>
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
                <Form.Control.Feedback type="invalid">{errors.security}</Form.Control.Feedback>
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
                <Form.Control.Feedback type="invalid">{errors.amenities}</Form.Control.Feedback>
              </Col> */}
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Assign to Unit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* ✅ Toast Notification - Same as Login component */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg={toastVariant}
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={2500}
          autohide
        >
          <Toast.Header closeButton={false}>
            <strong className="me-auto">
              {toastVariant === "success" ? "Success" : "Error"}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default AssignedUnitModal;