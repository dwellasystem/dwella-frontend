import { Col, Container, Row, Table } from "react-bootstrap"
import Header from "../../components/Header"
import { FaAngleRight } from "react-icons/fa6"
import ProfileAvatar from "../../components/employee/ProfileAvatar"
import ProfileStatus from "../../components/employee/ProfileStatus"
import ProfileDetails from "../../components/employee/ProfileDetails"
import { useGetUser } from "../../hooks/user/useGetUser"
import { formatDateToHumanReadable } from "../../helpers/authHelper/dateHelper"

interface EmployeeProfileProps{
  employeeId: string;
}

function EmployeeProfile(employeeId: EmployeeProfileProps) {

  const {user, loading} = useGetUser(employeeId.employeeId);

  const fullName = `${user.first_name} ${user.middle_name} ${user.last_name}`;
  const role = user.role || "Employee";
  const location = user.address || "Not Set";

  return (
    <Container style={{ maxWidth: "70rem" }}>
      <Container
        className="pt-5 d-flex flex-column "
      >
        {/* Header component*/}
        <Header path={'admin'}>
          <div className="d-flex gap-3">
            <h3 className="fw-bold">View profile</h3>
          </div>
        </Header>


      {/* Profile heading */}
        <div className="d-flex align-items-center gap-1 pt-5 mb-3">
          <span className="text-muted fw-bold d-flex align-items-center">
            Employee
          </span>
          <FaAngleRight size={12} />
          <span className="text-dark fw-bold d-flex align-items-center">
            View Profile
          </span>
        </div>

        {/* Top profile */}
        <Row className="rounded-3" style={{ backgroundColor: "#F2F2F7" }}>
          <Col xs={12} className="d-flex align-items-center flex-wrap justify-content-between m-auto" style={{width:"95%"}}>
            <ProfileAvatar name={fullName} role={role.charAt(0).toUpperCase() + role.slice(1)} location={location}/> {/* Avatar photo */}
            <ProfileStatus/>  {/* Online/Offline status */}
          </Col>
        </Row>
        
        {/* Profile details */}
        <Row className="rounded-3 mt-3" style={{ backgroundColor: "#F2F2F7" }}>
            <ProfileDetails props={employeeId}/> {/* Full profile details */}
        </Row>
      </Container>

      {/* Profile details */}
      <Row className="pt-3">
        <div className="overflow-auto">
          <h4 className="fw-bold">System Credentials</h4>
          <Table className='table-bordered'>
            <thead>
              <tr className="text-nowrap">
                <th style={{backgroundColor:"#F2F2F7"}}>Field</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-nowrap">
                    <td>Username</td>
                    <td>{!loading ? user.username : ''}</td>
              </tr>
              <tr className="text-nowrap">
                    <td>Account Created</td>
                    <td>{!loading ? formatDateToHumanReadable(user.created_at!) : ''}</td>
              </tr>
              <tr className="text-nowrap">
                    <td>Password</td>
                    <td>••••••••••</td>
              </tr>
              
            </tbody>
          </Table>
        </div>
      </Row>
    </Container>
  )
}

export default EmployeeProfile