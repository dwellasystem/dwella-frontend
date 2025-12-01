import { Col, Container, Row } from "react-bootstrap";
import ProfileAvatar from "../../components/ProfileAvatar";
import Header from "../../components/Header";
import { FaAngleRight } from "react-icons/fa6";
import ProfileStatus from "../../components/ProfileStatus";
import ProfileDetails from "../../components/ProfileDetails";
import { useAuth } from "../../contexts/auth/AuthContext";
import { useNavigate } from "@tanstack/react-router";

function Profile() {
  const {user, setUser} = useAuth();

  const navigate = useNavigate();

  const handNavigate = () => {
    navigate({to:'/resident/edit-profile'})
  }
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
          Dashboard
        </span>
        <FaAngleRight size={12} />
        <span className="text-dark fw-bold d-flex align-items-center">
          View Profile
        </span>
      </div>

      {/* Top profile */}
      <Row className="rounded-3" style={{ backgroundColor: "#F2F2F7" }}>
        <Col xs={12} className="d-flex align-items-center flex-wrap justify-content-between m-auto" style={{width:"95%"}}>
          <ProfileAvatar setUser={setUser} user={user!}/> {/* Avatar photo */}
          <ProfileStatus/>  {/* Online/Offline status */}
        </Col>
      </Row>

      {/* Profile details */}
      <Row className="rounded-3 mt-3" style={{ backgroundColor: "#F2F2F7" }}>
          <ProfileDetails user={user!} navigate={handNavigate}/> {/* Full profile details */}
      </Row>
      
    </Container>
  );
}

export default Profile;
