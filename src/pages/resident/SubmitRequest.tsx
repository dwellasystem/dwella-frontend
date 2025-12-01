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


type Props = {
    units?: AssignedUnitPopulated[];
    formData: FormType;
    setFormData: Dispatch<SetStateAction<FormType>>;
    submitForm?: (e: React.FormEvent) => void;
}

function SubmitRequest({units, formData, submitForm, setFormData}:Props) {
    const navigate = useNavigate();
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
                {/* Category option */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formUnitNumber">
                        <Form.Label>Unit Number</Form.Label>
                        <Form.Select
                        onChange={(e) => setFormData((prev) => ({...prev, unit: Number(e.target.value)}))}
                        aria-label="Default select example"
                        >
                        <option value={""}>Select Unit</option>
                        {units &&
                            units.map((unit) => (
                            <option key={unit.id} value={unit.unit_id.id}>
                                {unit.unit_id.unit_name}
                            </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>

                {/* Type */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formType">
                    <Form.Label>Type</Form.Label>
                    <Form.Select value={formData.type} onChange={(e) => setFormData((prev) => ({...prev, type: e.target.value}))}>
                        <option value={""}>Select Type</option>
                        <option value="complaint">Complaint</option>
                        <option value="question">Question</option>
                        <option value="request">Request</option>
                    </Form.Select>
                    </Form.Group>
                </Col>

                {/* Subject */}
                <Col>
                    <Form.Group className="mb-3" controlId="formSubject">
                        <Form.Label>Title</Form.Label>
                        <Form.Control value={formData.title} onChange={(e) => setFormData((prev) => ({...prev, title: e.target.value}))} type="text" placeholder="Enter subject" />
                    </Form.Group>
                </Col>

                {/* Details field */}
                <Col xs={12}>
                    <Form.Group className="mb-3" controlId="formMessage">
                        <Form.Label >Details</Form.Label>
                        <Form.Control value={formData.description} onChange={(e) => setFormData((prev) => ({...prev, description: e.target.value}))} as="textarea" type="text" rows={4} placeholder="Enter here..."/>
                    </Form.Group>
                </Col>

                 {/* Upload file component for file upload */}
                <Col xs={'12'}>
                    <UploadFile formData={formData} setFormData={setFormData} title='Attach File(Optional)'/>
                </Col>

                <Col className='d-flex gap-3 flex-wrap align-items-center justify-content-end mt-3'>
                    <div onClick={() => navigate({to:'/resident/inquiries'})} className='d-flex flex-grow-1 flex-sm-grow-0 align-items-center justify-content-center px-5 py-3 rounded-3' style={{backgroundColor:"#CED4F5", cursor:"pointer"}}><span className='text-black text-center fw-bold'>Cancel</span></div>
                    <Button type='submit' className='d-flex flex-grow-1 border-0 flex-sm-grow-0 align-items-center justify-content-center px-5 py-3 rounded-3' style={{backgroundColor:"#344CB7", cursor:"pointer"}}><span className='text-light text-center fw-bold'>Submit</span></Button>
                </Col>
            </Row>
        </Form>
    </Container>
  )
}

export default SubmitRequest