import { useNavigate } from "@tanstack/react-router"
import { Col, Row } from "react-bootstrap"
import { MdArrowOutward } from "react-icons/md"
import { useGetUser } from "../../hooks/user/useGetUser";


interface ProfileDetailsProps{
    employeeId: string,
}

function ProfileDetails({props}:{props:ProfileDetailsProps}) {
  const {error, user, loading} = useGetUser(props.employeeId);
  const navigate = useNavigate();

  if(loading) return <p>Loading...</p>;

  if(error) return <p>Error: {error}</p>;

  const fullname = `${user.first_name} ${user.middle_name} ${user.last_name}`;

  return (
    <div className="p-4 rounded-3 m-auto" style={{ backgroundColor: "#F2F2F7", width: "90%"}}>

        {/* Details Heading */}
        <Row>
            <Col className="d-flex justify-content-between align-items-center">
                <div className="fs-4 fw-bold">Details</div>
                <div onClick={() => navigate({to: `/admin/employee/${props.employeeId}/edit`})} className="bg-primary px-3 py-2 text-light d-flex gap-2 align-items-center rounded-3" style={{cursor:"pointer"}}>
                    <span className="fw-bold">Edit</span>
                    <MdArrowOutward size={25}/>
                </div>
            </Col>
        </Row>
        <hr />

        {/* Profile Full Details */}
        <Row className="d-flex flex-column">
            <Col className="d-flex justify-content-between flex-wrap gap-2">
                <div>
                    <span className="">Fullname</span>
                    <p className="fs-5 fw-bold">{fullname}</p>
                    <span className="">Email</span>
                    <p className="fs-5 fw-bold">{user.email}</p>
                </div>
                <div>
                    <span className="">Role</span>
                    <p className="fs-5 fw-bold">{user && user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ""}</p>
                    <span className="">Status</span>
                    <p className="fs-5 fw-bold">{user.account_status && user.account_status.charAt(0).toUpperCase() + user.account_status.slice(1)}</p>
                </div>
                <div>
                    <span className="">Contact Number</span>
                    <p className="fs-5 fw-bold">{user.phone_number}</p>
                </div>
            </Col>
        </Row>
    </div>
  )
}

export default ProfileDetails