import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import Header from '../../components/Header'
import { FaAngleRight } from 'react-icons/fa6'
import UploadFile from '../../components/UploadFile'
import type { Dispatch, SetStateAction } from 'react'
import type { AssignedUnitPopulated } from '../../models/AssigneUnit.model'
import { useNavigate } from '@tanstack/react-router'

type FormType = {
  resident: number | undefined;
  unit: number | undefined;
  type: string;
  title: string;
  description: string;
  photo?: File | null;
};

type FormErrors = {
  unit?: string;
  type?: string;
  title?: string;
  description?: string;
  [key: string]: string | undefined;
};

type Props = {
    units?: AssignedUnitPopulated[];
    formData: FormType;
    formErrors: FormErrors;
    isSubmitting: boolean;
    setFormData: Dispatch<SetStateAction<FormType>>;
    submitForm?: (e: React.FormEvent) => void;
}

function SubmitRequest({
  units, 
  formData, 
  formErrors,
  isSubmitting,
  submitForm, 
  setFormData
}: Props) {
  
  const navigate = useNavigate();
  
  const isFormValid = () => {
    return (
      formData.unit &&
      formData.type.trim() &&
      formData.title.trim() &&
      formData.description.trim()
    );
  };

  // Function to handle field change and clear error for that field
  const handleFieldChange = (field: keyof FormType, value: any) => {
    setFormData(prev => ({...prev, [field]: value}));
    
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      // We need to update formErrors from parent, so we'll pass this function up
      // For now, we'll rely on validation on submit only
    }
  };

  return (
    <Container className="pt-5 d-flex flex-column w-100" style={{maxWidth:"70rem"}}>
        {/* Header component*/}
        <Header path={'resident'}>
            <div className="d-flex gap-3">
                <h3 className='fw-bold'>Submit Request</h3>
            </div>
        </Header>

        {/* Form page heading */}
        <div className='d-flex align-items-center gap-1 pt-5 mb-3'>
            <span className='text-muted fw-bold d-flex align-items-center'>Inquiries</span>
            <FaAngleRight size={12}/>
            <span className='text-dark fw-bold d-flex align-items-center'>Submit Request</span>
        </div>

        {/* Pay now Form */}
        <Form onSubmit={submitForm} className='p-5 rounded-3 mb-5' style={{backgroundColor:"#F2F2F7"}}>
            <h3>Details</h3>
            <Row className='pt-3'>
                {/* Unit Number */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formUnitNumber">
                        <Form.Label className="fw-bold">Unit Number <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                          value={formData.unit || ""}
                          onChange={(e) => handleFieldChange('unit', e.target.value ? Number(e.target.value) : undefined)}
                          aria-label="Select unit"
                          isInvalid={!!formErrors.unit}
                        >
                          <option value="">Select Unit</option>
                          {units &&
                            units.map((unit) => (
                              <option key={unit.id} value={unit.unit_id.id}>
                                {unit.unit_id.unit_name} - {unit.unit_id.building}
                              </option>
                            ))}
                        </Form.Select>
                        {formErrors.unit && (
                          <Form.Control.Feedback type="invalid" className="d-block">
                            {formErrors.unit}
                          </Form.Control.Feedback>
                        )}
                        <Form.Text className="text-muted">
                          Required field
                        </Form.Text>
                    </Form.Group>
                </Col>

                {/* Type */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formType">
                      <Form.Label className="fw-bold">Type <span className="text-danger">*</span></Form.Label>
                      <Form.Select 
                        value={formData.type} 
                        onChange={(e) => handleFieldChange('type', e.target.value)}
                        isInvalid={!!formErrors.type}
                      >
                        <option value="">Select Type</option>
                        <option value="complaint">Complaint</option>
                        <option value="question">Question</option>
                        <option value="request">Request</option>
                      </Form.Select>
                      {formErrors.type && (
                        <Form.Control.Feedback type="invalid" className="d-block">
                          {formErrors.type}
                        </Form.Control.Feedback>
                      )}
                      <Form.Text className="text-muted">
                        Required field
                      </Form.Text>
                    </Form.Group>
                </Col>

                {/* Subject */}
                <Col>
                    <Form.Group className="mb-3" controlId="formSubject">
                        <Form.Label className="fw-bold">Title <span className="text-danger">*</span></Form.Label>
                        <Form.Control 
                          value={formData.title} 
                          onChange={(e) => handleFieldChange('title', e.target.value)} 
                          type="text" 
                          placeholder="Enter subject" 
                          isInvalid={!!formErrors.title}
                        />
                        {formErrors.title && (
                          <Form.Control.Feedback type="invalid" className="d-block">
                            {formErrors.title}
                          </Form.Control.Feedback>
                        )}
                        <Form.Text className="text-muted">
                          Required field
                        </Form.Text>
                    </Form.Group>
                </Col>

                {/* Details field */}
                <Col xs={12}>
                    <Form.Group className="mb-3" controlId="formMessage">
                        <Form.Label className="fw-bold">Details <span className="text-danger">*</span></Form.Label>
                        <Form.Control 
                          value={formData.description} 
                          onChange={(e) => handleFieldChange('description', e.target.value)} 
                          as="textarea" 
                          rows={4} 
                          placeholder="Enter here..."
                          isInvalid={!!formErrors.description}
                        />
                        {formErrors.description && (
                          <Form.Control.Feedback type="invalid" className="d-block">
                            {formErrors.description}
                          </Form.Control.Feedback>
                        )}
                        <Form.Text className="text-muted">
                          Required field
                        </Form.Text>
                    </Form.Group>
                </Col>

                 {/* Upload file component for file upload */}
                <Col xs={'12'}>
                    <UploadFile 
                      formData={formData} 
                      setFormData={setFormData} 
                      title='Attach File (Optional)'
                    />
                    <Form.Text className="text-muted">
                      Optional field
                    </Form.Text>
                </Col>

                <Col className='d-flex gap-3 flex-wrap align-items-center justify-content-end mt-3'>
                    <div 
                      onClick={() => navigate({to:'/resident/inquiries'})} 
                      className='d-flex flex-grow-1 flex-sm-grow-0 align-items-center justify-content-center px-5 py-3 rounded-3' 
                      style={{backgroundColor:"#CED4F5", cursor:"pointer"}}
                    >
                      <span className='text-black text-center fw-bold'>Cancel</span>
                    </div>
                    <Button 
                      type='submit' 
                      className='d-flex flex-grow-1 border-0 flex-sm-grow-0 align-items-center justify-content-center px-5 py-3 rounded-3' 
                      style={{backgroundColor:"#344CB7", cursor:"pointer"}}
                      disabled={isSubmitting || !isFormValid()}
                    >
                      <span className='text-light text-center fw-bold'>
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                      </span>
                    </Button>
                </Col>
            </Row>
        </Form>
    </Container>
  );
}

export default SubmitRequest;