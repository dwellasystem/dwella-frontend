import { Button, Col, Container, Form, Row } from "react-bootstrap"
import Header from "../../components/Header"
import { FaAngleRight } from "react-icons/fa6"
import { useGetUser } from "../../hooks/user/useGetUser";
import { useNavigate } from "@tanstack/react-router";
import type { User } from "../../models/User.model";
import { useState, useEffect } from "react";
import UserService from "../../services/user.service";

interface EditProps {
    id: string;
}

function EditProfile({id}: EditProps) {
    const {updateUserById} = UserService();

    const {user} = useGetUser(id);
    const [form, setForm] = useState<User>({})

    const navigate = useNavigate();

    useEffect(()=>{
        if(user){
            setForm({
                phone_number: user.phone_number ?? '',
                email: user.email ?? '',
                account_status: user.account_status ?? undefined,
                address: user.address ?? ''
            })
        }
        return
    },[user]);

    const updateHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            await updateUserById(id, form)
            window.location.href = window.location.origin
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <Container className="pt-5 d-flex flex-column w-100" style={{maxWidth:"70rem"}}>
        {/* Header component*/}
        <Header path={'resident'}>
            <div className="d-flex gap-3">
                <h3 className='fw-bold'>Edit Profile</h3>
            </div>
        </Header>

        {/* Form page heading */}
        <div className='d-flex align-items-center gap-1 pt-5 mb-3'>
            <span className='text-muted fw-bold d-flex align-items-center'>View Profile</span>
            <FaAngleRight size={12}/>
            <span className='text-dark fw-bold d-flex align-items-center'>Edit Profile</span>
        </div>

        {/* Edit Profile Form */}
        <Form onSubmit={updateHandler} className='p-5 rounded-3 mb-5' style={{backgroundColor:"#F2F2F7"}}>
            <h3>Details</h3>
            <Row className='pt-3'>
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formContactInfo">
                        <Form.Label >Contact Number</Form.Label>
                        <Form.Control type='text' required={true} value={form.phone_number ?? ''} onChange={(e) => setForm((data) => ({...data, phone_number: e.target.value}))} placeholder="e.g., 09179874321" />
                    </Form.Group>
                </Col>

                {/* Email Address */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label >Email address</Form.Label>
                        <Form.Control required={true} value={form.email ?? ''} onChange={(e) => setForm((data) => ({...data, email: e.target.value}))} type="email" placeholder="e.g., miguel.santos@email.com" />
                    </Form.Group>
                </Col>

                {/* Address */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formAddress">
                        <Form.Label >Address</Form.Label>
                        <Form.Control required={true} value={form.address ?? ''} onChange={(e) => setForm((data) => ({...data, address: e.target.value}))} type="text" placeholder="e.g., Cagayan De Oro City" />
                    </Form.Group>
                </Col>

                {/* Account status */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formPaymentOption">
                        <Form.Label >Account Status</Form.Label>
                        <Form.Select required={true} value={form.account_status} onChange={(e) => setForm((data) => ({...data, account_status: e.target.value === 'active' ?  'active': 'inactive'}))} aria-label="Default select example">
                            <option value={undefined}>Select</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col className='d-flex gap-3 flex-wrap align-items-center justify-content-end mt-3'>
                    <Button onClick={() => navigate({to:'/admin/resident'})} className='d-flex border-0 flex-grow-1 flex-sm-grow-0 align-items-center justify-content-center px-5 py-3 rounded-3' style={{backgroundColor:"#CED4F5", cursor:"pointer"}}><span className='text-black text-center fw-bold'>Cancel</span></Button>
                    <Button type='submit' className='d-flex border-0 flex-grow-1 flex-sm-grow-0 align-items-center justify-content-center px-3 py-3 rounded-3' style={{backgroundColor:"#344CB7", cursor:"pointer"}}><span className='text-light text-center fw-bold'>Save Changes</span></Button>
                </Col>
            </Row>
        </Form>
    </Container>
  )
}

export default EditProfile