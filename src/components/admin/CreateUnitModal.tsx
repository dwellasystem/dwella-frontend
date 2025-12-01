import { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { IoMdAdd } from 'react-icons/io';
import type { UnitType } from '../../pages/admin/Units';

type Props = {
  formData: UnitType;
  setFormData: React.Dispatch<React.SetStateAction<UnitType>>;
  onSubmit: (data: any) => void;
};

function CreateUnitModal({ formData, setFormData, onSubmit }: Props) {
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleClose = () => {
    setShow(false);
    setErrors({});
  };
  const handleShow = () => setShow(true);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if(name === 'floor_area'){
      setFormData((prev) => ({...prev, rent_amount: +value * 592.39}));
    }
    setFormData((prev: any) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Helper function to check empty or whitespace
    const isEmpty = (val: string) => !val || val.trim() === '';

    if (isEmpty(formData.unit_name)) newErrors.unit_name = 'Unit name is required';
    if (isEmpty(formData.building)) newErrors.building = 'Unit name is required';
    if (!formData.floor_area || formData.floor_area < 1) newErrors.floor_area = 'Floor area is required';
    if (!formData.bedrooms || formData.bedrooms < 1) newErrors.bedrooms = 'Bedrooms is required';
    // if (!formData.rent_amount || formData.rent_amount < 1) newErrors.rent_amount = 'rent amount is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // return true if no errors
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log('Validation failed');
      return;
    }

    console.log(formData)
    onSubmit(formData);
    handleClose();
  };

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
                  <Form.Label>Building</Form.Label>
                  <Form.Control name='building' onChange={handleChange} value={formData.building} isInvalid={!!errors.building} type="text" min={0} placeholder="ex. A" />
                  <Form.Control.Feedback type="invalid">{errors.building}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Unit</Form.Label>
                  <Form.Control name='unit_name' onChange={handleChange} value={formData.unit_name} isInvalid={!!errors.unit_name} type="text" placeholder="ex. 10B" />
                  <Form.Control.Feedback type="invalid">{errors.unit_name}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>No. Bedrooms</Form.Label>
                  <Form.Control name='bedrooms' onChange={handleChange} value={formData.bedrooms} isInvalid={!!errors.bedrooms} type="number" placeholder="ex. 4" />
                  <Form.Control.Feedback type="invalid">{errors.bedrooms}</Form.Control.Feedback>
                </Form.Group>
              </Col>              

              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Floor Area</Form.Label>
                  <Form.Control name='floor_area' onChange={handleChange} value={formData.floor_area} isInvalid={!!errors.floor_area} type="text" min={0} placeholder="ex. 24.5sqm" />
                  <Form.Control.Feedback type="invalid">{errors.floor_area}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Payable Amount</Form.Label>
                  <Form.Control disabled name='rent_amount' onChange={handleChange} value={formData.rent_amount} isInvalid={!!errors.rent_amount} type="number" min={0} placeholder="name@example.com" />
                  <Form.Control.Feedback type="invalid">{errors.rent_amount}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Create Unit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default CreateUnitModal;
