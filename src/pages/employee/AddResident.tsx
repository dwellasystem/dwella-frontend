import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import Header from '../../components/Header'
import { FaAngleRight } from 'react-icons/fa6'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import {type User } from '../../models/User.model'
import { convertHumanReadableToISO } from '../../helpers/authHelper/dateHelper'
import { useCreateUser } from '../../hooks/user/useCreateUser'
import { useGetUnits } from '../../hooks/unit/useGetUnits'
import type { Unit } from '../../models/Unit.model'
import AssignedUnitService from '../../services/assignedUnit.service'


const initialData: User = {
    first_name: "",
    middle_name:"",
    last_name:"",
    phone_number:"",
    account_status: undefined,
    move_in_date:"",
    email:"",
    password:"",
    username:"",
}

function AddResident() {
  const {createAssignedUnit} = AssignedUnitService();

  const [data, setData] = useState<User>(initialData);
  const [selectedUnit, setSelectedUnit] = useState<number | string>('');
  const {units, error, loading} = useGetUnits();

  const navigate = useNavigate();

  if(loading) return
  if(error) return <h1>{error}</h1>

  const AddResidentHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const moveInDateISO = convertHumanReadableToISO(data.move_in_date ?? '')

    if(selectedUnit === "Select" || !selectedUnit) return console.error('select units')

    const payload: User = {
    ...data,
    unit: Number(selectedUnit),
    move_in_date: moveInDateISO || '', // convert here
    };

    try {
        const {data} = await useCreateUser(payload);
        await createAssignedUnit({
            "unit_id": selectedUnit,
            "assigned_by": data
        })
        navigate({to:'/employee/resident'})
    } catch (error) {
        console.log(error)
    }

  }

  return (
    <Container className="pt-5 d-flex flex-column w-100" style={{maxWidth:"70rem"}}>
        {/* Header component*/}
        <Header path={'admin'}>
            <div className="d-flex gap-3">
                <h3 className='fw-bold'>Add Resident</h3>
            </div>
        </Header>

        {/* Form page heading */}
        <div className='d-flex align-items-center gap-1 pt-5 mb-3'>
            <span className='text-muted fw-bold d-flex align-items-center'>Residents</span>
            <FaAngleRight size={12}/>
            <span className='text-dark fw-bold d-flex align-items-center'>Add Resident</span>
        </div>

        {/* Add Resident Form */}
        <Form onSubmit={AddResidentHandler} className='p-5 rounded-3 mb-5' style={{backgroundColor:"#F2F2F7"}}>
            <h3>Details</h3>
            <Row className='pt-3'>

                {/* First Name */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formFirstName">
                        <Form.Label >First Name</Form.Label>
                        <Form.Control value={data?.first_name} onChange={(e) => setData((data) => ({...data, first_name: e.target.value}))} type="text" placeholder="ex. Nikola" />
                    </Form.Group>
                </Col>

                {/* Middle Name */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formMiddleName">
                        <Form.Label >Middle Name</Form.Label>
                        <Form.Control value={data?.middle_name} onChange={(e) => setData((data) => ({...data, middle_name: e.target.value}))} type="text" placeholder="ex. Curie" />
                    </Form.Group>
                </Col>

                {/* Last Name */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formLastName">
                        <Form.Label >Last Name</Form.Label>
                        <Form.Control value={data?.last_name} onChange={(e) => setData((data) => ({...data, last_name: e.target.value}))} type="text" placeholder="ex. Tesla" />
                    </Form.Group>
                </Col>

                {/* Contact Number */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formContactNumber">
                        <Form.Label >Contact Number</Form.Label>
                        <Form.Control value={data?.phone_number} onChange={(e) => setData((data) => ({...data, phone_number: e.target.value}))} type="number" placeholder="e.g., 09123456789" />
                    </Form.Group>
                </Col>

                {/* Email Address */}
                <Col>
                    <Form.Group className="mb-3" controlId="formEmailAddress">
                        <Form.Label >Email Address</Form.Label>
                        <Form.Control value={data?.email} onChange={(e) => setData((data) => ({...data, email: e.target.value}))} type="email" placeholder="e.g., example@gmail.com" />
                    </Form.Group>
                </Col>

                {/* Unit number */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formUnitNumber">
                        <Form.Label>Unit Code</Form.Label>
                        <Form.Select value={selectedUnit} onChange={(e) => setSelectedUnit(e.target.value)}  aria-label="Default select example">
                            <option>Select</option>
                            {units.map((unit: Unit) => (
                                <option key={unit.id} value={unit.id}>{unit.unit_name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>

                {/* Move In Date */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formMoveInDate">
                        <Form.Label >Move-in date</Form.Label>
                        <Form.Control required value={data?.move_in_date} onChange={(e) => setData((data) => ({...data, move_in_date: e.target.value}))} type="date"/>
                    </Form.Group>
                </Col>

                {/* Account status */}
                <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="formPaymentOption">
                        <Form.Label >Account Status</Form.Label>
                        <Form.Select value={data?.account_status} onChange={(e) => setData((data) => ({...data, account_status: e.target.value === 'active' ?  'active': 'inactive'}))}  aria-label="Default select example">
                            <option>Select</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                <h3 className='mt-sm-3'>Account</h3>

                <Col xs={12} md={12} className='d-flex gap-3 flex-column flex-sm-row mt-sm-2'>
                    <Form.Group className="mb-3 flex-grow-1" controlId="formUsername">
                        <Form.Label >Username</Form.Label>
                        <Form.Control value={data?.username} onChange={(e) => setData((data) => ({...data, username: e.target.value}))} type="text" placeholder='Username'/>
                    </Form.Group>

                    <Form.Group className="mb-3 flex-grow-1" controlId="formPassword">
                        <Form.Label >Password</Form.Label>
                        <Form.Control value={data?.password} onChange={(e) => setData((data) => ({...data, password: e.target.value}))} autoComplete='off' type="password" placeholder='Enter Password'/>
                    </Form.Group>

                </Col>

                <Col className='d-flex gap-3 flex-wrap align-items-center justify-content-end mt-3'>
                    <div onClick={() => navigate({to:'/employee/resident'})} className='d-flex flex-grow-1 flex-sm-grow-0 align-items-center justify-content-center px-5 py-3 rounded-3' style={{backgroundColor:"#CED4F5", cursor:"pointer"}}><span className='text-black text-center fw-bold'>Cancel</span></div>
                    <Button type='submit' className='d-flex border-0 flex-grow-1 flex-sm-grow-0 align-items-center justify-content-center px-3 py-3 rounded-3' style={{backgroundColor:"#344CB7", cursor:"pointer"}}><span className='text-light text-center fw-bold'>Add Resident</span></Button>
                </Col>
            </Row>
        </Form>
    </Container>
  )
}

export default AddResident