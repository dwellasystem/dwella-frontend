import { Button, Col, Container, Form, Row } from "react-bootstrap"
import Header from "../../components/Header"
import { FaAngleRight } from "react-icons/fa6"
import React from "react"
import type { User } from "../../models/User.model"
import { useCreateUser } from "../../hooks/user/useCreateUser"
import { useNavigate } from "@tanstack/react-router"

function AddEmployee() {
  const [employee, setEmployee] = React.useState<User>()
  const navigate = useNavigate();

  const addEmployeeHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if(!employee?.account_status) return console.error('select status')

    try {
        await useCreateUser(employee);
    } catch (error) {
        console.error("Error adding employee:", error)
        return
    }
    console.log('Employee added successfully')
  }

    
  return (
    <Container className="pt-5 d-flex flex-column w-100" style={{maxWidth:"70rem"}}>
        {/* Header component*/}
        <Header path={'admin'}>
            <div className="d-flex gap-3">
                <h3 className='fw-bold'>Add Employee</h3>
            </div>
        </Header>

        {/* Form page heading */}
        <div className='d-flex align-items-center gap-1 pt-5 mb-3'>
            <span className='text-muted fw-bold d-flex align-items-center'>Employees</span>
            <FaAngleRight size={12}/>
            <span className='text-dark fw-bold d-flex align-items-center'>Add Employee</span>
        </div>

        {/* Add Resident Form */}
        <Form onSubmit={addEmployeeHandler} className='p-5 rounded-3 mb-5' style={{backgroundColor:"#F2F2F7"}}>
            <h3>Details</h3>
            <Row className='pt-3'>

                {/* First Name */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formFirstName">
                        <Form.Label >First Name</Form.Label>
                        <Form.Control onChange={(e) => setEmployee((prev) => ({...prev, first_name: e.target.value}))} type="text" placeholder="ex. Charlie" />
                    </Form.Group>
                </Col>

                {/* Middle Name */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formMiddleName">
                        <Form.Label >Middle Name</Form.Label>
                        <Form.Control onChange={(e) => setEmployee((prev) => ({...prev, middle_name: e.target.value}))} type="text" placeholder="ex. Doe" />
                    </Form.Group>
                </Col>

                {/* Last Name */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formLastName">
                        <Form.Label >Last Name</Form.Label>
                        <Form.Control onChange={(e) => setEmployee((prev) => ({...prev, last_name: e.target.value}))} type="text" placeholder="ex. Puth" />
                    </Form.Group>
                </Col>

                {/* Contact Number */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formContactNumber">
                        <Form.Label >Contact Number</Form.Label>
                        <Form.Control onChange={(e) => setEmployee((prev) => ({...prev, phone_number: e.target.value}))} type="number" placeholder="e.g., 09123456789" />
                    </Form.Group>
                </Col>

                {/* Email Address */}
                <Col>
                    <Form.Group className="mb-3" controlId="formEmailAddress">
                        <Form.Label >Email Address</Form.Label>
                        <Form.Control onChange={(e) => setEmployee((prev) => ({...prev, email: e.target.value}))} required type="email" placeholder="e.g., example@gmail.com" />
                    </Form.Group>
                </Col>

                {/* Account role */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formAccountRole">
                        <Form.Label >Role</Form.Label>
                        <Form.Select onChange={(e) => setEmployee((prev) => ({...prev, role: e.target.value}))}  aria-label="Default select example">
                            <option value={undefined}>Select</option>
                            <option value="employee">Employee</option>
                            <option value="resident">Resident</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                {/* Account status */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formPaymentOption">
                        <Form.Label >Account Status</Form.Label>
                        <Form.Select onChange={(e) => setEmployee((prev) => ({...prev, account_status: e.target.value === 'active' ?  'active': 'inactive'}))}  aria-label="Default select example">
                            <option value={undefined}>Select</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                {/* Set defualt Login credentials */}
                <Col xs={12}>
                    <h3 className="fw-bold">Login Credentials</h3>
                </Col>

                {/* Set username */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formUsername">
                        <Form.Label >Username</Form.Label>
                        <Form.Control onChange={(e) => setEmployee((prev) => ({...prev, username: e.target.value}))} required type="text" placeholder="e.g., example123" />
                    </Form.Group>
                </Col>

                {/* Set password */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label >Password</Form.Label>
                        <Form.Control onChange={(e) => setEmployee((prev) => ({...prev, password: e.target.value}))} autoComplete="none" required minLength={8} type="password" placeholder="Enter password"/>
                    </Form.Group>
                </Col>

                <Col className='d-flex gap-3 flex-wrap align-items-center justify-content-end mt-3'>
                    <div onClick={() => navigate({to:'/admin/employee'})} className='d-flex flex-grow-1 flex-sm-grow-0 align-items-center justify-content-center px-5 py-3 rounded-3' style={{backgroundColor:"#CED4F5", cursor:"pointer"}}><span className='text-black text-center fw-bold'>Cancel</span></div>
                    <Button type="submit" title="Add Employee" className='d-flex flex-grow-1 flex-sm-grow-0 align-items-center justify-content-center fw-bold border-0 px-3 py-3 rounded-3' style={{backgroundColor:"#344CB7", cursor:"pointer"}}>Add Resident</Button>
                </Col>
            </Row>
        </Form>
    </Container>
  )
}

export default AddEmployee