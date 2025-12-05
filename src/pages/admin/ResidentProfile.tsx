import { Col, Container, Row } from 'react-bootstrap'
import Header from '../../components/Header'
import { FaAngleRight } from 'react-icons/fa6'
import ProfileAvatar from '../../components/ProfileAvatar'
import ProfileStatus from '../../components/ProfileStatus'
import ProfileDetails from '../../components/ProfileDetails'
import { useGetUser } from '../../hooks/user/useGetUser'
import type { User } from '../../models/User.model'
import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../contexts/auth/AuthContext'

interface ResidentProps{
  residentId: string
}

function ResidentProfile(props:ResidentProps) {
  const {user:adminEmployee} = useAuth();

  const {loading, error, user: fetchUser} = useGetUser(props.residentId);
  const [user, setuser] = useState<User | undefined>(undefined)

   const navigate = useNavigate();
   
   console.log("Fetch User Data:", fetchUser); // Add this for debugging

  useEffect(() => {
    if(fetchUser){
      setuser(fetchUser)
    }
  },[fetchUser])

  const handNavigate = () => {
    if(!user) return
      switch(adminEmployee?.role) {
        case 'admin':
          return navigate({to: `/admin/resident/$residentId/edit`, params: {residentId: user.id!.toString()}});
        case 'employee':
          return navigate({to: `/employee/resident/$residentId/edit`, params: {residentId: user.id!.toString()}});
    }
  }

  if(loading) return <h1>Loading...</h1>
  if(error) return <h1>Naay error..</h1>

    // Check after loading is complete
  if(!user) return <h1>User not found</h1>


  return (
    <Container
      className="pt-5 d-flex flex-column w-100"
      style={{ maxWidth: "70rem" }}
    >
      {/* Header component*/}
      <Header path={'resident'}>
        <div className="d-flex gap-3">
          <h3 className="fw-bold">View profile</h3>
        </div>
      </Header>

     {/* Profile heading */}
      <div className="d-flex align-items-center gap-1 pt-5 mb-3">
        <span className="text-muted fw-bold d-flex align-items-center">
          Resident
        </span>
        <FaAngleRight size={12} />
        <span className="text-dark fw-bold d-flex align-items-center">
          View Profile
        </span>
      </div>

      {/* Top profile */}
      <Row className="rounded-3" style={{ backgroundColor: "#F2F2F7" }}>
        <Col xs={12} className="d-flex align-items-center flex-wrap justify-content-between m-auto" style={{width:"95%"}}>
          <ProfileAvatar user={user} setUser={setuser}/> {/*Avatar photo*/}
          <ProfileStatus />  {/* Online/Offline status */}
        </Col>
      </Row>

      {/* Profile details */}
      <Row className="rounded-3 mt-3" style={{ backgroundColor: "#F2F2F7" }}>
          <ProfileDetails user={user} navigate={handNavigate}/> {/* Full profile details */}
      </Row>
    </Container>
  )
}

export default ResidentProfile